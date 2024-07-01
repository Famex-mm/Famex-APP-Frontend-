/* eslint-disable @next/next/no-img-element */
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion"

// core components
import Spinner from "../../../core/Spinner";
import {useWallet} from "@albs1/use-wallet";
import networks from "../../../../network/network.json";
import dynamic from "next/dynamic";
import helpers from "../../../../helpers";
const ReactTooltip = dynamic(() => import('react-tooltip'), {ssr: false});


export default function CardItem(props) {
    const wallet = useWallet();
    const socials = Object.entries(
        Object.fromEntries(
            Object.entries(props).filter(([key]) => key.includes("social_"))
        )
    );

    const checkAdmin = (address) => {
        return props?.admin.includes(address)
    }



    const mapSocials = () => {
        return socials.map((social) => {
            if (social[1]) {
                return (
                    <a
                        key={social[0]}
                        href={social[1]}
                        target={"_blank"}
                        rel={"noReferrer"}
                    >
                        <div className={'flex items-center justify-center w-8 h-8 rounded-md bg-[#2a2f43]'}>
                            <i
                                className={`text-white text-base fa-brands fa-${social[0].replace(
                                    "social_",
                                    ""
                                )}`}
                            />
                        </div>
                    </a>
                );
            }
        });
    };

    return (
        <div className="relative rounded-2.5xl bg-light-yellow-500 overflow-hidden transition hover:shadow-[0_5px_10px_rgba(0,0,0,0.2)]">
            <ReactTooltip/>
            <CardImage image={props.banner} id={props.slug}/>
            <div className="absolute flex items-center justify-center top-2 right-2 gap-2">
                {(wallet.status === "connected" && props?.admin && checkAdmin(wallet.account)) &&
                    <Link href={`management/${props.slug}`}>
                        <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl hover:cursor-pointer">
                            <motion.span className="w-5 h-5" whileHover={{rotate: 90}}>
                                <i className="fa-regular fa-gear text-white text-xl"/>
                            </motion.span>
                        </div>
                    </Link>
                }
                {
                    props?.networks?.length === 0 ? "" :
                            <div className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-xl">

                                <Image data-tip={helpers.web3.network.getNetworkName(props.networks[0])} src={`${helpers.web3.network.getNetworkImage(props.networks[0])}`} alt={helpers.web3.network.getNetworkName(props.networks[0])} width={20} height={20}
                                       objectFit="contain"/>
                            </div>
                }

            </div>
            <div className="relative py-7.5 px-16">
                <div className="absolute p-2 -top-9 flex bg-white items-center justify-center w-14 h-14 shadow-xl rounded">
                    <Image className={'rounded'} src={props.image} alt={props.slug} width={40} height={40}/>
                </div>
                <div className="mt-4 overflow-hidden text-ellipsis font-medium font-bilo text-xl">
                    {props.name}
                </div>
                <div className="flex items-center justify-center space-x-3 my-10">
                    {mapSocials()}
                </div>
                {
                    props.disableDetails ? "" : <div className={'grid grid-cols-2 gap-10'}>


                        <div className="flex items-center justify-center mb-2.5">
                            <div className="text-sm text-right text-black">
                                <a href={props.website} target={"_blank"} rel={"noReferrer"} className={'flex items-center'}>
                                    <i className="fa-regular fa-globe text-[17px]"></i> <span className={'ml-2 font-sofia'}>Website</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center justify-center mb-2.5">
                            <div className="text-sm text-right text-indigo-500">
                                <a href={props.whitepaper} target={"_blank"} rel={"noReferrer"} className={'flex items-center'}>
                                    <i className="fa-solid fa-file text-[17px]"/> <span className={'ml-2 font-sofia'}>Whitepaper</span>
                                </a>
                            </div>
                        </div>

                    </div>
                }
                {
                    props.management ? <Link href={`/management/${props.slug}`}>
                        <a className="block py-2.5 mt-5 w-full bg-indigo-500 text-white text-center rounded-full hover:bg-indigo-500/80 transition">
                            Manage Project
                        </a>
                    </Link> : props.comingSoon? '':<Link href={`/projects/${props.slug}`}>
                        <a className=" font-bilo font-medium block py-2.5 mt-5  bg-contain bg-center bg-no-repeat bg-gradient-button text-indigo-500 text-center transition text-lg">
                            View Project
                        </a>
                    </Link>
                }
            </div>
        </div>
    );
}

export const CardImage = (props) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleImageLoad = (event) => {
        const target = event.target;
        if (target.complete) {
            setTimeout(() => setImgLoaded(true), 500);
        }
    };

    return (
        <div className={`relative flex flex-col w-full justify-center bg-white`}>
            {!imgLoaded && (
                <div className="absolute flex w-full justify-center"><Spinner size={5}/></div>
            )}
            <Image
                src={props.image}
                alt={props.slug}
                onLoad={handleImageLoad}
                className={`w-full ${!imgLoaded && 'opacity-0'}`}
                layout="responsive"
                width="100%"
                height={50}
            />
        </div>
    );
};