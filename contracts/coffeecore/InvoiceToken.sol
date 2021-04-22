// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract InvoiceToken is ERC721, Ownable{
  
  constructor(
        string memory name,
        string memory symbol
    ) 
    ERC721(name, symbol){}

function mint(address to, uint256 tokenId) public onlyOwner {
   _mint(to, tokenId);
  }
// function _mint(address to) public onlyOwner{
//    mint(to, totalSupply().add(1));
//   }
}