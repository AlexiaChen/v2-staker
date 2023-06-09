pragma solidity >=0.4.24;


interface IStakingRewards {
    // Views
    function lastTimeRewardApplicable() external view returns (uint256);

    function rewardPerToken() external view returns (uint256);

    function earned(address account) external view returns (uint256);

    function getRewardForDuration() external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    // Mutative

    function stake(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function getReward() external;

    function exit() external;

    // stand-alone method for getting stakers for staking a period of time
    // function getAccountsByStakingDuration(uint256 duration) external view returns (address [] memory, uint);
    // stand-alone method for get all valid stakers for their own weignht (stake balance weight and stake time weight)
    // function getValidStakersWithWeight() external view returns (address [] memory, uint256 [] memory, uint256 [] memory, uint);
    // return weight for account (balanceWeight and timeDurationWeight)
    // function getWeight(address account) external view returns (uint256, uint256);
}