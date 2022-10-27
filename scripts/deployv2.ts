import { ethers } from 'hardhat';
const hre = require('hardhat');


async function main() {

  console.log("Deployv2 script ETHERSCAN_API_KEY: ", process.env.ETHERSCAN_API_KEY);
  
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`Deployment Account balance: ${balance.toString()}`);

  console.log("Deploying...");
  //// UniswapV2ERC20 token
  const uniswapERC20Token = await ethers.getContractFactory("UniswapV2ERC20");
  const hreUniswapERC20Token = await uniswapERC20Token.deploy();
  await hreUniswapERC20Token.deployed();
  console.log("UniswapV2ERC20 address is:", hreUniswapERC20Token.address);

  //// StakingRewardsFactory

  // mock reward token
  const mockRewardToken = await ethers.getContractFactory("MyRewardERC20");
  const hreMockReward = await mockRewardToken.deploy();
  await hreMockReward.deployed();
  console.log("My Reward ERC20 Token address is:", hreMockReward.address);

  // mock staking token
  const mockStakingToken = await ethers.getContractFactory("MyStakingERC20");
  const hreMockStaking = await mockStakingToken.deploy();
  await hreMockStaking.deployed();
  console.log("My Staking ERC20 Token address is:", hreMockStaking.address); 

  // getting timestamp
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestamp = blockBefore.timestamp + 60*15;

  const stakingRewardsFactory = await ethers.getContractFactory("StakingRewardsFactory");
  console.log("Deploying StakingRewardsFactory");
  const hreStakingRedwardsFactory = await stakingRewardsFactory.deploy(hreMockReward.address, timestamp);
  await hreStakingRedwardsFactory.deployed();
  console.log("StakingRewardsFactory address is:", hreStakingRedwardsFactory.address);
    
  // Verify contract
  let deployNetwork: string = `${process.env.VERIFY_DEPLOYED_NETWORK}`;
  console.log("verify deployed network: ", deployNetwork);
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

