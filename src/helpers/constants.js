export const TITLE_PREFIX = "Avatea | DeFi Market Making";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
export const PAIRED_TOKEN_DEFAULT_IMAGE = process.env.NEXT_PUBLIC_PAIRED_TOKEN_DEFAULT_IMAGE;
export const AVATEA_TOKEN = {
    "4": "0xB991Da4310CdeE737DE53E1C700c363c9aF69631",
    "5": "0xC8c14A34b7629d9f2671F132CC80d7d4A1139435",
    "56": "0xC8c14A34b7629d9f2671F132CC80d7d4A1139435",
}
export const AVATEA_TOKEN_IMAGE = process.env.NEXT_PUBLIC_AVATEA_TOKEN_IMAGE;
export const DEFAULT_SLIPPAGE = process.env.NEXT_PUBLIC_DEFAULT_SLIPPAGE;
export const ENVIRONMENT_MODE = process.env.NEXT_PUBLIC_VERCEL_ENV;

export const DEPLOYMENT_GAS_COST = {
    "5": "0.0000000000000001",
    "56": "0.2",
};

export const MARKET_MAKER_DEPLOYER_ADDRESS = {
    "5": "0xcd0Cb9a57028Ba5720D4d86Ee8afe66eb3999FB7",
    "56": "0x1024cB8649930efdD158958BD5ab552B295eD33c",
};

export const WETH_ADDRESS = {
    "5": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    "56": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
};

export const PAIRED_TOKEN_IMAGES = {
    "0xc778417E063141139Fce010982780140Aa0cD5Ab": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6": "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": "https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png",
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
};

export const RPC_URL = {
    5: "https://ethereum-goerli-rpc.allthatnode.com",
    137: 'https://polygon-mainnet-rpc.allthatnode.com:8545',
    56: 'https://bsc-dataseed.binance.org',
    43114: 'https://avalanche-mainnet-rpc.allthatnode.com'
}

export const DEX_ROUTER = {
    '5': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    '56': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
}

export const SOCIALDATA = [
    {
        name: "LinkedIn",
        value: "social_linkedin",
        icon: "linkedin",
        color: "bg-indigo-400",
    },
    {
        name: "Facebook",
        value: "social_facebook",
        icon: "facebook",
        color: "bg-indigo-400",
    },
    {
        name: "Github",
        value: "social_github",
        icon: "github",
        color: "bg-indigo-400",
    },
    {
        name: "Telegram",
        value: "social_telegram",
        icon: "telegram",
        color: "bg-indigo-400",
    },
    {
        name: "Discord",
        value: "social_discord",
        icon: "discord",
        color: "bg-indigo-400",
    },
    {
        name: "Medium",
        value: "social_medium",
        icon: "medium",
        color: "bg-indigo-400",
    },
    {
        name: "Twitter",
        value: "social_twitter",
        icon: "twitter",
        color: "bg-indigo-400",
    },
];