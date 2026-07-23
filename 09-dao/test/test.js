const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleDAO", function(){
    let dao, owner, member1, nonMember, member2;

    this.beforeEach(async function(){
        const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
        dao = await SimpleDAO.deploy();
        await dao.waitForDeployment();
        [owner, member1, nonMember, member2] = await ethers.getSigners();
    });


    it("Should automatically make the deployer (owner) a member", async function(){
        await dao.addMember(member1.address);
        expect(await dao.members(owner.address)).to.be.true;
    });

    // it("Should automatically make the deployer/owner a member", async function(){
    //     await dao.addMember(member1.address);
    //     expect(await dao.members(owner.address)).to.be.true;
    // });

    
});