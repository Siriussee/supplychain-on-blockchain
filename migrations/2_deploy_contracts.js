// migrating the appropriate contracts
const FarmerRole = artifacts.require("./FarmerRole.sol");
const DistributorRole = artifacts.require("./DistributorRole.sol");
const RetailerRole = artifacts.require("./RetailerRole.sol");
const ConsumerRole = artifacts.require("./ConsumerRole.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");
const SupplyChainToken = artifacts.require("./SupplyChainToken.sol");

module.exports = async(deployer, network, accounts) => {
  let deployFarmerRole = await deployer.deploy(FarmerRole);
  let deployDistributorRole = await deployer.deploy(DistributorRole);
  let deployRetailerRole = await deployer.deploy(RetailerRole);
  let deployConsumerRole = await deployer.deploy(ConsumerRole);
  let deploySupplyChainToken = await deployer.deploy(SupplyChainToken, 'SupplyChainToken', 'SCT', '1000000');
  let deploySupplyChain = await deployer.deploy(SupplyChain, deploySupplyChainToken.address, '1');

};
