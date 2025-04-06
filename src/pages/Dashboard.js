import React, { useState, useEffect, useContext } from "react";
import { LineGraph } from "../components/LineGraph";
import { format } from "date-fns";
import { KPI } from "../components/KPIs";
import "./css/Dashboard.css";
import { AuthContext } from "../hooks/user";
import DatePicker from "react-datepicker";
import LineGraphFiltered from "../components/LineGraphFiltered";
import Chatbot from "../components/Chatbot";
import { TranslationContext } from "../hooks/translation";

// There are three sites for the SMO
const sites = [0, 1, 2];

function Dashboard() {
  const auth = useContext(AuthContext); // Gets the context of the user
  const { translate } = useContext(TranslationContext); // Gets the context of the translation
  const [error, setError] = useState(null); // State for error messages
  const [errorWidget, setErrorWidget] = useState(null); // State for error messages for newwidget
  const [dropdownVisible2, setDropdownVisible2] = useState(false); // State for newwidget dropdown
  const [granularity, setGranularity] = useState(""); // State for report name
  const [operation, setOperation] = useState(""); // State for opration of aggregation for newwidget
  const [startDate, setStartDate] = useState(null); // State for end date for newwidget
  const [endDate, setEndDate] = useState(null); // State for start date for newwidget
  const [site, setSite] = useState(auth?.site); // State for sites
  const [selectedKPI, setSelectedKPI] = useState(null); // State for selected KPI for newwidget
  const [loadingKPIs, setLoadingKPIs] = useState(false); // State for loading status KPIS for newwidget
  const [kpis, setKpis] = useState([]); // State for KPIs options to show to user for newwidget
  const [loading, setLoading] = useState(false); // State for loading status for newwidget
  const [category, setCategory] = useState(true); // State to choose either to load by category or by site
  const [dataSet, setDataSet] = useState([]); // State for the data to be passed to the LineGraphFiltered component
  
  // Fetch KPIs data from API based on site
  useEffect(() => {
    const fetchKPIs = async () => {
      setLoadingKPIs(true);
      setError(null);
      const storedToken = localStorage.getItem("token");

      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${storedToken}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        if (site) {
          const response = await fetch(
            `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/?site=${site}`,
            requestOptions
          );

          if (!response.ok) {
            throw new Error("Failed to fetch KPIs");
          }

          const data = await response.json();
          setKpis(data.data); // the .data is an array of object
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingKPIs(false);
      }
    };

    if (dropdownVisible2) {
      fetchKPIs();
    }
  }, [dropdownVisible2, site]);

  useEffect(() => {
    if (auth?.site) {
      setSite(auth.site);
    }
  }, [auth]);

  // Handle granularity of days change
  const handleGranularityChange = (newName) => {
    setGranularity(newName);
  };

  const handleChoiceWidget = (choice) => {
    toggleDropdown2();
    setError(null); // Reset error when a choice is made
  };

  const toggleDropdown2 = () => {
    setDropdownVisible2((prev) => !prev);
  };

  // Handle operation change
  const handleOperationChange = (newOperation) => {
    setOperation(newOperation);
  };

  // Handle site change
  const handleSiteChange = (site) => {
    setSite(site);
  };

  // Handle granularity of machines change
  const handleGradMachines = (event) => {
    setCategory(event);
  };

  const handleNewWidget = async () => {
    setLoading(true);
    setErrorWidget(null);

    try {
      const myHeaders = new Headers();
      const storedToken = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${storedToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      // Date formatted for the API
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : null;
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : null;

      if (site && selectedKPI) {
        const response = await fetch(
          `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/site/${site}/compute?kpi_id=${selectedKPI}&start_date=${formattedStartDate}%2000%3A00%3A00&end_date=${formattedEndDate}%2000%3A00%3A00&granularity_op=${operation}&granularity_days=${granularity}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Failed to create");
        }

        const data = await response.json();

        var dataParsed = data.data.map((e) => {
          return e.value;
        });

        if (dataParsed) setDataSet(dataParsed);
      }
    } catch (err) {
      if(err){
        setErrorWidget(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // Calls graph on the info of 1 site if FFM, all sites if SMO
  // Since the SMO user has no site field in the object it's rappresented in we check
  // if it's a SMO by checking the site field
  const renderGraph = () => {
    if (!auth) return <></>;
    if (auth?.site !== null)
      return <LineGraph site={auth?.site} title={translate.Dashboard.graph_title_ffm} />;
    // FFM
    else
      return (
        <div className="d-flex flex-column gap-3 pb-3 flex-shrink-0">
          {sites.map((site) => (
            <LineGraph
              key={`graph_${site}`}
              site={site}
              title={`${translate.Dashboard.graph_title_smo} ${site + 1}, ${translate.Dashboard.graph_title_smo1}`}
            />
          ))}
        </div>
      );
  };

  return (
    <div className="d-flex flex-column w-100 h-100 overflow-scroll p-3">
      <h2>{translate.Dashboard.title}</h2>
      <div className="d-flex align-items-center">
        <p className="m-0">{translate.Dashboard.subtitle}</p>
        <div className="d-flex gap-2 flex-1 align-items-center justify-content-end ms-auto">
          <button
            onClick={() => handleChoiceWidget()}
            className={`kpi-tab`}
            disabled
          >
            {translate.Dashboard.create_alarm}
          </button>
          <button
            onClick={() => handleChoiceWidget()}
            className={`kpi-tab ${dropdownVisible2 ? "active" : ""}`}
          >
            {translate.Dashboard.show_graph}
          </button>
        </div>
      </div>

      <div className="button-container d-flex flex-column gap-3 justify-content-center">
        {/* Dropdown menu */}
        <div className="d-flex flex-column gap-3">
          {/* Show additional options based on the selection */}
          {dropdownVisible2 && (
            <div className="d-flex gap-3 flex-wrap kpi-card p-3">
              <select
                id="kpis"
                value={selectedKPI}
                onChange={(e) => {
                  setSelectedKPI(e.target.value);
                }}
                className="dropdown-select"
              >
                {loadingKPIs && <option>{translate.Dashboard.loading_kpis}</option>}{" "}
                {/* Loading state */}
                {error && <option>{translate.Dashboard.error_kpis}</option>}{" "}
                {/* Error state */}
                {!loadingKPIs &&
                  !error &&
                  kpis.map((kpi) => (
                    <option key={kpi._id} value={kpi._id}>
                      {kpi.name}
                    </option>
                  ))}
              </select>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy/MM/dd"
                className="date-picker"
                placeholderText={translate.CreateReport.select_sdate}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy/MM/dd"
                className="date-picker"
                placeholderText={translate.CreateReport.select_edate}
              />
              <select
                id="operation"
                value={operation}
                onChange={(e) => handleOperationChange(e.target.value)}
                className="dropdown-select"
              >
                <option value="" disabled>
                  {translate.Dashboard.select_operation}
                </option>
                <option value="avg">{translate.labels.avg}</option>
                <option value="min">{translate.labels.min}</option>
                <option value="max">{translate.labels.max}</option>
                <option value="std">{translate.labels.std}</option>
              </select>
              <select
                id="granularity"
                value={granularity}
                onChange={(e) => handleGranularityChange(e.target.value)}
                className="dropdown-select"
              >
                <option value="" disabled>
                  {translate.Dashboard.select_days}
                </option>
                <option value="1">1 {translate.Dashboard.day}</option>
                <option value="7">7 {translate.Dashboard.days}</option>
                <option value="30">30 {translate.Dashboard.days}</option>
              </select>
              <select
                id="category"
                value={category}
                onChange={(e) => handleGradMachines(e.target.value)}
                className="dropdown-select"
              >
                <option value="" disabled>
                  {translate.Dashboard.select_machines}
                </option>
                <option value="true">{translate.Dashboard.by_site}</option>
                <option value="false">{translate.Dashboard.by_category}</option>
              </select>
              {auth?.site == null && (
                <select
                  id="site"
                  value={site}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="" disabled>
                    {translate.Dashboard.select_site}
                  </option>
                  <option value="1">1</option>
                  <option value="0">2</option>
                  <option value="2">3</option>
                </select>
              )}
              <button onClick={handleNewWidget} disabled={loading} className="kpi-tab">
                {loading ? translate.Dashboard.create_button_loading : translate.Dashboard.create_graph}
              </button>
              {errorWidget && <p className="error-message">{errorWidget}</p>}
              {/* Add more widget types as needed */}
            </div>
          )}
        </div>
      </div>
      <div className="p-3 mb-4">
        {startDate && endDate && granularity && dataSet?.length > 0 && (
          <LineGraphFiltered
            startDate={startDate}
            endDate={endDate}
            increment = {granularity}
            chartData={dataSet}
          />
        )}
      </div>
      {renderGraph()}
      {auth?.site && <KPI />}
      <Chatbot />
    </div>
  );
}

export default Dashboard;
