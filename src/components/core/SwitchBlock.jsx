import * as React from "react";
import networks from "../../network/network.json";
import {useCallback, useEffect} from "react";
import {useWallet} from "@albs1/use-wallet";
import {ethers} from "ethers";
import Button from "./Button/Button";
import CenteredContent from "./CenteredContent";

export default function SwitchBlock(props) {
    const wallet = useWallet();
    const [currentNetwork, setCurrentNetwork] = React.useState(networks[wallet.chainId] || networks[4]);
    const [targetNetwork, setTargetNetwork] = React.useState();


    useEffect(() => {
        const network = networks.filter(network => network.chainId == wallet.chainId);
        setCurrentNetwork(network[0]);

        const targetChain = networks.filter(network => network.chainId == props.targetChainId);
        setTargetNetwork(targetChain[0])
    },[wallet,currentNetwork])





    const switchChain = async ({chainId,displayName,symbol, currencyName, rpcUrls}) => {
        if (wallet.chainId !== chainId) {
            try {
                await wallet.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue( chainId)}]
                    });
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await wallet.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: displayName,
                                chainId: ethers.utils.hexValue( chainId),
                                nativeCurrency: { name: currencyName, decimals: 18, symbol },
                                rpcUrls
                            }
                        ]
                    });
                }
            }
        }
    }

  return (
  <CenteredContent>
      <p className={'text-2xl'}>To access this functionality, please switch to the main chain of the project.</p>
      <div className="flex flex-row items-center space-x-2 justify-center">
          <div className={'space-x-2 rounded-2xl flex flex-row items-center border-2 border-gray-200 px-6 py-3'}>
              <p className={'text-xl'}>Current Network:</p>
              <img src={`${currentNetwork?.icon}`} alt="network" width={20} height={20} />
              <span className="text-xl">{currentNetwork?.displayName}</span>
          </div>

      </div>
      <Button handleClick={() => switchChain(targetNetwork)}>Switch to {targetNetwork?.displayName}  <img className={'ml-2'} src={`${targetNetwork?.icon}`} alt="network" width={20} height={20} /></Button>
  </CenteredContent>

  );
}

export const NetworkItem = (props) => {
  return (
    <div
      className="flex items-center justify-between p-2 rounded-md hover:cursor-pointer hover:bg-gray-100"
      onClick={() => props.handleClick(props.network)}
    >
      <div className="flex items-center gap-2">
          {
              props?.network?.icon ?  <img
                      src={props?.network?.icon}
                      alt="network_item"
                      width={20}
                      height={20}
              /> : ""
          }

        <span>{props.network.displayName}</span>
      </div>
      {props.currentNetwork?.networkName == props.network?.networkName && (
        <div className="state w-2.5 h-2.5 rounded-full bg-green-500"></div>
      )}
    </div>
  );
};
