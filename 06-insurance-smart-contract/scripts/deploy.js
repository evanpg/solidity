const { ethers } = require("hardhat");

async function main() {
  // compile contract... V3 has this built into getContractFactory
  // await hre.run('compile');

  // get factory
  const InsuranceFactory = await ethers.getContractFactory("Insurance");
  const Insurance =  await InsuranceFactory.deploy();
  await Insurance.waitForDeployment();

  console.log("Insurance deployed to:", Insurance.target);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;

});