const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Staker contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    

    //// UniswapV2ERC20 token
    const UniswapERC20Token = await ethers.getContractFactory("UniswapV2ERC20");
    const hreUniswapERC20Token = await UniswapERC20Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { hreUniswapERC20Token, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { hreUniswapERC20Token, owner } = await loadFixture(deployTokenFixture);

    const symbol = await hreUniswapERC20Token.symbol();
    expect(symbol).to.equal("UNI-V2");
  });

  
});