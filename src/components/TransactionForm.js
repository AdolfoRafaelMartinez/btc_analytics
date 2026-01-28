import React, { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import { getUtxos, broadcastTransaction } from '../api/quicknode';

const TransactionForm = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);

  const sendBitcoin = async () => {
    try {
      const network = bitcoin.networks.testnet;
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });

      const utxos = await getUtxos(address);

      if (utxos.length === 0) {
        throw new Error('No unspent transaction outputs found.');
      }

      const txb = new bitcoin.TransactionBuilder(network);
      let totalValue = 0;
      utxos.forEach(utxo => {
        txb.addInput(utxo.txid, utxo.vout);
        totalValue += utxo.value;
      });

      const amountToSend = parseInt(amount);
      const fee = 10000;
      const change = totalValue - amountToSend - fee;

      if (totalValue < amountToSend + fee) {
        throw new Error('Insufficient funds.');
      }

      txb.addOutput(toAddress, amountToSend);
      if (change > 0) {
        txb.addOutput(address, change);
      }

      utxos.forEach((utxo, index) => {
        txb.sign(index, keyPair);
      });

      const tx = txb.build();
      const txHex = tx.toHex();

      const broadcastedTxId = await broadcastTransaction(txHex);
      setTransactionId(broadcastedTxId);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Send Bitcoin</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Private Key (WIF)</label>
        <input
          type="text"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Destination Address</label>
        <input
          type="text"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Amount (Satoshi)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={sendBitcoin}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Send
      </button>
      {transactionId && (
        <div className="mt-4 p-2 bg-green-100 rounded-lg">
          Transaction successful! Transaction ID: {transactionId}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
