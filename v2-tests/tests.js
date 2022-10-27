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

    // mock staking token
    const mockStakingToken = await ethers.getContractFactory("MyStakingERC20");
    const hreMockStaking = await mockStakingToken.deploy();
    await hreMockStaking.deployed();

    // getting timestamp
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestamp = blockBefore.timestamp + 60;
    
    const stakingRewardsFactory = await ethers.getContractFactory("StakingRewardsFactory");
    const hreStakingRedwardsFactory = await stakingRewardsFactory.deploy(hreMockReward.address, timestamp);
    await hreStakingRedwardsFactory.deployed();

    console.log("My Reward ERC20 Token address is:", hreMockReward.address);
    console.log("My Staking ERC20 Token address is:", hreMockStaking.address); 
    console.log("UniswapV2ERC20 address is:", hreUniswapERC20Token.address);
    console.log("StakingRewardsFactory address is:", hreStakingRedwardsFactory.address);

    // Fixtures can return anything you consider useful for your tests
    return { hreUniswapERC20Token, hreStakingRedwardsFactory, hreMockReward, hreMockStaking, owner, addr1, addr2 };
  }

  it("My Reward ERC20 Token", async function () {
    const { hreMockReward } = await loadFixture(deployTokenFixture);

    expect(await hreMockReward.symbol()).to.equal("MRT");
    expect(await hreMockReward.name()).to.equal("My Reward Token");
  });

  it("My Staking ERC20 Token", async function () {
    const { hreMockStaking } = await loadFixture(deployTokenFixture);

    expect(await hreMockStaking.symbol()).to.equal("MST");
    expect(await hreMockStaking.name()).to.equal("My Staking Token");
  });
  
  it("UniswapV2 ERC20 Token", async function () {
    const { hreUniswapERC20Token, owner } = await loadFixture(deployTokenFixture);

    expect(await hreUniswapERC20Token.symbol()).to.equal("UNI-V2");
    expect(await hreUniswapERC20Token.name()).to.equal("Uniswap V2");
  });

  it("Staking Reward Factory", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking, owner, addr1 } = await loadFixture(deployTokenFixture);

    // ownership
    await expect(hreStakingRedwardsFactory.connect(addr1.address).deploy(hreMockStaking.address, 1000)).to.be.rejected;
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.ok;
    // only once deploy with same staking token address
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.rejected;

    // deploy staking token
    expect(await hreStakingRedwardsFactory.stakingTokens(0)).to.be.equal(hreMockStaking.address);


  });

  
});