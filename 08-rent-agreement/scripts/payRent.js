const hre = require("hardhat");

async function main() {
    // address of deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    // get signers
    const [, , tenant] = await hre.ethers.getSigners();
    console.log("Using he following address as the tenant:", tenant.address);

    // amount of rent to be paid, adjust this according to contract
    const rentAmount = hre.ethers.parseEther("1"); // 1 ETH

    // show balance before
    let tenantBalance = await hre.ethers.provider.getBalance(tenant.address);
    // console.log(`tenants balance before: ${hre.ethers.utils.formatEther(tenantBalance)} ETH`);

    // get contract instance connecting it with the tenant account to 
    const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
    const rentAgreement = new hre.ethers.Contract(contractAddress, RentAgreement.interface, tenant);

    // execute setTenantFunction to set Third account as tenant
    const payRentTx = await rentAgreement.payRent({ value: rentAmount });
    const receipt = await payRentTx.wait();

    console.log(`Amount paid: ${rentAmount}. Transaction Hash: ${payRentTx.hash}`);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

