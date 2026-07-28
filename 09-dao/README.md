# Polygon DAO

This project demonstrates how to deploy and interact with a simple DAO on the Polygon Amoy testnet.

## Steps to Deployment:
1. Create, compile, and deploy just the contract file in a testing environment like Remix. 
2. Test the contract features using Remix.
    - Remix is quicker than Hardhat when it comes to testing, as it's easier to switch between accounts for emulating activity.
3. Move the contract to an IDE and install Hardhat in the project root. 
    - Replace the contract file with the contract you developed in Remix.
    - Replace test file with a .js mocha file for further testing.
4. Test contract using Hardhat's "ignition".
5. Deploy the contract onchain via Hardhat.
6. Verify in block explorer. 

Further steps for accessibility:
7. Create a "frontend" folder.
    - Create a dotenv environment and .env file to store wallet details and contract hash.
    - Create .js components that reference smart contract functions.
8. Create an App Dashboard for monitoring interactions. https://dashboard.alchemy.com/
    - Store the DAO address in config.js
9. Interface was built consisting of React http with hooks to MetaMask. 


### Transactions
For details on transactions visit:  https://amoy.polygonscan.com/address/0xf0603CDbd1F376e6e91c94BC9732cd2178230cD9


There are two main ways to interact with the DAO:
### 1. Hardhat Scripts (Backend Interaction)
You can interact with the contract by running individual scripts such as:

```bash
node scripts/addMembers.js
```

These scripts allow you to execute specific DAO actions (e.g., adding members, creating proposals, voting).

---

### 2. Frontend Interaction (Recommended)
A React-based frontend is included for easier interaction.

Start the frontend with:

```bash
npm run dev
```

This will:

* Launch the app in your browser
* Allow you to connect your MetaMask wallet
* Interact with the deployed DAO contract on the Polygon Amoy testnet

---

## ⚠️ Notes
* Interacting with the contract requires a wallet funded with **Amoy testnet POL**.
* When using MetaMask, ensure you are connected to the **Polygon Amoy network**.
* Reconstructing a contract from blockchain bytecode (via a block explorer) will not recover the original source code completely — important logic and structure may be missing.

---

## 🔮 Next Steps (Suggested Improvements)
* Add events (`ProposalCreated`, `VoteCast`, `Executed`)
* Improve UI/UX in the frontend
* Add proposal history and status tracking
* Add WalletContext.jsx for more fluid interactions while navigating within the domain

