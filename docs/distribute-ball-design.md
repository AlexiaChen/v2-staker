Doc status: Reviewed && implemented

## 背景介绍

由于这是一个外包项目，需求方最开始需要一个流动性挖矿的功能，最开始的功能越简单越好，所以这个系统就抄了UniswapV2的流动性挖矿源码了。但是由于其在测试网表现的功能，需求方需要增加一个功能：单币质押分平台利润的功能。据需求方的反馈，目前的奖励是质押LP token后奖励Ball代币，并没有奖励平台利润。

这个功能简而言之就是：**把betting平台赚取的手续费也用来发奖励。**

bettiing平台就是一个赌球的的平台，每一期赌球，分配一下平台赚取的利润，这些利润，就分配奖励给staker。

## 实现

通过背景的了解，每一期的时间界限应该是管理者来定义的（比如每几天，每几场比赛分一期），因为合约无法自己自动运行，需要人工手工触发这个发奖励的操作。并且，v2-staker这个项目由于没有考虑到这么一个特定化的功能，所以需要改动，并且这个改动的设计应该尽量不与原来的机制耦合在一起。应该尽可能一个方法完成，一个比较独立的方法，所以不应该涉及Factory的修改，只应该在StakingRewards池子内修改，获取池子中的用户数据，给这些用户发利润奖励。

但是目前原项目，奖励的代币只支持一种ERC20代币，不支持多种，所以有一个同事提出来，是否可以通过利润来回购Ball代币，来实现奖励的发放，回购的这个操作也不可能在Staker里面，Staker只关注发放奖励，不关心其他的，只应该做好它自己的一件事。

所以回购完成后的Ball代币，也应该手动充值到对应的StakingRewards池子中，但是因为这个利润分配，与质押的机制不同，所以这份利润回购的Ball的数额要与原先机制的Reward token的份额分开，以免混淆和相互影响，是一个比较单独，独立的功能。

### 方案一

在StakingRewards合约中新增一个发放利润的方法:

```d
function distributeProfits(uint256 amount) public {
    require(amount > 0, "Cannot distribute Profits 0");
    rewardsToken.safeTransferFrom(msg.sender, address(this), amount);
    uint256 memory amount_per_unser = amount / user_number;
    // 获取staker中的质押中的用户数据，要筛选过滤条件
    for(userBalance : _balances) {
        if(userBalance > 0 && interval <= block.timestamp - userStakingTimeStamp) {
            rewardsToken.safeTransfer(userAddress, amount_per_user);
        } 
    }
}
```

把用利润回购的ball代币，转移到池子合约的地址下，与Factory操作StakingRewards的池子原理一致，都要转账给池子，池子才方便发奖励。利润回购的ball代币的发放数额，需要做单独记录，以免与原系统混淆。

这个方案的设计目标是尽可能改动少，不影响质押获取奖励的功能和算法。利润回购的Ball，不参与原系统的机制和算法。

### 方案二 （已选择这个方案实现）

考虑到平台赚取的利润要分配给质押的用户，其实本质上就是想获取到当前Staker对应质押池子中符合奖励条件的用户数据，那么本质上这个分配方案可以不需要Staker具体参与，Staker只提供必要的用户数据。这样可以由外部的合约参与，让前端获取到符合条件的用户数据后，再调用Ball ERC20代币的transfer接口，来发放利润回购的ball代币。当然，这个需要登录利润回购后的owner账号的钱包，才可以操作，由这个利润的owner来点击转账发放奖励按钮。当然方案一，肯定也是需要类似这样的人工介入操作的。这个是由合约的特性决定的，合约无法自发被触发，总是需要caller来调用。

```d
function getUsersForProfits() address [] public {
    // 经过各种条件筛选符合条件的用户地址返回
    return users
} 
```

- 实现PR https://github.com/FiiLabs/v2-staker/pull/1

### 方案三

如果是不用回购Ball的机制，那么势必让池子多管理一份ERC20的代币，造成不必要的复杂，工作量和测试也会相应增多。这个方案不推荐实现。

