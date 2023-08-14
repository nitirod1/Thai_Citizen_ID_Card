import { ethers } from "hardhat";
import { expect } from "chai";
const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  
describe("ThaiCitizenIdCardToken", function () {
  async function deployTokenFixture() {
    const [owner, subOwner, citizen1,citizen2] = await ethers.getSigners();

    const tokenInstance = await ethers.deployContract("ThaiCitizenIdCardToken");

    // Fixtures can return anything you consider useful for your tests
    return { tokenInstance, owner, subOwner, citizen1,citizen2 };
  }

  it("should reverted when already citizen role", async function () {
    const { tokenInstance,citizen1} = await loadFixture(deployTokenFixture);
    const citizenIdHash =  ethers.keccak256("0x1337");
    const fullNameHash = ethers.keccak256("0x1337");
    const ageHash = ethers.keccak256("0x1337");
    const genderHash = ethers.keccak256("0x1337");
    const issueDate = "2023-08-01";
    const expiryDate = "2025-08-01";
    const uri = "token-uri";
    await tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        citizenIdHash,
        fullNameHash,
        ageHash,
        genderHash,
        issueDate,
        expiryDate,
        uri
    );
    
    await expect(tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        citizenIdHash,
        fullNameHash,
        ageHash,
        genderHash,
        issueDate,
        expiryDate,
        uri
    )).to.be.reverted;

  });
  it("should reverted when burn token ", async function () {
    const { tokenInstance,owner,citizen1} = await loadFixture(deployTokenFixture);
    const citizenIdHash =  ethers.keccak256("0x1337");
    const fullNameHash = ethers.keccak256("0x1337");
    const ageHash = ethers.keccak256("0x1337");
    const genderHash = ethers.keccak256("0x1337");
    const issueDate = "2023-08-01";
    const expiryDate = "2025-08-01";
    const uri = "token-uri";
    await tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        citizenIdHash,
        fullNameHash,
        ageHash,
        genderHash,
        issueDate,
        expiryDate,
        uri
    );
    expect(await tokenInstance.balanceOf(citizen1)).to.equal(1)
    await tokenInstance.connect(owner).removeToken(0)
    expect(await tokenInstance.balanceOf(citizen1)).to.equal(0)
    await expect(tokenInstance.connect(citizen1).getCitizen(0)).to.be.reverted;
  });
});