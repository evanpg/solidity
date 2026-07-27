const {ethers } = require("hardhat");

async function main() {
  // compile contract
  await hre.run('compile');

  // get factory
  const Insurance = await ethers.getContractFactory("Insurance");
  const Insurance =  await Insurance.deploy();
  await Insurance.waitForDeployment();

  console.log("Insurance deployed to:", Insurance.target);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;

});