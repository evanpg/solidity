import React from "react";
import { useState } from "react";

import {
    connectWallet,
    addMember,
    deposit,
    createProposal,
    vote,
    executeProposal,
    getProposal
} from "./contract/dao";

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

    const handleAddMember = async () => {

        const address = prompt("Member address");

        if (!address) return;

        try {
            const hash = await addMember(address);

            alert("Member added!\n" + hash);

        } catch (err) {
            alert(err.reason || err.message);
        }
    };

    const handleDeposit = async () => {

        const amount = prompt("Amount (MATIC)");

        if (!amount) return;

        try {

            const hash = await deposit(amount);

            alert(hash);

        } catch (err) {

            alert(err.reason || err.message);

        }
    };

    const handleCreateProposal = async () => {

        const description = prompt("Description");

        const recipient = prompt("Recipient");

        const amount = prompt("Amount (MATIC)");

        try {

            const hash = await createProposal(
                description,
                recipient,
                amount
            );

            alert(hash);

        } catch (err) {

            alert(err.reason || err.message);

        }
    };

    const handleVote = async () => {

        const id = prompt("Proposal ID");

        try {

            const hash = await vote(Number(id));

            alert(hash);

        } catch (err) {

            alert(err.reason || err.message);

        }
    };

    const handleExecute = async () => {

        const id = prompt("Proposal ID");

        try {

            const hash = await executeProposal(Number(id));

            alert(hash);

        } catch (err) {

            alert(err.reason || err.message);

        }
    };

    const handleGetProposal = async () => {

        const id = prompt("Proposal ID");

        try {

            const proposal = await getProposal(Number(id));

            console.log(proposal);

            alert(JSON.stringify(proposal, null, 2));

        } catch (err) {

            alert(err.reason || err.message);

        }
    };

    return (

        <div style={{ padding: 40 }}>

            <h1>Simple DAO</h1>

            <button onClick={connect}>
                Connect Wallet
            </button>

            <p>{wallet}</p>

            <hr />

            <button onClick={handleAddMember}>
                Add Member
            </button>

            <button onClick={handleDeposit}>
                Deposit
            </button>

            <button onClick={handleCreateProposal}>
                Create Proposal
            </button>

            <button onClick={handleVote}>
                Vote
            </button>

            <button onClick={handleExecute}>
                Execute Proposal
            </button>

            <button onClick={handleGetProposal}>
                View Proposal
            </button>

        </div>
    );
}