// migrating the appropriate contracts
const FarmerRole = artifacts.require("./FarmerRole.sol");
const DistributorRole = artifacts.require("./DistributorRole.sol");
const RetailerRole = artifacts.require("./RetailerRole.sol");
const ConsumerRole = artifacts.require("./ConsumerRole.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");
const SupplyChainToken = artifacts.require("./SupplyChainToken.sol");
const InvoiceToken = artifacts.require("./InvoiceToken.sol");

module.exports = async(deployer, network, accounts) => {
  await deployer.deploy(FarmerRole);
  await deployer.deploy(DistributorRole);
  await deployer.deploy(RetailerRole);
  await deployer.deploy(ConsumerRole);
  const sct = await deployer.deploy(SupplyChainToken, 'SupplyChainToken', 'SCT', '1000000');
  //const sct = SupplyChainToken.deployed();
  const it = await deployer.deploy(InvoiceToken, 'InvoiceToken', 'INV');
  const sc = await deployer.deploy(SupplyChain, sct.address, '1', it.address);
  //const sc = SupplyChainToken.deployed();
  await sct.transfer(sc.address, '100000')
  //let randownvar = await deploySupplyChainToken.transfer(deploySupplyChain.address, '100000', {from: deployer});
};
