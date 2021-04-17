# Supply Chain on Blockchain

Course project for EECE571G Blockchain Software Engigneering

## How to Use

### Backend

#### Deploy

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

#### Test Output

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
    MyERC20Token Deployment
      ✓ The deployment should be done successfully
      ✓ The deployed smart contract has the correct name (44ms)
      ✓ The deployed smart contract has the correct symbol (40ms)
      ✓ The deployed smart contract has the correct total supply
    Test increaseAllowance()
      ✓ The sender should have the amount of token unchanged (96ms)
      ✓ The allowance[sender][receiver] should have the amount of token increased (123ms)
      ✓ The increaseAllowance() should trigger an event. (70ms)
    Test decreaseAllowance()
      ✓ The sender should have the amount of token unchanged (70ms)
      ✓ The allowance[sender][receiver] should have the amount of token decreased (86ms)
      ✓ The decreaseAllowance() should trigger an event. (52ms)
    Test transfer()
      ✓ The sender should have the amount of token left after calling transfer() (68ms)
      ✓ The receiver should have the amount of token received after calling transfer() (84ms)
      ✓ The transfer should trigger an event. (44ms)
    Test transferFrom()
      ✓ The sender should have the amount of token decreased after calling transferFrom() (73ms)
      ✓ allowance[sender][receiver] should have the amount of token decreased (111ms)
      ✓ The receiver should have the amount of token received after calling transferFrom() (119ms)
      ✓ The transferFrom should trigger two events. (60ms)
    Test burn()
      ✓ The deployed smart contract has the correct total supply after burn() (93ms)
      ✓ The account has the correct balance (68ms)
      ✓ The burn() should trigger an event. (44ms)
      Test burnFrom()
        ✓ The deployed smart contract has the correct total supply after burn() (80ms)
        ✓ The account has the correct balance (88ms)
        ✓ The account has the correct allowance (105ms)
        ✓ The burnFrom() should trigger 2 events. (47ms)

  Contract: SupplyChain
    ✓ 0. Testing smart contract function owner()/isOwner()/renounceOwnership()/transferOwnership() that modify contract's owner (528ms)
    ✓ 1. Testing smart contract function addFarmer()/renounceFarmer() that adds/removes a farmer to/from supply chain (156ms)
    ✓ 2. Testing smart contract function addDistributor()/renounceDistributor() that adds/removes a Distributor to/from supply chain (132ms)
    ✓ 3. Testing smart contract function addConsumer()/renounceConsumer() that adds/removes a Consumer to/from supply chain (111ms)
    ✓ 4. Testing smart contract function addRetailer()/renounceRetailer() that adds/removes a Retailer to/from supply chain (122ms)
    ✓ 5. Testing smart contract function harvestItem() that allows a farmer to harvest coffee (160ms)
    ✓ 6. Testing smart contract function processItem() that allows a farmer to process coffee (137ms)
    ✓ 7. Testing smart contract function packItem() that allows a farmer to pack coffee (175ms)
    ✓ 8. Testing smart contract function sellItem() that allows a farmer to sell coffee (99ms)
    ✓ 9. Testing smart contract function buyItem() that allows a distributor to buy coffee (185ms)
    ✓ 10. Testing smart contract function shipItem() that allows a distributor to ship coffee (129ms)
    ✓ 11. Testing smart contract function receiveItem() that allows a retailer to mark coffee received (136ms)
    ✓ 12. Testing smart contract function purchaseItem() that allows a consumer to purchase coffee (139ms)
    ✓ 13. Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain (51ms)
    ✓ 14. Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain (52ms)


  39 passing (5s)
```