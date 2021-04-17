// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
 
 
contract SupplyChainToken is ERC20, ERC20Burnable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 amount
    )
    ERC20Burnable()
    ERC20(name, symbol)
    {
        _mint(msg.sender, amount * (10 ** decimals()));
    }

    function burn(uint256 amount) public virtual override {
        _burn(_msgSender(), amount);
    }
}