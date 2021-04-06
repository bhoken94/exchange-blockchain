module.export = ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

module.export = ether = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
};

// Same as ether
module.export = tokens = (n) => ether(n);
