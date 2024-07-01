import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useWallet} from "@albs1/use-wallet";
import {useRouter} from "next/router";
import {motion} from "framer-motion";
import i18n from '../../src/i18n/index.json';
const tabItemsi18n = i18n.en.projects.slug.tabItems;
import helpers from "../../src/helpers";
import networks from "../../src/network/network.json";

// core components
import Tab from "../../src/components/core/Tab/Tab";

// project detail components
import Banner from "../../src/components/pages/projectDetail/Banner/Banner";
import Vault from "../../src/components/pages/projects/Vault";
import MarketMaking from "../../src/components/pages/projects/MarketMaking";
import Vesting from "../../src/components/pages/projects/Vesting";
import Liquidity from "../../src/components/pages/projects/LiquidityMaker";
import Info from "../../src/components/pages/projects/Info";
import {usePageTitleContext} from '../../src/context/PageTitleContext';
import ConnectYourWallet from "../../src/components/core/ConnectYourWallet";
import Deposit from "../../src/components/pages/projects/Deposit";
import Head from "next/head";
import {DEFAULT_CHAIN_ID, TITLE_PREFIX} from "../../src/helpers/constants";
import ComingSoon from "../../src/components/core/ComingSoon";
import SwitchBlock from "../../src/components/core/SwitchBlock";
import Tokenomics from "../../src/components/pages/projects/Tokenomics";
import DisabledTabItem from "../../src/components/core/Tab/DisabledTabItem";
import TabItem from "../../src/components/core/Tab/TabItem";

const tabItems = [tabItemsi18n.info, tabItemsi18n.depositWithdraw, tabItemsi18n.sustainableTrading, tabItemsi18n.liquidity, tabItemsi18n.vault, tabItemsi18n.vesting,'Tokenomics'];

