import { ethers } from "ethers";
import {
    INSURANCE_ADDRESS,
    EXPECTED_CHAIN_ID,
    EXPECTED_CHAIN_HEX,
    EXPECTED_NETWORK_NAME,
} from "./config";
import { INSURANCE_ABI } from "./abi";

async function ensureCorrectNetwork(provider) {
    const network = await provider.getNetwork();
    if (network.chainId === EXPECTED_CHAIN_ID) return;

    try {
        await provider.send("wallet_switchEthereumChain", [
            { chainId: EXPECTED_CHAIN_HEX },
        ]);
    } catch (err) {
        // 4902 = chain not added to MetaMask yet
        if (err.code === 4902 || err?.error?.code === 4902) {
            await provider.send("wallet_addEthereumChain", [
                {
                    chainId: EXPECTED_CHAIN_HEX,
                    chainName: "Sepolia",
                    nativeCurrency: {
                        name: "SepoliaETH",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    rpcUrls: ["https://rpc.sepolia.org"],
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
            ]);
        } else {
            throw new Error(
                `Wrong network. Switch MetaMask to ${EXPECTED_NETWORK_NAME} (chainId ${EXPECTED_CHAIN_ID}).`
            );
        }
    }

    const after = await provider.getNetwork();
    if (after.chainId !== EXPECTED_CHAIN_ID) {
        throw new Error(
            `Wrong network. Switch MetaMask to ${EXPECTED_NETWORK_NAME} (chainId ${EXPECTED_CHAIN_ID}).`
        );
    }
}

async function getContract() {
    if (!window.ethereum) {
        throw new Error("No wallet found. Install MetaMask.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    await ensureCorrectNetwork(provider);

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        INSURANCE_ADDRESS,
        INSURANCE_ABI,
        signer
    );

    // Sanity check: empty bytecode on this chain → classic "require(false) / no data" error
    const code = await provider.getCode(INSURANCE_ADDRESS);
    if (!code || code === "0x") {
        throw new Error(
            `No contract at ${INSURANCE_ADDRESS} on this network. Switch to ${EXPECTED_NETWORK_NAME}.`
        );
    }

    return { provider, signer, contract };
}

function friendlyError(err) {
    if (err?.reason) return err.reason;
    if (err?.shortMessage) return err.shortMessage;
    return err?.message || String(err);
}

// Wallet
export async function connectWallet() {
    const { signer } = await getContract();
    return await signer.getAddress();
}

// Fund contract — must call the payable function (no receive/fallback on the contract)
export async function fundContract(amountInEth) {
    const { signer, contract } = await getContract();

    console.log("Contract:", contract.target);
    console.log("Connected wallet:", await signer.getAddress());
    console.log("Insurer:", await contract.insurer());
    console.log("Amount:", amountInEth);

    const tx = await contract.fundContract({
        value: ethers.parseEther(amountInEth.toString()),
    });

    await tx.wait();
    return tx.hash;
}

// Pay premium
export async function payPremium(policyId, amountInEth) {
    const { contract } = await getContract();
    const tx = await contract.payPremium(policyId, {
        value: ethers.parseEther(amountInEth.toString()),
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
        payoutDone: p.payoutDone,
    };
}

export async function getBalance() {
    const { provider, contract } = await getContract();
    const balance = await provider.getBalance(contract.target);
    return ethers.formatEther(balance);
}

export async function getInsurer() {
    const { contract } = await getContract();
    return await contract.insurer();
}

export async function checkAccounts() {
    const { signer, contract } = await getContract();

    const wallet = await signer.getAddress();
    const insurer = await contract.insurer();

    console.log("Connected wallet:", wallet);
    console.log("Contract insurer:", insurer);

    return {
        wallet,
        insurer,
        isInsurer: wallet.toLowerCase() === insurer.toLowerCase(),
    };
}

export { friendlyError };
