import React, { useCallback } from "react";
import moment from 'moment';
import stc from 'string-to-color'

import TableCol from "../../../core/table/TableCol";
import Image from "next/image";

const TRANSACTION_TYPES = {
    'VW': 'Vault Withdrawal', // Done
    'VR': 'Vault Rewards', // Done
    'VA': 'Vault Reward Adding', // Done
    'LMW': 'Liquidity Maker Withdrawal', // Done
    'LMD': 'Liquidity Maker LP Deposit',
    'MMBD': 'Market Making Base Deposit', // Done
    'MMPD': 'Market Making Paired Deposit', // Done
    'MMVD': 'Market Making Vesting Deposit', // Done
    'MMVR': 'Market Making Vesting Release', // Done
    'MMBW': 'Market Making Base Withdrawal', // Done
    'MMPW': 'Market Making Paired Withdrawal', // Done
    'MMCD': 'Market Making Contract Deployment', // Done
    'MMAS': 'Market Making Allow Selling', // Done
    'MMBR': 'Market Making Base Staking Ratio', // Done
    'MMBB': 'Market Making Base Batch',
    'MMVA': 'Market Making Vesting Automated Release',
    'AR': 'Avatea Rewards',
    'VD': 'Vault Deposit',
    'VE': 'Vault Exit',
    'MMSC': 'Market Making Settings Change',
    'MMRT': 'Market Making Revoke Tokens',
    'MMAR': 'Market Making Allow Releasing',
    'MMPR': 'Market Making Paired Staking Ratio',
    'LMR': 'Liquidity Maker Rewards Claiming',
    'LMC': 'Liquidity Maker Liquidity Compound',
    'LME': 'Liquidity Maker Exit',
    'LMA': 'Liquidity Maker Reward Adding',
    'LMB': 'Liquidity Maker Base Deposit',
    'LMP': 'Liquidity Maker Paired Deposit',
    'LML': 'Liquidity Maker Liquidity Reward Adding'
}

const CheckMark = () => {
    return <i className="fa-regular fa-check"></i>
}

const DoubleCheckMark = () => {
    return <i className="fa-regular fa-check-double"></i>
}

const CircularProgressBar = (props) => {
    return (
        <div className="relative flex w-fit items-center">
            <svg className="w-7 h-7">
                <circle className="text-gray-300" strokeWidth="2" stroke="currentColor" fill="transparent" r="10" cx="14" cy="14"></circle>
                <circle className={`${props.color}`} strokeWidth="2" strokeDasharray={10 * 2 * Math.PI} strokeDashoffset={10 * 2 * Math.PI - (props.percent / 100) * 10 * 2 * Math.PI} strokeLinecap="round" stroke="currentColor" fill="transparent" r="10" cx="14" cy="14"></circle>

                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={10} fill={`${props.fill}`}>{props.label}</text>
            </svg>
        </div>
    )
}

function parseValue(value, type) {
    if (["MMBR", "MMPR"].includes(type)) {
        value = <CircularProgressBar percent={value} label={value} color="text-sky-500" fill="#0ea5e9" />
    }
    if (["MMAS", "MMAR"].includes(type)) {
        value = value === 'true' ? <CircularProgressBar percent={100} label="✓" color="text-green-500" fill="#22c55e" /> : <CircularProgressBar percent={100} label="-" color="text-red-500" fill="#ef4444" />
    }
    return value
}

export default function TransactionItem(props) {
    const shortenAddress = useCallback((address) => {
        return address != null
          ? `${address.slice(0, 6)}...${address.slice(
              address.length - 4,
              address.length
            )}`
          : "";
    },[]);


    return (
        // <div className="grid grid-cols-12 items-center w-full p-2">
        //     <TableCol className="truncate col-span-4 font-medium text-base tracking-[.0125rem]">
        //         <div className={`inline-block px-3 py-2 rounded-full border-2 border-opacity-50 border-gray-300 text-black hover:bg-gray-300 delay-150 transition-all hover:border-opacity-100 hover:cursor-pointer text-center`}>
        //             <div className="hidden md-lg:flex items-center gap-2 text-sm leading-none">
        //                 {props.image ?
        //                     <Image src={props.image} alt="" width={16} height={16}/>
        //                     : ''
        //                 }
        //                 {TRANSACTION_TYPES[props.type]}
        //             </div>
        //             <p className="md-lg:hidden text-sm leading-none">{props.type}</p>
        //         </div>
        //     </TableCol>
        //     <TableCol className="truncate col-span-3 font-medium text-base tracking-[.0125rem]">
        //         <small>
        //             <i className="fa-solid fa-timer mr-1"></i>
        //             <span className="hidden md-lg:inline-block">{moment(props.timestamp).format('llll')}</span>
        //             <span className="md-lg:hidden">{moment(props.timestamp).fromNow()}</span>
        //         </small>
        //     </TableCol>
        //     <TableCol className="col-span-4 flex justify-center md-lg:justify-start font-medium text-base tracking-[.0125rem] text-white">
        //         <div className={`text-slate-600 text-sm`}>
        //             {props.amount > 0 ? props.amount :
        //                 parseValue(props.value, props.type)
        //             }
        //         </div>
        //     </TableCol>
        //     <TableCol className="col-span-1 flex items-center justify-center">
        //         <a target={'_blank'} href={`https://rinkeby.etherscan.io/tx/${props.hash}`} rel={'noreferrer'} className={'hover:cursor-pointer'}>
        //             <div className={`hover:cursor-pointer flex items-center justify-center w-6 h-6 pt-[1.5px] rounded-md border border-slate-600/50 hover:border-slate-600`}>
        //                 <i className={`cursor-pointer fa-solid fa-eye fa-xs text-slate-600`}/>
        //             </div>
        //         </a>
        //     </TableCol>
        // </div>
        <div className="flex items-center justify-between p-3">
            <div className="flex flex-col gap-1">
                <span className="text-lg flex items-center content-center">
                    <img src={props.image} className={'w-[20px] h-[20px] mr-2'} />
                    {TRANSACTION_TYPES[props.type]}
                </span>
                <span className="text-slate-500"> <i className="fa-light fa-calendar" /> {moment(props.timestamp).fromNow()} </span>
            </div>

            <div className="flex flex-col">
                <div className="flex justify-end text-right text-green-600">
                    {props.amount > 0 ? <span className="px-1 rounded-md bg-green-100">${props.amount}</span> :
                        parseValue(props.value, props.type)
                    }
                </div>
                <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${props.hash}`} rel={'noreferrer'} className="text-sky-500 cursor-pointer hover:underline">
                    <span className="hidden md-lg:block">{props.hash}</span>
                    <span className="block md-lg:hidden">{shortenAddress(props.hash)}</span>
                </a>
            </div>
        </div>
    );
}
