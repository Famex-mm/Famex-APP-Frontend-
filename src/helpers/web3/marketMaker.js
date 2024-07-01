import {BigNumber, ethers} from 'ethers';
import marketMaker from '../../abi/MarketMaker.json';
import {toast} from "react-toastify";
import helpers from "../index";
import {API_URL, DEFAULT_CHAIN_ID, DEPLOYMENT_GAS_COST, MARKET_MAKER_DEPLOYER_ADDRESS, RPC_URL} from "../constants";
import MarketMakerDeployer from "../../abi/MarketMakerDeployer.json";
import axios from "axios";

const deploy = async (wallet,
                      baseToken,
                      pairedToken,
                      paused,
                      projectSlug,
                      volume,
                      maxBuyingAmount,
                      maxSellingAmount,
                      maxPreferredDrawdown,
                      lowerPreferredPriceRange,
                      upperPreferredPriceRange,
                      pairedTokenImage,
                      pairedTokenTicker,) => {

    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const options = {value: ethers.utils.parseEther(DEPLOYMENT_GAS_COST[wallet.chainId])}
        const MarketMakerDeployerContract = await new ethers.Contract(MARKET_MAKER_DEPLOYER_ADDRESS[wallet.chainId], MarketMakerDeployer.abi, signer);
        const tx = await MarketMakerDeployerContract.createMarketMaker(baseToken, pairedToken, paused, options);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();

        const {
            controllerWallet,
            marketMaker
        } = receipt.events.find(x => x.event === "CreatedMarketMakingContract").args;

        await axios.post(`${API_URL}MarketMakingPool/`, {
            address: marketMaker,
            controller_wallet: controllerWallet,
            token: baseToken,
            paired_token: pairedToken,
            project: projectSlug,
            network: String(wallet.chainId),
            max_selling_amount: maxSellingAmount,
            max_buying_amount: maxBuyingAmount,
            max_preferred_drawdown: maxPreferredDrawdown,
            lower_preferred_price_range: lowerPreferredPriceRange,
            upper_preferred_price_range: upperPreferredPriceRange,
            paired_token_image: pairedTokenImage,
            paired_token_ticker: pairedTokenTicker,
            volume,
            live: !paused
        })

        await helpers.callback.hook({
            type: "MMCD",
            data: {
                receipt,
                wallet,
                address: marketMaker
            }
        })
        return true;
    } catch (e) {
        console.log('deploy error', e);
        toast.error(e.reason);
        return false;
    }
}

const stake = async (wallet, marketMakerAddress, amount) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.stake(amount);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();

        await helpers.callback.hook({
            type: "MMBD",
            data: {
                receipt,
                wallet
            }
        })
        return true;
    } catch (e) {
        console.log('stake error', e);
        toast.error(e.reason);
        return false;
    }
}

const stakeBatch = async (wallet, marketMakerAddress, user_addresses, amountsInWei, amounts) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const tx = await marketMakerContract.stakeBatch(amountsInWei, user_addresses);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();

        await helpers.callback.batchHook({
            type: "MMBB",
            data: {
                receipt,
                wallet,
                user_addresses,
                amounts
            }
        })
        return true;
    } catch (e) {
        console.log('stakeBatch error', e);
        toast.error(e.reason);
        throw e;
    }
}

const createVesting = async (wallet,
                             marketMakerAddress,
                             user_addresses,
                             start,
                             cliff,
                             duration,
                             slicePeriodSeconds,
                             revocable,
                             amountsInWei,
                             amounts,
                             batchName,
                             projectName) => {

    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const tx = await marketMakerContract.createVestingSchedule(
            user_addresses,
            start,
            cliff,
            duration,
            slicePeriodSeconds,
            revocable,
            amountsInWei
        );

        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();

        await helpers.callback.batchHook({
            type: "MMVD",
            data: {
                receipt,
                wallet,
                user_addresses,
                amounts,
                start,
                cliff,
                duration,
                slicePeriodSeconds,
                revocable,
                batchName,
                projectName
            }
        })
        return true;
    } catch (e) {
        console.log('createVesting error', e);
        toast.error(e.reason);
        throw e;
    }
}

