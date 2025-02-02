import * as React from "react";
import {useEffect, useState} from "react";
import Link from "next/link";
import i18n from '../../../../src/i18n/index.json';

// core components
import ButtonFit from "../../../../src/components/core/Button/ButtonFit";

// news component
import NewsCard from "../../../../src/components/pages/management/news/NewsCard";
import helper from "../../../../src/helpers";
import ManagementAuthentication from "../../../../src/components/pages/management/ManagementAuthentication";
import {useWallet} from "@albs1/use-wallet";
import {useRouter} from "next/router";
import ButtonOutlineFit from "../../../../src/components/core/Button/ButtonOutlineFit";

import { usePageTitleContext } from "../../../../src/context/PageTitleContext";


export default function NewsList(props) {
    const router = useRouter();
    const wallet = useWallet();
    const { setTitle } = usePageTitleContext();

    const [articles, setArticles] = useState([]);
    const [project, setProject] = React.useState({});
    const { slug } = router.query;

    useEffect(() => {
        if (props.projectDetail) setProject(props.projectDetail);
        else {
            (async () => {
                const result = await helper.project.getProject(slug);
                setProject(result?.project);
            })();
        }
    }, [props, slug]);

    useEffect(() => {
        const fetchArticles = async () => {
            setArticles(
                await helper.article.getArticles({project: slug})
            );
        };
        fetchArticles();
    }, [props, slug]);

    useEffect(() => {
        setTitle("Edit Article")
    }, [setTitle])


    return (
        <ManagementAuthentication wallet={wallet} project={project}>
            <div className="w-full">
                <div className="flex flex-col md-lg:flex-row items-center justify-between gap-5">
                    <h1 className="text-2xl">{i18n.en.management.news.title}</h1>
                    <div className={'grid grid-cols-2 gap-2.5'}>
                        <ButtonOutlineFit name="Back" icon="fa-regular fa-arrow-left" handleClick={() => router.back()} />
                        <Link href={`/management/${slug}/news/add`} passHref>
                            <a>
                                <ButtonFit name={i18n.en.management.news.button} icon="fa-regular fa-plus-large"/>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="grid md-lg:grid-cols-2 lg-xl:grid-cols-3 gap-4 m-2">
                    {articles.map((news, index) => (
                        <NewsCard news={news} key={index}/>
                    ))}
                </div>
            </div>
        </ManagementAuthentication>
    );
}

export async function getServerSideProps(context) {
    return await helper.project.getProjectServerSide(context);
}