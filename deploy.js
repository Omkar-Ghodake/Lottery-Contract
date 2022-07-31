const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const { interface, bytecode } = require('./compile')

// Create a provider
const provider = new HDWalletProvider(
	'vocal undo make delay camp one cigar mesh seed play icon model',
	'https://rinkeby.infura.io/v3/f3f2fb84bf7f447ba23dcef9fd9e4abc'
);

const web3 = new Web3(provider);

const deploy = async () => {
	// Get all accounts provided by wallet provider
	const accounts = await web3.eth.getAccounts();
	console.log(`Attempting deploy from account: ${accounts[0]}`);

	// Deploying contract
	const result = await new web3.eth.Contract(interface)
		.deploy({ data: bytecode })
		.send({ from: accounts[0], gas: '1000000' });
	console.log(`Contract deployed to: ${result.options.address}`);
	provider.engine.stop();
}
deploy();