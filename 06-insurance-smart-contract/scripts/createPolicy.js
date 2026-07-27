// this runs with `npx hardhat run ./scripts/createPolicy.js --network amoy`

import hre from "hardhat";

const { ethers } = hre;

async function main() {
    const CONTRACT_ADDRESS = "0xf0603CDbd1F376e6e91c94BC9732cd2178230cD9";
    //const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const abi = [
        "function createPolicy(address,uint256,uint256)"
    ];

    const { ethers } = await hre.network.connect(); //V3 specific

    const [signer] = await ethers.getSigners();

    const insurance = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
    );

    const tx = await insurance.createPolicy(
        "0xd3702E5d683C81BBC6B83F253CCB9f0602626972", // dev2 address
        //"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        1, 1);

    await tx.wait();

    console.log("Policy Created!");
    console.log("Tx:", tx.hash);
}

main().catch(console.error);

