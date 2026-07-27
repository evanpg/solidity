# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat --init #to install

npx hardhat help
npx hardhat test


npx hardhat node

npx hardhat ignition deploy ./ignition/modules/Lock.js
npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost 
npx hardhat ignition deployments
# npx hardhat ignition deploy ./ignition/modules/Lock.js --network amoy
# npx hardhat verify --network amoy CONTRACT_ADDRESS
```

if deploying locally, when you restart the node the deployment has to be manually deleted from its folder in /ignition/deployments/ and then redeployed.

