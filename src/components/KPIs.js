import React from "react";
import { Line } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import "./css/KPIs.css";
import { Chart, ArcElement } from 'chart.js';
import { TranslationContext } from "../hooks/translation";
Chart.register(ArcElement);

export const KPI = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const { translate } = React.useContext(TranslationContext); // Gets the context of the translation
    const [error, setError] = React.useState(null); // State for error
    const [energyAnomaliesData, setEnergyAnomaliesData] = React.useState(null);
    const [timeAnomaliesData, setTimeAnomaliesData] = React.useState(null);
    const [cycleAnomaliesData, setCycleAnomaliesData] = React.useState(null);
    const [consumptionData, setConsumptionData] = React.useState(null);
    const [consumptionWorkingData, setConsumptionWorkingData] = React.useState(null);
    const [consumptionIdleData, setConsuptionIdleData] = React.useState(null);
    const [costData, setCostData] = React.useState(null);
    const [costIdleData, setCostIdleData] = React.useState(null);
    const [costWorkingData, setCostWorkingData] = React.useState(null);
    const [cycleData, setCycleData] =React.useState(null);
    const [cycleGoodData, setCycleGoodData] = React.useState(null);
    const [cycleBadData, setCyclebadData] = React.useState(null);
    const [cycleTimeAnomaliesData, setcTimeAnomaliesData] = React.useState(null);

    const machine_category = ["Metal cutter", "Laser Welder", "Assembler", "Tester", "Rivetter", "Laser Cutter"];
    const day_label =  ["24-10-30", "24-10-01", "24-10-02", "24-10-03", "24-10-04"];
    const type_anom = ["energy", "downtime", "cycle_quality", "cycle_time"];
    const backgroundColor = ["#8e5ea2", "#3e95cd", "#3cba9f", "#e8c3b9", "#c45850", "#ffcc00"];
    const storedToken = localStorage.getItem("token");
    const kpi_id = ["673a6ad3d9e0b151b88cbed3","673a6ad4d9e0b151b88cbed6", "673a6ad4d9e0b151b88cbed5", "673a6ad5d9e0b151b88cbed9", "673a6ad5d9e0b151b88cbed8", "673a6ad7d9e0b151b88cbedb", "673a6ad8d9e0b151b88cbedc"]; //consumption, consumption idle, consumption working, const idle, const working, good cycles, bad cycles

    const handleTabChange = (value) => {
        setTabValue(value);
    };

    const handleAnomalies = () => {
        const fetchValues = async (type) => {
            setError(null); // Clear previous errors

            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/anomalies/?anomaly_type=${type}`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                
                const data = await response.json();
                if (Array.isArray(data.data) && data.data.length > 0) {
                    const anomaliesByGroup = data.data[0].anomalies_by_group;
                  
                    const values = Object.values(anomaliesByGroup).map(Number); // Extract values and convert to numbers
                    return {
                        labels : machine_category,
                        datasets : [{
                            data : values,
                            backgroundColor : backgroundColor,
                        }],
                    }
                  }
            } catch (err) {
                setError(err.message);
            }
        };


        const fetchAllValues = async () => {
            try {
                const data = await fetchValues(type_anom[0]);
                setEnergyAnomaliesData(data);

                const datatime = await fetchValues(type_anom[1]);
                setTimeAnomaliesData(datatime);

                const datacycle = await fetchValues(type_anom[2]);
                setCycleAnomaliesData(datacycle);

                const datacycleTime = await fetchValues(type_anom[3]);
                setcTimeAnomaliesData(datacycleTime);
            } catch (err) {
                setError("An error occurred while fetching values.");
            }
        };
        
        fetchAllValues();
    };

    const handleConsumption = () =>{
        const fetchValues = async (kpi, bordercolor, backcolor) => {
            setError(null); // Clear previous errors

            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=avg&granularity_days=1`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                
                const data = await response.json();
                const values = Array.isArray(data.data) ? data.data.map((item) => item.value) : [];
                return {
                    labels : day_label,
                    datasets : [{
                        label : `${translate.KPIs.trend}`,
                        data: values,
                        borderColor: bordercolor,
                        backgroundColor: backcolor,
                        fill: true,
                    }]
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchAllValues = async () => {
            try {
                const data = await fetchValues(kpi_id[0], "#3f51b5", "rgba(63, 81, 181, 0.2)");
                setConsumptionData(data);

                const datawork = await fetchValues(kpi_id[2],"#ff5722", "rgba(76, 175, 80, 0.2)");
                setConsumptionWorkingData(datawork);

                const dataidle = await fetchValues(kpi_id[1],"#2196f3", "rgba(33, 150, 243, 0.2)");
                setConsuptionIdleData(dataidle);
            } catch (err) {
                setError("An error occurred while fetching values.");
            }
        };
        
        fetchAllValues();
    };

    const handleCost = () => {
        const fetchValues = async (kpi, bordercolor, backcolor) => {
            setError(null); // Clear previous errors

            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=avg&granularity_days=1`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                
                const data = await response.json();
                const values = Array.isArray(data.data) ? data.data.map((item) => item.value) : [];
                return {
                    labels : day_label,
                    datasets : [{
                        label : `${translate.KPIs.trend}`,
                        data: values,
                        borderColor: bordercolor,
                        backgroundColor: backcolor,
                        fill: true,
                    }]
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchValuePie = async (kpi, kpi1) => {
            try{
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=sum`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const response1 = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi1}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=sum`,
                    requestOptions
                );

                if (!response1.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                const data1 = await response1.json();
                const values = Array.isArray(data.data) ? data.data.map((item) => item.value) : [];
                const values1 = Array.isArray(data1.data) ? data1.data.map((item) => item.value) : [];
                return {
                    labels : [`${translate.KPIs.pie_cost_1}` , `${translate.KPIs.pie_cost_2}`],
                    datasets : [{
                        data: [values[0], values1[0]],
                        backgroundColor: [ "#badb16", "#ff5722"],
                    }]
                }
            } catch (err){
                console.log(err);
            }
        }

        const fetchAllValues = async () => {
            try {
                const data = await fetchValuePie(kpi_id[4], kpi_id[3]);
                setCostData(data);

                const datawork = await fetchValues(kpi_id[4],"#ff5722", "rgba(76, 175, 80, 0.2)");
                setCostWorkingData(datawork);

                const dataidle = await fetchValues(kpi_id[3],"#2196f3",  "rgba(33, 150, 243, 0.2)");
                setCostIdleData(dataidle);
            } catch (err) {
                setError("An error occurred while fetching values.");
            }
        };
        
        fetchAllValues();
    };

    const handleCycle = () => {
        const fetchValues = async (kpi, bordercolor, backcolor) => {
            setError(null); // Clear previous errors

            try {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=avg&granularity_days=1`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                
                const data = await response.json();
                const values = Array.isArray(data.data) ? data.data.map((item) => item.value) : [];
                return {
                    labels : day_label,
                    datasets : [{
                        label : `${translate.KPIs.trend}`,
                        data: values,
                        borderColor: bordercolor,
                        backgroundColor: backcolor,
                        fill: true,
                    }]
                }
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchValuePie = async (kpi, kpi1) => {
            try{
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow",
                };

                const response = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=sum`,
                    requestOptions
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const response1 = await fetch(
                    `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/1/compute?kpi_id=${kpi1}&start_date=2024-09-30%2000%3A00%3A00&end_date=2024-10-04%2000%3A00%3A00&granularity_op=sum`,
                    requestOptions
                );

                if (!response1.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                const data1 = await response1.json();
                const values = Array.isArray(data.data) ? data.data.map((item) => item.value) : [];
                const values1 = Array.isArray(data1.data) ? data1.data.map((item) => item.value) : [];
                return {
                    labels : [`${translate.KPIs.pie_cycle_1}` , `${translate.KPIs.pie_cycle_2}`],
                    datasets : [{
                        data: [values[0], values1[0]],
                        backgroundColor: [ "#badb16", "#ff5722"],
                    }]
                }
            } catch (err){
                console.log(err);
            }
        }

        const fetchAllValues = async () => {
            try {
                const data = await fetchValuePie(kpi_id[5], kpi_id[6]);
                setCycleData(data);

                const datawork = await fetchValues(kpi_id[5],"#ff5722", "rgba(76, 175, 80, 0.2)");
                setCycleGoodData(datawork);

                const dataidle = await fetchValues(kpi_id[6],"#2196f3",  "rgba(33, 150, 243, 0.2)");
                setCyclebadData(dataidle);
            } catch (err) {
                setError("An error occurred while fetching values.");
            }
        };
        
        fetchAllValues();
    };


    React.useEffect(() => {
        handleAnomalies(); // Chiamare la funzione al montaggio

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="kpi-container">
            {/* Tab Buttons */}
            <div className="kpi-tabs">
                <button
                    className={`kpi-tab ${tabValue === 0 ? "active" : ""}`}
                    onClick={() => {
                        handleAnomalies();
                        handleTabChange(0);
                    }}
                >
                    {translate.KPIs.tab_anom}
                </button>
                <button
                    className={`kpi-tab ${tabValue === 1 ? "active" : ""}`}
                    onClick={() => {
                        handleTabChange(1);
                        handleConsumption()
                        }
                    }
                >
                    {translate.KPIs.tab_energy}
                </button>
                <button
                    className={`kpi-tab ${tabValue === 2 ? "active" : ""}`}
                    onClick={() => {
                        handleTabChange(2);
                        handleCost();
                        }
                    }
                >
                    {translate.KPIs.tab_cost}
                </button>
                <button
                    className={`kpi-tab ${tabValue === 3 ? "active" : ""}`}
                    onClick={() => {
                        handleTabChange(3);
                        handleCycle();
                    }
                    }
                >
                    {translate.KPIs.tab_cycle}
                </button>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                {tabValue === 0 && (
                    <>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.anom_1}</h3>
                            {energyAnomaliesData ? (
                                <Pie data={energyAnomaliesData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.anom_2}</h3>
                            {timeAnomaliesData ? (
                                <Pie data={timeAnomaliesData} />
                                    ): (
                                    <p>{translate.KPIs.loading} </p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.anom_3}</h3>
                                {cycleAnomaliesData ? (
                                    <Pie data = {cycleAnomaliesData} />
                                ) : (
                                    <p>{translate.KPIs.loading} </p>
                                )

                                }
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.anom_4}</h3>
                                {cycleTimeAnomaliesData ? (
                                    <Pie data = {cycleAnomaliesData} />
                                ) : (
                                    <p>{translate.KPIs.loading} </p>
                                )
                                }
                        </div>
                    </>
                )}

                {tabValue === 1 && (
                    <>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.energy_1}</h3>
                            {consumptionData ? (
                                <Line data={consumptionData} />
                                    ): (
                                    <p>{translate.KPIs.loading} </p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.energy_2}</h3>
                            {consumptionIdleData ? (
                                <Line data={consumptionIdleData} />
                                    ): (
                                    <p>{translate.KPIs.loading} </p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.energy_3}</h3>
                            {consumptionWorkingData ? (
                                <Line data={consumptionWorkingData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                    </>
                )}

                {tabValue === 2 && (
                    <>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cost_1}</h3>
                            {costData ? (
                                <Pie data={costData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cost_2}</h3>
                            {costIdleData ? (
                                <Line data={costIdleData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cost_3}</h3>
                            {costWorkingData ? (
                                <Line data={costWorkingData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                    </>
                )}

                {tabValue === 3 && (
                    <>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cycle_1}</h3>
                            {cycleData ? (
                                <Pie data={cycleData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cycle_2}</h3>
                            {cycleGoodData ? (
                                <Line data={cycleGoodData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                        <div className="kpi-card">
                            <h3>{translate.KPIs.cycle_3}</h3>
                            {cycleBadData ? (
                                <Line data={cycleBadData} />
                                    ): (
                                    <p>{translate.KPIs.loading}</p>
                                )}
                        </div>
                    </>
                )}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};


export default KPI;
