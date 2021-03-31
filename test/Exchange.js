const EVM_REVERT = require('./helpers');
const wait = require('./helpers');

const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

contract('Exchange', ([deployer, user]) => {
  let exchange, token;
  const interestPerSecond = 31668017; //(10% APY) for min. deposit (0.01 ETH)

  beforeEach(async () => {
    token = await Token.new();
    exchange = await Exchange.new(token.address);
    await token.setMinter(exchange.address, { from: deployer });
  });

  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await token.name()).to.be.eq('Exchange Currency');
      });

      it('checking token symbol', async () => {
        expect(await token.symbol()).to.be.eq('EC');
      });

      it('checking token initial total supply', async () => {
        expect(Number(await token.totalSupply())).to.eq(0);
      });

      it('exchange should have Token minter role', async () => {
        expect(await token.minter()).to.eq(exchange.address);
      });
    });

    describe('failure', () => {
      it('passing minter role should be rejected', async () => {
        await token.setMinter(user, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
      });

      it('tokens minting should be rejected', async () => {
        await token.mint(user, '1', { from: deployer }).should.be.rejectedWith(EVM_REVERT); //unauthorized minter
      });
    });
  });

  describe('testing deposit...', () => {
    let balance;

    describe('success', () => {
      beforeEach(async () => {
        await exchange.deposit({ value: 10 ** 16, from: user }); //0.01 ETH
      });

      it('balance should increase', async () => {
        expect(Number(await exchange.etherBalanceOf(user))).to.eq(10 ** 16);
      });

      it('deposit time should > 0', async () => {
        expect(Number(await exchange.depositStart(user))).to.be.above(0);
      });

      it('deposit status should eq true', async () => {
        expect(await exchange.isDeposited(user)).to.eq(true);
      });
    });

    describe('failure', () => {
      it('depositing should be rejected', async () => {
        await exchange.deposit({ value: 10 ** 15, from: user }).should.be.rejectedWith(EVM_REVERT); //to small amount
      });
    });
  });

  describe('testing withdraw...', () => {
    let balance;

    describe('success', () => {
      beforeEach(async () => {
        await exchange.deposit({ value: 10 ** 16, from: user }); //0.01 ETH

        await wait(2); //accruing interest

        balance = await web3.eth.getBalance(user);
        await exchange.withdraw({ from: user });
      });

      it('balances should decrease', async () => {
        expect(Number(await web3.eth.getBalance(exchange.address))).to.eq(0);
        expect(Number(await exchange.etherBalanceOf(user))).to.eq(0);
      });

      it('user should receive ether back', async () => {
        expect(Number(await web3.eth.getBalance(user))).to.be.above(Number(balance));
      });

      it('user should receive proper amount of interest', async () => {
        //time synchronization problem make us check the 1-3s range for 2s deposit time
        balance = Number(await token.balanceOf(user));
        expect(balance).to.be.above(0);
        expect(balance % interestPerSecond).to.eq(0);
        expect(balance).to.be.below(interestPerSecond * 4);
      });

      it('depositer data should be reseted', async () => {
        expect(Number(await exchange.depositStart(user))).to.eq(0);
        expect(Number(await exchange.etherBalanceOf(user))).to.eq(0);
        expect(await exchange.isDeposited(user)).to.eq(false);
      });
    });

    describe('failure', () => {
      it('withdrawing should be rejected', async () => {
        await exchange.deposit({ value: 10 ** 16, from: user }); //0.01 ETH
        await wait(2); //accruing interest
        await exchange.withdraw({ from: deployer }).should.be.rejectedWith(EVM_REVERT); //wrong user
      });
    });
  });
});
