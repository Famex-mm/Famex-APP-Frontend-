import {ethers} from 'ethers';
import TokenContract from '../../abi/Token.json';
import {DEFAULT_CHAIN_ID, RPC_URL} from "../constants";
import {toast} from "react-toastify";
import helpers from "../index";

const fetchTotalSupply = async (wallet, tokenAddress, chainId = DEFAULT_CHAIN_ID) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet,chainId);
        const tokenContract = await new ethers.Contract(tokenAddress, TokenContract.abi, signer);
        return await tokenContract.totalSupply();
    } catch (e) {
        toast.error(e.reason);
        console.log('fetchTotalSupply error', e);
    }
}

const fetchTicker = async (wallet, tokenAddress) => {
    const { signer } = await helpers.web3.authentication.getSigner(wallet,wallet.chainId);
    const tokenContract = await new ethers.Contract(tokenAddress, TokenContract.abi, signer);
    return await tokenContract.symbol();
}

const balanceOf = async (wallet, tokenAddress, address, chainId = DEFAULT_CHAIN_ID) => {
    const { signer } = await helpers.web3.authentication.getSigner(wallet,chainId);
    const tokenContract = await new ethers.Contract(tokenAddress, TokenContract.abi, signer);
    try {
        return await tokenContract.balanceOf(address);
    } catch (e) {
        toast.error(e.reason);
        console.log('balanceOf error', e);
    }
}

const wethBalanceOf = async (wallet, address) => {
    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
    try {
        return await provider.getBalance(address)
    } catch (e) {
        toast.error(e.reason);
        console.log('wethBalanceOf error', e);
    }
}

const fetchApprovedAmount = async (wallet, addressToApprove, tokenAddress) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet,wallet.chainId);
        const tokenContract = await new ethers.Contract(tokenAddress, TokenContract.abi, signer);
        return await tokenContract.allowance(wallet.account, addressToApprove);
    } catch (e) {
        toast.error(e.reason);
        console.log('fetchApprovedAmount error', e);
    }
}


const approveCustomToken = async (wallet, addressToApprove, supplyToApprove, tokenAddress) => {
    const { signer } = await helpers.web3.authentication.getSigner(wallet,wallet.chainId);
    const tokenContract = await new ethers.Contract(tokenAddress, TokenContract.abi, signer);
    try {
        const tx = await tokenContract.approve(addressToApprove, supplyToApprove);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            },
            {
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            }
        )
    } catch (e) {
        toast.error(e.reason);
        console.log('approveToken error', e);
    }
}

export default {
    fetchTotalSupply,
    approveCustomToken,
    fetchApprovedAmount,
    balanceOf,
    wethBalanceOf,
    fetchTicker
}