import React, { useState } from 'react';
import * as bitcoin from 'bitcoinjs-lib';

const WalletGenerator = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const generateWallet = () => {
    try {
      const network = bitcoin.networks.testnet;
      const keyPair = bitcoin.ECPair.makeRandom({ network });
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
      const privateKey = keyPair.toWIF();
      setWallet({ address, privateKey });
      setError(null);
    } catch (err) {
      setError(err.message);
      setWallet(null);
    }
  };

  return (
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Create Wallet</h2>
      <button
        onClick={generateWallet}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Generate New Wallet
      </button>
      {wallet && (
        <div className="mt-4 p-2 bg-gray-100 rounded-lg">
          <p><strong>Address:</strong> {wallet.address}</p>
          <p><strong>Private Key (WIF):</strong> {wallet.privateKey}</p>
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

export default WalletGenerator;
