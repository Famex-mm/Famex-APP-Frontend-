import * as React from "react";
import helper from '../src/helpers';
import Card from "../src/components/pages/projects/Card/Card";
import {usePageTitleContext} from '../src/context/PageTitleContext';
import Head from "next/head";
import {TITLE_PREFIX} from "../src/helpers/constants";


export default function Projects() {

    const {setTitle} = usePageTitleContext();

    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        const getProjects = async () => {
            const projects = await helper.project.getProjects({comingSoon: true, live:false});
            setProjects(projects);
        }

        getProjects();
    }, [])


    React.useEffect(() => {
        setTitle("Upcoming Projects")
    }, [setTitle])

    return (
        <div>
            <Head>
                <title>Projects | {TITLE_PREFIX}</title>
                <meta property="og:title" content={`Upcoming Projects ${TITLE_PREFIX}`} key="title"/>
            </Head>
            <div className="index">
                <Card projectsProps={projects} comingSoon={true}/>
            </div>
        </div>
    )
}