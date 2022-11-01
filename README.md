# uniswap-v2-staker

This is the canonical staking contract designed for [Uniswap V3](https://github.com/Uniswap/uniswap-v3-core).

## Arch

![](images/arch.jpg)

架构大概是这样的，有一个抵押奖励的工厂合约`StakingRewardsFactory`， 这个是deployer这样的owner独占的，它被创建的时候传递两个参数，第一个是将会奖励的ERC20的代币地址，第二个是这个合约真正开始工作的时间，就是一个时间戳。Factory合约维护多个抵押奖励的池子，因为它可以支持不同的ERC20代币作为抵押，但是奖励的代币只有一种，就是constructor传递的那个奖励代币。

每一个抵押的奖励池子，对应不同的stake代币，比如deploy了两个不同的stake 代币，那么就对应有两个`StakeReward`合约的地址，StakeReward合约是deploy方法里面动态new创建的。StakeReward于stake代币一一对应。

如果要抵押stake你想要的代币获取流动性挖矿奖励，需要拿到对应的stake代币的奖励池合约的地址(StakeReward合约地址),然后调用其的stake方法，经过一段时间以后，再调用getward函数获取奖励代币。或者调用exit方法，获取奖励代币的同时，也提取你所欲的抵押的代币赎回。

## Get Started && How to simply use

0. 先给Factory合约的地址充钱，充My Reward ERC20代币的钱。

1. 首先，拥有owner权限的account调用Factory的deploy方法，传递流动性挖矿需要支持的抵押ERC20代币合约的地址，和奖励的额度。首先，Factory工厂合约要有reward ERC20代币的余额，不然奖励池没法进行工作。所以再次之前，先确认Factory合约的地址下，有一定数量的MRT这个ERC20 代币(My Reeward Token)。这个数量的代币，deploy(stake erc20 token address, rewardAmount) rewardAmount

2. 然后调用Factory合约的 notifyRewardAmounts() 或者 notifyRewardAmount(address stakingToken)，通知并向流动性矿池转之前deploy时候设置的rewardAmount这个数量的代币。

3. 现在就可以使用StakingRewards的合约接口，比如用stake方法存stake的ERC20代币了，getReward方法提取质押期间所获得的奖励。如果要提取抵押的stake ERC20的代币，可以用withdraw方法。用exit方法更直接，提取奖励的同时也提取抵押的存款。

## Development and Testing

```sh
yarn
yarn test
```

##  Contracts Address

### Goerli Tesnet

v1 (deprecated):

Deploying contracts with the account: `0x30B29E4615C6c7fcDF648Dc539dB7724743024c5`

- <del> UniswapV2ERC20 address is: `0x2e22a0114F829179BeCa340523aCdD7A4bd3A045` (not verified) </del>
- <del> My Reward ERC20 Token address is: `0x7ba75561E982A33F88C70259acB4759f186afe3F` (not verified) </del>
- <del> My Staking ERC20 Token address is: `0x623e205bAa59b24990df9B5d27343286Da9880bf` (not verified) </del>
- <del> StakingRewardsFactory address is: `0xd8914251939A3dc14a24D5e8dB72DEC4a669A673` (not verified) </del> 

v2:

Deploying contracts with the account: `0x30B29E4615C6c7fcDF648Dc539dB7724743024c5`

- My Stake ERC20 Token Address `0x138F183171C849c6A7437A7E60C9ac28CEc66D07`   (verified on etherscan) https://goerli.etherscan.io/address/0x138f183171c849c6a7437a7e60c9ac28cec66d07 
- My Reward ERC20 Token Address `0xc01C97800cbD85f39aE204e9510c400B27F9C93B` (verified on etherscan) https://goerli.etherscan.io/address/0xc01c97800cbd85f39ae204e9510c400b27f9c93b
- UniswapV2ERC20 address `0x2c8D84ED5D3Aef8087A22B1f0d495bff395098FF` （veified on etherscan） https://goerli.etherscan.io/address/0x2c8d84ed5d3aef8087a22b1f0d495bff395098ff 
- StakingRwardsFactory address `0xF0335B3F3baa36E32dfA5dFcC224C5D5c4654081` （verified on etherscan） https://goerli.etherscan.io/address/0xf0335b3f3baa36e32dfa5dfcc224c5d5c4654081 
   - constructor(`0xc01C97800cbD85f39aE204e9510c400B27F9C93B`, `1667299572`) 第一个参数是MRT代币的地址，奖励是奖励MRT代币，第二个参数是开始流动性挖矿开始工作的时间戳，设置是部署时间 + 半个小时以后

## Deploy

```bash
yarn deploy:goerli
```

Or you can use remix IDE for deploying, Flattening solidity file and upload files to REMIX IDE to compile, deploy.

## TroubleShooting 

- https://github.com/Uniswap/v3-staker/issues/236