export default function ProjectDetail(props) {
    //@Todo add min buy limit and max buy limit fields (stop-loss)
    const {setTitle} = usePageTitleContext();

    const wallet = useWallet();
    const router = useRouter();
    const {slug} = router.query;
    const [project, setProject] = useState({});
    const [userData, setUserData] = useState([]);
    const [vault, setVault] = useState({});
    const [mainChainId, setMainChainId] = useState();
    const [marketMakingPool, setMarketMakingPool] = useState({});
    const [liquidityMaker, setLiquidityMaker] = useState({})
    const [tab, setTab] = useState(0); // 0 - Vault(News), 1 - Market Making, 2 - Vesting
    const tabRef = useRef(null);

    const fetchProject = async (fetchChainId = true) => {
        const result = await helpers.project.getProject(slug,mainChainId ? mainChainId : DEFAULT_CHAIN_ID);
        setMarketMakingPool(result?.marketMakingPool);
        setVault(result?.vault);
        setLiquidityMaker(result?.liquidityMaker)
        if(fetchChainId) setMainChainId(result?.mainChainId)
    };

    useEffect(() => {
        setTitle("Project Detail");
        if (props.projectDetail) setProject(props.projectDetail);
        if (props.marketMakingPool) setMarketMakingPool(props.marketMakingPool);
        if (props.vault) setVault(props.vault);
        if (props.liquidityMaker) setLiquidityMaker(props.liquidityMaker);
        if (props.mainChainId) setMainChainId(props.mainChainId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props, slug]);
    }, []);
    //
    useEffect( () => {
        fetchProject(false)
    },[mainChainId])

    useEffect(() => {
        //@TODO Error handling if empty market making pool or vault
        if (Object.keys(project).length !== 0) {
            fetchProject();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project]);


    useEffect(() => {
        if (wallet.status === "connected") {
            const initWalletConnected = async () => {
                let {data} = await helpers.user.userProjectData(wallet, slug)
                setUserData(data);
            };
            initWalletConnected();
        }
    }, [wallet, project, slug]);

    useEffect(() => {
        const onHashChangeStart = (url) => {
            setTab(parseInt(url.split('#')[1]));
        };

        router.events.on("hashChangeStart", onHashChangeStart);

        return () => {
            router.events.off("hashChangeStart", onHashChangeStart);
        };
    }, [router.events]);

    useEffect(() => {
        setTab(parseInt(router.asPath.search('#') === -1 ? 0 : router.asPath.split('#')[1]));
    }, [router.asPath])

    const changeChainId = (targetId) => {
        setMainChainId(targetId)
    }

    return (
        <motion.div initial={{opacity: 0}} transition={{duration: .7}} animate={{opacity: 1}}
                    className="space-y-7.5 pb-10 bg-[#FFFFF5]/50 rounded-2.5xl">
            <Head>
                <title>{project.name} | { TITLE_PREFIX }</title>
                <meta property="og:title" content={`${project.name} | ${TITLE_PREFIX}`} key="title" />
            </Head>
            <Banner {...project} chainId={mainChainId} />
            {
                project.networks?.length > 1 &&
                    <div className="flex justify-center">
                        <span
                            className="flex flex-row items-center rounded-[24px] p-2 space-x-2 overflow-scroll scrollbar-none"
                        >
                        {project.networks?.map(network =>
                        <div key={network} onClick={()=> changeChainId(network)}>
                            <div></div>

                                 <div
                                     className={
                                         mainChainId == network
                                             ? "flex  items-center  rounded-[20px] whitespace-nowrap px-5 py-3 bg-[#CCCAB2] text-black hover:cursor-pointer transition"
                                             : "flex items-center  rounded-[20px] whitespace-nowrap px-5 py-3 bg-gray-100 hover:cursor-pointer transition"
                                     }
                                 >
                                     {mainChainId == network &&
                                         <span className="flex mr-1.5 h-3 w-3 relative place-content-center justify-center">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                                     }
                                     <img src={networks.find(key => {
                                         return key.chainId == network
                                     }).icon} alt="network" width={20} height={20} className={'pr-1'} />

                                     {networks.find(key => {
                                         return key.chainId == network
                                     }).displayName}
                                 </div>

                        </div>)
                        }
                        </span>
                    </div>
            }
            {/* Tab menu */}
            {marketMakingPool?.id &&
                <div ref={tabRef} className="flex justify-center">
                    <Tab items={tabItems} tab={tab} setTab={setTab} userData={userData} liquidity={project?.liquidity}
                         vault={project?.vault} tokenomics={project?.data?.tokenomics}/>
                </div>
            }

            {tab === 0 &&
                <div className="px-9 min-h-[800px] md-lg:min-h-[500px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <Info
                            project={project}
                            marketMakingPool={marketMakingPool}
                            liquidityMaker={liquidityMaker}
                            setTab={setTab}
                            mainChainId={mainChainId}
                        />
                    </motion.div>
                </div>
            }
            {tab === 1 &&
                <div className="px-9 min-h-[800px] md-lg:min-h-[550px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <>
                            {
                                wallet.status === "connected" ? (mainChainId == wallet.chainId ?
                                    <Deposit
                                        wallet={wallet}
                                        marketMakingPool={marketMakingPool}
                                        project={project}
                                        setTab={setTab}
                                    /> : <SwitchBlock targetChainId={mainChainId}/>
                                ) : <ConnectYourWallet/>
                            }
                        </>
                    </motion.div>
                </div>
            }

            {tab === 2 &&
                <div className="px-9 min-h-[800px] md-lg:min-h-[480px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <>
                            {
                                wallet.status === "connected" ? (mainChainId == wallet.chainId ?
                                    <MarketMaking
                                        wallet={wallet}
                                        marketMakingPool={marketMakingPool}
                                        project={project}
                                    /> : <SwitchBlock targetChainId={mainChainId}/>
                                ) : <ConnectYourWallet/>
                            }
                        </>
                    </motion.div>
                </div>
            }

            {tab === 3 &&
                <div className="px-9 min-h-[500px] md-lg:min-h-[625px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                            {
                                wallet.status === "connected" ? (mainChainId == wallet.chainId ?
                                    <Liquidity
                                        wallet={wallet}
                                        project={project}
                                        marketMakingPool={marketMakingPool}
                                        liquidityMaker={liquidityMaker}
                                    /> : <SwitchBlock targetChainId={mainChainId}/>
                                ) : <ConnectYourWallet/>
                            }
                    </motion.div>
                </div>
            }
            {tab === 4 &&
                <div className="px-9 min-h-[550px] md-lg:min-h-[350px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <>
                            {
                                wallet.status === "connected" ? (mainChainId == wallet.chainId ?
                                        <Vault
                                        vault={vault}
                                        wallet={wallet}
                                        project={project}
                                        setTab={setTab}
                                    /> : <SwitchBlock targetChainId={mainChainId}/>
                                ) : <ConnectYourWallet/>
                            }
                        </>
                    </motion.div>
                </div>
            }
            {tab === 5 &&
                <div className="px-9 md-lg:min-h-[500px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <>
                            {
                                wallet.status === "connected" ? (
                                    mainChainId == wallet.chainId ? <Vesting
                                        wallet={wallet}
                                        marketMakingPool={marketMakingPool}
                                        project={project}
                                        setTab={setTab}
                                    /> : <SwitchBlock targetChainId={mainChainId}/>
                                ) : <ConnectYourWallet/>
                            }
                        </>
                    </motion.div>
                </div>
            }
            {tab === 6 &&
                <div className="px-9 md-lg:min-h-[500px]">
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{duration: 0.5}}>
                        <Tokenomics
                            project={project}
                            mainChainId={mainChainId}
                        />
                    </motion.div>
                </div>
            }
        </motion.div>
    );
}

export async function getServerSideProps(context) {
    return await helpers.project.getProjectServerSide(context);
}
