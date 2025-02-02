import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {useWallet} from "@albs1/use-wallet";
import {useRouter} from "next/router";
import { motion } from "framer-motion";
import i18n from '../../../src/i18n/index.json';

// core components
import Button from "../../../src/components/core/Button/Button";
import Tab from "../../../src/components/core/Tab/Tab";

// project detail components
import Banner from "../../../src/components/pages/projectDetail/Banner/Banner";
import Card from "../../../src/components/pages/projectDetail/Card/Card";

// social icons without background
import helper from "../../../src/helpers";
import VaultCard from "../../../src/components/pages/management/VaultCard";
import MarketMakingCard from "../../../src/components/pages/management/MarketMakingCard";
import ManageProjectCard from "../../../src/components/pages/management/ManageProjectCard";
import LiquidityMakerCard from "../../../src/components/pages/management/LiquidityMakerCard";
import ManagementAuthentication from "../../../src/components/pages/management/ManagementAuthentication";

import { usePageTitleContext } from "../../../src/context/PageTitleContext";
import Head from "next/head";
import {TITLE_PREFIX} from "../../../src/helpers/constants";

const tabItems = ["Manage Project", "Market Making Pool","Liquidity Maker","Vault"];

export default function ManagementIndex(props) {
    const wallet = useWallet();
    const router = useRouter();
    const { setTitle } = usePageTitleContext();
    
    const { slug } = router.query;
    const [project, setProject] = React.useState({});
    const [vault, setVault] = useState({});
    const [marketMakingPool, setMarketMakingPool] = useState({});
    const [liquidityMaker, setLiquidityMaker] = useState({});
    const [mainChainId, setMainChainId] = useState();
    const [tab, setTab] = useState(0);
    const tabRef = useRef();

    useEffect(() => {
        setTitle("Project Management")
        if (props.projectDetail) setProject(props.projectDetail);
        if (props.marketMakingPool) setMarketMakingPool(props.marketMakingPool);
        if (props.vault) setVault(props.vault);
        if (props.liquidityMaker) setLiquidityMaker(props.liquidityMaker);
        if (props.mainChainId) setMainChainId(props.mainChainId);
        else {
            const fetchProject = async () => {
                const result = await helper.project.getProject(slug);
                setProject(result?.project);
                setMarketMakingPool(result?.marketMakingPool);
                setVault(result?.vault);
                setLiquidityMaker(result?.liquidityMaker);
                setMainChainId(result?.mainChainId);
            };
            fetchProject();
        }
    }, [props, setTitle, slug]);

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
    
    return (
        <>
            <Head>
                <title>{project.name} | Management</title>
                <meta property="og:title" content={`${project.name} | ${TITLE_PREFIX}`} key="title" />
                <meta name="robots" content="noindex" />
            </Head>
            <ManagementAuthentication wallet={wallet} project={project}>
                <div className="space-y-7.5">
                    <Banner {...project} chainId={mainChainId} />
                    {/* Tab menu */}
                    <div ref={tabRef} className="flex justify-center">
                        <Tab items={tabItems} tab={tab} setTab={setTab}/>
                    </div>

                    {!project.signed_contract ? (
                        <Card>
                            <div className="card-header mb-5 text-center">
                                <h1 className="text-2xl mb-2.5">
                                    {i18n.en.management.pending.title}
                                </h1>
                                <p className={'text-small'}>
                                    {i18n.en.management.pending.message}
                                </p>
                            </div>
                            <div className="w-full space-y-3.75">
                                {/* Edit Button */}
                                <Button name="Contact support"/>
                            </div>
                        </Card>
                    ) : (
                        <>
                            {tab === 0 &&
                                <div className="min-h-[370px]">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                        <ManageProjectCard project={project} vault={vault}/>
                                    </motion.div>
                                </div>
                            }
                            {tab === 1 &&
                                <div className="min-h-[770px]">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                        <MarketMakingCard mainChainId={mainChainId} project={project} marketMakingPool={marketMakingPool}/>
                                    </motion.div>
                                </div>
                            }
                            {tab === 2 &&
                                <div className="min-h-[770px]">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                        <LiquidityMakerCard mainChainId={mainChainId} liquidityMaker={liquidityMaker} project={project}/>
                                    </motion.div>
                                </div>
                            }
                            {tab === 3 &&
                                <div className="min-h-[360px]">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
                                        <VaultCard mainChainId={mainChainId} vault={vault} project={project}/>
                                    </motion.div>
                                </div>
                            }
                        </>
                    )}
                </div>
            </ManagementAuthentication>

        </>
    );
}

export async function getServerSideProps(context) {
    return await helper.project.getProjectServerSide(context);
}
