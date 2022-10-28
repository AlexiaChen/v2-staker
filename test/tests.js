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
    const timestamp = blockBefore.timestamp + 5;
    
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
    // 这里主要表达式，只有owner的权限账号才可以部署deploy一个新的质押代币
    await expect(hreStakingRedwardsFactory.connect(addr1.address).deploy(hreMockStaking.address, 1000)).to.be.rejected;
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.ok;
    // only once deploy with same staking token address
    // 对于同一个质押staking代币，只可以部署一次，无论怎样修改其对应的奖励额度
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 200)).to.be.rejected;

  });

  it("Staking Reward Factory deploy new stake contract", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking } = await loadFixture(deployTokenFixture);
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, 1000)).to.be.ok;
    // deploy staking token
    // 每部署一个新的质押代币，其对应的代币合约地址就会被保存在Factory中
    expect(await hreStakingRedwardsFactory.stakingTokens(0)).to.be.equal(hreMockStaking.address);
  });

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  it("Staking Reward Factory Reward ", async function () {
    const { hreStakingRedwardsFactory, hreMockStaking, hreMockReward, owner} = await loadFixture(deployTokenFixture);
    
    // 部署一个staking token，质押这个staking token，可以获得奖励，奖励的amount为1000
    const rewardAmount = 1000;
    await expect(hreStakingRedwardsFactory.deploy(hreMockStaking.address, rewardAmount)).to.be.ok;
    expect(await hreStakingRedwardsFactory.stakingTokens(0)).to.be.equal(hreMockStaking.address);

    // Factory指定的工作时间戳还没有到,所以不可以开始其自身的工作
    await expect(hreStakingRedwardsFactory.notifyRewardAmounts()).to.be.revertedWith('StakingRewardsFactory::notifyRewardAmount: not ready');

    expect(await hreMockStaking.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
    expect(await hreMockReward.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));

    // 首先要转给Factory一定量的Reward Token。它后面才可以工作：转账reward token给其创建的不同质押代币对应的StakingRewards的合约
    const transferAmount = 10000;
    await expect(hreMockReward.transfer(hreStakingRedwardsFactory.address, transferAmount))
      .to.changeTokenBalances(hreMockReward, [owner.address, hreStakingRedwardsFactory.address], [-transferAmount, transferAmount]);
    expect(await hreMockReward.balanceOf(hreStakingRedwardsFactory.address)).to.equal(transferAmount);

    // 因为Factory构造的时候指定了其开始工作的最小时间戳，所以需要延迟一下时间，不然不满足require的指定
    this.timeout(10*1000);
    await wait(1000*6);
    await expect(hreStakingRedwardsFactory.notifyRewardAmounts()).to.be.ok;
    expect(await hreMockReward.balanceOf(hreStakingRedwardsFactory.address)).to.equal(transferAmount - rewardAmount);
    const [ stakingRewards ] = await hreStakingRedwardsFactory.stakingRewardsInfoByStakingToken(hreMockStaking.address);
    expect(await hreMockReward.balanceOf(stakingRewards)).to.equal(rewardAmount);

    // 1.测试到这里就会发现，对于StakingRewardFactory来说，它有些只有一个实例并且有Onwer。
    // 2. Onwer可以deploy发布一个新的staking token来作为可以质押的ERC20的代币种类，不同的staking token种类，有对应不同的奖励Reward额度（Reward Amount）,但是奖励的ERC20 代币只有一种reward token
    //   这个在构造函数的时候就指定reward token了，这个reward token可能就是UniswaoV2ERC20的代币。当然，这个在测试中都是模拟出来的。
    
  });
});