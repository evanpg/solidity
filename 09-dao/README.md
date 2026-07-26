# Polygon DAO

This project demonstrates how to deploy and interact with a simple DAO on the Polygon Amoy testnet.

## 🚀 Getting Started

For details on transactions visit:  https://amoy.polygonscan.com/address/0xf0603CDbd1F376e6e91c94BC9732cd2178230cD9

There are two main ways to interact with the DAO:


### 1. Hardhat Scripts (Backend Interaction)

Deploy the contract using:

```bash
npx hardhat run ./scripts/deploy.js --network amoy
```

After deployment, you can interact with the contract by running individual scripts such as:

```bash
node scripts/addMembers.js
```

These scripts allow you to execute specific DAO actions (e.g., adding members, creating proposals, voting).

---

### 2. Frontend (Recommended)

A React-based frontend is included for easier interaction.

Start the frontend with:

```bash
npm run dev
```
    
This will:

* Launch the app in your browser
* Inject the React UI into `index.html`
* Allow you to connect your MetaMask wallet
* Interact with the deployed DAO contract on the Polygon Amoy testnet

---

## 🧪 Useful Hardhat Commands

```bash
npx hardhat help              # Show available tasks
npx hardhat test              # Run tests
REPORT_GAS=true npx hardhat test  # Run tests with gas reporting
npx hardhat node              # Start local blockchain
npx hardhat run scripts/deploy.js  # Deploy locally
```

---

## ⚠️ Notes

* Interacting with the contract requires a wallet funded with **Amoy testnet POL**.
* When using MetaMask, ensure you are connected to the **Polygon Amoy network**.
* Reconstructing a contract from blockchain bytecode (via a block explorer) will not recover the original source code completely — important logic and structure may be missing.

---

## 📌 Project Overview

* Smart Contract: Solidity (DAO logic)
* Deployment: Hardhat
* Frontend: React + MetaMask
* Network: Polygon Amoy Testnet

---

## 🔮 Next Steps (Suggested Improvements)

* Add events (`ProposalCreated`, `VoteCast`, `Executed`)
* Improve UI/UX in the frontend
* Add proposal history and status tracking
* A WalletContext.jsx for more fluid interactions while navigating

---

This project is intended as a learning and portfolio example for building decentralized governance systems on Polygon.
