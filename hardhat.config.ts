import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-contract-sizer'
import 'solidity-coverage'

import '@nomicfoundation/hardhat-toolbox';

import { HardhatUserConfig } from 'hardhat/config'
import { SolcUserConfig } from 'hardhat/types'

require('dotenv').config()



const DEFAULT_COMPILER_SETTINGS: SolcUserConfig = {
  version: '0.7.6',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const V2_COMPIPLER_SETTINGS: SolcUserConfig = {
  version: '0.5.16',
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
  },
}

if (process.env.RUN_COVERAGE == '1') {
  /**
   * Updates the default compiler settings when running coverage.
   *
   * See https://github.com/sc-forks/solidity-coverage/issues/417#issuecomment-730526466
   */
  console.info('Using coverage compiler settings')
  DEFAULT_COMPILER_SETTINGS.settings.details = {
    yul: true,
    yulDetails: {
      stackAllocation: true,
    },
  }
}

console.log("#### hardhat config file: INFURA API key: ", process.env.INFURA_API_KEY);
console.log("#### hardhat config file: THERSCAN API key: ", process.env.ETHERSCAN_API_KEY);
console.log("#### hardhat config file: account priv key: ", process.env.ACCOUNT_PRIV_KEY);

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/1cd80711bced49fba439826c916c8871',
      accounts: ['1b85de991fefdd7677a0c0beae945a2162251367f831b6987eff044ea6f8ec73']
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
  },
  solidity: {
    compilers: [/*DEFAULT_COMPILER_SETTINGS, */ V2_COMPIPLER_SETTINGS],
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: true,
    runOnCompile: false,
  },

  paths: {
    sources: "v2-contracts",
    tests: "v2-tests",
    cache: "./cache",
    artifacts: "./artifacts"

  }
}


  config.etherscan = {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      goerli: `${process.env.ETHERSCAN_API_KEY}`,
    }
  }


export default config
