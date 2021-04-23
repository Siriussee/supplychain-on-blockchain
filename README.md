# Supply Chain on Blockchain

Course project for EECE571G Blockchain Software Engigneering

This project is a coffee supply chain with ERC20 and ERC721 token support. In our supply chain, roles in coffee bean manufacturer and distribution are integrated into one smart contract, the SupplyChain contract. Further, we ensemble a standard ERC20 token support to our supply chain, in which all participants can settle accounts using SupplyChainToken (SCT), and exchange between SCT and ETH without any barrier. The final addition is ERC721 for invoicing. Please go to the following GitHub repository to download our project and run a demo on your own machine.
GitHub Repo: https://github.com/Siriussee/supplychain-on-blockchain

## How to Use

### Backend

This script describes how to deploy and test the backend smart contract. 

```
//clone the project
git clone https://github.com/Siriussee/supplychain-on-blockchain
cd supplychain-on-blockchain

//use nvm version 12.13.0
nvm use 12.13.0

//install dependencies
npm install

//make sure that you have truffle version ^5.3.2 (so we have sloc version ^0.8.0)
truffle version

//open annother terminal Ethereum test net
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"

//go back to previous terminal, compile, migrate and test the contract
truffle compile
truffle migrate
truffle test
```

### Frontend 

TBD

### File Structure

```
.
├── bs-config.json
├── build               //not included in this repo, will automatically generate after `truffle compile`
├── node_modules        //not included in this repo, will automatically  generate after `npm install`
├── contracts           //source codes of smart contracts (*.sol)
├── migrations          //deployment scripts of smart contracts (*.js)
├── test                //unit test files of smart contracts (*.test.js)
├── package.json        //dependency
├── package-lock.json   //dependency
├── README.md           //<== u are here!
├── src                 //frontend things
├── index.html
├── style.css
├── LICENSE
└── truffle-config.js   //truffle config file, includes testnet address/key and solc compiler version.
```

## Appendix

### Truffle Test Output

```
sirius@UbuntuVM:~/Desktop/supplychain-on-blockchain$ truffle test
Using network 'development'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.

ganache-cli accounts used here...
Contract Owner: accounts[0]  0x27D8D15CbC94527cAdf5eC14B69519aE23288B95
Farmer: accounts[1]  0x018C2daBef4904ECbd7118350A0c54DbeaE3549A
Distributor: accounts[2]  0xCe5144391B4aB80668965F2Cc4f2CC102380Ef0A
Retailer: accounts[3]  0x460c31107DD048e34971E57DA2F99f659Add4f02
Consumer: accounts[4]  0xD37b7B8C62BE2fdDe8dAa9816483AeBDBd356088

Contract: SupplyChainToken
SupplyChainToken Deployment
    ✓ The deployment should be done successfully
    ✓ The deployed smart contract has the correct name
    ✓ The deployed smart contract has the correct symbol
    ✓ The deployed smart contract has the correct total supply
Test increaseAllowance()
    ✓ The sender should have the amount of token unchanged (91ms)
    ✓ The allowance[sender][receiver] should have the amount of token increased (89ms)
    ✓ The increaseAllowance() should trigger an event. (53ms)
Test decreaseAllowance()
    ✓ The sender should have the amount of token unchanged (79ms)
    ✓ The allowance[sender][receiver] should have the amount of token decreased (89ms)
    ✓ The decreaseAllowance() should trigger an event. (46ms)
Test transfer()
    ✓ The sender should have the amount of token left after calling transfer() (78ms)
    ✓ The receiver should have the amount of token received after calling transfer() (80ms)
    ✓ The transfer should trigger an event. (38ms)
Test transferFrom()
    ✓ The sender should have the amount of token decreased after calling transferFrom() (72ms)
    ✓ allowance[sender][receiver] should have the amount of token decreased (102ms)
    ✓ The receiver should have the amount of token received after calling transferFrom() (70ms)
    ✓ The transferFrom should trigger two events. (66ms)
Test burn()
    ✓ The deployed smart contract has the correct total supply after burn() (83ms)
    ✓ The account has the correct balance (93ms)
    ✓ The burn() should trigger an event. (41ms)
Test burnFrom()
    ✓ The deployed smart contract has the correct total supply after burn() (102ms)
    ✓ The account has the correct balance (108ms)
    ✓ The account has the correct allowance (71ms)
    ✓ The burnFrom() should trigger 2 events. (62ms)

Contract: SupplyChain
Test onwership function
  ✓ Testing smart contract function owner()/isOwner()/renounceOwnership()/transferOwnership() that modify contract's owner (600ms)
Test role-based access control function
  ✓ Testing smart contract function addFarmer()/renounceFarmer() that adds/removes a farmer to/from supply chain (125ms)
  ✓ Testing smart contract function addDistributor()/renounceDistributor() that adds/removes a Distributor to/from supply chain (125ms)
  ✓ Testing smart contract function addConsumer()/renounceConsumer() that adds/removes a Consumer to/from supply chain (115ms)
  ✓ Testing smart contract function addRetailer()/renounceRetailer() that adds/removes a Retailer to/from supply chain (125ms)
Test business process function of supply chain
  ✓ Testing BalanceOf() that query balance (41ms)
  ✓ Testing buyToken() that top-up balance (119ms)
Test business process function of supply chain
  ✓ Testing smart contract function harvestItem() that allows a farmer to harvest coffee (212ms)
  ✓ Testing smart contract function processItem() that allows a farmer to process coffee (159ms)
  ✓ Testing smart contract function packItem() that allows a farmer to pack coffee (144ms)
  ✓ Testing smart contract function sellItem() that allows a farmer to sell coffee (87ms)
  ✓ Testing smart contract function buyItem() that allows a distributor to buy coffee (211ms)
  ✓ Testing smart contract function shipItem() that allows a distributor to ship coffee (125ms)
  ✓ Testing smart contract function receiveItem() that allows a retailer to mark coffee received (249ms)
  ✓ Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (204ms)
Test audit fuction
  ✓ Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (61ms)
  ✓ Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain (49ms)


41 passing (5s)
```
