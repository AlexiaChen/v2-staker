const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { delay } = require("lodash");
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
    const timestamp = blockBefore.timestamp + 2;
    
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

  it("Staking Reward Factory ownership", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking, addr1 } = await loadFixture(deployTokenFixture);

    // ownership
    await expect(hreStakingRedwardsFactory.connect(addr1.address).deploy(hreMockStaking.address, 1000)).to.be.rejected;
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.ok;
    // only once deploy with same staking token address
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.rejected;

  });

  it("Staking Reward Factory deploy new stake contract", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking } = await loadFixture(deployTokenFixture);
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.ok;
    // deploy staking token
    expect(await hreStakingRedwardsFactory.stakingTokens(0)).to.be.equal(hreMockStaking.address);
  });

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  it("Staking Reward Factory Reward ", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking, hreMockReward, owner} = await loadFixture(deployTokenFixture);
    
    const rewardAmount = 1000;
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, rewardAmount)).to.be.ok;
    expect(await hreStakingRedwardsFactory.stakingTokens(0)).to.be.equal(hreMockStaking.address);

    //await expect(hreStakingRedwardsFactory.notifyRewardAmounts()).to.be.revertedWith('StakingRewardsFactory::notifyRewardAmount: not ready');

    expect(await hreMockStaking.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
    expect(await hreMockReward.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));

    const transferAmount = 10000;
    await expect(hreMockReward.transfer(hreStakingRedwardsFactory.address, transferAmount))
      .to.changeTokenBalances(hreMockReward, [owner.address, hreStakingRedwardsFactory.address], [-transferAmount, transferAmount]);
    expect(await hreMockReward.balanceOf(hreStakingRedwardsFactory.address)).to.equal(transferAmount);
    
    console.log("Factory %s balance is %s", hreStakingRedwardsFactory.address, await hreMockReward.balanceOf(hreStakingRedwardsFactory.address));

    this.timeout(10*1000);
    await wait(1000*5);
    await expect(hreStakingRedwardsFactory.notifyRewardAmounts()).to.be.ok;
    expect(await hreMockReward.balanceOf(hreStakingRedwardsFactory.address)).to.equal(transferAmount - rewardAmount);


  });
});