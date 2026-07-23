const {ethers } = require("hardhat");

async function main() {
  // compile contract
  await hre.run('compile');

  // get factory
  const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
  const simpleDAO =  await SimpleDAO.deploy();
  await simpleDAO.waitForDeployment();

  console.log("SimpleDAO deployed to:", simpleDAO.target);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;

});