import { ethers } from 'hardhat';

import { LoadFixtureFunction } from '../test/types';
import { UniswapV3Staker } from '../typechain';
import { uniswapFixture, UniswapFixtureType } from '../test/shared/fixtures';
import { expect } from '../test/shared';
import { createFixtureLoader, provider } from '../test/shared/provider';

async function main() {
    // let loadFixture: LoadFixtureFunction;
    // loadFixture = createFixtureLoader(provider.getWallets(), provider);
    // let context: UniswapFixtureType;
    // context = await loadFixture(uniswapFixture);
    
    
    const [deployer, addr1, addr2] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const stakerFactory = await ethers.getContractFactory("UniswapV3Staker");
    const staker = await stakerFactory.deploy(
        /*context.factory.address*/ addr1.address,
        /*context.nft.address*/addr2.address,
        2 ** 32,
        2 ** 32,
    );
  
    console.log("Token address:", staker.address);

    console.log("sss: ", await staker.maxIncentiveDuration());
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

