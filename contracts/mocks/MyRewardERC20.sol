pragma solidity ^0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import "hardhat/console.sol";

contract MyRewardERC20 is ERC20 {
    
    string public  name;
    string public  symbol;
    
    constructor()  public  {
        name = "My Reward Token";
        symbol = "MRT";

        _mint(msg.sender, 10 ether);
    }

    // function transfer(address recipient, uint256 amount) public  returns (bool)  {
    //     console.log("MyRewardERC20:: msg.sender address %s balance %s", msg.sender, balanceOf(msg.sender));
    //     _transfer(msg.sender, recipient, amount);
    //     return true;
    // }
}