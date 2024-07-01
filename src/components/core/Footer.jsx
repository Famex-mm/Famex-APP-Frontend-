import * as React from "react";
import Image from "next/image";

const links = [
    {
        title: "Twitter",
        link: "https://twitter.com/avateamm",
        icon: 'twitter',
        link_name: "Latest Announcements",
    },
    {
        title: "Telegram",
        link: "https://t.me/avateaofficial\n",
        icon: 'telegram',
        link_name: "Join Discussion",
    },
    {
        title: "Linkedin",
        link: "https://www.linkedin.com/company/avateafinance/",
        icon: 'linkedin',
        link_name: "Check Our Company",
    },
    {
        title: "Discord",
        link: "https://discord.gg/BHYDRve5xC",
        icon: 'discord',
        link_name: "Join Discussion",
    },
    {
        title: "Medium",
        link: "https://avatea.medium.com/",
        icon: 'medium',
        link_name: "Our Blog",
    },
];


export default function Footer(props) {
    return (
        <footer className="flex flex-col gap-5  items-center justify-center p-10 bg-light-yellow-500 mt-5 rounded-2.5xl ">
            <div className="flex flex-col text-center gap-3">
                <Image src="/logo.svg" alt="logo" width={120} height={20} />
            </div> 
            <div>
                <div className="grid grid-flow-col gap-10">
                    {
                        links.map((social,i) => {
                            return (
                                    <div key={i} className={'flex items-center justify-center w-8 h-8 rounded-md bg-[#2a2f43]'}>
                                        <a href={social.link} target={'_blank'} rel={'noreferrer'}>
                                            <i className={`fa-brands fa-${social.icon} fa-inverse`}/>
                                        </a>
                                    </div>

                            )
                        })
                    }
                </div>
            </div>
            <span><a target={'_blank'} rel="noreferrer" href={'https://avatea.io/privacy-policy.pdf'}>Privacy Policy</a></span>

            <p>Copyright © 2023 - All right reserved</p>

        </footer>
    )
}