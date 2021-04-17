const MyErc20Token = artifacts.require("coffeecore/SupplyChainToken");
const truffleAssert = require('truffle-assertions');
require('chai')
.use(require('chai-as-promised'))
.should();

contract("SupplyChainToken",(accounts)=>{
    let myErc20;
    const tokenName = 'SupplyChainToken';
    const tokenSymbol = 'SCT';
    const tokenTotalSupply = '1000000';

    const deployer = accounts[0];
    const sender = accounts[1];
    const receiver = accounts[2];

    const transferToSender = web3.utils.toWei(new web3.utils.BN(tokenTotalSupply)).div(new web3.utils.BN(100));
    const sendTokenAmountWei = web3.utils.toWei('1');
    let transferReceipt;

    before(async () =>{
        myErc20 = await MyErc20Token.new(tokenName, tokenSymbol, tokenTotalSupply, {from: deployer});
        transferReceipt = await myErc20.transfer(sender, transferToSender, {from: deployer});
    });

    describe('SupplyChainToken Deployment', async()=>{
        it('The deployment should be done successfully',async() =>{
            const address = myErc20.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        });

        it('The deployed smart contract has the correct name', async()=>{
            const name = await myErc20.name();
            assert.equal(name, tokenName)
        });

        it('The deployed smart contract has the correct symbol', async()=>{
            const symbol = await myErc20.symbol();
            assert.equal(symbol, tokenSymbol);
        });

        it('The deployed smart contract has the correct total supply', async()=>{
            let totalSupply = await myErc20.totalSupply();
            assert.equal(totalSupply.toString(), web3.utils.toWei(new web3.utils.BN(tokenTotalSupply)).toString());
        });

    });

    describe('Test increaseAllowance()', async()=>{
        it('The sender should have the amount of token unchanged', async()=>{
            let tokenInSender = await myErc20.balanceOf(sender);
            let allowanceReceipt = await myErc20.increaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let amountLeftInSender = await myErc20.balanceOf(sender);
            assert.equal(tokenInSender.toString(), amountLeftInSender.toString());
        });

        it('The allowance[sender][receiver] should have the amount of token increased', async()=>{
            let allowanceSender2ReceiverBefore = await myErc20.allowance(sender, receiver);
            let allowanceReceipt = await myErc20.increaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            assert.equal(allowanceSender2ReceiverAfter - allowanceSender2ReceiverBefore, sendTokenAmountWei);
        });

        it('The increaseAllowance() should trigger an event.', async() => {
            let allowanceReceipt = await myErc20.increaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            truffleAssert.eventEmitted(allowanceReceipt, 'Approval', (ev) => {
                return ev.owner === sender
                    && ev.spender === receiver
                    && ev.value.toString() === allowanceSender2ReceiverAfter.toString();
            });
        });
    });

    describe('Test decreaseAllowance()', async()=>{
        before(async () => {
            await myErc20.increaseAllowance(receiver, sendTokenAmountWei, {from: sender});
        });

        it('The sender should have the amount of token unchanged', async()=>{
            let tokenInSender = await myErc20.balanceOf(sender);
            await myErc20.decreaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let amountLeftInSender = await myErc20.balanceOf(sender);
            assert.equal(tokenInSender.toString(), amountLeftInSender.toString());
        });

        it('The allowance[sender][receiver] should have the amount of token decreased', async()=>{
            let allowanceSender2ReceiverBefore = await myErc20.allowance(sender, receiver);
            await myErc20.decreaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            assert.equal(allowanceSender2ReceiverBefore - allowanceSender2ReceiverAfter, sendTokenAmountWei);
        });

        it('The decreaseAllowance() should trigger an event.', async() => {
            let allowanceReceipt = await myErc20.decreaseAllowance(receiver, sendTokenAmountWei, {from: sender});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            truffleAssert.eventEmitted(allowanceReceipt, 'Approval', (ev) => {
                return ev.owner === sender
                    && ev.spender === receiver
                    && ev.value.toString() === allowanceSender2ReceiverAfter.toString();
            });
        });
    });

    describe('Test transfer()', async()=>{
        before(async () => {
            await myErc20.transfer(receiver, sendTokenAmountWei, {from: sender});
        });

        it('The sender should have the amount of token left after calling transfer()', async()=>{
            let tokenInSender = await myErc20.balanceOf(sender);
            await myErc20.transfer(receiver, sendTokenAmountWei, {from: sender});
            let amountLeftInSender = await myErc20.balanceOf(sender);
            assert.equal(tokenInSender - sendTokenAmountWei, amountLeftInSender.toString());
        });

        it('The receiver should have the amount of token received after calling transfer()', async()=>{
            let receiverBalanceBefore = await myErc20.balanceOf(receiver);
            await myErc20.transfer(receiver, sendTokenAmountWei, {from: sender});
            let receiverBalanceAfter = await myErc20.balanceOf(receiver);
            assert.equal(sendTokenAmountWei, receiverBalanceAfter - receiverBalanceBefore);
        });

        it('The transfer should trigger an event.', async() => {
            let sendReceipt = await myErc20.transfer(receiver, sendTokenAmountWei, {from: sender});
            truffleAssert.eventEmitted(sendReceipt, 'Transfer', (ev) => {
                return ev.from === sender
                    && ev.to === receiver
                    && ev.value.toString() === sendTokenAmountWei.toString();
            });
        });
    });

    describe('Test transferFrom()', async()=>{
        before(async () => {
            let sendTokenAmountWeiThreeTimes = web3.utils.toWei('3');
            await myErc20.increaseAllowance(receiver, sendTokenAmountWeiThreeTimes, {from: sender});
        });

        //weird bug, commented

        it('The sender should have the amount of token decreased after calling transferFrom()', async()=>{
            let senderBalanceBefore = await myErc20.balanceOf(sender);
            await myErc20.transferFrom(sender, receiver, sendTokenAmountWei, {from: receiver});
            let senderBalanceAfter = await myErc20.balanceOf(sender);
            //let sendTokenAmountWeiBN = web3.utils.BN(sendTokenAmountWei)
            assert.equal(sendTokenAmountWei, senderBalanceBefore.sub(senderBalanceAfter));
        });

        it('allowance[sender][receiver] should have the amount of token decreased', async()=>{
            let receiverBalanceBefore = await myErc20.balanceOf(receiver);
            await myErc20.transferFrom(sender, receiver, sendTokenAmountWei, {from: receiver});
            let receiverBalanceAfter = await myErc20.balanceOf(receiver);
            assert.equal(sendTokenAmountWei, receiverBalanceAfter - receiverBalanceBefore);
        });

        it('The receiver should have the amount of token received after calling transferFrom()', async()=>{
            let allowanceSender2ReceiverBefore = await myErc20.allowance(sender, receiver);
            await myErc20.transferFrom(sender, receiver, sendTokenAmountWei, {from: receiver});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            assert.equal(allowanceSender2ReceiverBefore - allowanceSender2ReceiverAfter, sendTokenAmountWei);
        });

        it('The transferFrom should trigger two events.', async() => {
            let transferFromReceipt = await myErc20.transferFrom(sender, receiver, sendTokenAmountWei, {from: receiver});
            truffleAssert.eventEmitted(transferFromReceipt, 'Transfer', (ev) => {
                return ev.from === sender
                    && ev.to === receiver
                    && ev.value.toString() === sendTokenAmountWei.toString();
            });

            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            truffleAssert.eventEmitted(transferFromReceipt, 'Approval', (ev) => {
                return ev.owner === sender
                    && ev.spender === receiver
                    && ev.value.toString() === allowanceSender2ReceiverAfter.toString();
            });
        });
    });

    describe('Test burn()', async()=>{
        it('The deployed smart contract has the correct total supply after burn()', async()=>{
            let totalSupplyBefore = await myErc20.totalSupply();
            await myErc20.burn(sendTokenAmountWei, {from: sender});
            let totalSupplyAfter = await myErc20.totalSupply();
            assert.equal(sendTokenAmountWei, totalSupplyBefore.sub(totalSupplyAfter));
        });

        it('The account has the correct balance', async()=>{
            let tokenInSenderBefore = await myErc20.balanceOf(sender);
            await myErc20.burn(sendTokenAmountWei, {from: sender});
            let tokenInSenderAfter = await myErc20.balanceOf(sender);
            assert.equal(sendTokenAmountWei, tokenInSenderBefore.sub(tokenInSenderAfter));
        });

        it('The burn() should trigger an event.', async() => {
            let burnReceipt = await myErc20.burn(sendTokenAmountWei, {from: sender});
            truffleAssert.eventEmitted(burnReceipt, 'Transfer', (ev) => {
                return ev.from === sender
                    && ev.to === "0x0000000000000000000000000000000000000000" //zero address
                    && ev.value.toString() === sendTokenAmountWei.toString();
            });
        });
    });


    describe('Test burnFrom()', async()=>{
        before(async () => {
            let sendTokenAmountWeiThreeTimes = web3.utils.toWei('5');
            await myErc20.increaseAllowance(receiver, sendTokenAmountWeiThreeTimes, {from: sender});
        });

        it('The deployed smart contract has the correct total supply after burn()', async()=>{
            let totalSupplyBefore = await myErc20.totalSupply();
            await myErc20.burnFrom(sender, sendTokenAmountWei, {from: receiver});
            let totalSupplyAfter = await myErc20.totalSupply();
            assert.equal(sendTokenAmountWei, totalSupplyBefore.sub(totalSupplyAfter));
        });

        it('The account has the correct balance', async()=>{
            let tokenInSenderBefore = await myErc20.balanceOf(sender);
            await myErc20.burnFrom(sender, sendTokenAmountWei, {from: receiver});
            let tokenInSenderAfter = await myErc20.balanceOf(sender);
            assert.equal(sendTokenAmountWei, tokenInSenderBefore.sub(tokenInSenderAfter));
        });

        it('The account has the correct allowance', async()=>{
            let allowanceSender2ReceiverBefore = await myErc20.allowance(sender, receiver);
            await myErc20.burnFrom(sender, sendTokenAmountWei, {from: receiver});
            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            assert.equal(sendTokenAmountWei, allowanceSender2ReceiverBefore.sub(allowanceSender2ReceiverAfter));
        });

        it('The burnFrom() should trigger 2 events.', async() => {
            let burnReceipt = await myErc20.burnFrom(sender, sendTokenAmountWei, {from: receiver});
            truffleAssert.eventEmitted(burnReceipt, 'Transfer', (ev) => {
                return ev.from === sender
                    && ev.to === "0x0000000000000000000000000000000000000000" //zero address
                    && ev.value.toString() === sendTokenAmountWei.toString();
            });

            let allowanceSender2ReceiverAfter = await myErc20.allowance(sender, receiver);
            truffleAssert.eventEmitted(burnReceipt, 'Approval', (ev) => {
                return ev.owner === sender
                    && ev.spender === receiver
                    && ev.value.toString() === allowanceSender2ReceiverAfter.toString();
            });
        });
    });
});
