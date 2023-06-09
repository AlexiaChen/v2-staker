Doc status: Reviewed && implemented

## 背景介绍

根据今天再与客户沟通，他们描述的系数，也就是这个释放速率，就是我所理解的代码里面的`rewardRate`了，
并且这个释放速率会随着打钱进stake池子进行动态调整。

客户举的例子：

> 两个人质押数量一样的情况下，比如现在一天释放1个BALL，前半天有1个人，后半天多了一个现在有两个人，那第一个人是拿到0.5+0.25，另外一个是0.25

我回答:

> 那要看，后来这个质押的人质押的数量有没有比前一个人多，如果多，就不一定了。

> 如果后来人比前面一个人质押多，那么可能的场景就是。第一个人是0.5 + 0.15  后面一个是0.35

客户回答:

> 对 我这是假设质押量一样 具体分肯定是按质押比例

我回答:

> 因为后面一个它再质押多，它也不可能分得超过0.5 ，因为这个奖励只剩一半了。

客户回答:

> 完全正确，逻辑就应该是这样。

我回答:

> 我所理解的这个代码里面的公式就是类似这样建模的，至于有没有那么精准，就不好说了，因为释放速率它会调整，说不定第二天，释放速率就随着你打钱进去，调整成一天释放5个了。

客户回答:

> OK

从以上的沟通需求来看，那么目前的stake池子的逻辑算法就是这样建模的，需求也完全满足客户要求。所以对外提供地址的权重占比就是多此一举，完全没有必要，也不节省gas费用。客户也不关心奖励的时间区间设置，因为只要模型是满足以上沟通的需求逻辑就可以了。所以最终又走回了原来那条路。

- 另外还需要更新`rewardDuration`， 客户觉得60天太长了。
- stake的质押资金要锁定48个小时，如果有新的资金进来，还需要更新锁定时间。

## 实现

改造StakingRewardsFactory合约，新增两个接口:

- `function notifyRewardAmounts2() public onlyOwner`
- `function notifyRewardAmount2(address stakingToken, uint256 _rewardAmount)`

以上接口主要是owner用来向Factory管理的Stake池子打对应数量的代币。用作奖励。这两个接口可以连续向对应的池子转账，以前的notify接口只可以转账一次。所以需要修改，这里不破坏原始逻辑，所以新增两个接口。

删除 [设计方案第二版](./distribute-ball-design-v2.md)中提到的，notify中的`rewardDuration`参数。删除 `function getValidStakersWithWeight() external view returns `接口, 删除一切对外提供权重占比的接口。

- 更新 `rewardsDuration` 参数为5天
- 在stake方法中增加  `_stakeLockFinishTimeStamp[msg.sender] = block.timestamp.add(lockStakeDuration);` 在withdraw方法中增加  `require(block.timestamp > _stakeLockFinishTimeStamp[msg.sender], "cannot withdraw our stake, this time in locking range");`


