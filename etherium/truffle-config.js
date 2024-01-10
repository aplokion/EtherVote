const fs = require('fs');
// const HDWalletProvider = require('@truffle/hdwallet-provider');

const solcVersion = fs.readFileSync('.solc-version', 'utf-8').trim();

module.exports = {
  compilers: {
    solc: {
      version: solcVersion,
    },
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 6721975,
      gasPrice: 20000000000,
    },
    ganache: {  // Новая сеть для Ganache
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
};

