## 背景介绍

由于流动性挖矿之前新做了一个[需求](./distribute-ball-design.md) 不满足客户要求，客户要求要获取目前正在质押的用户的占比权重(质押时间占比和质押数额占比)。所以需要对之前提到的[方案二](https://github.com/FiiLabs/v2-staker/blob/main/docs/distribute-ball-design.md#%E6%96%B9%E6%A1%88%E4%BA%8C-%E5%B7%B2%E9%80%89%E6%8B%A9%E8%BF%99%E4%B8%AA%E6%96%B9%E6%A1%88%E5%AE%9E%E7%8E%B0)的接口做修改，才可以满足。

还有客户所说的有一个系数要乘上，不然池子的奖励很容易被掏空，我想这里是有的，在`StakingRewards.sol`中，`notifyRewardAmount(uint256 reward)`来通知矿池以什么数额的奖励开始瓜分奖励代币的时候，是有一个系数的，这个系数叫`rewardRate`，里面有一个断言语句 `  require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");` 意思就是防止在某个时间区间，奖励利率不合理的要求是不给通过的。我想这个就是客户所描述的“池子不能被一下子掏空"的原因。

## 实现

这里应该是我目前可以想到的最直接简单的实现。

其实如果仔细分析，其实第二个附带的这个安全上的系数需求，目前就是可以满足的，获取用户的权重占比是可以做的。并且为了灵活性，我们后面测试的合约可以删除`StakingRewardsFactory.sol`这个合约。因为这个合约的限制太多，是`StakingRewards.sol`的工厂合约，是上层的直接简单封装，我们以后可以直接使用StakingRewardss.sol这个单币质押池子的合约，有多少个需要stake的代币，就部署这个合约的多少个实例，只是参数不一样。

因为客户对这个时间区间瓜分一定数额的奖励，对这个时间区间有指定的要求，那么可以把时间区间调小，通过参数指定的方式, 同样是用`notifyRewardAmount`这个方法，这个方法增加一个奖励时间区间的参数就可以了，因为安全性它自己会保证，参数不符合要求它自己会自动报错提示用户。

比如这样:

```d
function notifyRewardAmount(uint256 rewardDuration,uint256 rewardAmount)
```

这样就可以根据客户的需求动态调整这个参数了，这个方法的意思是：在给定`rewardDurarion`的时间区间内(以秒为计算)， 质押者根据自身的权重占比来瓜分(挖)总额为`rewardAmount`的奖励代币。 之前的实现是，`rewardDurarion`是硬编码为`60`天。所以这里是可以修改的。

还有就是权重占比的用户列表获取，需要这样实现，新增一个方法叫`getValidStakersWithWeight`：

```d
function getValidStakersWithWeight() external view returns 
    (address [] memory, uint256 [], uint256 []) {
// 第一个数组返回所有在质押用户的用户地址
// 第二个数组返回在质押用户地址对应的质押余额占比，如果是占比0.5也就是50%,那么就是0.5*1e18 ，用这样的方式来表示百分比和小数  https://ethereum.stackexchange.com/questions/52962/usage-of-float-numbers-in-smart-contract
// 第三个数组返回在质押用户地址对应的质押时间占比，小数表示方式同上
return (accounts, balancesWeight, durationWeight);
}
```

这个接口提供出去，由外部合约来通过这些权重来计算发放ball奖励，因为这里的ball奖励，与池子之前的奖励是不一样的，这里的ball奖励是通过平台利润回购的ball，不能混淆。数额额度也会不一样，所以由外部合约来代发。