import { ethers } from "ethers";
import { INSURANCE_ADDRESS } from "./config";
import { INSURANCE_ABI } from "./abi";

async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        INSURANCE_ADDRESS,
        INSURANCE_ABI,
        signer
    );
    return { provider, signer, contract };
}

// Wallet
export async function connectWallet() {
    const { signer } = await getContract();
    return await signer.getAddress();
}

// Fund contract
export async function fundContract(amountInEth) {
    const { contract } = await getContract();
    const tx = await contract.fundContract({
        value: ethers.parseEther(amountInEth.toString())
    });
    await tx.wait();
    return tx.hash;
}

// Pay premium
export async function payPremium(policyId, amountInEth) {
    const { contract } = await getContract();
    const tx = await contract.payPremium(policyId, {
        value: ethers.parseEther(amountInEth.toString())
    });
    await tx.wait();
    return tx.hash;
}

// Create policy
export async function createPolicy(policyHolder, premium, coverageAmount) {
    const { contract } = await getContract();
    const tx = await contract.createPolicy(
        policyHolder,
        ethers.parseEther(premium.toString()),
        ethers.parseEther(coverageAmount.toString())
    );

    await tx.wait();
    return tx.hash;
}

// Claims
export async function submitClaim(id) {
    const { contract } = await getContract();
    const tx = await contract.submitClaim(id);
    await tx.wait();
    return tx.hash;
}

export async function approveClaim(id) {
    const { contract } = await getContract();
    const tx = await contract.approveClaim(id);
    await tx.wait();
    return tx.hash;
}

export async function claimPayout(id) {
    const { contract } = await getContract();
    const tx = await contract.claimPayout(id);
    await tx.wait();
    return tx.hash;
}

// Views
export async function policyDetails(id) {
    const { contract } = await getContract();

    const p = await contract.policyDetails(id);

    return {
        policyHolder: p.policyHolder,
        premium: ethers.formatEther(p.premium),
        coverageAmount: ethers.formatEther(p.coverageAmount),
        isClaimed: p.isClaimed,
        isClaimApproved: p.isClaimApproved,
        premiumPaid: p.premiumPaid,
        payoutDone: p.payoutDone
    };
}

export async function getBalance() {
    const { provider, contract } = await getContract();
    const balance = await provider.getBalance(contract.target);
    return ethers.formatEther(balance);
}