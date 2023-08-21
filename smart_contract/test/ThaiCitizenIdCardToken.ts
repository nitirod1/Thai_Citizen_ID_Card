import { ethers ,upgrades} from "hardhat";
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
    const crpydata =  "test"
    const issueDate = "2023-08-01";
    const expiryDate = "2025-08-01";
    await tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        crpydata,
        issueDate,
        expiryDate
    );
    
    await expect(tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        crpydata,
        issueDate,
        expiryDate
    )).to.be.reverted;

  });
  it("should reverted when burn token ", async function () {
    const { tokenInstance,owner,citizen1} = await loadFixture(deployTokenFixture);
    const crpydata =  "test"
    const issueDate = "2023-08-01";
    const expiryDate = "2025-08-01";
    await tokenInstance.connect(citizen1).safeMint(
        citizen1.address,
        crpydata,
        issueDate,
        expiryDate
    );
    expect(await tokenInstance.balanceOf(citizen1)).to.equal(1)
    await tokenInstance.connect(owner).removeToken(0)
    expect(await tokenInstance.balanceOf(citizen1)).to.equal(0)
    await expect(tokenInstance.connect(citizen1).getCitizen(0)).to.be.reverted;
  });
  it("onlyAllowedRoles getCitizen ", async function () {
    const { tokenInstance,owner,citizen1,citizen2} = await loadFixture(deployTokenFixture);
    const crpydata =  "test"
    const issueDate = "2023-08-01";
    const expiryDate = "2025-08-01";
    await tokenInstance.connect(citizen2).safeMint(
        citizen2.address,
        crpydata,
        issueDate,
        expiryDate
    );
    
    const ownerToken =await tokenInstance.connect(citizen2).ownerOf(0)
    console.log(ownerToken == citizen2.address)
    expect(await tokenInstance.connect(owner).getCitizen(0));
  });
});
// describe("Box", function() {
//   it('works', async () => {
//     const Box = await ethers.getContractFactory("ThaiCitizenIdCardToken");
//     const BoxV2 = await ethers.getContractFactory("BoxV2");
  
//     const instance = await upgrades.deployProxy(Box, [42]);
//     const upgraded = await upgrades.upgradeProxy(await instance.getAddress(), BoxV2);

//     const value = await upgraded.value();
//     expect(value.toString()).to.equal('42');
//   });
// });