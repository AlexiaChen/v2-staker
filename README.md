# uniswap-v2-staker

This is the canonical staking contract designed for [Uniswap V3](https://github.com/Uniswap/uniswap-v3-core).

## Arch

![](images/arch.jpg)


## Development and Testing

```sh
yarn
yarn test
```

##  Contracts Address

### Goerli Tesnet

v1 (deprecated):

- Deploying contracts with the account: `0x30B29E4615C6c7fcDF648Dc539dB7724743024c5` (not verified )
- UniswapV2ERC20 address is: `0x2e22a0114F829179BeCa340523aCdD7A4bd3A045` (not verified)
- My Reward ERC20 Token address is: `0x7ba75561E982A33F88C70259acB4759f186afe3F` (not verified)
- My Staking ERC20 Token address is: `0x623e205bAa59b24990df9B5d27343286Da9880bf` (not verified)
- StakingRewardsFactory address is: `0xd8914251939A3dc14a24D5e8dB72DEC4a669A673` (not verified)

v2:

- My Stake ERC20 Token Address `0xe2003461C2A2c2d18B5CF72ae992f75640ABbF52`   (verified on etherscan) https://goerli.etherscan.io/address/0xe2003461c2a2c2d18b5cf72ae992f75640abbf52 
- My Reward ERC20 Token Address `0xfC456971cF064cB610e6134dF3Bc3c861033052B` (verified on etherscan) https://goerli.etherscan.io/address/0xfc456971cf064cb610e6134df3bc3c861033052b
- UniswapV2ERC20 address `0x2c8D84ED5D3Aef8087A22B1f0d495bff395098FF` （veified on etherscan） https://goerli.etherscan.io/address/0x2c8d84ed5d3aef8087a22b1f0d495bff395098ff 
- StakingRwardsFactory address `0x4cB454a7499EaC89EeBf6295C541E51e9803E7d0` （verified on etherscan） https://goerli.etherscan.io/address/0x4cb454a7499eac89eebf6295c541e51e9803e7d0 
   - constructor(0xfC456971cF064cB610e6134dF3Bc3c861033052B, 1667185320)

## Deploy

```bash
yarn deploy:goerli
```

Or you can use remix IDE for deploying, Flattening solidity file and upload files to REMIX IDE to compile, deploy.

## TroubleShooting 

- https://github.com/Uniswap/v3-staker/issues/236

