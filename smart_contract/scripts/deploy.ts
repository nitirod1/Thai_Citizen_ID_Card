import { ethers } from "hardhat";
import "dotenv/config";
const { SEPOLIA_RPC, PRIVATE_KEY, ETHERSCAN_API } = process.env;
async function main() {
  // // const lockedAmount = ethers.utils.parseEther("0.001");
  const ThaiCitizenContract = await ethers.getContractFactory("ThaiCitizenIdCardToken"); 
  const ThaiCitizenDeploymend = await ThaiCitizenContract.deploy();

  await ThaiCitizenDeploymend.waitForDeployment();

  console.log(
    `ThaiCitizen deployed to ${await ThaiCitizenDeploymend.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
