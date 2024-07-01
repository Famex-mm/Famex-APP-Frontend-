import Button from "../../core/Button/Button";
import InputWithIcon from "../../core/Input/InputWithIcon";
import {useEffect, useState} from "react";
import {useWallet} from "@albs1/use-wallet";
import helper from "../../../helpers";
import {PAIRED_TOKEN_DEFAULT_IMAGE, PAIRED_TOKEN_IMAGES} from "../../../helpers/constants";
import {ethers} from "ethers";
import Checkbox from "../../core/Checkbox/Checkbox";
import helpers from "../../../helpers";

export default function MarketMakingDeployment({project}) {

    const wallet = useWallet();
    const [pairedToken, setPairedToken] = useState('');
    const [baseToken, setBaseToken] = useState('');
    const [pairedTokenCheckSum, setPairedTokenCheckSum] = useState('');
    const [baseTokenCheckSum, setBaseTokenCheckSum] = useState('');
    const [pairedTokenTicker, setPairedTokenTicker] = useState('');
    const [pairedTokenImage, setPairedTokenImage] = useState(PAIRED_TOKEN_DEFAULT_IMAGE);
    const [volume, setVolume] = useState('0');
    const [maxBuyingAmount, setMaxBuyingAmount] = useState('0');
    const [maxSellingAmount, setMaxSellingAmount] = useState('0');
    const [maxPreferredDrawdown, setMaxPreferredDrawdown] = useState("0");
    const [lowerPreferredPriceRange, setLowerPreferredPriceRange] = useState("0");
    const [upperPreferredPriceRange, setUpperPreferredPriceRange] = useState("0");
    const [paused, setPaused] = useState(false);

    const deployMarketMakingPool = async () => {
        let success = await helper.web3.marketMaker.deploy(wallet,
            baseTokenCheckSum,
            pairedTokenCheckSum,
            paused,
            project.slug,
            volume,
            maxBuyingAmount,
            maxSellingAmount,
            maxPreferredDrawdown,
            lowerPreferredPriceRange,
            upperPreferredPriceRange,
            pairedTokenImage,
            pairedTokenTicker
            );
        if (success) location.reload();
    };

    useEffect(() => {
        const updatePairedToken = async () => {
            if (pairedToken.length === 42) {
                let checkSum = pairedToken;
                try {
                    checkSum = ethers.utils.getAddress(pairedToken.toLowerCase())
                } catch (e) {
                    console.log('checkSum error', e);
                }
                setPairedTokenCheckSum(checkSum)
                if (PAIRED_TOKEN_IMAGES[checkSum]) {
                    setPairedTokenImage(PAIRED_TOKEN_IMAGES[checkSum])
                } else {
                    setPairedTokenImage(PAIRED_TOKEN_DEFAULT_IMAGE)
                }

                try {
                    setPairedTokenTicker(await helper.web3.token.fetchTicker(wallet, checkSum));
                } catch (e) {
                    setPairedTokenTicker('');
                }

            }
        };
        updatePairedToken();
    }, [wallet, pairedToken]);

    useEffect(() => {
        const updateBaseToken = async () => {
            if (baseToken.length === 42) {
                let checkSum = baseToken;
                try {
                    checkSum = ethers.utils.getAddress(baseToken.toLowerCase())
                } catch (e) {
                    console.log('checkSum error', e);
                }
                setBaseTokenCheckSum(checkSum)
            }
        };
        updateBaseToken();
    }, [wallet, baseToken]);


    return (

        <div className="card-content space-y-3.75">
            {/* Pair Token */}
            <div className="w-full space-y-2.5">
                <span
                    className="text-base">Base Token Address - {project.ticker}</span>
                <InputWithIcon
                    id="editBaseToken"
                    name="editBaseToken"
                    type="text"
                    placeholder="0x..."
                    setValue={setBaseToken}
                    value={baseToken}
                    image={project.image}
                />
            </div>
            <div className="w-full space-y-2.5">
                <span
                    className="text-base">Pair Token Address {pairedTokenTicker ? ' - ' + pairedTokenTicker : ''}</span>
                <InputWithIcon
                    id="editPairToken"
                    name="editPairToken"
                    type="text"
                    placeholder="0x..."
                    setValue={setPairedToken}
                    value={pairedToken}
                    image={pairedTokenImage}
                />
            </div>
            {/* Max buying amount & Max selling amount */}
            <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                <div className="w-full space-y-2.5">
                    <span className="text-base">Max Buying Amount per day</span>
                    <InputWithIcon
                        id="editMaxBuyingAmount"
                        name="editMaxBuyingAmount"
                        type="number"
                        placeholder="0"
                        setValue={setMaxBuyingAmount}
                        value={maxBuyingAmount}
                        image={pairedTokenImage}
                    />
                </div>
                <div className="w-full space-y-2.5">
                    <span className="text-base">Max Selling Amount per day</span>
                    <InputWithIcon
                        id="editMaxSellingAmount"
                        name="editMaxSellingAmount"
                        type="number"
                        placeholder="0"
                        image={project.image}
                        setValue={setMaxSellingAmount}
                        value={maxSellingAmount}
                    />
                </div>
            </div>
            <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                <div className="w-full space-y-2.5">
                    <span className="text-base">Max Preferred Drawdown</span>
                    <InputWithIcon
                        id="editPairToken"
                        name="editPairToken"
                        type="number"
                        value={maxPreferredDrawdown}
                        setValue={setMaxPreferredDrawdown}
                        image={pairedTokenImage}
                    />
                </div>
                <div className="w-full space-y-2.5">
                    <span className="text-base">Volume per day</span>
                    <InputWithIcon
                        id="editPairToken"
                        name="editPairToken"
                        type="number"
                        value={volume}
                        setValue={setVolume}
                        image={pairedTokenImage}
                    />
                </div>
            </div>
            <div className="w-full py-2 grid md-lg:grid-cols-2 gap-3.75">
                <div className="w-full space-y-2.5">
                        <span className="text-base">
                          Lower Preferred Price Range
                        </span>
                    <InputWithIcon
                        id="editMaxBuyingAmount"
                        name="editMaxBuyingAmount"
                        type="number"
                        value={lowerPreferredPriceRange}
                        setValue={setLowerPreferredPriceRange}
                        image={pairedTokenImage}
                    />
                </div>
                <div className="w-full space-y-2.5">
                        <span className="text-base">
                                Upper Preferred Price Range
                        </span>
                    <InputWithIcon
                        id="editMaxBuyingAmount"
                        name="editMaxBuyingAmount"
                        type="number"
                        value={upperPreferredPriceRange}
                        setValue={setUpperPreferredPriceRange}
                        image={pairedTokenImage}
                    />
                </div>
            </div>
            <div className="w-full space-y-2.5 flex flex-row content-center">
                <span className="text-base mt-2 mr-2">Deploy contract in paused state</span>
                <Checkbox setValue={setPaused}/>
            </div>

            <div className="my-6 flex p-4 text-sm text-gray-700 bg-gray-100 rounded-lg"
                 role="alert">
                <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor"
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Info</span>
                <div>
                    <span className="font-bold">Warning:</span> You are currently on the <span className={'font-bold'}>{helpers.web3.network.getNetworkName(wallet.chainId)}</span> network. Deploy the contract on the network on which the project token is active. Switch to another chain if you are on the wrong network.
                </div>
            </div>
            <Button name="Deploy" handleClick={deployMarketMakingPool}/>
        </div>

    )
}