const stakePairedToken = async (wallet, marketMakerAddres, amount) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddres, marketMaker.abi, signer);
        const tx = await marketMakerContract.stakePairedToken(amount);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMPD",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('stakePairedToken error', e);
        toast.error(e.reason);
        throw e;
    }
}

const stakePairedTokenInETH = async (wallet, marketMakerAddress, amount) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const tx = await marketMakerContract.stakePairedTokenInETH({value: amount});
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMPD",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('stakePairedTokenInETH error', e);
        toast.error(e.reason);
        throw e;
    }
}

const withdrawBaseToken = async (wallet, marketMakerAddress, amount, full_withdrawal) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const tx = await marketMakerContract.withdrawBaseToken(amount);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMBW",
            data: {
                receipt,
                wallet,
                full_withdrawal
            }
        })
        return true;
    } catch (e) {
        console.log('withdrawBaseToken error', e);
        toast.error(e.reason);
        return false;
    }
}

const withdrawPairToken = async (wallet, marketMakerAddress, amount, full_withdrawal) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const tx = await marketMakerContract.withdrawPairedToken(amount);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMPW",
            data: {
                receipt,
                wallet,
                full_withdrawal
            }
        })
        return true;
    } catch (e) {
        console.log('withdrawPairedToken error', e);
        toast.error(e.reason);
        return false;
    }
}


const release = async (wallet, marketMakerAddress, full_withdrawal) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.release();
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMVR",
            data: {
                receipt,
                wallet,
                full_withdrawal
            }
        })
        return true;
    } catch (e) {
        console.log('release error', e);
        toast.error(e.reason);
        return false;
    }
}

const revoke = async (wallet, marketMakerAddress, user_address) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.revoke(user_address);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMRT",
            data: {
                receipt,
                wallet,
                user_address
            }
        })
        return true;
    } catch (e) {
        console.log('revoke error', e);
        toast.error(e.reason);
        throw e;
    }
}


const computeReleasableAmount = async (wallet, marketMakerAddress, userAddress) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet,wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const result = await marketMakerContract.computeReleasableAmount(userAddress);
        return result
    } catch (e) {
        console.log('computeReleasableAmount error', e);
        toast.error(e.reason);
        return 0;
    }
}

const getTotalVested = async (wallet, marketMakerAddress, chainId = DEFAULT_CHAIN_ID) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet,chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        return await marketMakerContract.totalVested();
    } catch (e) {
        console.log('getTotalVested error', e);
        toast.error(e.reason);
        return 0;
    }
}

const fetchHoldersMapping = async (wallet, marketMakerAddress, address) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId);
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const data = await marketMakerContract.holdersMapping(address);

        const {
            balanceInPairedToken,
            balanceInBaseToken,
            baseTokenStakedInLiquidity,
            pairedTokenStakedInLiquidity,
            baseAmountBought,
            pairedAmountBought,
            baseAmountSold,
            pairedAmountSold,
            projectOwner,
            allowSelling,
            maxBaseLiquidityRatio,
            maxPairedLiquidityRatio
        } = data;

        function max(a, b) {
            return a.gt(b) ? a : b
        }

        function min(a, b) {
            return a.lt(b) ? a : b
        }

        let baseAllocationLiquidity = max(min((balanceInBaseToken.add(baseTokenStakedInLiquidity).add(baseAmountSold))
            .mul(maxBaseLiquidityRatio).div(100).sub(baseTokenStakedInLiquidity), balanceInBaseToken), 0)

        let baseAllocationTrading = max(min((balanceInBaseToken.add(baseTokenStakedInLiquidity).add(baseAmountSold))
            .mul(BigNumber.from(100).sub(maxBaseLiquidityRatio)).div(100).sub(baseAmountSold), balanceInBaseToken), 0)

        let pairedAllocationLiquidity = max(min((balanceInPairedToken.add(pairedTokenStakedInLiquidity).add(pairedAmountBought))
            .mul(maxPairedLiquidityRatio).div(100).sub(pairedTokenStakedInLiquidity), balanceInPairedToken), 0)

        let pairedAllocationTrading = max(min((balanceInPairedToken.add(pairedTokenStakedInLiquidity).add(pairedAmountBought))
            .mul(BigNumber.from(100).sub(maxPairedLiquidityRatio)).div(100).sub(pairedAmountBought), balanceInPairedToken), 0)

        return {
            balanceInPairedToken,
            balanceInBaseToken,
            baseTokenStakedInLiquidity,
            pairedTokenStakedInLiquidity,
            baseAmountBought,
            pairedAmountBought,
            baseAmountSold,
            pairedAmountSold,
            projectOwner,
            allowSelling,
            maxBaseLiquidityRatio,
            maxPairedLiquidityRatio,
            baseAllocationLiquidity,
            baseAllocationTrading,
            pairedAllocationLiquidity,
            pairedAllocationTrading
        }
    } catch (e) {
        console.log('holdersMapping error', e);
        toast.error(e.reason);
        return 0;
    }
}


