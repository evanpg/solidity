// to run:    npx hardhat run scripts/interact.js --network localhost

const { ethers, network } = require("hardhat");

async function main() {

    const lockAddress =
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const Lock = await ethers.getContractAt(
        "Lock",
        lockAddress
    );
    
    console.log(
        "Owner:",
        await Lock.owner()
    );

    console.log(
        "Unlock time:",
        await Lock.unlockTime()
    );

    const lockBalanceBefore = await ethers.provider.getBalance(lockAddress);
    const ownerBalanceBefore = await ethers.provider.getBalance(await Lock.owner());

    console.log(
        "Contract balance before:",
        ethers.formatEther(lockBalanceBefore),
        "ETH"
    );

    console.log(
        "Owner balance before:",
        ethers.formatEther(ownerBalanceBefore),
        "ETH"
    );
    

    await network.provider.send(
        "evm_increaseTime",
        [2 * 365 * 24 * 60 * 60]
        );

    await network.provider.send(
        "evm_mine"
    );

const block = await ethers.provider.getBlock("latest");

    console.log(
        "Current time is:",
        block.timestamp
    );


    console.log(
        //withdraw, 
        "Trying to Withdrawal");

    const withdraw = await Lock.withdraw();
    await withdraw.wait();

    const lockBalanceAfter = await ethers.provider.getBalance(lockAddress);
    const ownerBalanceAfter = await ethers.provider.getBalance(await Lock.owner());

    console.log(
        "Contract balance after:",
        ethers.formatEther(lockBalanceAfter),
        "ETH"
    );

    console.log(
        "Owner balance after:",
        ethers.formatEther(ownerBalanceAfter),
        "ETH"
    );
};

main()
.catch((error)=>{
    console.error(error);
    process.exitCode = 1;
});