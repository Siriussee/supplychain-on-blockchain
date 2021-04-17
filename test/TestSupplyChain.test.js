// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "Zhang San"
    const originFarmInformation = "Foxconn, ShenZhen, China"
    const originFarmLatitude = "113.929770"
    const originFarmLongitude = "22.521490"
    var productID = sku + upc
    const productNotes = "iPhone 12 Pro Max Ultra Plus (8 cam)"
    const one = 1
    const productPrice = web3.utils.toWei(one.toString(), "ether") // .toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x0000000000000000000000000000000000000000'

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])
	
    describe('Test onwership function', async()=>{
        it("Testing smart contract function owner()/isOwner()/renounceOwnership()/transferOwnership() that modify contract's owner", async() => {
            const supplyChain = await SupplyChain.deployed();
            let owner = await supplyChain.owner.call();
            //let isOwner = await supplyChain.isOwner.call();
            
            //  Verify the result set
            //assert.equal(isOwner, true, 'Error: failed to identify owner (owner()).');
            assert.equal(owner, ownerID, 'Error: failed to identify owner (isOwner()).');
                    
            // account[0]: account[0] => account[5], valid
            let transferOwner = await supplyChain.transferOwnership(accounts[5]);
            let ownerNew1 = await supplyChain.owner.call();
            truffleAssert.eventEmitted(transferOwner, 'OwnershipTransferred');
            assert.equal(ownerNew1, accounts[5], 'Error: failed to identify owner (transferOwnership => isOwner()).');
            
            // account[0]: account[5] => account[0], invalid
            await truffleAssert.fails(
                supplyChain.transferOwnership(ownerID, {from: ownerID}),
                truffleAssert.ErrorType.REVERT
            );
            
            // account[5]: account[5] => 0x0, valid
            let renounceOwner = await supplyChain.renounceOwnership({from: accounts[5]});
            truffleAssert.eventEmitted(transferOwner, 'OwnershipTransferred');
            let ownerNew2 = await supplyChain.owner.call();
            truffleAssert.eventEmitted(transferOwner, 'OwnershipTransferred');
            assert.equal(ownerNew2, emptyAddress, 'Error: failed to identify owner (renounceOwnership => isOwner()).');
        })
    });

    describe('Test role-based access control function', async()=>{
        it("Testing smart contract function addFarmer()/renounceFarmer() that adds/removes a farmer to/from supply chain", async() => {
            const supplyChain = await SupplyChain.deployed()
            
            // add a farmer to supply chain and check
            let addFarmer = await supplyChain.addFarmer(accounts[5]);
            let isFarmer = await supplyChain.isFarmer(accounts[5]);
            
            //remove a farmer to supply chain and check
            let removeFarmer = await supplyChain.renounceFarmer({from: accounts[5]});
            let isFarmerAfter = await supplyChain.isFarmer(accounts[5]);
            
            //  Verify the result set
            assert.equal(isFarmer, true, 'Error: failed to add farmer.')
            truffleAssert.eventEmitted(addFarmer, 'FarmerAdded');
            assert.equal(isFarmerAfter, false, 'Error: failed to remove farmer.')
            truffleAssert.eventEmitted(removeFarmer, 'FarmerRemoved');
            
        })
        
        it("Testing smart contract function addDistributor()/renounceDistributor() that adds/removes a Distributor to/from supply chain", async() => {
            const supplyChain = await SupplyChain.deployed()
            
            // add a Distributor to supply chain and check
            let addDistributor = await supplyChain.addDistributor(accounts[5]);
            let isDistributor = await supplyChain.isDistributor(accounts[5]);
            
            //remove a Distributor to supply chain and check
            let removeDistributor = await supplyChain.renounceDistributor({from: accounts[5]});
            let isDistributorAfter = await supplyChain.isDistributor(accounts[5]);
            
            //  Verify the result set
            assert.equal(isDistributor, true, 'Error: failed to add Distributor.')
            truffleAssert.eventEmitted(addDistributor, 'AddingDistributor');
            assert.equal(isDistributorAfter, false, 'Error: failed to remove Distributor.')
            truffleAssert.eventEmitted(removeDistributor, 'RemovingDistributor');
            
        })
        
        it("Testing smart contract function addConsumer()/renounceConsumer() that adds/removes a Consumer to/from supply chain", async() => {
            const supplyChain = await SupplyChain.deployed()
            
            // add a Consumer to supply chain and check
            let addConsumer = await supplyChain.addConsumer(accounts[5]);
            let isConsumer = await supplyChain.isConsumer(accounts[5]);
            
            //remove a Consumer to supply chain and check
            let removeConsumer = await supplyChain.renounceConsumer({from: accounts[5]});
            let isConsumerAfter = await supplyChain.isConsumer(accounts[5]);
            
            //  Verify the result set
            assert.equal(isConsumer, true, 'Error: failed to add Consumer.')
            truffleAssert.eventEmitted(addConsumer, 'AddingConsumer');
            assert.equal(isConsumerAfter, false, 'Error: failed to remove Consumer.')
            truffleAssert.eventEmitted(removeConsumer, 'RemovingConsumer');
            
        })
        
        
        it("Testing smart contract function addRetailer()/renounceRetailer() that adds/removes a Retailer to/from supply chain", async() => {
            const supplyChain = await SupplyChain.deployed()
            
            // add a Retailer to supply chain and check
            let addRetailer = await supplyChain.addRetailer(accounts[5]);
            let isRetailer = await supplyChain.isRetailer(accounts[5]);
            
            //remove a Retailer to supply chain and check
            let removeRetailer = await supplyChain.renounceRetailer({from: accounts[5]});
            let isRetailerAfter = await supplyChain.isRetailer(accounts[5]);
            
            //  Verify the result set
            assert.equal(isRetailer, true, 'Error: failed to add Retailer.')
            truffleAssert.eventEmitted(addRetailer, 'AddingRetailer');
            assert.equal(isRetailerAfter, false, 'Error: failed to remove Retailer.')
            truffleAssert.eventEmitted(removeRetailer, 'RemovingRetailer');
            
        })
    });

    describe('Test business process function of supply chain', async()=>{
        it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Mark an item as Harvested by calling function harvestItem()
            let tx = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
            assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
            assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
            assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
            assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
            assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
            assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
            assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
            assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')      
            truffleAssert.eventEmitted(tx, 'Harvested');
            
            // account[5] (not farmer): supplyChain.harvestItem(), invalid
            await truffleAssert.fails(
                supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, {from: accounts[5]}),
                truffleAssert.ErrorType.REVERT
            );
        })    

        it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Mark an item as Processed by calling function processtItem()
            let tx = await supplyChain.processItem(upc)

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
            truffleAssert.eventEmitted(tx, 'Processed');
            
            // account[5]: supplyChain.packItem(), invalid
            await truffleAssert.fails(
                supplyChain.packItem(upc, {from: accounts[5]}),
                truffleAssert.ErrorType.REVERT
            );

            // processItem(UNPORCESSED_ITEM)
            let new_upc = 2;
            await truffleAssert.fails(
                supplyChain.processItem(new_upc),
                truffleAssert.ErrorType.REVERT
            );
        
        })    

        it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Mark an item as Packed by calling function packItem()
            let tx = await supplyChain.packItem(upc)

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
            truffleAssert.eventEmitted(tx, 'Packed');
            
            
            // account[5]: supplyChain.packItem(), invalid
            await truffleAssert.fails(
                supplyChain.packItem(upc, {from: accounts[5]}),
                truffleAssert.ErrorType.REVERT
            );
                
            // packItem(UNPORCESSED_ITEM)
            let new_upc = 2;
            await truffleAssert.fails(
                supplyChain.packItem(new_upc),
                truffleAssert.ErrorType.REVERT
            );
        })    

        it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Mark an item as ForSale by calling function sellItem()
            const _price = parseInt("1000000000000") //1/10000 Ether or 1e12 Wei
            let tx = await supplyChain.sellItem(upc, _price)

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
            truffleAssert.eventEmitted(tx, 'ForSale');  
        })    

        it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            let randomvar = await supplyChain.addDistributor(accounts[2]);
            
            // Insufficient fund, invalid
            await truffleAssert.fails(
                supplyChain.buyItem(upc, {from: distributorID, value: 100000000000}), //0.1x the price,
                truffleAssert.ErrorType.REVERT
            );

            // Mark an item as Sold by calling function buyItem()
            let tx = await supplyChain.buyItem(upc, {from: distributorID, value: 3000000000000}) //3x the price


            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            truffleAssert.eventEmitted(tx, 'Sold');
            assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
            assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')

        })    

        it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
            const supplyChain = await SupplyChain.deployed()

            let randomvar = await supplyChain.addFarmer(accounts[1]);

            // Mark an item as Sold by calling function shipItem()
            let tx = await supplyChain.shipItem(upc, {from: originFarmerID}) 


            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            truffleAssert.eventEmitted(tx, 'Shipped');
            assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
            assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')      
        })    

        it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
            const supplyChain = await SupplyChain.deployed()

            let randomvar = await supplyChain.addRetailer(accounts[3]);

            // Mark an item as Sold by calling function buyItem()
            let tx = await supplyChain.receiveItem(upc, {from: retailerID}) 

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            truffleAssert.eventEmitted(tx, 'Received');
            assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
            assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')      
        })    

        it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
            const supplyChain = await SupplyChain.deployed()
            
            let randomvar = await supplyChain.addConsumer(accounts[4]);

            // Mark an item as Sold by calling function buyItem()
            let tx = await supplyChain.purchaseItem(upc, {from: consumerID}) 


            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            // Verify the result set
            truffleAssert.eventEmitted(tx, 'Purchased');
            assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
            assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')  
        })    
    });

    describe('Test audit fuction', async()=>{
        it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
            
            // Verify the result set:
            assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
            assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
            assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
            assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
            assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
            assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
            assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
            assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        })

        it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
            const supplyChain = await SupplyChain.deployed()

            // Retrieve the just now saved item from blockchain by calling function fetchItem()
            const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

            const _price = parseInt("1000000000000") //1/10000 Ether or 1e12 Wei

            // Verify the result set:
            assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
            assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
            //assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
            //assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
            assert.equal(resultBufferTwo[4], _price, 'Error: Missing or Invalid productPrice')
            assert.equal(resultBufferTwo[5], 7, 'Error: Missing or State of the product')
            assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
            assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
            assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')

        })
    });

});