const fetchHoldersVestingMapping = async (wallet, marketMakerAddress, address) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);
        const data = await marketMakerContract.holdersVestingMapping(address);
        const {
            amountVested,
            released,
            cliff,
            start,
            duration,
            slicePeriodSeconds,
            revocable,
            allowReleasing
        } = data;
        return {
            amountVested,
            released,
            cliff,
            start,
            duration,
            slicePeriodSeconds,
            revocable,
            allowReleasing
        }
    } catch (e) {
        console.log('fetchHoldersVestingMapping error', e);
        toast.error(e.reason);
        return 0;
    }
}

const setAllowSelling = async (wallet, marketMakerAddress, allowSelling) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.setAllowSelling(allowSelling);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMAS",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('setAllowSelling error', e);
        toast.error(e.reason);
        return false;
    }
}


const setAllowReleasing = async (wallet, marketMakerAddress, allowReleasing) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.setAllowReleasing(allowReleasing);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMAR",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('setAllowReleasing error', e);
        toast.error(e.reason);
        return false;
    }
}

const setMaxBaseLiquidityRatio = async (wallet, marketMakerAddress, maxBaseLiquidityRatio) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.setMaxBaseLiquidityRatio(maxBaseLiquidityRatio);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMBR",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('setMaxBaseStakingRatio error', e);
        toast.error(e.reason);
        return false;
    }
}

const setMaxPairedLiquidityRatio = async (wallet, marketMakerAddress, maxPairedLiquidityRatio) => {
    try {
        const { signer } = await helpers.web3.authentication.getSigner(wallet, wallet.chainId)
        const marketMakerContract = await new ethers.Contract(marketMakerAddress, marketMaker.abi, signer);

        const tx = await marketMakerContract.setMaxPairedLiquidityRatio(maxPairedLiquidityRatio);
        toast.promise(
            tx.wait(),
            {
                pending: 'Pending transaction',
                success: `Transaction succeeded!`,
                error: 'Transaction failed!'
            }
        )
        const receipt = await tx.wait();
        await helpers.callback.hook({
            type: "MMPR",
            data: {
                receipt,
                wallet,
            }
        })
        return true;
    } catch (e) {
        console.log('setMaxPairedStakingRatio error', e);
        toast.error(e.reason);
        return false;
    }
}

const getTVL = async (wallet, marketMakerAddress, baseTokenAddress, pairedTokenAddress,chainId = DEFAULT_CHAIN_ID) => {

    let baseBalance = await helpers.web3.token.balanceOf(wallet, baseTokenAddress, marketMakerAddress, chainId)
    let pairedBalance = await helpers.web3.token.balanceOf(wallet, pairedTokenAddress, marketMakerAddress, chainId)

    return {baseBalance, pairedBalance}
}

export default {
    stake,
    stakePairedToken,
    stakePairedTokenInETH,
    withdrawBaseToken,
    withdrawPairToken,
    release,
    computeReleasableAmount,
    deploy,
    fetchHoldersMapping,
    fetchHoldersVestingMapping,
    createVesting,
    stakeBatch,
    revoke,
    setAllowSelling,
    setAllowReleasing,
    setMaxBaseLiquidityRatio,
    setMaxPairedLiquidityRatio,
    getTotalVested,
    getTVL
}