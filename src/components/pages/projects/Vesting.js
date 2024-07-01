import {useEffect, useState} from "react";
import Image from "next/image";
import helpers from "../../../helpers";
import i18n from '../../../i18n/index.json';
// core components
import Button from "../../core/Button/Button";
import CenteredContent from "../../core/CenteredContent";

// project detail components
import Card from "../projectDetail/Card/Card";
import {VestingChart} from "./Charts/VestingChart";
import SkeletonVesting from "./Skeleton/SkeletonVesting";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import KPIWrapper from "../../core/KPIWrapper";
import KPICard from "../../core/KPICard";

export default function Vesting({
                                    wallet,
                                    project,
                                    marketMakingPool,
                                    setAction,
                                    userAddress,
                                    setTab
                                }) {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [releaseAbleAmount, setReleaseAbleAmount] = useState(0);
    const [amountVested, setAmountVested] = useState(0);
    const [amountReleased, setAmountReleased] = useState(0);
    const [cliff, setCliff] = useState("0");
    const [start, setStart] = useState("0");
    const [duration, setDuration] = useState("0");
    const [revocable, setRevocable] = useState(false);
    const [releasable, setReleasable] = useState(false);
    const [slicePeriodSeconds, setSlicePeriodSeconds] = useState("0");
    const [load, setLoad] = useState(false);


    useEffect(() => {

        if (
            wallet.status === "connected" &&
            marketMakingPool.paired_token
        ) {
            const initWalletConnected = async () => {
                const {
                    amountVested,
                    released,
                    cliff,
                    start,
                    duration,
                    slicePeriodSeconds,
                    revocable,
                    allowReleasing
                } = await helpers.web3.marketMaker.fetchHoldersVestingMapping(wallet, marketMakingPool.address, (userAddress ? userAddress : wallet.account));

                setReleaseAbleAmount(
                    helpers.formatting.web3Format(
                        await helpers.web3.marketMaker.computeReleasableAmount(
                            wallet,
                            marketMakingPool.address,
                            userAddress ? userAddress : wallet.account
                        )
                    )
                );

                setAmountReleased(helpers.formatting.web3Format(released));
                setAmountVested(helpers.formatting.web3Format(amountVested));
                setCliff(cliff);
                setStart(start);
                setDuration(duration);
                setSlicePeriodSeconds(slicePeriodSeconds);
                setRevocable(revocable);
                setReleasable(allowReleasing);
                setLoad(true)
            };
            initWalletConnected();
        }
    }, [wallet, marketMakingPool]);

    const releaseVesting = async () => {
        let full_withdrawal =
            parseFloat(amountVested) ===
            parseFloat(amountReleased) + parseFloat(releaseAbleAmount);
        await helpers.marketMaker.release(
            wallet,
            marketMakingPool.address,
            full_withdrawal
        );
    };

    const revokeVesting = async () => {
        setIsLoading(true);
        Swal.fire({
            title: 'Read before proceeding',
            text: "The revoke action can not be reverted, proceed with caution.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, revoke'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.close();
                try {
                    await helpers.marketMaker.revoke(
                        wallet,
                        marketMakingPool.address,
                        userAddress
                    );
                    router.back();
                    setIsLoading(false)
                } catch (e) {
                    console.log(e);
                    setIsLoading(false)
                }

            }
        })

    };

    const toggleAutoRelease = async () => {
        await helpers.marketMaker.setAllowReleasing(
            wallet,
            marketMakingPool.address,
            !releasable
        );
        setReleasable(!releasable);
    };

    if (amountVested === '0.00') return (
        <CenteredContent>
            <span className={'text-2xl'}>{i18n.en.projects.slug.vesting.noVestingAvailable}</span>
            <div className={'w-[70%] mx-auto'}>
                <Image src={'/red-flag.png'} alt="noImage" layout={'responsive'} height={672} width={1030}/>
            </div>
            <Button handleClick={() => setTab(0)}>{i18n.en.projects.slug.vesting.returnToProject}</Button>
        </CenteredContent>
    );

    return !load && amountVested !== '0.00' ? <SkeletonVesting/> : (
        <div className="flex flex-col gap-5 max-w-[700px] lg:max-w-[1100px] mx-auto">
            <Card>
                <KPIWrapper cols={4}>
                    <KPICard image={project.image} end={amountVested} label={i18n.en.projects.slug.vesting.vested}/>
                    <KPICard image={project.image} end={amountReleased} label={i18n.en.projects.slug.vesting.released}/>
                    <KPICard image={project.image} end={releaseAbleAmount} label={i18n.en.projects.slug.vesting.releasable}/>
                    <KPICard image={project.image} postFix={revocable ? i18n.en.projects.slug.vesting.yes : i18n.en.projects.slug.vesting.no} label={i18n.en.projects.slug.vesting.revocable}/>
                </KPIWrapper>
            </Card>
            <Card>
                <div className="vesting-header">
                    <h1 className="text-2xl">
                        <i className="fa-solid fa-unlock"></i> {i18n.en.projects.slug.vesting.vesting}
                    </h1>

                    <div className="flex flex-row justify-center py-5.5 space-y-4.5 ">
                    </div>
                </div>
                <VestingChart
                    amountVested={amountVested}
                    cliff={cliff}
                    start={start}
                    duration={duration}
                    slicePeriodSeconds={slicePeriodSeconds}
                    ticker={project.ticker}
                />
                <div className="pt-9">
                    <div className="flex flex-row space-x-5">

                        {(setAction === 'revoke' && revocable) &&
                            <Button name={i18n.en.projects.slug.vesting.revokeTokens} handleClick={revokeVesting} isLoading={isLoading}
                                    disabled={isLoading}>
                                {" "}
                                <i className=" pl-2 fa-solid fa-arrow-down-to-arc"/>
                            </Button>
                        }
                        {(setAction !== 'revoke') &&
                            <Button name={i18n.en.projects.slug.vesting.releaseTokens} handleClick={releaseVesting}>
                                {" "}
                                <i className=" pl-2 fa-solid fa-arrow-down-to-arc"/>
                            </Button>
                        }

                        {(releasable && setAction === 'revoke') &&
                            <Button name={`${i18n.en.projects.slug.vesting.autoReleaseEnabled} `} disabled={true}/>
                        }
                        {(releasable && setAction !== 'revoke') &&
                            <Button name={`${i18n.en.projects.slug.vesting.disableAutoRelease} `} handleClick={toggleAutoRelease}/>
                        }
                        {(!releasable && setAction === 'revoke') &&
                            <Button name={`${i18n.en.projects.slug.vesting.autoReleaseDisabled} `} disabled={true}/>
                        }
                        {(!releasable && setAction !== 'revoke') &&
                            <Button name={`${i18n.en.projects.slug.vesting.enableAutoRelease} `} handleClick={toggleAutoRelease}/>
                        }

                    </div>
                </div>
            </Card>
        </div>
    );
}
