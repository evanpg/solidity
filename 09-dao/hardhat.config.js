require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { AMOY_RPC_URL, MNEMONIC, MNEMONIC2 } = process.env;


module.exports = {
  solidity: "0.8.27",
  networks: {
    amoy: {
      url: AMOY_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC, 
      },
      gas: 2011111,
      gasPrice: 30000000000,
    },
  }
};
