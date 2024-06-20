document.addEventListener('DOMContentLoaded', () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    const contractAddress = '0xYourContractAddressHere';
    const contractABI = [/* ABI array here */];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const addressInput = document.getElementById('address');
    const balanceSpan = document.getElementById('balance');
    const recipientInput = document.getElementById('recipient');
    const amountInput = document.getElementById('amount');
    const transferBtn = document.getElementById('transferBtn');
    const transactionStatus = document.getElementById('transactionStatus');
    const transactionList = document.getElementById('transactionList');

    async function updateBalance() {
        const address = addressInput.value;
        if (address) {
            try {
                const balance = await contract.methods.balanceOf(address).call();
                balanceSpan.textContent = balance;
            } catch (error) {
                transactionStatus.textContent = 'Error getting balance';
            }
        }
    }

    async function transferTokens() {
        const fromAddress = addressInput.value;
        const toAddress = recipientInput.value;
        const amount = amountInput.value;
        if (fromAddress && toAddress && amount) {
            try {
                const transaction = await contract.methods.transfer(toAddress, amount).send({ from: fromAddress });
                updateBalance();
                transactionStatus.textContent = `Transaction successful: ${transaction.transactionHash}`;
                addTransactionToList(transaction.transactionHash);
            } catch (error) {
                transactionStatus.textContent = 'Error transferring tokens';
            }
        } else {
            transactionStatus.textContent = 'Please fill out all fields';
        }
    }

    function addTransactionToList(transactionHash) {
        const listItem = document.createElement('li');
        listItem.textContent = transactionHash;
        transactionList.appendChild(listItem);
    }

    addressInput.addEventListener('change', updateBalance);
    transferBtn.addEventListener('click', transferTokens);
});
