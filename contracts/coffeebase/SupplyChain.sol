// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "../coffeeaccesscontrol/FarmerRole.sol";
import "../coffeeaccesscontrol/ConsumerRole.sol";
import "../coffeeaccesscontrol/RetailerRole.sol";
import "../coffeeaccesscontrol/DistributorRole.sol";
import "../coffeecore/SupplyChainToken.sol";
import "../coffeecore/InvoiceToken.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract SupplyChain is Ownable, ConsumerRole, RetailerRole, DistributorRole, FarmerRole {

  // Define a variable called 'supplyChainToken' for self-defined ERC20 token
  SupplyChainToken supplyChainToken;

  // Define a variable called 'invoiceToken' for self-defined ERC721 token
  InvoiceToken invoiceToken;

  // Define a variable called 'invoiceId' for identifying invoices
  uint invoiceId;
  
  // The value of supplyChainToken, tokenPrice = 1 means that 1 wei = 1 SCT
  uint256 tokenPrice;

  // Define a variable called 'upc' for Universal Product Code (UPC)
  uint  upc;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'items' that maps the UPC to an Item.
  mapping (uint => Item) items;

  // History structure, including current owner and its timestamp (block number)
  struct History{
    address owner;
    uint timestamp;
  }

  // Define a public mapping 'itemsHistory' that maps the UPC to an array of History,
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => History[8]) itemsHistory;

  // Define enum 'State' with the following values:
  enum State
  {
    Harvested,  // 0
    Processed,  // 1
    Packed,     // 2
    ForSale,    // 3
    Sold,       // 4
    Shipped,    // 5
    Received,   // 6
    Purchased   // 7
    }

  State constant defaultState = State.Harvested;

  // Define a struct 'Item' with the following fields:
  struct Item {
    uint    sku;  // Stock Keeping Unit (SKU)
    uint    upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
    address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address payable originFarmerID; // Metamask-Ethereum address of the Farmer
    string  originFarmName; // Farmer Name
    string  originFarmInformation;  // Farmer Information
    string  originFarmLatitude; // Farm Latitude
    string  originFarmLongitude;  // Farm Longitude
    uint    productID;  // Product ID potentially a combination of upc + sku
    string  productNotes; // Product Notes
    uint    productPrice; // Product Price
    State   itemState;  // Product State as represented in the enum above
    address payable distributorID;  // Metamask-Ethereum address of the Distributor
    address retailerID; // Metamask-Ethereum address of the Retailer
    address payable consumerID; // Metamask-Ethereum address of the Consumer
  }

  // Define 8 events with the same 8 state values and accept 'upc' as input argument
  event Harvested(uint upc);
  event Processed(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event Purchased(uint upc);

  //Define event for token purchased and sold
  event TokenPurchase(address indexed buyer, uint256 value);
  event TokenSell(address indexed buyer, uint256 value);

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address _address) {
    require(msg.sender == _address, "This is not the required or expected address.");
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) {
    require(msg.value >= _price, "insufficient funds to cover the price of the item.");
    _;
  }

  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    supplyChainToken.transfer(items[_upc].consumerID, amountToReturn);
  }

  modifier hasEnoughToken(uint _amount) {
    require(supplyChainToken.balanceOf(msg.sender) >= _amount, "insufficient funds");
    _;
  }

  modifier hasEnoughAllowance(address spender, uint _amount) {
    require(supplyChainToken.allowance(address(this), msg.sender) >= _amount, "insufficient allowance");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Harvested
  modifier harvested(uint _upc) {
    require(items[_upc].itemState == State.Harvested && items[_upc].sku != 0, "This is item is not currently in the state 'Harvested'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Processed
  modifier processed(uint _upc) {
    require(items[_upc].itemState == State.Processed, "This is item is not currently in the state 'Processed'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Packed
  modifier packed(uint _upc) {
    require(items[_upc].itemState == State.Packed, "This is item is not currently in the state 'Packed'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is ForSale
  modifier forSale(uint _upc) {
    require(items[_upc].itemState == State.ForSale, "This is item is not currently in the state 'For Sale'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Sold
  modifier sold(uint _upc) {
    require(items[_upc].itemState == State.Sold, "This is item is not currently in the state 'Sold'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Shipped
  modifier shipped(uint _upc) {
    require(items[_upc].itemState == State.Shipped, "This is item is not currently in the state 'Shipped'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Received
  modifier received(uint _upc) {
    require(items[_upc].itemState == State.Received, "This is item is not currently in the state 'Received'");
    _;
  }

  // Define a modifier that checks if an item.state of a upc is Purchased
  modifier purchased(uint _upc) {
    require(items[_upc].itemState == State.Purchased, "This is item is not currently in the state 'Purchased'");
    _;
  }

  /**
   * @dev In the constructor set 'owner' to the address that instantiated the contract
   * and set 'sku' and 'upc' to 1
   * @param _supplyChainTokenContract: the address of underlying supplyChainTokenContract
   * @param _tokenPrice: the price of supplyChainToken
   */
  constructor(SupplyChainToken _supplyChainTokenContract, 
              uint256 _tokenPrice,
              InvoiceToken _invoiceToken) payable {
    transferOwnership(msg.sender);
    supplyChainToken = _supplyChainTokenContract;
    tokenPrice = _tokenPrice;
    invoiceToken = _invoiceToken;
    invoiceId=1;
    sku = 1;
    upc = 1;
  }
  
  /**
   * @dev Users can buy tokens from this smart contract (the supplyChain contract)
   * @param _numberOfTokens: the amount that top-up to msg.sender
   * Emits an {TokenPurchase} event.
   */
  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value >= _numberOfTokens * tokenPrice, 'Insufficient funds');
    require(supplyChainToken.balanceOf(address(this)) >= _numberOfTokens, 'Out of liquility');

    // increase tokens
    supplyChainToken.increaseAllowance(msg.sender, _numberOfTokens);

    emit TokenPurchase(msg.sender, _numberOfTokens);
  }

  /**
   * @dev Users can sell tokens to this smart contract (the supplyChain contract)
   * @param _numberOfTokens: the amount that decrease to msg.sender
   * Emits an {TokenSell} event.
   */
  function sellTokens(uint256 _numberOfTokens) public 
    hasEnoughToken(_numberOfTokens)
  {
    require(address(this).balance >= _numberOfTokens * tokenPrice, 'Out of liquility');

    //decrease tokens
    supplyChainToken.decreaseAllowance(msg.sender, _numberOfTokens);

    //refund ether
    payable(msg.sender).transfer(_numberOfTokens * tokenPrice);

    emit TokenSell(msg.sender, _numberOfTokens);
  }

  /**
   * @dev Allows a farmer to mark an item 'Harvested', will self-increase sku
   * also marks farmer address and block number into itemHistory. Only a farmer can call it.
   * @param _upc: uint
   * @param _originFarmerID: address
   * @param _originFarmName: string
   * @param _originFarmInformation: string
   * @param _originFarmLatitude: string
   * @param _originFarmLongitude: string
   * @param _productNotes: string
   * Emits an {Harvested} event.
   */
  function harvestItem(uint _upc, address payable _originFarmerID, string memory _originFarmName, 
  string memory _originFarmInformation, string memory _originFarmLatitude, 
  string memory _originFarmLongitude, string memory _productNotes) public
    onlyFarmer()
  {
    // Add the new item as part of Harvest
    items[_upc].sku = sku;
    items[_upc].upc = _upc;
    items[_upc].ownerID = _originFarmerID;
    items[_upc].originFarmerID = _originFarmerID;
    items[_upc].originFarmName = _originFarmName;
    items[_upc].originFarmInformation = _originFarmInformation;
    items[_upc].originFarmLatitude = _originFarmLatitude;
    items[_upc].originFarmLongitude = _originFarmLongitude;
    items[_upc].productNotes = _productNotes;
    items[_upc].itemState = State.Harvested;
    
    //itemsHistory?
    //History history = History(msg.sender, block.number);
    itemsHistory[_upc][0] = History(msg.sender, block.number);

    // Increment sku
    sku = sku + 1;
    
    // Emit the appropriate event
    emit Harvested(_upc);
  }

  /**
   * @dev Allows a farmer to mark an item 'Processed'
   * also marks farmer address and block number into itemHistory. Only a farmer can call it.
   * @param _upc: uint
   * Emits an {Processed} event.
   */
  function processItem(uint _upc) public
    harvested(_upc)
    verifyCaller(msg.sender)
    onlyFarmer()
  {
    // Update the appropriate fields
    items[_upc].itemState = State.Processed;

    // Emit the appropriate event
    emit Processed(_upc);

    //itemsHistory?
    itemsHistory[_upc][1] = History(msg.sender, block.number);
  }

  /**
   * @dev Allows a farmer to mark an item 'Packed'
   * also marks farmer address and block number into itemHistory. Only a farmer can call it.
   * @param _upc: uint
   * Emits an {Packed} event.
   */
  function packItem(uint _upc) public
    processed(_upc)
    verifyCaller(msg.sender)
    onlyFarmer()
  {
    // Update the appropriate fields
    items[_upc].itemState = State.Packed;

    // Emit the appropriate event
    emit Packed(_upc);

    //itemsHistory?
    itemsHistory[_upc][2] = History(msg.sender, block.number);
  }

  /**
   * @dev Allows a farmer to mark an item 'ForSale'
   * also marks farmer address and block number into itemHistory. Only a farmer can call it.
   * @param _upc: uint
   * Emits an {ForSale} event.
   */
  function sellItem(uint _upc, uint _price) public
    packed(_upc)
    verifyCaller(msg.sender)
    onlyFarmer()
  {
    // Update the appropriate fields
    items[_upc].itemState = State.ForSale;
    items[_upc].productPrice = _price;
    
    // Emit the appropriate event
    emit ForSale(_upc);

    //itemsHistory
    itemsHistory[_upc][3] = History(msg.sender, block.number);
  }

  function transferAllowance(address from, address to, uint amount) internal {
    supplyChainToken.decreaseAllowance(from, amount);
    supplyChainToken.increaseAllowance(to, amount);
  }
  
  /**
   * @dev Allows the disributor to mark an item 'Sold'
   * Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough,
   * and any excess ether sent is refunded back to the buyer
   * also marks farmer address and block number into itemHistory. Only a Distributor can call it.
   * @param _upc: uint
   * Emits an {Sold} event.
   * NFT invoice minted for the buyer
   */
  function buyItem(uint _upc, uint _invoiceId) public payable
      forSale(_upc)
      hasEnoughAllowance(msg.sender, items[_upc].productPrice)
      onlyDistributor()
    {
    // mint the invoice for the buyer which emits Transfer event
    invoiceToken.mint(msg.sender, _invoiceId);

    // Update the appropriate fields - ownerID, distributorID, itemState
    items[_upc].itemState = State.Sold;
    items[_upc].ownerID = payable(msg.sender);
    items[_upc].distributorID = payable(msg.sender);

    // Transfer money to farmer
    transferAllowance(msg.sender, items[_upc].originFarmerID, items[_upc].productPrice);

    // emit the appropriate event
    emit Sold(_upc);

    //itemsHistory
    itemsHistory[_upc][4] = History(msg.sender, block.number);
  }
  
  /**
   * @dev Allows the disributor to mark an item 'Shipped'
   * also marks farmer address and block number into itemHistory. Only a Farmer can call it.
   * @param _upc: uint
   * Emits an {Sold} event.
   */
  function shipItem(uint _upc) public
      sold(_upc)
      verifyCaller(msg.sender)
      onlyFarmer()
    {
    // Update the appropriate fields
    items[_upc].itemState = State.Shipped;

    // emit the appropriate event
    emit Shipped(_upc);

    //itemsHistory
    itemsHistory[_upc][5] = History(msg.sender, block.number);
  }


  /**
   * @dev Allows the disributor to mark an item 'Received'
   * also marks farmer address and block number into itemHistory. Only a Retailer can call it.
   * @param _upc: uint
   * Emits an {Received} event.
   */
  function receiveItem(uint _upc) public
    shipped(_upc)
    hasEnoughAllowance(msg.sender, items[_upc].productPrice)
    verifyCaller(msg.sender)
    onlyRetailer()
    // Access Control List enforced by calling Smart Contract / DApp
    //**** ^ not implemented so far
    {
    // Update the appropriate fields - ownerID, retailerID, itemState
    items[_upc].itemState = State.Received;
    items[_upc].ownerID = msg.sender;
    items[_upc].retailerID = msg.sender;

    // Pay to distributor
    transferAllowance(msg.sender, items[_upc].distributorID, items[_upc].productPrice);

    // Emit the appropriate event
    emit Received(_upc);

    itemsHistory[_upc][6] = History(msg.sender, block.number);
  }

  /**
   * @dev Allows the disributor to mark an item 'Purchased'
   * also marks farmer address and block number into itemHistory. Only a Retailer can call it.
   * @param _upc: uint
   * Emits an {Purchased} event.
   */
  function purchaseItem(uint _upc) public
    received(_upc)
    verifyCaller(msg.sender)
    hasEnoughAllowance(msg.sender, items[_upc].productPrice)
    onlyConsumer()
    //no check to see if they paid?
    // Access Control List enforced by calling Smart Contract / DApp
    //**** ^ not implemented so far
    {
    // Update the appropriate fields - ownerID, consumerID, itemState
    items[_upc].itemState = State.Purchased;
    items[_upc].ownerID = msg.sender;
    items[_upc].consumerID = payable(msg.sender);

    // Pay to retailerID
    transferAllowance(msg.sender, items[_upc].retailerID, items[_upc].productPrice);

    // Emit the appropriate event
    emit Purchased(_upc);

    itemsHistory[_upc][7] = History(msg.sender, block.number);
  }

  function fetchItemHistory(uint _upc, uint index) public view 
  returns(address owner, uint blockNumber)
  {
    require(index < 8, 'index out of bound');
    owner = itemsHistory[_upc][index].owner;
    blockNumber = itemsHistory[_upc][index].timestamp;
  }

  /**
   * @dev Fetch item info of its producer. 
   * @param _upc: uint
   * Returns (uint itemSKU, uint itemUPC, address ownerID, address farmerID,
   * string originFarmName, string originFarmInformation, string originFarmLatitude, 
   * string originFarmLongitude)
   */
  function fetchItemBufferOne(uint _upc) public view returns
  (
    uint    itemSKU,
    uint    itemUPC,
    address ownerID,
    address originFarmerID,
    string  memory originFarmName,
    string  memory originFarmInformation,
    string  memory originFarmLatitude,
    string  memory originFarmLongitude
  )
  {
    // Assign values to the 8 parameters
    itemSKU = items[_upc].sku;
    itemUPC = items[_upc].upc; //or just _upc;
    ownerID = items[_upc].ownerID;
    originFarmerID = items[_upc].originFarmerID;
    originFarmName = items[_upc].originFarmName;
    originFarmInformation = items[_upc].originFarmInformation;
    originFarmLatitude = items[_upc].originFarmLatitude;
    originFarmLongitude = items[_upc].originFarmLongitude;
  }

  /**
   * @dev Fetch item info of its producer. 
   * @param _upc: uint
   * Returns (uint itemSKU, uint itemUPC, uint productID, string productNotes,
   * uint productPrice, State itemState, address distributorID, 
   * address retailerID, address consumerID)
   */
  function fetchItemBufferTwo(uint _upc) public view returns
  (
    uint    itemSKU,
    uint    itemUPC,
    uint    productID,
    string  memory productNotes,
    uint    productPrice,
    State    itemState,
    address distributorID,
    address retailerID,
    address consumerID
  )
  {
    // Assign values to the 9 parameters
    itemSKU = items[_upc].sku;
    itemUPC = items[_upc].upc; //or just _upc;
    productID = items[_upc].productID;
    productNotes = items[_upc].productNotes;
    productPrice = items[_upc].productPrice;
    itemState = items[_upc].itemState;
    distributorID = items[_upc].distributorID;
    retailerID = items[_upc].retailerID;
    consumerID = items[_upc].consumerID;
  }
}
