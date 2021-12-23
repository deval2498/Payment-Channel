const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("/////////Signature Verification/////////////", function() {
    let owner;
    before(async function() {
        owner = await ethers.getSigner();
        const verifySignature = await ethers.getContractFactory("verifySignature")
        const verifysignature = await verifysignature.deploy();
        await verifysignature.deployed();
        console.log("verifySignature deployed to:",verifysignature.address);


        describe("Should verify message with signature!", function(){
            it("Should get message hash",async function(){
                verifysignature.getMessageHash()
            })
        });
    });
})