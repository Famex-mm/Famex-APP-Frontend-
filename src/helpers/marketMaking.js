import axios from 'axios';
import {API_URL, DEFAULT_CHAIN_ID} from "./constants";
import helpers from '../helpers';
import {toast} from 'react-toastify';


const getMarketMakingPools = async ({invested, vested, saved, live, network = DEFAULT_CHAIN_ID, callback} = {}) => {

    let parameters = "?";
    if (invested) parameters += `invested=${invested}&`
    if (vested) parameters += `vested=${vested}&`
    if (saved) parameters += `saved=${saved}&`
    if (live) parameters += `live=${live}&`
    if (network) parameters += `network=${network}&`

    try {
        const {data} = await axios.get(`${API_URL}MarketMakingPool/${parameters}`);
        return data
    } catch (e) {
        console.log('getMarketMakingPools error:', e);
    }
}

const getMarketMakingSettings = async ({slug, user_address = "none"}) => {
    try {
        const {data} = await axios.get(`${API_URL}Project/${slug}/?user_address=${user_address}`);
        return data.UserSettings;
    } catch (e) {
        console.log('getMarketMakingSettings error:', e);
    }
}


//@Todo check api to allow API method and how to fix authentication
const updateMarketMakingPool = async ({settings, wallet}) => {
    try {
        const {
            volume,
            max_selling_amount,
            max_buying_amount,
            max_preferred_drawdown,
            lower_preferred_price_range,
            upper_preferred_price_range,
            id
        } = settings;
        const signature = await helpers.web3.authentication.getSignature(wallet);
        await axios(
            {
                method: 'patch',
                url: `${API_URL}MarketMakingPool/${id}/`,
                data: {
                    volume,
                    max_selling_amount,
                    max_buying_amount,
                    max_preferred_drawdown,
                    lower_preferred_price_range,
                    upper_preferred_price_range,
                    signature,
                    user_address: wallet.account
                }
            }
        )
        toast.success('Settings saved succesfully.')

    } catch (e) {
        console.log('updateMarketMakingSettings error:', e);
        toast.error('Something wen\'t wrong.')
        throw e;
    }
}


//@Todo check api to allow API method and how to fix authentication
const updateMarketMakingSettings = async ({marketMakingSettings, wallet}) => {
    try {
        const {
            marketMakingType,
            pressure,
            priceLimit,
            tradingUntil,
            marketMakingPoolId,
            id
        } = marketMakingSettings;

        const signature = await helpers.web3.authentication.getSignature(wallet);

        let {data} = await axios(
            {
                method: 'post',
                url: `${API_URL}UserSettings/`,
                data: {
                    market_making_type: marketMakingType,
                    buy_sell_pressure: pressure,
                    price_limit: priceLimit,
                    trading_until: tradingUntil,
                    market_making_pool: marketMakingPoolId,
                    user_address: wallet.account,
                    signature
                }
            }
        )
        toast.success('Settings saved succesfully.')
        return data.id

    } catch
        (e) {
        console.log('updateMarketMakingSettings error:', e);
        toast.error('Something wen\'t wrong.')
        throw e;
    }
}


const getMarketMakingPool = async (id) => {
    try {
        const {data} = await axios.get(`${API_URL}MarketMakingPool/${id}/`);
        return data;
    } catch (e) {
        console.log('getMarketMakingPool error:', e);
    }
}

const getMarketMakingTickers = async (id) => {
    try {
        const {data} = await axios.get(`${API_URL}MarketMakingPool/${id}/retrieve_tickers/`);
        return data;
    } catch (e) {
        console.log('getMarketMakingTickers error:', e);
    }
}

export default {
    getMarketMakingPools,
    getMarketMakingPool,
    updateMarketMakingSettings,
    getMarketMakingSettings,
    updateMarketMakingPool,
    getMarketMakingTickers
}