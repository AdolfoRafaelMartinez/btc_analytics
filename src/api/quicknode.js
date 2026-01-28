import axios from 'axios';

const QUICKNODE_API_KEY = process.env.REACT_APP_QUICKNODE_API_KEY;
const BASE_URL =
	`https://wispy-muddy-mound.btc-testnet4.quiknode.pro/${QUICKNODE_API_KEY}`

export const getUtxos = async (address) => {
  try {
    const { data } = await axios.post(BASE_URL, {
      method: 'getunspenttxouts',
      params: [[address]],
      id: 1,
      jsonrpc: '2.0',
    });
    return data.result;
  } catch (error) {
    console.error('Error fetching UTXOs:', error);
    throw error;
  }
};

export const broadcastTransaction = async (txHex) => {
  try {
    const { data } = await axios.post(BASE_URL, {
      method: 'sendrawtransaction',
      params: [txHex],
      id: 1,
      jsonrpc: '2.0',
    });
    return data.result;
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    throw error;
  }
};
