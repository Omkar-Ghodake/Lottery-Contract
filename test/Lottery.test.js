const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
	// Getting all accounts
	accounts = await web3.eth.getAccounts();

	// Creating instance of contract
	lottery = await new web3.eth.Contract(interface)
		.deploy({ data: bytecode })
		.send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
	it('Deploys a Contract', () => {
		assert.ok(lottery.options.address);
	});

	it('Allows one account to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[1], players[0]);
		assert.equal(1, players.length);
	});

	it('Allows multiple accounts to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[3],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[1], players[0]);
		assert.equal(accounts[2], players[1]);
		assert.equal(accounts[3], players[2]);
		assert.equal(3, players.length);
	});

	it('Requires minimum amount of ether to enter', async () => {
		try {
			await lottery.methods.enter().send({
				from: accounts[1],
				value: 0
			});
		} catch (error) {
			assert(error);
			return;
		}

		assert(false);
	});

	it('Only Manager can call pickWinner', async () => {
		try {
			await lottery.methods.pickWinner().send({
				from: accounts[0],
				// value: web3.utils.toWei('0.02', 'ether')
			});
		} catch (error) {
			assert(error);
			return;
		}
		assert(false);
	});

	it('Send money to the user and resets the array', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});

		const initialBalance = await web3.eth.getBalance(accounts[0]);
		await lottery.methods.pickWinner().send({ from: accounts[0] });
		const finalBalance = await web3.eth.getBalance(accounts[0]);
		const difference = finalBalance - initialBalance;
		// console.log(difference);
		assert(difference > web3.utils.toWei('1.8', 'ether'));
	});
});