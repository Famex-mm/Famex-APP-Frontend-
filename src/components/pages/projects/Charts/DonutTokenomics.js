import * as React from "react";
import dynamic from "next/dynamic";

const ChartWithNoSSR = dynamic(() => import("react-apexcharts"), { ssr: false });


export default function DonutTokenomics(props) {
    const [series, setSeries] = React.useState();
    const [labels, setLabels] = React.useState();
    const [options,setOptions] = React.useState();

    React.useEffect(() => {
        let values = [];
        let labels = [];
        props?.tokenomicsData?.forEach((datapiece) => {
            // values.push([datapiece.label, datapiece.percentage]);
            values.push(datapiece.percentage);
            labels.push(datapiece.label);
        });

        setOptions({
            chart: {
                type: 'donut',
            },
            labels,
            dataLabels: {
                enabled:false
            },
            colors:['#3b63b2', '#3d87b0', '#85bfc2','#add6c7','#cfedb8','#e0deab','#ffe596','#dbb573','#94825c','#292e42','#26458f'],
            responsive: [{
                breakpoint: 480,
                options: {
                    // chart: {
                    //     width: 200
                    // },
                    dataLabels: {
                        enabled:false
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],

        })
        setSeries(values);
        // setSeries([
        //     {
        //         name: "Tokenomics",
        //         data: values,
        //     },
        // ]);
    }, [props]);

    const DonutChartMemo = React.useMemo(() => {
        return series && <ChartWithNoSSR options={options} labels={labels} series={series} type="donut" width="100%" height={320} />;
    }, [series]);

    return <>{DonutChartMemo}</>;
}
