import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ethers} from "ethers";
import helpers from "../../../helpers";
import {WETH_ADDRESS} from "../../../helpers/constants";
import i18n from "../../../i18n/index.json";
const translateBase = i18n.en.projects.slug.depositWithdraw;

// core components
import InputApproveWithIconSubmit from "../../core/Input/InputApproveWithIconSubmit";

// page components
import MaxButton from "./Button/MaxButton";
import Card from "../projectDetail/Card/Card";
import SkeletonDeposit from "./Skeleton/SkeletonDeposit";
import HomeCard from "../../pages/Home/HomeCard";
import KPIWrapper from "../../core/KPIWrapper";
import KPICard from "../../core/KPICard";
import InputWithIconSubmit from "../../core/Input/InputWithIconSubmit";
import ReactGA from "react-ga4";

export default function Deposit({wallet, project, marketMakingPool, setTab}) {

    const router = useRouter();
    const [amountBaseTokenBalance, setAmountBaseTokenBalance] = useState('0');
    const [amountPairTokenBalance, setAmountPairTokenBalance] = useState('0');
    const [amountBaseTokenToWithdraw, setAmountBaseTokenToWithdraw] = useState('0');
    const [amountPairTokenToWithdraw, setAmountPairTokenToWithdraw] = useState('0');
    const [amountBaseTokenToStake, setAmountBaseTokenToStake] = useState('0');
    const [amountPairTokenToStake, setAmountPairTokenToStake] = useState('0');
    const [baseTokenWalletBalance, setBaseTokenWalletBalance] = useState('0');
    const [pairedTokenWalletBalance, setPairedTokenWalletBalance] = useState('0');
    const [pairedTokenIsWeth, setPairedTokenIsWeth] = useState(false);
    const [load, setLoad] = useState(false);


    useEffect(() => {

        if (wallet.isConnected() && marketMakingPool.address) {
            const initWalletConnected = async () => {

                if (marketMakingPool.paired_token === WETH_ADDRESS[wallet.chainId]) {
                    setPairedTokenIsWeth(true)
                    setPairedTokenWalletBalance(helpers.formatting.web3Format(await helpers.token.wethBalanceOf(wallet, wallet.account)));
                } else {
                    setPairedTokenWalletBalance(helpers.formatting.web3Format(await helpers.token.balanceOf(wallet, marketMakingPool.paired_token, wallet.account, wallet.chainId)));
                }

                setBaseTokenWalletBalance(helpers.formatting.web3Format(await helpers.token.balanceOf(wallet, marketMakingPool.token, wallet.account, wallet.chainId)));
                const {
                    balanceInBaseToken,
                    balanceInPairedToken,
                } = await helpers.web3.marketMaker.fetchHoldersMapping(wallet, marketMakingPool.address, wallet.account);

                setAmountBaseTokenBalance(helpers.formatting.web3Format(balanceInBaseToken));
                setAmountPairTokenBalance(helpers.formatting.web3Format(balanceInPairedToken));
                setLoad(true);
            };
            initWalletConnected();
        }

    }, [marketMakingPool.address, marketMakingPool.paired_token, marketMakingPool.token, wallet]);


    const setMax = async (amount, setter) => {
        setter(amount);
    };


    const stakePairedToken = async () => {
        const wei = ethers.utils.parseEther(amountPairTokenToStake);
        let success;
        if (pairedTokenIsWeth) {
            success = await helpers.web3.marketMaker.stakePairedTokenInETH(wallet, marketMakingPool.address, wei);
        } else {
            success = await helpers.web3.marketMaker.stakePairedToken(wallet, marketMakingPool.address, wei);
        }
        setAmountPairTokenBalance(parseFloat(amountPairTokenBalance) + parseFloat(amountPairTokenToStake));
        ReactGA.event({
            category: "Funds",
            action: "Stake Pair Token",
            label: "Actions"
        });
    };

    const stakeBaseToken = async () => {
        const wei = ethers.utils.parseEther(amountBaseTokenToStake);
        await helpers.marketMaker.stake(wallet, marketMakingPool.address, wei);
        ReactGA.event({
            category: "Funds",
            action: "Deposit Base Token",
            label: "Actions"
        });
    };

    const withdrawPairToken = async () => {
        let full_withdrawal = parseFloat(amountPairTokenToWithdraw) === parseFloat(amountPairTokenBalance) && parseFloat(amountBaseTokenBalance) === 0;
        const wei = ethers.utils.parseEther(amountPairTokenToWithdraw);
        let success = await helpers.web3.marketMaker.withdrawPairToken(wallet, marketMakingPool.address, wei, full_withdrawal);
        ReactGA.event({
            category: "Funds",
            action: "Withdraw Pair Token",
            label: "Actions"
        });
    };

    const withdrawBaseToken = async () => {
        let full_withdrawal = parseFloat(amountBaseTokenToWithdraw) === parseFloat(amountBaseTokenBalance) && parseFloat(amountPairTokenBalance) === 0;
        const wei = ethers.utils.parseEther(amountBaseTokenToWithdraw);
        let success = await helpers.marketMaker.withdrawBaseToken(wallet, marketMakingPool.address, wei, full_withdrawal);
        ReactGA.event({
            category: "Funds",
            action: "Withdraw Base Token",
            label: "Actions"
        });
    };


    return !load ? <SkeletonDeposit/> : (

        <div className="flex flex-col gap-5">
            <Card>
                <KPIWrapper cols={4}>
                    <KPICard image={project.image} end={baseTokenWalletBalance} label={i18n.en.projects.slug.depositWithdraw.wallet}/>
                    <KPICard image={marketMakingPool.paired_token_image} end={pairedTokenWalletBalance}
                             label={i18n.en.projects.slug.depositWithdraw.wallet}/>
                    <KPICard image={project.image} end={amountBaseTokenBalance} label={i18n.en.projects.slug.depositWithdraw.contract}/>
                    <KPICard image={marketMakingPool.paired_token_image} end={amountPairTokenBalance}
                             label={i18n.en.projects.slug.depositWithdraw.contract}/>
                </KPIWrapper>
            </Card>
            <div className={'grid grid-cols-1 md-lg:grid-cols-2 gap-4'}>
                <Card title="Dashboard">
                    {/* Card Header */}
                    <div className=" card-content space-y-5 ">
                        <div className="space-y-2.5">
                            <div className="flex flex-row items-center justify-between text-base">
                                <div>
                                    {i18n.en.projects.slug.depositWithdraw.withdraw} {project.ticker}
                                </div>
                                <MaxButton
                                    balance={amountBaseTokenBalance}
                                    handleClick={() => setMax(amountBaseTokenBalance, setAmountBaseTokenToWithdraw)}
                                />
                            </div>
                            <InputWithIconSubmit
                                id="withdrawToken"
                                name="withdrawToken"
                                type="number"
                                placeholder="0"
                                submitName={i18n.en.projects.slug.depositWithdraw.withdraw}
                                image={project.image}
                                icon="fa-light fa-circle-minus"
                                value={amountBaseTokenToWithdraw}
                                setValue={setAmountBaseTokenToWithdraw}
                                submitFunction={withdrawBaseToken}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex flex-row items-center justify-between text-base">
                                <div>
                                    {i18n.en.projects.slug.depositWithdraw.withdraw} {marketMakingPool.paired_token_ticker}

                                </div>
                                <MaxButton
                                    balance={amountPairTokenBalance}
                                    handleClick={() => setMax(amountPairTokenBalance, setAmountPairTokenToWithdraw)}
                                />
                            </div>
                            <InputWithIconSubmit
                                id="withdrawCash"
                                name="withdrawCash"
                                type="number"
                                placeholder="0"
                                submitName={i18n.en.projects.slug.depositWithdraw.withdraw}
                                image={marketMakingPool.paired_token_image}
                                icon="fa-light fa-circle-minus"
                                value={amountPairTokenToWithdraw}
                                setValue={setAmountPairTokenToWithdraw}
                                submitFunction={withdrawPairToken}
                            />
                        </div>
                    </div>
                </Card>
                <Card title="Settings">
                    {/* Card Header */}
                    <div className="card-content space-y-5">

                        <div className="space-y-2.5">
                            <div className="flex flex-row items-center justify-between text-base">
                                <div>
                                    {i18n.en.projects.slug.depositWithdraw.deposit} {project.ticker}
                                </div>
                                <MaxButton
                                    balance={baseTokenWalletBalance}
                                    handleClick={() => setMax(baseTokenWalletBalance, setAmountBaseTokenToStake)}
                                />
                            </div>
                            <InputApproveWithIconSubmit
                                id="token"
                                name="token"
                                type="number"
                                icon="fa-light fa-circle-plus"
                                submitName={i18n.en.projects.slug.depositWithdraw.deposit}
                                placeholder="0"
                                image={project.image}
                                submitFunction={stakeBaseToken}
                                value={amountBaseTokenToStake}
                                setValue={setAmountBaseTokenToStake}
                                address={marketMakingPool.address}
                                token={marketMakingPool.token}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex flex-row items-center justify-between text-base">
                                <div>
                                    {i18n.en.projects.slug.depositWithdraw.deposit} {marketMakingPool.paired_token_ticker}
                                </div>
                                <MaxButton
                                    balance={pairedTokenWalletBalance}
                                    handleClick={() => setMax(pairedTokenWalletBalance, setAmountPairTokenToStake)}
                                />
                            </div>
                            <InputApproveWithIconSubmit
                                id="cash"
                                name="cash"
                                type="number"
                                icon="fa-light fa-circle-plus"
                                submitName={i18n.en.projects.slug.depositWithdraw.deposit}
                                placeholder="0"
                                submitFunction={stakePairedToken}
                                value={amountPairTokenToStake}
                                image={marketMakingPool.paired_token_image}
                                setValue={setAmountPairTokenToStake}
                                address={marketMakingPool.address}
                                token={marketMakingPool.paired_token}
                            />
                        </div>

                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <HomeCard
                    icon={<i className="fa-solid fa-circle-plus text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.releaseVesting}
                    content={i18n.en.projects.slug.depositWithdraw.releaseVestingDescriptipon}
                    handleClick={() => setTab(6)}
                />

                <HomeCard
                    icon={<i className="fa-solid fa-hands-holding-dollar text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.depositLpTokens}
                    content={i18n.en.projects.slug.depositWithdraw.depositLpTokensDescription}
                    handleClick={() => router.push('/farms')}
                />

                <HomeCard
                    icon={<i className="fa-solid fa-sack-dollar text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.stakeInVault}
                    content={i18n.en.projects.slug.depositWithdraw.stakeInVaultDescription}
                    handleClick={() => setTab(5)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <HomeCard
                    icon={<i className="fa-solid fa-circle-minus text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.withdrawLiquidity}
                    content={i18n.en.projects.slug.depositWithdraw.withdrawLiquidityDescription}
                    handleClick={() => setTab(4)}
                />

                <HomeCard
                    icon={<i className="fa-solid fa-hand-holding-dollar text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.withdrawLpTokens}
                    content={i18n.en.projects.slug.depositWithdraw.withdrawLpTokensDescription}
                    handleClick={() => router.push('/farms')}
                />

                <HomeCard
                    icon={<i className="fa-solid fa-face-tongue-money text-2xl text-indigo-500"></i>}
                    title={i18n.en.projects.slug.depositWithdraw.withdrawVaultRewards}
                    content={i18n.en.projects.slug.depositWithdraw.withdrawVaultRewardsDescription}
                    handleClick={() => setTab(5)}
                />
            </div>
        </div>
    )
}