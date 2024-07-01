import {useEffect, useState} from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import helpers from "../../../helpers";
import i18n from '../../../i18n/index.json';

// core components
import KPIWrapper from "../../core/KPIWrapper";
import KPICard from "../../core/KPICard";

// page components
import Card from "../projectDetail/Card/Card";
import Feed from "../projectDetail/Feed/Feed";
import PriceAreaChart from "./Charts/PriceAreaChart";
import {useWallet} from "@albs1/use-wallet";
import {ethers} from "ethers";
import dynamic from "next/dynamic";
import DonutTokenomics from "./Charts/DonutTokenomics";



export default function Tokenomics({project}) {
    const [tokenomicsData,setTokenomicsData] = useState()

    useEffect(() => {
        const fetchTokenomics = async () => {
            if (project.slug) {
                setTokenomicsData(
                    await helpers.project.getTokenomics(project)
                );
            }
        };
        fetchTokenomics();
    }, [project]);

    console.log(tokenomicsData)


    return (
        // <div className="grid grid-cols-1 md-lg:grid-cols-2 gap-7.5 max-w-[900px] lg:max-w-[1000px] mx-auto">
        <div className="flex flex-col gap-5">

            <div className="grid grid-cols-1 md-lg:grid-cols-3 gap-5">
                <Card title="Project Info">
                    {/* Card Header */}
                    <div className="card-header">
                        <div className={'relative bg-gradient-to-r from-[#6EE0FF] to-[#FFDE99] font-semibold text-lg leading-8 w-fit pb-[1px] md:text-2xl'}>
                            <h1 className="text-2xl bg-white">Token Summary</h1>
                        </div>
                    </div>

                    <div className="card-content pt-5.5">
                        <table className="table-auto w-full">
                            <thead className={'text-left'}>
                            <tr>
                                <th>Round</th>
                                <th>Tokens</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tokenomicsData?.map((tokenomicData,i) => {
                                    return <tr key={i}>
                                        <td>{tokenomicData.label}</td>
                                        <td>{tokenomicData.tokens}</td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>

                    </div>
                </Card>
                <div className={'md-lg:col-span-2'}>
                    <Card title="Project Info">
                        {/* Card Header */}
                        <div className="card-header">
                            <div className={'relative bg-gradient-to-r from-[#6EE0FF] to-[#FFDE99] font-semibold text-lg leading-8 w-fit pb-[1px] md:text-2xl'}>
                                <h1 className="text-2xl bg-white">Token distribution</h1>
                            </div>
                        </div>

                        <div className="card-content pt-5.5">
                            <div className="break-all">
                                <DonutTokenomics tokenomicsData={tokenomicsData}/>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>



        </div>
    )
}