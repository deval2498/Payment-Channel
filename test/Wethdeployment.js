const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("", function () {
  let weth;
  let sender;
  let paymentchannel;
  let recipient;
  let msghash;
  let signedmsghash;
  let ethsignedmsg;
  before(async function () {
    const WETH = await ethers.getContractFactory("WETH");
    [sender,recipient] = await ethers.getSigners();
    weth = await WETH.deploy();
    await weth.deployed;
    console.log("WETH token address:",weth.address);
        
    
    const paymentChannel = await ethers.getContractFactory("paymentChannel")
    paymentchannel = await paymentChannel.deploy(weth.address);
    await paymentchannel.deployed();
    console.log("paymentchannel deployed to:",paymentchannel.address);

    const verifySignature = await ethers.getContractFactory("verifySignature")
    verifysignature = await verifySignature.deploy();
    await verifysignature.deployed();
    console.log("VerifySignature deployed to:",verifysignature.address);


  });



  describe("Minting:", function() {
    it("Should mint weth", async function () {
    await weth.mint({value: ethers.utils.parseEther('1')});
    console.log("wallet balance is:",await sender.getBalance())
    expect(await weth.balanceOf(sender.address)).to.equal(ethers.utils.parseEther('1'));
    console.log('Balance is:',await weth.balanceOf(sender.address))
    })

    it("Should approve paymentchannel to take funds",async function(){
      let result;
      result = await weth.approve(paymentchannel.address,ethers.utils.parseEther('1'));
      expect(await weth.allowance(sender.address,paymentchannel.address)).to.equal(ethers.utils.parseEther('1'));
    })
    })

  describe("Channel Tests:",function(){
      it("Should open channel:",async function() {
          let result;
          result = await paymentchannel.openChannel(recipient.address,5000,ethers.utils.parseEther('1'));
          expect(await weth.balanceOf(paymentchannel.address)).to.equal(ethers.utils.parseEther('1'));
          console.log("Sender Balance:", await weth.balanceOf(sender.address));
          console.log("Expiration time:",await paymentchannel.expiration())
      })

      it("Should generate signed message:",async function() {
        msghash = await verifysignature.getMessageHash(paymentchannel.address,weth.address,ethers.utils.parseEther('1'));
        ethsignedmsg = await verifysignature.getEthSignedMessage(msghash)
        let binary = ethers.utils.arrayify(msghash);
        signedmsghash = await sender.signMessage(binary);
        expect(await verifysignature.verify(sender.address,paymentchannel.address,weth.address,ethers.utils.parseEther('1'),signedmsghash)).to.equal(true);
      })

      it("Verify Hash:", async function() {
        let result2 = await paymentchannel.verifyHash(signedmsghash,ethers.utils.parseEther('1'),paymentchannel.address,weth.address)
        console.log("Verify Hash result:", result2)
      })

      it("Claim timeout:",async function(){
        let result1 = setTimeout(async function() {await paymentchannel.claimTimeout()},1)
        console.log("sender address:",await weth.balanceOf(sender.address))
      })

      it("Should close channel and transfer amount to recipient if timeout is not claimed:",async function() {
        let result = await paymentchannel.connect(recipient).closeChannel(signedmsghash,ethers.utils.parseEther('1'),paymentchannel.address,weth.address)
        console.log("Result:",result)
        console.log("Recipient address:",await weth.balanceOf(recipient.address))
      })
  })
});
