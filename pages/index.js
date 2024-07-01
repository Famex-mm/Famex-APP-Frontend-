import * as React from "react";
import Image from "next/image";

// core components
import ButtonFit from "../src/components/core/Button/ButtonFit";

// page components
import HomeWrapper from "../src/components/pages/Home/HomeWrapper";
import HomeCard from "../src/components/pages/Home/HomeCard";
import HomeCheckMark from "../src/components/pages/Home/HomeCheckMark";

// SVG
import {APIReference, ArchitectureGuide, Installation, Plugins} from "../src/components/SVG";

import {usePageTitleContext} from "../src/context/PageTitleContext";
import {useRouter} from "next/router";
import Head from "next/head";
import {TITLE_PREFIX} from "../src/helpers/constants";
import ButtonGradientOutline from "../src/components/core/Button/ButtonGradientOutline";
import tw from "tailwind-styled-components";

export default function Home() {

    const router = useRouter();
    const {setTitle} = usePageTitleContext();

    React.useEffect(() => {
        setTitle("Get Started")
    }, [setTitle])

    return (
        <HomeWrapper>
            <Head>
                <title>{ TITLE_PREFIX }</title>
                <meta property="og:title" content={`${TITLE_PREFIX}`} key="title" />
            </Head>
            {/* header */}
            <div className="grid grid-cols-1 md-lg:grid-cols-2 rounded-xl  gap-5">
                <div className={'gradient-border-1 rounded-2xl !bg-center !bg-[length:150%] sm-md:!bg-[length:118%] lg:!bg-[length:103%] border-4'}>
                    <div  className="flex flex-col items-center justify-between gap-5">
                        <div className={'p-10 py-16 space-y-5'}>
                            <h1 className="text-sofia-pro text-2xl text-light-yellow-500 md-lg:text-3xl leading-[64px]">Decentralized Market Making</h1>
                                <p className={'text-bilo text-light-yellow-500'}>
                                    Market Making made for Web3. Take back control and earn rewards through Avatea’s decentralized market making platform.

                                </p>
                            <ul className={'mt-5 text-light-yellow-500'}>
                                <li>
                                    <i className="fa-light fa-circle-check"/> No monthly fees
                                </li>
                                <li>
                                    <i className="fa-light fa-circle-check"/> Multi chain
                                </li>
                                <li>
                                    <i className="fa-light fa-circle-check"/> Non-custodial
                                </li>
                            </ul>
                            <div className="md-lg:self-start ">
                                <ButtonGradientOutline name="Get Started" classNames="!h-12.5"/>
                            </div>
                        </div>


                    </div>

                </div>

                <div className={'gradient-border-2 rounded-2xl !bg-center  !bg-[length:150%] sm-md:!bg-[length:118%] lg:!bg-[length:103%] border-4'}>

                    <div  className="flex flex-col items-center justify-between gap-5">
                        <div className={'p-10 py-16 space-y-5'}>
                            <h1 className="text-sofia-pro text-2xl text-dark-blue-500 md-lg:text-3xl leading-[64px]">Vesting</h1>
                            <p className={'text-bilo text-dark-blue-500'}>
                                Successful vesting is one of the ways to ensure that team members, advisors and investors are aligned with the long-term success of the project.

                            </p>
                            <ul className={'mt-5  text-dark-blue-500'}>
                                <li>
                                    <i className="fa-light fa-circle-check"/> Free of charge
                                </li>
                                <li>
                                    <i className="fa-light fa-circle-check"/> Linear vesting
                                </li>
                                <li>
                                    <i className="fa-light fa-circle-check"/> Periodical vesting
                                </li>
                            </ul>
                            <div className="md-lg:self-start ">
                                <ButtonGradientOutline name="Get Started" classNames="!h-12.5 !text-dark-blue-500"/>
                            </div>
                        </div>


                    </div>

                </div>
                <div className={'gradient-border rounded-2xl bg-light-yellow-500'}>

                    <div  className="flex flex-col items-center justify-between gap-5">
                        <div className={'p-10 py-16 space-y-5'}>
                            <div className=" grow flex flex-row ">
                                {/* icon */}
                                <CardIcon>
                                    <i className={'fa-solid fa-chart-column fa-xl'}/>

                                </CardIcon>

                                {/* title */}
                                <div className={'mx-5 space-y-5'}>
                                    <h2 className="text-sofia-pro text-2xl text-dark-blue-500 md-lg:text-3xl leading-[64px]">Sustainable Trading
                                    </h2>
                                    {/* content */}
                                    <p className={'text-bilo text-dark-blue-500'}>
                                        Utilize Avatea’s algorithm to sustainably buy and sell tokens - utilizing limit orders, adaptive order sizing, slippage minimization, reduced price impact and automated arbitrage trading.
                                    </p>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={'gradient-border rounded-2xl bg-light-yellow-500'}>

                    <div  className="flex flex-col items-center justify-between gap-5">
                        <div className={'p-10 py-16 space-y-5'}>
                            <div className=" grow flex flex-row ">
                            {/* icon */}
                            <CardIcon>
                                <i className={'fa-solid fa-hand-holding-droplet fa-xl'}/>

                            </CardIcon>

                            {/* title */}
                            <div className={'mx-5 space-y-5'}>
                                <h2 className="text-sofia-pro text-2xl text-dark-blue-500 md-lg:text-3xl leading-[64px]">Liquidity Provision
                                </h2>
                                {/* content */}
                                <p className={'text-bilo text-dark-blue-500'}>
                                    As a project, boost your Liquidity Pool and as a user start earning LP rewards straight from the Avatea platform.
                                </p>

                            </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            {/*<div className="grid grid-cols-1 md-lg:grid-cols-2 rounded-xl p-5 bg-white gap-5">*/}
            {/*    <div className="flex flex-col items-center justify-between gap-5 md-lg:p-10">*/}
            {/*        <div>*/}
            {/*            <h1 className="text-4xl md-lg:text-5xl leading-[64px]">Sustainably trade, stake, and hold cryptocurrencies on Avatea</h1>*/}
            {/*            <p>*/}
            {/*                Avatea is committed to fostering the growth of Web3 applications by providing the infrastructure needed for Web3.*/}
            {/*            </p>*/}
            {/*        </div>*/}

            {/*        <div className="md-lg:self-start">*/}
            {/*            <ButtonFit name="Get Started" classNames="!h-12.5"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    <div className="relative md-lg:p-5">*/}
            {/*        <div className="absolute hidden md-lg:block top-0 left-0 z-10 h-full w-50"*/}
            {/*             style={{background: "linear-gradient(90deg,#fff,hsla(0,0%,100%,.98) 18.23%,hsla(0,0%,100%,.911052) 37.83%,hsla(0,0%,100%,.776042) 67.38%,hsla(0,0%,100%,0))"}}>*/}
            {/*        </div>*/}
            {/*        <div className="overflow-hidden">*/}
            {/*            <div className="w-[10000px]">*/}
            {/*                <div className="animate-marquee my-5 grow float-left">*/}
            {/*                    <Image src="/dapps.png" alt="" width="779" height="384" objectFit="cover"/>*/}
            {/*                </div>*/}
            {/*                <div className="animate-marquee my-5 grow float-left">*/}
            {/*                    <Image src="/dapps.png" alt="" width="779" height="384" objectFit="cover"/>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="absolute flex items-center justify-center inset-0">*/}
            {/*            <div className="p-10 rounded-full overflow-hidden backdrop-blur-md">*/}
            {/*                <ButtonFit name="Explore all projects" handleClick={() => router.push(`/projects`)}/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Developers */}
            {/*<div className="bg-indigo-500 text-white shadow-lg rounded-xl grid grid-cols-1 md-lg:grid-cols-2 md-lg:p-10 ">*/}
            {/*    /!* left *!/*/}
            {/*    <div className="max-w-lg flex flex-col h-full items-center md-lg:items-start justify-between p-5 gap-5">*/}
            {/*        <div>*/}
            {/*            <h2 className="mb-6 lg:mb-4 md:mb-4 sm:mb-4">*/}
            {/*                Built by developers, for developers*/}
            {/*            </h2>*/}
            {/*            <p className="body-md mb-5 md:mb-4 sm:mb-6 opacity-80">*/}
            {/*                Avatea combines the best of Ethereum and sovereign blockchains into a full-fledged multi-chain system.*/}
            {/*            </p>*/}

            {/*            <ul className="flex flex-col gap-4">*/}
            {/*                <li className="flex items-center opacity-80 gap-3">*/}
            {/*                    <div className="w-6 h-6">*/}
            {/*                        <HomeCheckMark/>*/}
            {/*                    </div>*/}
            {/*                    <span>It is able to fully benefit from Ethereum’s network effects</span>*/}
            {/*                </li>*/}
            {/*                <li className="flex items-center opacity-80 gap-3">*/}
            {/*                    <div className="w-6 h-6">*/}
            {/*                        <HomeCheckMark/>*/}
            {/*                    </div>*/}
            {/*                    <span>It is inherently more secure</span>*/}
            {/*                </li>*/}
            {/*                <li className="flex items-center opacity-80 gap-3">*/}
            {/*                    <div className="w-6 h-6">*/}
            {/*                        <HomeCheckMark/>*/}
            {/*                    </div>*/}
            {/*                    <span>It is more open and powerful</span>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}

            {/*        <div className="flex items-center w-fit h-12.5 justify-center py-4 px-7.5 bg-white text-black rounded-full hover:cursor-pointer">*/}
            {/*            Get Started*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*    /!* right *!/*/}
            {/*    <div className="flex justify-center md-lg:justify-end">*/}
            {/*        <Image src="/developer.png" alt="developer" width={550} height={350} objectFit="contain"/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* features */}
            <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-5">
                <HomeCard handleClick={() => router.push('projects')} icon={Installation} title="Projects" content="Visit our overview of projects which are utilizing the Avatea protocol.">
                    <i className={'fa-solid fa-diagram-project fa-xl'}/>
                </HomeCard>
                <HomeCard handleClick={() => router.push('coming-soon')} icon={ArchitectureGuide} title="Upcoming Projects" content="Visit our overview of projects which will launch soon on the Avatea platform.">
                    <i className={'fa-solid fa-rocket-launch fa-xl'}/>
                </HomeCard>

                <HomeCard handleClick={() => router.push('/dashboard')} icon={Plugins} title="Dashboard" content="Overview of your projects where you are active in and the transactions you have executed.">
                    <i className={'fa-solid fa-chart-area fa-xl'}/>
                </HomeCard>
                <HomeCard handleClick={() => router.push('/farms')} icon={APIReference} title="Farms" content="Overview of the projects which have enabled the liquidity farms.">
                    <i className={'fa-solid fa-farm fa-xl'}/>
                </HomeCard>
            </div>
        </HomeWrapper>
    );
}
const CardIcon = tw.div`
    flex
    w-8
    h-8
    p-2
    rounded-md
    bg-gradient-to-r
    from-[#6EE0FF]
    to-[#FFDE99]
    md:w-11
    md:h-11
    items-center
    justify-center
`;