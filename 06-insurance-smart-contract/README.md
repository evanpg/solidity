Images of interface and onchain transactions are in ./screenshots.
Deployed contract found here: https://sepolia.etherscan.io/address/0xf0603cdbd1f376e6e91c94bc9732cd2178230cd9

## Usage
### Running Tests
```shell
npx hardhat test
```

prep:
 ```shell
npm install --save-dev @nomicfoundation/hardhat-ethers ethers
npm install dotenv
npm install vite --save-dev
```

change hardhat.config.ts variables to include dotenv, otherwise it wont read global variables.

### Make a deployment 
V3 includes an Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:
```shell
npx hardhat node
npx hardhat ignition deploy ignition/modules/insurance.js
```

To run the deployment to Sepolia, you need an account with funds to send the transaction.

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/insurance.js
```
copy the generated contract address into config.js

### 1. Hardhat Scripts (Backend Interaction)
You can interact with the contract by running individual scripts such as:

```bash
npx hardhat run scripts/createPolicy.js --network sepolia
npx hardhat console --network sepolia
```

### 2. Frontend Interaction (Recommended)
A React-based frontend is included for easier interaction.

Start the frontend with:
```bash
npm run dev
```
This will:
* Launch the app in your browser
* Allow you to connect your MetaMask wallet
* Interact with the deployed DAO contract
