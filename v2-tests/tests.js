const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
//const { waffle } = require("hardhat");
//const { deployMockContract, provider } = waffle;

describe("Staker contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    
    //// UniswapV2ERC20 token
    const uniswapERC20Token = await ethers.getContractFactory("UniswapV2ERC20");
    const hreUniswapERC20Token = await uniswapERC20Token.deploy();
    await hreUniswapERC20Token.deployed();

    //// StakingRewardsFactory

    // mock reward token
    const mockRewardToken = await ethers.getContractFactory("MyRewardERC20");
    const hreMockReward = await mockRewardToken.deploy();
    await hreMockReward.deployed();

    // getting timestamp
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestamp = blockBefore.timestamp + 60;
    
    const stakingRewardsFactory = await ethers.getContractFactory("StakingRewardsFactory");
    const hreStakingRedwardsFactory = await stakingRewardsFactory.deploy(hreMockReward.address, timestamp);
    await hreStakingRedwardsFactory.deployed();

    console.log("My Reward ERC20 Token address is:", hreMockReward.address); 
    console.log("UniswapV2ERC20 address is:", hreUniswapERC20Token.address);
    console.log("StakingRewardsFactory address is:", hreStakingRedwardsFactory.address);

    // Fixtures can return anything you consider useful for your tests
    return { hreUniswapERC20Token, hreStakingRedwardsFactory, hreMockReward, owner, addr1, addr2 };
  }

  it("My Reward ERC20 Token", async function () {
    const { hreMockReward } = await loadFixture(deployTokenFixture);

    expect(await hreMockReward.symbol()).to.equal("MRT");
    expect(await hreMockReward.name()).to.equal("My Reward Token");
  });
  

  it("UniswapV2 ERC20 Token", async function () {
    const { hreUniswapERC20Token, owner } = await loadFixture(deployTokenFixture);

    expect(await hreUniswapERC20Token.symbol()).to.equal("UNI-V2");
    expect(await hreUniswapERC20Token.name()).to.equal("Uniswap V2");
  });

  
});