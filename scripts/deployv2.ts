import { ethers } from 'hardhat';
const hre = require('hardhat');


async function main() {

  console.log("Deployv2 script ETHERSCAN_API_KEY: ", process.env.ETHERSCAN_API_KEY);
  
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
    
  // Verify contract
  let deployNetwork: string = 'goerli';
  await hre.run('verify:verify', {
    address: hreStakingRedwardsFactory.address,
    constructorArguments: [hreMockReward.address, timestamp],
    network: deployNetwork,
    apiKey: {
        goerli: process.env.ETHERSCAN_API_KEY,
    },
});

  await hre.run('verify:verify', {
    address: hreUniswapERC20Token.address,
    constructorArguments: [],
    network: deployNetwork,
    apiKey: {
        goerli: process.env.ETHERSCAN_API_KEY,
    },
  });

  await hre.run('verify:verify', {
    address: hreMockReward.address,
    constructorArguments: [],
    network: deployNetwork,
    apiKey: {
        goerli: process.env.ETHERSCAN_API_KEY,
    },
  });

  await hre.run('verify:verify', {
    address: hreMockStaking.address,
    constructorArguments: [],
    network: deployNetwork,
    apiKey: {
        goerli: process.env.ETHERSCAN_API_KEY,
    },
  });

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

