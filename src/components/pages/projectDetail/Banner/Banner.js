import * as React from "react";

import Image from "next/image";
import BannerContent from "./BannerContent";
import helpers from "../../../../helpers";
import {AVATEA_TOKEN_IMAGE} from "../../../../helpers/constants";

export default function Banner(props) {


  return (
    <div
      className="relative w-full h-85 md-lg:h-100 rounded-2.5xl"
      style={{
        backgroundImage: `url("${props.banner}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.75))'
      }}
    >
        {
            props.chainId ?  <div className="absolute flex items-center justify-center top-2 right-2 w-16 h-16 bg-white/20 rounded-0.5xl">
                <Image src={props.chainId ? helpers.project.getNetworkIcon(props.chainId) : AVATEA_TOKEN_IMAGE} alt="chainImage" width={48} height={48}/>
            </div> : ""
        }

      <BannerContent {...props}/>
    </div>
  );
}
