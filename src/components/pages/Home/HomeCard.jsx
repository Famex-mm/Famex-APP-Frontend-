import * as React from "react";
import tw from "tailwind-styled-components";
import Image from "next/image";
import Link from "next/link";

export default function HomeCard(props) {
    const { handleClick } = props;
    return (<div onClick={() => handleClick()}
                 className="group relative flex rounded-xl border border-slate-200 bg-light-yellow-500 hover:bg-gradient-to-t hover:from-cyan-400 hover:to-sky-500 transition"
    >
        <div className="py-10 grow relative rounded-0.5xl p-6 m-[2px] bg-light-yellow-500 hover:bg-sky-50 hover:cursor-pointer transition flex flex-row items-center">
            {/* icon */}
            <CardIcon>
                {/*<Image*/}
                {/*        src="/img/icon-vt.svg"*/}
                {/*        width={44}*/}
                {/*        height={44}*/}
                {/*        alt="card-icon"*/}
                {/*/>*/}
                {props.children ? props.children : props.icon ? props.icon : ""}
            </CardIcon>

            {/* title */}
            <div className={'mx-5'}>
                <h2 className="font-display text-base text-slate-900"><span className="absolute -inset-px rounded-xl"></span>{props.title}</h2>

                {/* content */}
                <p className="mt-1 text-sm text-bilo text-dark-blue-500">
                    {props.content}</p>

            </div>
        </div>
    </div>)
    // return (
    //         handleClick ? (<div onClick={() => handleClick()}
    //                 className="group relative flex rounded-xl border border-slate-200 bg-light-yellow-500 hover:bg-gradient-to-t hover:from-cyan-400 hover:to-sky-500 transition"
    //         >
    //             <div className="py-10 grow relative rounded-0.5xl p-6 m-[2px] bg-light-yellow-500 hover:bg-sky-50 hover:cursor-pointer transition flex flex-row items-center">
    //                 {/* icon */}
    //                 <CardIcon>
    //                     {/*<Image*/}
    //                     {/*        src="/img/icon-vt.svg"*/}
    //                     {/*        width={44}*/}
    //                     {/*        height={44}*/}
    //                     {/*        alt="card-icon"*/}
    //                     {/*/>*/}
    //                     {props.children}
    //                 </CardIcon>
    //
    //                 {/* title */}
    //                 <div className={'mx-5'}>
    //                     <h2 className="font-display text-base text-slate-900"><span className="absolute -inset-px rounded-xl"></span>{props.title}</h2>
    //
    //                     {/* content */}
    //                     <p className="mt-1 text-sm text-bilo text-dark-blue-500">
    //                         {props.content}</p>
    //
    //                 </div>
    //             </div>
    //         </div>): (<Link href={link}>
    //             <div
    //                     className="group relative flex rounded-xl border border-slate-200 bg-light-yellow-500 hover:bg-gradient-to-t hover:from-cyan-400 hover:to-sky-500 transition"
    //             >
    //                 <div className="py-10 grow relative rounded-0.5xl p-6 m-[2px] bg-light-yellow-500 hover:bg-sky-50 hover:cursor-pointer transition flex flex-row items-center">
    //                     {/* icon */}
    //                     <CardIcon>
    //                         {/*<Image*/}
    //                         {/*        src="/img/icon-vt.svg"*/}
    //                         {/*        width={44}*/}
    //                         {/*        height={44}*/}
    //                         {/*        alt="card-icon"*/}
    //                         {/*/>*/}
    //                         {props.children}
    //                     </CardIcon>
    //
    //                     {/* title */}
    //                     <div className={'mx-5'}>
    //                         <h2 className="font-display text-base text-slate-900"><span className="absolute -inset-px rounded-xl"></span>{props.title}</h2>
    //
    //                         {/* content */}
    //                         <p className="mt-1 text-sm text-bilo text-dark-blue-500">
    //                             {props.content}</p>
    //
    //                     </div>
    //                 </div>
    //             </div>
    //         </Link>)

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