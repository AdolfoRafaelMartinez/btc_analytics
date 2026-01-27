import axios from 'axios';

const QUICKNODE_API_KEY = process.env.REACT_APP_QUICKNODE_API_KEY;

// Base URL for the Quicknode endpoint, should be replaced with the actual endpoint URL.
const BASE_URL =
	`https://wispy-muddy-mound.btc-testnet4.quiknode.pro/${QUICKNODE_API_KEY}`

// Function to get data for a specific Bitcoin address
export const getAddressData = async address => {
	const postData = {
		method: 'bb_getaddress', // The RPC method for getting address data
		params: [address], // The parameters for the method, in this case, the Bitcoin address
		id: 1,
		jsonrpc: '2.0',
	}

	try {
		const response = await axios.post(BASE_URL, postData, {
			headers: {
				'Content-Type': 'application/json',
			},
			maxBodyLength: Infinity,
		})
		return response.data.result
	} catch (error) {
		console.error(error)
	}
}

// Function to get Bitcoin fiat rates for a specific timestamp
export const getBitcoinFiatRates = async timestampUnix => {
	const postData = {
		method: 'bb_gettickers', // The RPC method for getting Bitcoin fiat rates
		params: [{ timestamp: timestampUnix }], // The parameters with the timestamp
		id: 1,
		jsonrpc: '2.0',
	}

	try {
		const response = await axios.post(BASE_URL, postData, {
			headers: {
				'Content-Type': 'application/json',
			},
			maxBodyLength: Infinity,
		})
		return response.data.result.rates
	} catch (error) {
		console.error(error)
	}
}

// Function to get the balance history for a Bitcoin address
export const getBalanceHistory = async (address, from, to, groupBy) => {
	const postData = {
		method: 'bb_getbalancehistory', // The RPC method for getting balance history
		params: [
			address, // The Bitcoin address
			{
				from: from.toString(), // Start of the time range as a string
				to: to.toString(), // End of the time range as a string
				fiatcurrency: 'usd', // The fiat currency to get the balance in
				groupBy: groupBy, // The grouping interval for balance history
			},
		],
		id: 1,
		jsonrpc: '2.0',
	}

	try {
		const response = await axios.post(BASE_URL, postData, {
			headers: {
				'Content-Type': 'application/json',
			},
			maxBodyLength: Infinity,
		})
		return response.data.result
	} catch (error) {
		console.error(error)
	}
}
