import * as React from "react";
import {useEffect, useState} from "react";
import Image from "next/image";
import ReactGA from "react-ga4";
import dynamic from "next/dynamic";
import helper from "../../../helpers";
import i18n from '../../../i18n/index.json';

// core components
import InputWithIconSubmit from "../../core/Input/InputWithIconSubmit";
import RangeSlider from "../../core/RangeSlider/RangeSlider";
import Radio from "../../core/Radio/Radio";
import Button from "../../core/Button/Button";
import Modal from "../../core/modal/Modal";
import KPIWrapper from "../../core/KPIWrapper";
import KPICard from "../../core/KPICard";

// page components
import Card from "../projectDetail/Card/Card";
import SkeletonMarketMaking from "./Skeleton/SkeletonMarketMaking";
import HomeCard from "../../pages/Home/HomeCard";
import InputTime from "../../core/Input/InputTime";
import Toggle from "../../core/Toggle/Toggle";

const ReactTooltip = dynamic(() => import('react-tooltip'), {ssr: false});

const questions = [
    "How to guide - Please make a selection",
    "How to guide - How fast would you like this to happen?",
    "What price limit do you want to set?",
]

export default function MarketMaking({wallet, project, marketMakingPool}) {

    const [isLoading, setIsLoading] = useState(false);
    const [baseTokenValueLocked, setBaseTokenValueLocked] = useState("0");
    const [pairedTokenValueLocked, setPairedTokenValueLocked] = useState("0");
    const [amountBaseTokenBalance, setAmountBaseTokenBalance] = useState('0');
    const [amountPairTokenBalance, setAmountPairTokenBalance] = useState('0');
    const [pressure, setPressure] = useState('0');
    const [priceLimit, setPriceLimit] = useState('0');
    const [fresh, setFresh] = useState(false);
    const [marketMakingSettingsId, setMarketMakingSettingsId] = useState(null);
    const [mode, setMode] = useState("sell");
    const [estimation, setEstimation] = useState("- Days");
    const [fractionEstimation, setFractionEstimation] = useState("100 %");
    const [tradingUntilPeriod, setTradingUntilPeriod] = useState(0);
    const [tradingUntilDate, setTradingUntilDate] = useState('');
    const [tradingUntil, setTradingUntil] = useState(null);
    const [estimationLoader, setEstimationLoader] = useState(false);
    const [activity, setActivity] = useState({
        baseAmountBought: '0',
        pairedAmountBought: '0',
        baseAmountSold: '0',
        pairedAmountSold: '0'
    })
    const [allowSelling, setAllowSelling] = useState(true);
    const [load, setLoad] = useState(false);
    const [visibleMagicModal, setVisibleMagicModal] = useState(false);
    const [openMagicModal, setOpenMagicModal] = useState(false);
    const [magicQStep, setMagicQStep] = useState(0);
    const [touchedSettings, setTouchedSettings] = useState(false);
    const [marketMakingSettings, setMarketMakingSettings] = useState()
    const [tokenPrice, setTokenPrice] = useState('0');
    const [timeToggle,setTimeToggle] = useState(false)
    useEffect(() => {

        if (wallet.isConnected() && marketMakingPool.address) {
            const initWalletConnected = async () => {

                const {
                    balanceInBaseToken,
                    balanceInPairedToken,
                    baseAmountBought,
                    pairedAmountBought,
                    baseAmountSold,
                    pairedAmountSold,
                    allowSelling,
                    pairedAllocationTrading,
                    baseAllocationTrading
                } = await helper.web3.marketMaker.fetchHoldersMapping(wallet, marketMakingPool.address, wallet.account);
                setActivity({
                    baseAmountBought: helper.formatting.web3Format(baseAmountBought),
                    pairedAmountBought: helper.formatting.web3Format(pairedAmountBought),
                    baseAmountSold: helper.formatting.web3Format(baseAmountSold),
                    pairedAmountSold: helper.formatting.web3Format(pairedAmountSold),
                    pairedAllocationTrading: helper.formatting.web3Format(pairedAllocationTrading),
                    baseAllocationTrading: helper.formatting.web3Format(baseAllocationTrading),
                })
                setAllowSelling(allowSelling);
                setAmountBaseTokenBalance(helper.formatting.web3Format(balanceInBaseToken));
                setAmountPairTokenBalance(helper.formatting.web3Format(balanceInPairedToken));
                setBaseTokenValueLocked(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            marketMakingPool.token,
                            marketMakingPool.address,
                            wallet.chainId
                        ) || '0'
                    )
                );
                setPairedTokenValueLocked(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(
                            wallet,
                            marketMakingPool.paired_token,
                            marketMakingPool.address,
                            wallet.chainId
                        ) || '0'
                    )
                );
                setTokenPrice(await helper.web3.uniswap.getPrice(wallet, marketMakingPool.token, marketMakingPool.paired_token, wallet.chainId))
                setLoad(true);
            };
            initWalletConnected();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet]);


    useEffect(() => {
        if (wallet.status === "connected") {
            const initWalletConnected = async () => {
                //@TODO Wire Chain ID for production
                const marketMakingSettings = await helper.marketMaking.getMarketMakingSettings({
                    slug: project.slug, user_address: wallet.account,
                });
                if (marketMakingSettings) {
                    const {
                        market_making_type, buy_sell_pressure, price_limit, id, trading_until
                    } = marketMakingSettings;
                    setMarketMakingSettings({
                        market_making_type,
                        buy_sell_pressure: buy_sell_pressure?.toString(),
                        price_limit,
                        trading_until
                    });
                    if (!market_making_type) setFresh(true);
                    setMarketMakingSettingsId(id);
                    setTradingUntil(trading_until);
                    if (mode === 'sell') setMode(market_making_type === null || market_making_type === 'hold' ? "sell" : market_making_type);
                    if (pressure === '0') setPressure(buy_sell_pressure === null ? '0' : buy_sell_pressure.toString());
                    if (pressure === '0') setPriceLimit(price_limit === null ? 0 : price_limit);
                }
            };
            initWalletConnected();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.status, project]);

    useEffect(() => {
        if (fresh) {
            setTouchedSettings(true)
        } else {
            const comparisonObject = {
                market_making_type: mode,
                buy_sell_pressure: pressure,
                price_limit: priceLimit,
                trading_until: tradingUntil
            }

            if (JSON.stringify(comparisonObject) === JSON.stringify(marketMakingSettings)) {
                setTouchedSettings(false)
            } else {
                setTouchedSettings(true)
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, pressure, priceLimit, tradingUntil])

    useEffect(() => {

        setEstimationLoader(true);

        let days = 0;
        if (parseFloat(pressure) > 0 && mode === 'buy') {
            let max_buying_amount = marketMakingPool.max_buying_amount
            let balance = parseFloat(activity.pairedAllocationTrading)
            days = balance / (max_buying_amount * pressure / 100)

            days = Math.round(days * 10) / 10
            setEstimation(days + ' Days')
        } else if (parseFloat(pressure) > 0 && mode === 'sell') {
            let max_selling_amount = marketMakingPool.max_selling_amount
            let balance = parseFloat(activity.baseAllocationTrading)
            days = balance / (max_selling_amount * pressure / 100)

            days = Math.round(days * 10) / 10
            setEstimation(days + ' Days')
        } else {
            setEstimation('- Days')
            setFractionEstimation('100 %')
        }

        if (parseFloat(pressure) > 0 && tradingUntilPeriod > 0) {
            let seconds = days * 86400;
            setFractionEstimation(Math.min(100, Math.ceil(10000 * tradingUntilPeriod / seconds) / 100) + "%");
            let currentTime = new Date().getTime() / 1000 + tradingUntilPeriod
            setTradingUntil(new Date(currentTime * 1000).toISOString())
        }

        const timeout = setTimeout(() => setEstimationLoader(false), 1800);

        return () => {
            clearTimeout(timeout)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, pressure, amountBaseTokenBalance, amountPairTokenBalance, marketMakingPool, tradingUntilPeriod]);

    useEffect(() => {
        if (tradingUntil !== null ) setTimeToggle(true);
        let date = new Date(tradingUntil);
        setTradingUntilDate(helper.formatting.dateFormat(date / 1000, true))


    }, [tradingUntil]);

    useEffect(() => {
       setTouchedSettings(true)
    },[timeToggle])


    useEffect(() => {
        setTimeout(() => {
            setVisibleMagicModal(true);
        }, 600)
    })

    useEffect(() => {
        if (openMagicModal) {
            ReactGA.event({
                category: "Modal",
                action: "Open Modal",
                label: "How to"
            });
        }
    }, [openMagicModal])
    const setMax = async (amount, setter) => {
        setter(amount);
    };

    const handleSetMode = (mode) => {
        setMode(mode);
    }

    const updateSettings = async () => {
        try {
            setIsLoading(true);
            const marketMakingSettings = {
                marketMakingType: mode,
                pressure,
                priceLimit,
                tradingUntil: timeToggle === false ? null : tradingUntil,
                marketMakingPoolId: marketMakingPool.id,
                id: marketMakingSettingsId ? marketMakingSettingsId : "",
            };
            let id = await helper.marketMaking.updateMarketMakingSettings({
                marketMakingSettings, wallet
            });
            setIsLoading(false)
            if (fresh) {
                setFresh(false);
                setMarketMakingSettingsId(id)
            }
            ReactGA.event({
                category: 'Settings',
                action: 'Updated Settings - Sustainable Trading'
            });
        } catch (e) {
            setIsLoading(false)
        }

    };

    const AllowSelling = async () => {
        let success = helper.marketMaker.setAllowSelling(wallet, marketMakingPool.address, true);
        setFresh(false);
        ReactGA.event({
            category: 'Settings',
            action: 'Allowed Selling - Sustainable Trading'
        });
    };

    return !load ? <SkeletonMarketMaking/> : (
        <>
            <ReactTooltip/>
            {/* magic modal */}
            {visibleMagicModal &&
                <Modal
                    title={questions[magicQStep]}
                    open={openMagicModal}
                    handleClose={() => setOpenMagicModal(false)}
                >
                    {
                        magicQStep === 0 &&
                        <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-5">
                            <HomeCard
                                icon={<i className="fa-solid fa-money-check-pen text-2xl text-indigo-500"></i>}
                                title={i18n.en.projects.slug.marketMaking.buyMode}
                                content={`${i18n.en.projects.slug.marketMaking.wantToBuy} ${project.ticker}`}
                                handleClick={() => {
                                    setMode("buy");
                                    setMagicQStep(1);
                                }}
                            />

                            <HomeCard
                                icon={<i className="fa-solid fa-money-check-pen text-2xl text-indigo-500"></i>}
                                title={i18n.en.projects.slug.marketMaking.sellMode}
                                content={`${i18n.en.projects.slug.marketMaking.wantToSell} ${project.ticker}`} handleClick={() => {
                                setMode("sell");
                                setMagicQStep(1);
                            }}
                            />
                        </div>
                    }
                    {
                        magicQStep === 1 &&
                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-8">
                                <span className="text-sm"><i className="fa-solid fa-circle-bolt"/> {i18n.en.projects.slug.marketMaking.pressure}</span>
                                <RangeSlider setPercent={setPressure} percent={pressure}/>
                            </div>

                            <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-5">
                                <Button name={i18n.en.projects.slug.marketMaking.previous} handleClick={() => setMagicQStep(0)}/>
                                <Button name={i18n.en.projects.slug.marketMaking.next} handleClick={() => setMagicQStep(2)}/>
                            </div>
                        </div>
                    }
                    {
                        magicQStep === 2 &&
                        <div className="flex flex-col space-y-2.5">
                            <InputWithIconSubmit
                                id="priceLimit"
                                name="priceLimit"
                                type="number"
                                image={marketMakingPool.paired_token_image}
                                placeholder={i18n.en.projects.slug.marketMaking.enterPrice}
                                icon="fa-light fa-circle-minus"
                                hideButton={true}
                                value={priceLimit}
                                setValue={setPriceLimit}
                            />

                            <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-5">
                                <Button name="Previous" handleClick={() => setMagicQStep(0)}/>
                                {allowSelling || mode === "buy" ?
                                    <Button name="Show Settings"
                                            isLoading={isLoading}
                                            disabled={isLoading}
                                            handleClick={() => setOpenMagicModal(false)}> <i
                                        className="pl-2 fa-solid fa-check-circle"/></Button>
                                    :
                                    <Button name={i18n.en.projects.slug.marketMaking.allowSustainableSelling} handleClick={(e) => {
                                        AllowSelling()
                                    }}> <i className="pl-2 fa-solid fa-arrow-down-to-arc"/></Button>
                                }
                            </div>
                        </div>
                    }
                </Modal>
            }
            <div className="grid md-lg:grid-cols-1 gap-7.5">
                <Card title="Dashboard" className={''}>

                    {/* Card Header */}
                    <div className="card-header">
                        {mode === "sell" ? (
                            <KPIWrapper cols={4}>
                                <KPICard image={project.image} end={activity.baseAmountSold} label={i18n.en.projects.slug.marketMaking.sold}/>
                                <KPICard image={marketMakingPool.paired_token_image} end={activity.pairedAmountSold}
                                         label={i18n.en.projects.slug.marketMaking.bought}/>
                                <KPICard image={marketMakingPool.paired_token_image}
                                         disableCount={true}
                                         end={activity.pairedAmountSold / activity.baseAmountSold}
                                         label={i18n.en.projects.slug.marketMaking.avgPrice}/>
                                <KPICard image={project.image} end={activity.baseAllocationTrading}
                                         label={i18n.en.projects.slug.marketMaking.allocation}/>
                            </KPIWrapper>
                        ) : (
                            <KPIWrapper cols={4}>
                                <KPICard image={project.image} end={activity.baseAmountBought} label={i18n.en.projects.slug.marketMaking.bought}/>
                                <KPICard image={marketMakingPool.paired_token_image} end={activity.pairedAmountBought}
                                         label={i18n.en.projects.slug.marketMaking.sold}/>
                                <KPICard image={marketMakingPool.paired_token_image}
                                         end={activity.pairedAmountBought / activity.baseAmountBought}
                                         disableCount={true}
                                         label={i18n.en.projects.slug.marketMaking.avgPrice}/>
                                <KPICard image={marketMakingPool.paired_token_image}
                                         end={activity.pairedAllocationTrading} label={i18n.en.projects.slug.marketMaking.allocation}/>
                            </KPIWrapper>

                        )}


                        <div className="py-5.5 space-y-4.5 hidden">
                            <div className="flex justify-between">
                                <span className="text-sm">
                                    <i className="fa-solid fa-money-bill-transfer"/> {i18n.en.projects.slug.info.TVL}
                                </span>
                                <span className="flex text-base font-medium">
                                    <Image src={project.image} alt="projectImage" width={24} height={24}/>
                                    <span className="mx-2.5">{baseTokenValueLocked}</span>
                                    <Image
                                        src={marketMakingPool.paired_token_image}
                                        alt="pairedTokenImage"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="mx-2.5">{pairedTokenValueLocked}</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm"><i className="fa-solid fa-circle-minus"/> {i18n.en.projects.slug.marketMaking.sold}</span>
                                <span className="flex text-base font-medium">
                                    <Image src={project.image} alt="projectImage" width={24} height={24}/>
                                    <span className="mx-2.5">{activity.baseAmountSold} </span>
                                    <Image
                                        src={marketMakingPool.paired_token_image}
                                        alt="pairedTokenImage"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="mx-2.5">{activity.pairedAmountSold}</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm"><i className="fa-solid fa-circle-plus"/> {i18n.en.projects.slug.marketMaking.bought}</span>
                                <span className="flex text-base font-medium">
                                    <Image src={project.image} alt="projectImage" width={24} height={24}/>
                                    <span className="mx-2.5">{activity.baseAmountBought}</span>
                                    <Image
                                        src={marketMakingPool.paired_token_image}
                                        alt="pairedTokenImage"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="mx-2.5">{activity.pairedAmountBought}</span>
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm"><i className="fa-solid fa-circle-minus"/> {i18n.en.projects.slug.marketMaking.allocatedTradingAmount}</span>
                                <span className="flex text-base font-medium">
                                    <Image src={project.image} alt="projectImage" width={24} height={24}/>
                                    <span className="mx-2.5">{activity.baseAllocationTrading} </span>
                                    <Image
                                        src={marketMakingPool.paired_token_image}
                                        alt="pairedTokenImage"
                                        width={24}
                                        height={24}
                                    />
                                    <span className="mx-2.5">{activity.pairedAllocationTrading}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="Settings">
                    {/* Card Header */}
                    <div className="card-header flex justify-between">
                        <h1 className="text-2xl"><i className="fa-solid fa-sliders"/> {i18n.en.projects.slug.marketMaking.settings}</h1>
                        <div
                            className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-900/5 shadow-lg rounded-full flex items-center justify-center hover:cursor-pointer"
                            onClick={() => setOpenMagicModal(true)}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-md"/>
                        </div>
                    </div>

                    <div className="card-content pt-5.5 space-y-5">
                        <div className="space-y-2.5">
                            <span className="text-sm"><i className="fa-solid fa-plus-minus"/> {i18n.en.projects.slug.marketMaking.mode} <i data-tip={i18n.en.projects.slug.marketMaking.modeTooltip} className="fa-solid fa-info-circle cursor-pointer"></i></span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                                <Radio
                                    name="mode"
                                    label={i18n.en.projects.slug.marketMaking.buy}
                                    value={"buy"}
                                    checked={mode === "buy"}
                                    handleSetMode={handleSetMode}
                                />
                                <Radio
                                    name="mode"
                                    label={i18n.en.projects.slug.marketMaking.sell}
                                    value={"sell"}
                                    checked={mode === "sell"}
                                    handleSetMode={handleSetMode}
                                />
                            </div>
                        </div>
                        <div className="grid md-lg:grid-cols-2 md-lg:h-20 gap-5">
                            <div className="flex flex-col space-y-8">
                                <span className="text-sm"><i className="fa-solid fa-circle-bolt"/> {i18n.en.projects.slug.marketMaking.pressure} <i data-tip={i18n.en.projects.slug.marketMaking.pressureTooltip} className="fa-solid fa-info-circle cursor-pointer"></i></span>
                                <RangeSlider setPercent={setPressure} percent={pressure}/>
                            </div>
                            <div
                                className={`${estimationLoader ? 'space-y-5' : 'space-y-5'} ${estimation === `- ${i18n.en.projects.slug.marketMaking.days}` ? 'hidden' : ''}`}>
                                <span className="text-sm"><i className="fa-solid fa-timer"/> {i18n.en.projects.slug.marketMaking.estimationOfDuration} <i data-tip={i18n.en.projects.slug.marketMaking.estimationTooltip} className="fa-solid fa-info-circle cursor-pointer"></i></span>
                                {
                                    estimationLoader ?
                                        <div className={'flex flex-row'}>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <small>{i18n.en.projects.slug.marketMaking.calculatingEstimation}</small>
                                        </div>
                                        :
                                        <p>{estimation}</p>

                                }
                            </div>
                        </div>

                        <div className="grid md-lg:grid-cols-2 md-lg:h-30 gap-5">
                            <div className={'col-span-full'}>
                                <Toggle
                                    label={"Do you want to set a limit untill when your trades should be exectued?"}
                                    handleClick={() => {
                                        setTimeToggle(!timeToggle)
                                    }}
                                    checked={timeToggle}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-sm"><i
                                    className="fa-solid fa-clock"/> {i18n.en.projects.slug.marketMaking.tradingUntil} {timeToggle ? tradingUntilDate : '' } <i data-tip={i18n.en.projects.slug.marketMaking.tradingUntilTooltip} className="fa-solid fa-info-circle cursor-pointer"></i></span>
                                {
                                    timeToggle ? <InputTime
                                        id="priceLimit"
                                        name="priceLimit"
                                        type="number"
                                        image={marketMakingPool.paired_token_image}
                                        placeholder={i18n.en.projects.slug.marketMaking.enterPrice}
                                        icon="fa-light fa-circle-minus"
                                        hideButton={true}
                                        value={tradingUntilPeriod}
                                        setValue={setTradingUntilPeriod}
                                    /> : <div className="text-left bg-gray-100 rounded-lg p-1">
                                        <div
                                            className="p-2 bg-gray-100 justify-center items-center text-black leading-none lg:rounded-sm flex lg:inline-flex"
                                            role="alert">
                                                <span
                                                    className="flex rounded-full bg-gray-300 uppercase px-2 py-1 text-xs mr-3">{i18n.en.projects.slug.marketMaking.note}</span>
                                            <span className=" mr-2 text-left flex-auto">Time limit is not enabled, trades will be executed untill your target has been reached.</span>
                                        </div>
                                    </div>
                                }


                            </div>
                            <div
                                className={`${estimationLoader ? 'space-y-5' : 'space-y-5'} ${estimation === `- ${i18n.en.projects.slug.marketMaking.days}` ? 'hidden' : ''}`}>
                                <span className="text-sm"><i className="fa-solid fa-percent"/> {i18n.en.projects.slug.marketMaking.estimatedFraction}  <i data-tip={i18n.en.projects.slug.marketMaking.fractionTooltip} className="fa-solid fa-info-circle cursor-pointer"></i></span>
                                {
                                    estimationLoader ?
                                        <div className={'flex flex-row'}>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <small>{i18n.en.projects.slug.marketMaking.calculatingEstimation}</small>
                                        </div>
                                        :
                                        <p>{fractionEstimation}</p>

                                }
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex flex-row items-center justify-between text-base">
                                   <span className="text-sm"><i className="fa-solid fa-circle-dollar"/>
                                       {mode === "buy" ? ` ${i18n.en.projects.slug.marketMaking.maxBuyPrice} `: ` ${i18n.en.projects.slug.marketMaking.minSellPrice} `}
                                        <i data-tip={i18n.en.projects.slug.marketMaking.minMaxPriceTooltip} className="fa-solid fa-info-circle cursor-pointer"></i>
                            </span>
                                <div className="flex items-center gap-1">

                                    {
                                        mode === "buy" ?
                                            <span className={`text-sm relative space-x-1`}>{i18n.en.projects.slug.marketMaking.currentPrice}:
                                                <span
                                                    className={`ml-1 text-balance transition-all delay-300 ${Number(priceLimit) >= Number(tokenPrice) ? 'text-green-600' : 'text-red-600'}`}>{tokenPrice}</span>
                                                {
                                                    Number(priceLimit) >= Number(tokenPrice) ?
                                                        <span className="relative  flex-row group">
                                                     <i data-tip={i18n.en.projects.slug.marketMaking.aboveCurrentPrice}
                                                        className="fa-solid fa-check-circle fa-xs text-green-400 transition-all delay-300 cursor-pointer"></i>
                                                </span> : <span className="relative  flex-row group">
                                                     <i data-tip={i18n.en.projects.slug.marketMaking.belowCurrentPrice}
                                                        className="fa-solid fa-warning fa-xs text-amber-500 transition-all delay-300 cursor-pointer"></i>
                                                </span>
                                                }

                                            </span> :

                                            <span className={`text-sm space-x-1 relative`}>{i18n.en.projects.slug.marketMaking.currentPrice}:
                                            <span
                                                className={`ml-1 text-balance transition-all delay-300 ${Number(priceLimit) <= Number(tokenPrice) ? 'text-green-600' : 'text-red-600'}`}>{tokenPrice}</span>
                                                {
                                                    Number(priceLimit) <= Number(tokenPrice) ?
                                                        <span className="relative  flex-row group">
                                                     <i data-tip={i18n.en.projects.slug.marketMaking.belowCurrentPrice}
                                                        className="fa-solid fa-check-circle fa-xs text-green-400 transition-all delay-300 cursor-pointer"></i>
                                                </span> : <span className="relative  flex-row group">
                                                     <i data-tip={i18n.en.projects.slug.marketMaking.aboveCurrentPrice}
                                                        className="fa-solid fa-warning fa-xs text-amber-500 transition-all delay-300 cursor-pointer"></i>
                                                </span>
                                                }
                                        </span>

                                    }

                                </div>

                            </div>

                            <InputWithIconSubmit
                                id="priceLimit"
                                name="priceLimit"
                                type="number"
                                image={marketMakingPool.paired_token_image}
                                placeholder={i18n.en.projects.slug.marketMaking.enterPrice}
                                icon="fa-light fa-circle-minus"
                                hideButton={true}
                                value={priceLimit}
                                setValue={setPriceLimit}
                            />
                        </div>
                        {
                            (priceLimit === '0' || priceLimit === 0) && <div className="text-center py-4 lg:px-4">
                                <div
                                    className="p-2 bg-gray-100 items-center text-black leading-none lg:rounded-full flex lg:inline-flex"
                                    role="alert">
                                                <span
                                                    className="flex rounded-full bg-gray-300 uppercase px-2 py-1 text-xs mr-3">{i18n.en.projects.slug.marketMaking.note}</span>
                                    <span className=" mr-2 text-left flex-auto">{i18n.en.projects.slug.marketMaking.noteDescription}</span>
                                </div>
                            </div>
                        }

                        {allowSelling || mode === "buy" ?
                            <Button name={i18n.en.projects.slug.marketMaking.saveSettings}
                                    isLoading={isLoading}
                                    disabled={isLoading || !touchedSettings}
                                    handleClick={(e) => {
                                        updateSettings()
                                    }}> <i className="pl-2 fa-solid fa-arrow-down-to-arc"/></Button>
                            :
                            <Button name={i18n.en.projects.slug.marketMaking.allowSustainableSelling} handleClick={(e) => {
                                AllowSelling()
                            }}> <i className="pl-2 fa-solid fa-arrow-down-to-arc"/></Button>
                        }
                    </div>
                </Card>
            </div>
        </>
    )
}