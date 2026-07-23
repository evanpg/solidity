// src/contract/dao.js

import { ethers } from "ethers";
import { DAO_ADDRESS } from "./config";
import { DAO_ABI } from "./abi";

/**
 * Connect MetaMask and return provider, signer and contract.
 */
async function getContract() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
        DAO_ADDRESS,
        DAO_ABI,
        signer
    );

    return { provider, signer, contract };
}

//
// Wallet
//

export async function connectWallet() {
    const { signer } = await getContract();

    return await signer.getAddress();
}

//
// Members
//

export async function addMember(address) {
    const { contract } = await getContract();

    const tx = await contract.addMember(address);

    await tx.wait();

    return tx.hash;
}

export async function isMember(address) {
    const { contract } = await getContract();

    return await contract.members(address);
}

//
// Treasury
//

export async function deposit(amountInEth) {
    const { signer, contract } = await getContract();

    const tx = await signer.sendTransaction({
        to: contract.target,
        value: ethers.parseEther(amountInEth.toString())
    });

    await tx.wait();

    return tx.hash;
}

export async function getBalance() {
    const { provider, contract } = await getContract();

    const balance = await provider.getBalance(contract.target);

    return ethers.formatEther(balance);
}

//
// Proposals
//

export async function createProposal(
    description,
    recipient,
    amountInEth
) {
    const { contract } = await getContract();

    const tx = await contract.createProposal(
        description,
        recipient,
        ethers.parseEther(amountInEth.toString())
    );

    await tx.wait();

    return tx.hash;
}

export async function vote(proposalId) {
    const { contract } = await getContract();

    const tx = await contract.vote(proposalId);

    await tx.wait();

    return tx.hash;
}

export async function executeProposal(proposalId) {
    const { contract } = await getContract();

    const tx = await contract.executeProposal(proposalId);

    await tx.wait();

    return tx.hash;
}

//
// Views
//

export async function getProposal(id) {
    const { contract } = await getContract();

    const proposal = await contract.getProposal(id);

    return {
        description: proposal.description,
        recipient: proposal.recipient,
        amount: ethers.formatEther(proposal.amount),
        executed: proposal.executed,
        voteCount: Number(proposal.voteCount)
    };
}

export async function getProposalCount() {
    const { contract } = await getContract();

    const count = await contract.proposals.length;

    return Number(count);
}