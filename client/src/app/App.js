import { useEffect, useState } from 'react';
import web3 from "../config/web3";
import lottery from '../lottery';

function App() {
  // const [manager, setManager] = useState('');
  // const [players, setPlayers] = useState([]);
  const [contractData, setContractData] = useState({
    manager: '',
    players: [],
    balance: '',
    value: ''
  });

  const [message, setMessage] = useState('')

  const getContractData = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setContractData({ ...contractData, manager, players, balance });
    console.log(contractData)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setMessage('Waiting on Transaction Success...');

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(contractData.value, 'ether')
    });

    setMessage('You have been Entered!');
  }

  const handlePickWinner = async () => {
    setMessage('Waiting on Transaction Success...');

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A Winner has been Picked!');
  }

  const onChange = (e) => {
    setContractData({ ...contractData, value: e.target.value });

  }

  useEffect(() => {
    getContractData();
  }, [])


  return (
    <div className="App">
      <h1>Lottery Contract</h1>
      <p>This Contract is managed by <b>{ contractData.manager }</b>.</p>
      <p>There are currently <b>{ contractData.players.length }</b> people entered, competing to win <b>{ web3.utils.fromWei(contractData.balance, 'ether') } ether</b>!</p>

      <hr />

      <form onSubmit={ handleOnSubmit }>
        <h4>Want to try your LUCK?</h4>

        <div className="form-group">
          <label htmlFor="etherAmount">Amount of ether to enter </label>
          <input type="text" id='etherAmount' onChange={ onChange } />
        </div>

        <button>Enter</button>
      </form>

      <hr />

      <h4>Ready to Pick a Winner?</h4>
      <button onClick={ handlePickWinner }>Pick Winner</button>

      <hr />

      <h2>{ message }</h2>
    </div>
  );
}

export default App;
