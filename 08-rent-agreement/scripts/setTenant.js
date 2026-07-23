const hre = require("hardhat");

async function main() {
    // address of deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    // get signers
    const [landlord, , tenant] = await hre.ethers.getSigners();

    console.log("Using he following address as the tenant:", tenant.address);

    //get contract instance, connecting it to landlords account to perform operations
    const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
    const rentAgreement = RentAgreement.attach(contractAddress).connect(landlord);

    // execute setTenantFunction to set Third account as tenant
    const setTenantTx = await rentAgreement.setTenant(tenant.address);
    await setTenantTx.wait();

    console.log(`Tenant set successfully with address ${tenant.address}. Transaction Hash: ${setTenantTx.hash}`);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

