import React, { useState } from "react";

import {
    connectWallet,
    fundContract,
    createPolicy,
    payPremium,
    submitClaim,
    approveClaim,
    claimPayout,
    policyDetails,
    getBalance
} from "./contract/insurance";

export default function App() {

    const [wallet, setWallet] = useState("");

    const connect = async () => {
        try {
            const address = await connectWallet();
            setWallet(address);
        } catch (err) {
            alert(err.message);
        }
    };

    // -------------------------
    // INSURER ACTIONS
    // -------------------------

    const handleFund = async () => {
        const amount = prompt("Amount to fund contract (ETH)");
        if (!amount) return;

        try {
            const hash = await fundContract(amount);
            alert("Contract funded!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleCreatePolicy = async () => {
        const holder = prompt("Policy holder address");
        const premium = prompt("Premium (ETH)");
        const coverage = prompt("Coverage amount (ETH)");

        if (!holder || !premium || !coverage) return;

        try {
            const hash = await createPolicy(holder, premium, coverage);
            alert("Policy created!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleApproveClaim = async () => {
        const id = prompt("Policy ID");

        try {
            const hash = await approveClaim(Number(id));
            alert("Claim approved!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    // -------------------------
    // USER ACTIONS
    // -------------------------

    const handlePayPremium = async () => {
        const id = prompt("Policy ID");
        const amount = prompt("Premium amount (ETH)");

        try {
            const hash = await payPremium(Number(id), amount);
            alert("Premium paid!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleSubmitClaim = async () => {
        const id = prompt("Policy ID");

        try {
            const hash = await submitClaim(Number(id));
            alert("Claim submitted!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleClaimPayout = async () => {
        const id = prompt("Policy ID");

        try {
            const hash = await claimPayout(Number(id));
            alert("Payout claimed!\n" + hash);
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    // -------------------------
    // VIEW FUNCTIONS
    // -------------------------

    const handleGetPolicy = async () => {
        const id = prompt("Policy ID");

        try {
            const policy = await policyDetails(Number(id));
            alert(JSON.stringify(policy, null, 2));
        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleGetBalance = async () => {
        try {
            const balance = await getBalance();
            alert("Contract balance: " + balance + " ETH");
        } catch (err) {
            alert(err.message);
        }
    };

    // -------------------------
    // UI
    // -------------------------

    return (
        <div style={{ padding: 40 }}>

            <h1>Insurance DApp</h1>

            <button onClick={connect}>
                Connect Wallet
            </button>

            <p>{wallet}</p>

            <hr />

            <h2>Insurer Actions</h2>

            <button onClick={handleFund}>
                Fund Contract
            </button>

            <button onClick={handleCreatePolicy}>
                Create Policy
            </button>

            <button onClick={handleApproveClaim}>
                Approve Claim
            </button>

            <hr />

            <h2>User Actions</h2>

            <button onClick={handlePayPremium}>
                Pay Premium
            </button>

            <button onClick={handleSubmitClaim}>
                Submit Claim
            </button>

            <button onClick={handleClaimPayout}>
                Claim Payout
            </button>

            <hr />

            <h2>View</h2>

            <button onClick={handleGetPolicy}>
                View Policy
            </button>

            <button onClick={handleGetBalance}>
                Contract Balance
            </button>

        </div>
    );
}