pragma solidity ^0.5.16;

contract RewardsDistributionRecipient {
    address public rewardsDistribution;

    function notifyRewardAmount(uint256 reward) external;
    function notifyRewardAmount2(uint256 _rewardDuration, uint256 _rewardAmount) external;

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
        _;
    }
}