const Token = artifacts.require('Token');
const Exchange = artifacts.require('Exchange');

module.exports = async function (deployer) {
  await deployer.deploy(Token);

  //assign token into variable to get it's address
  const token = await Token.deployed();

  //pass token address for dBank contract(for future minting)
  await deployer.deploy(Exchange, token.address);

  //assign dBank contract into variable to get it's address
  const exchange = await Exchange.deployed();

  //change token's owner/minter from deployer to dBank
  await token.setMinter(exchange.address);
};
