import { ethers } from 'hardhat';
const hre = require('hardhat');


async function main() {

  console.log("Timestamp script ETHERSCAN_API_KEY: ", process.env.ETHERSCAN_API_KEY);
  
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`Deployment Account balance: ${balance.toString()}`);

  
  
  // getting timestamp
  const blockNumBefore = await ethers.provider.getBlockNumber();
  const blockBefore = await ethers.provider.getBlock(blockNumBefore);
  const timestamp = blockBefore.timestamp + 60*30;

  console.log("current block number is ", blockNumBefore);
  console.log("current block timestamp plus 30 min is ", timestamp)

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

