const { ethers } = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0xf0603CDbd1F376e6e91c94BC9732cd2178230cD9";

    const abi = [
        "function addMember(address)"
    ];

    const [signer] = await ethers.getSigners();

    const dao = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
    );

    const tx = await dao.addMember(
        "0xd3702E5d683C81BBC6B83F253CCB9f0602626972"
    );

    await tx.wait();

    console.log("Member added!");
    console.log("Tx:", tx.hash);
}

main().catch(console.error);