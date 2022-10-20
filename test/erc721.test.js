const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuanNFT contract", function () {

    async function testLuanNFT() {

        let LuanNFT;
        let token721;
        let _name='LuanNFT';
        let _symbol='LAA';
        let otheraccounts;

        
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;
        
        const lockedAmount = ONE_GWEI;
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
        
        [owner, ...otheraccounts] = await ethers.getSigners();
        
        LuanNFT = await ethers.getContractFactory("LuanNFT");
        token721 = await LuanNFT.deploy(_name,_symbol);
        
        // token721 = await owner.create("LuanNFT", "LAA", "18", "100000");

        return { token721, unlockTime, lockedAmount, owner, otherAccount };
    };

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        // it("Should set the right unlockTime", async function () {
        //     const { token721, unlockTime } = await loadFixture(testLuanNFT);
        
        //     expect(await token721.unlockTime()).to.equal(unlockTime);
        // });

        it("Should has the correct name and symbol ", async function () {
            const { token721 } = await loadFixture(testLuanNFT);

            expect(await token721.name()).to.equal(_name);
            expect(await token721.symbol()).to.equal(_symbol);
        });

        it("Should set the right owner", async function () {
            const { token721, owner } = await loadFixture(testLuanNFT);
      
            expect(await token721.owner()).to.equal(owner.address);
        });

        it("Should only owner of contract call startAuction", async function () {
            const { token721, owner } = await loadFixture(testLuanNFT);
            await expect(token721.connect(owner).startAuction()).to.revertedWith(
              "Not the owner of the auction"
            );
        });

        it("Should mint a token with token ID 1 & 2 to account1", async function () {
            const address1=account1.address;
            await token721.mintTo(address1);
            expect(await token721.ownerOf(1)).to.equal(address1);

            await token721.mintTo(address1);
            expect(await token721.ownerOf(2)).to.equal(address1);

            expect(await token721.balanceOf(address1)).to.equal(2);      
        });

        // it("Burn NFT", async function () {
        // });
        //revertedWith, compara o erro..
    });

    describe("Withdrawals", function () {

        describe("Transfers", function () {
            it("Should transfer the funds to the owner", async function () {
                const { token721, unlockTime, lockedAmount, owner } = await loadFixture(testLuanNFT);
        
                await time.increaseTo(unlockTime);
        
                await expect(token721.withdraw()).to.changeEtherBalances(
                [owner, token721],
                [lockedAmount, -lockedAmount]
                );
            });
        });

    });

});


  // ToDo - Aprove-Receive-Token
  // Implement - AccessControl - Interface, fazer um it de burn | Doing
  // Implement - Modifier using accesControl.| Doing
  // Solidity Counter | Implement counter | usar pra fazer a contagem dos nft.| Doing
