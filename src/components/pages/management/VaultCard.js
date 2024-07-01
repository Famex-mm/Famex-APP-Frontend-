import {useCallback, useEffect, useState} from "react";
import {useWallet} from "@albs1/use-wallet";
import {ethers} from "ethers";
import Image from "next/image";

import helper from "../../../helpers";
import {AVATEA_TOKEN, AVATEA_TOKEN_IMAGE, PAIRED_TOKEN_DEFAULT_IMAGE} from "../../../helpers/constants";
import i18n from '../../../i18n/index.json';

// core components
import Button from "../../core/Button/Button";
import InputApproveWithIconSubmit from "../../core/Input/InputApproveWithIconSubmit";

// page components
import MaxButton from "../projects/Button/MaxButton";
import Card from "../projectDetail/Card/Card";
import SwitchBlock from "../../core/SwitchBlock";
import moment from "moment/moment";
import InputWithIconSubmit from "../../core/Input/InputWithIconSubmit";
import InputTime from "../../core/Input/InputTime";
import dynamic from "next/dynamic";
import * as React from "react";
const ReactTooltip = dynamic(() => import('react-tooltip'), {ssr: false});


export default function VaultCard({project, vault, mainChainId}) {

    const wallet = useWallet();

    const [vaultTLV, setVaultTLV] = useState("0");
    const [rewardPerToken, setRewardPerToken] = useState("0");
    const [baseTokenWalletBalance, setBaseTokenWalletBalance] = useState("0");
    const [amountBaseTokenToStake, setAmountBaseTokenToStake] = useState("0");

    useEffect(() => {
        if (wallet.status === "connected" && wallet.chainId === mainChainId && vault.address) {
            const initWalletConnected = async () => {
                setVaultTLV(
                    helper.formatting.web3Format(
                        await helper.web3.vault.totalSupply(wallet, vault.address)
                    )
                );
                setRewardPerToken(
                    await helper.web3.vault.rewardPerToken(wallet, vault.address)
                );

                setBaseTokenWalletBalance(
                    helper.formatting.web3Format(
                        await helper.token.balanceOf(wallet, marketMakingPool.token, wallet.account,mainChainId)
                    )
                );

            };
            initWalletConnected();
        }
    }, [wallet, vault, project]);

    const addReward = useCallback(async () => {
        const wei = ethers.utils.parseEther(amountBaseTokenToStake);
        let success = await helper.web3.vault.addReward(wallet, vault.address, wei);
    }, [amountBaseTokenToStake, wallet, vault]);

    const setMax = useCallback(async (amount, setter) => {
        setter(amount);
    }, []);

    return (

        <>
            <ReactTooltip/>
            <Card className={'col-span-full md:col-span-1'}>


                {
                    vault.address ?
                        wallet.chainId == mainChainId ? <div className="flex flex-col p-3.75 space-y-4">
                                <h2 className="text-2xl"><i className="fa-solid fa-nfc-lock"/> {i18n.en.management.vault.title}</h2>
                                <div className="flex justify-between">
                                    <span className="text-sm"><i className="fa-solid fa-users"/> {i18n.en.management.vault.attributes.usersStaked} <i data-tip={i18n.en.management.vault.attributes.usersStakedTooltip} className="fa-solid fa-info-circle cursor-pointer"/></span>
                                    <span className="text-base font-medium">
                      {vault.num_invested}
                    </span>
                                </div>
                                <div className="flex justify-between">
                      <span className="text-sm">
                        <i className="fa-solid fa-money-bill-transfer"/> TVL
                      </span>
                                    <span className="flex text-base font-medium">
                        <Image
                            src={AVATEA_TOKEN_IMAGE}
                            alt="avateaTokenImage"
                            width={24}
                            height={24}
                        />
                        <span className="ml-2.5">{vaultTLV}</span>
                      </span>
                                </div>
                                <div className="flex justify-between">
                      <span className="text-sm">
                        <i className="fa-solid fa-hands-holding-dollar"/>{" "}
                          {i18n.en.management.vault.attributes.rewardPerAvateaToken}
                          <i data-tip={i18n.en.management.vault.attributes.rewardPerAvateaTokenTooltip} className="fa-solid fa-info-circle cursor-pointer"/>
                      </span>
                                    <span className="flex text-base font-medium">
                        <Image
                            src={project.image}
                            alt="projectImage"
                            width={24}
                            height={24}
                        />
                        <span className="ml-2.5">{rewardPerToken}</span>
                      </span>
                                </div>

                                <div className="flex flex-row items-center justify-between text-base">
                                    <div>
                                        <i className="fa-solid fa-coin"/> {i18n.en.management.vault.attributes.addRewards}
                                        <i data-tip={i18n.en.management.vault.attributes.addRewardsTooltip} className="fa-solid fa-info-circle cursor-pointer"/>
                                    </div>
                                    <span>
                            <MaxButton
                                balance={baseTokenWalletBalance}
                                handleClick={() =>
                                    setMax(
                                        baseTokenWalletBalance,
                                        setAmountBaseTokenToStake
                                    )
                                }
                            />
                      </span>
                                </div>
                                <InputApproveWithIconSubmit
                                    id="cash"
                                    name="cash"
                                    type="number"
                                    icon="fa-light fa-circle-plus"
                                    submitName="Deposit"
                                    image={project.image}
                                    submitFunction={addReward}
                                    value={amountBaseTokenToStake}
                                    setValue={setAmountBaseTokenToStake}
                                    address={vault.address}
                                    token={marketMakingPool.token}
                                />
                            </div>
                            : <SwitchBlock targetChainId={mainChainId}/>

                        : <div className="flex flex-col p-3.75 space-y-4">
                            <h1 className="text-2xl text-center"><i className="fa-solid fa-nfc-lock"/> {i18n.en.management.vault.title}</h1>
                            <div className="bg-gray-200 border border-gray-400 px-4 py-3 rounded relative text-center"
                                 role="alert">
                                <span>{i18n.en.management.vault.noVault}</span>

                            </div>
                            <Button name={i18n.en.management.vault.requestVault}/>
                        </div>
                }
            </Card>

        </>

    )
}