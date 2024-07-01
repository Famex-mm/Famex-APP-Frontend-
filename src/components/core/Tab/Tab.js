import * as React from "react";

import TabItem from "./TabItem";
import DisabledTabItem from "./DisabledTabItem";

export default function Tab(props) {
    return (
        <span
            className="flex flex-row items-center rounded-[24px] p-2 space-x-2 overflow-scroll scrollbar-none"
        >
      {props.items.map((item, index) => (
          <div key={index}>
              {(!props.liquidity && item === 'Liquidity') || (!props.vault && item === 'Vault') || (!props.tokenomics && item === "Tokenomics") || (!props.userData?.includes(item) && item === "Vesting") ?
                  <DisabledTabItem
                      active={props.userData ? props.userData.includes(item) : false}
                      label={item}
                      key={index}
                      value={index}
                      handleSetTab={props.setTab}
                      selected={props.tab === index}
                  />
                  :
                  <TabItem
                      active={props.userData ? props.userData.includes(item) : false}
                      label={item}
                      key={index}
                      value={index}
                      handleSetTab={props.setTab}
                      selected={props.tab === index}
                  />
              }
          </div>
      ))}
    </span>
    );
}
