const path = require('path');
const fs = require('fs');
const solc = require('solc');

// acquiring the path of smart contract
const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// reading the content of smart contract
const source = fs.readFileSync(lotteryPath, 'utf8');

// compiling the smart contract
var input = {
	language: 'Solidity',
	sources: {
		'Lottery.sol': {
			content: source
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*']
			}
		}
	}
};

var output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Lottery.sol'].Lottery;

// console.log(output)

module.exports = {
	interface: output.abi,
	bytecode: output.evm.bytecode.object
}
