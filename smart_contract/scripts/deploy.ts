import { ethers,upgrades } from "hardhat";

async function main() {
  // // const lockedAmount = ethers.utils.parseEther("0.001");
  const ThaiCitizenContract = await ethers.getContractFactory("ThaiCitizenIdCardToken"); 
  // const ThaiCitizenDeploymend = await ThaiCitizenContract.deploy();
  const thaiCitizenContract = await upgrades.deployProxy(ThaiCitizenContract);
  await thaiCitizenContract.waitForDeployment();

  console.log(
    `ThaiCitizen deployed to ${await thaiCitizenContract.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
