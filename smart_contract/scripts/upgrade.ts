import { ethers,upgrades } from "hardhat";

const { PROXY_ADDRESS, DEPLOY_CONTRACT_NAME } = process.env;
async function main() {
  const v2 = await ethers.getContractFactory(DEPLOY_CONTRACT_NAME as string);
  const v2Upg = await upgrades.upgradeProxy(PROXY_ADDRESS as string, v2);
  console.log("Upgrade Implementation address:",await v2Upg.getAddress());
}

main();
// const { ethers, upgrades } = require(“hardhat”);
// async function main() {
// const CubeTokenUpg = await ethers.getContractFactory(“CubeTokenUpgraded”);
// const cubeTokenUpg = await upgrades.prepareUpgrade(“{{YOUR_PROXY_ADDRESS}}”, CubeTokenUpg);
// console.log(“Upgrade Implementation address:”, cubeTokenUpg);
// }
