pragma solidity ^0.5.16;

import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import '@openzeppelin/contracts/ownership/Ownable.sol';

import "../interfaces/IStakingRewards.sol";

// https://ethereum.stackexchange.com/questions/78923/how-can-i-send-tokens-to-large-number-of-addresses
// https://ethereum.stackexchange.com/questions/44434/whats-the-best-way-to-distribute-tokens 
contract DistributeProfitsAirDrop is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    constructor() Ownable() public {

    }

    // function transferBatchForThePool(address _stakingPool, IERC20 _profitToken, uint256 amount, uint256 duration) public onlyOwner {
    //     require(_stakingPool != address(0), "stakingPool must none zero address");
    //     require(amount > 0, "Profit amount for every valid staking person must greater than zero");

    //     IStakingRewards pool = (IStakingRewards)(_stakingPool);
    //     (address [] memory accounts, uint count) = pool.getAccountsByStakingDuration(duration);
    //     uint256 totalPaid = amount.mul(count);
    //     if(count > 0) {
    //         require(_profitToken.balanceOf(address(this)) > totalPaid, 
    //             "The contract balance not enough.");
    //         for(uint i = 0; i < count; i++) {
    //             _profitToken.safeTransfer(accounts[i], amount);
    //         }

    //         emit ProfitsPaid(totalPaid);
    //     }
    // }

    event ProfitsPaid(uint256 paidProfits);
}