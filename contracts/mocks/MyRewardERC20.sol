pragma solidity =0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRewardERC20 is ERC20 {
    
    string public  name;
    string public  symbol;
    
    constructor()  public  {
        name = "My Reward Token";
        symbol = "MRT";
    }
}