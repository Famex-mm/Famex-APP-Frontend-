import BannerSocialButton from "./BannerSocialButton";
import ButtonOutline from "../../../core/Button/ButtonOutline";
import Link from "next/link";
import Image from "next/image";
import i18n from '../../../../i18n/index.json';
import { Global, Whitepaper } from "../../../SVG";

export default function PreviewContent(props) {
  const socials = Object.entries(
    Object.fromEntries(
      Object.entries(props).filter(([key]) => key.includes("social_"))
    )
  );

  const mapSocials = () => {
    return socials.map((social) => {
        if (social[1]) {
            return (
              <div key={social[0]} className={'flex items-center justify-center w-8 h-8 rounded-md bg-[#2a2f43]'}>
                <a href={social[1]} target={'_blank'} rel={'noreferrer'}>
                    <i className={`fa-brands fa-${social[0].replace("social_", "")} fa-inverse`}/>
                </a>
              </div>
            );
        }
    });
  };

  return (
    <div
        id={'project-banner'}
      className="absolute flex flex-col space-y-5 md-lg:space-y-0 md-lg:flex-row w-full h-full bottom-0 px-5 pb-5 pt-7.5 md-lg:h-[233px] md-lg:px-7.5 md-lg:pb-7.5 md-lg:pt-11 rounded-2.5xl md-lg:justify-between"
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 32, 76, 0) 0%, #00204C 100%)",
      }}
    >
      <div className="flex flex-col justify-end w-full space-y-5 md-lg:w-1/2 md-lg:h-full">
        <div className="flex md-lg:w-full md-lg:space-x-3.5">
          <div className="flex items-center w-[67px] h-[67px] px-5 py-2.5 bg-white/10 rounded-0.5xl">
            {props.image && <Image src={props.image} alt="tokeImage" width={27} height={27}/>}
          </div>
          <div className="flex-1 w-1/2 space-y-2 ">
            <div className="text-lg font-extrabold leading-none text-white project-title font-poppins">
              {props.name}
            </div>

            {props.website ? (
              <div className="text-xs text-right text-white">
                <a href={props.website} target="_blank" rel="noReferrer" className="flex items-center">
                  {Global}
                  <span className="ml-4 font-sofia">Website</span>
                </a>
              </div>
            ) : (
              ""
            )}

            {props.whitepaper ? (
              <div className="text-xs text-right text-white">
                <a href={props.whitepaper} target="_blank" rel="noReferrer" className="flex items-center">
                  {Whitepaper}
                  <span className="ml-4 font-sofia">whitepaper</span>
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col justify-end w-full grow md-lg:w-1/3 md-lg:h-full">
        <div className="absolute flex flex-col items-end w-full space-y-5 md-lg:bottom-0 md-lg:right-0">
          <div className="grid grid-flow-col gap-10 w-fit">
            {mapSocials()}
          </div>
        </div>
      </div>
    </div>
  );
}
