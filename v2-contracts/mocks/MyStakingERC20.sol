pragma solidity =0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyStakingERC20 is ERC20 {
    
    string public  name;
    string public  symbol;
    
    constructor()  public  {
        name = "My Staking Token";
        symbol = "MST";
    }
}