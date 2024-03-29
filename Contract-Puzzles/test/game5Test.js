const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }

  beforeEach(async function () {
    this.wallet = null;
    let i = 0;
    while (!this.wallet) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      const address = await wallet.getAddress();
      console.log(i++, address);
      if (address < "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf") {
        this.wallet = wallet;
        break;
      }
    }
    const signer = await ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: this.wallet.address,
      value: ethers.utils.parseEther("1"),
    });
  });

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    await game.connect(this.wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
