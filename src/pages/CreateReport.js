import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css"; 
import "./css/CreateReport.css";
import { AuthContext } from "../hooks/user";
import { TranslationContext } from "../hooks/translation";

// This page is in common between SMO and FFM
// Allows them to create a report choosing the time period
// The SMO has too choose on which site too (with a button only a SMO user can see)

// The language choice is for future implementation 

const CreateReport = () => {
  const auth = useContext(AuthContext);
  const { translate } = React.useContext(TranslationContext); // Gets the context of the translation
  const [language, setLanguage] = useState("italian"); // State for language
  const [startDate, setStartDate] = useState(null); // Start Date state
  const [endDate, setEndDate] = useState(null); // End Date state
  const [site, setSite] = useState(auth?.site ?? 1); // State for site, default to the one in the context or 1
  const [operation, setOperation] = useState("avg"); // State for frequency
  const [name, setName] = useState(""); // State for report name
  const [selectedKPIs, setSelectedKPIs] = useState([]); // State for selected KPIs
  const [loadingKPIs, setLoadingKPIs] = useState(false); // State for loading status KPIS
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [kpis, setKpis] = useState([]); // State for KPIs options to show to user

  // Fetch KPIs data from API
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

        const response = await fetch(
          `https://api-656930476914.europe-west1.run.app/api/v1.0/kpi/?site=${site}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Failed to fetch KPIs");
        }

        const data = await response.json();
        setKpis(data.data); // the .data is an array of objects
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingKPIs(false);
      }
    };

    fetchKPIs();
  }, [site]);

  // Handle name input change
  const handleNameChange = (newName) => {
    setName(newName);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Handle site change
  const handleSiteChange = (site) => {
    setSite(site);
  };

  // Handle operation change
  const handleOperationChange = (newOperation) => {
    setOperation(newOperation);
  };

  // Handle KPIs selection change (multi-select)
  const handleKPIChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedKPIs(selectedValues);
  };

  // Handle download button click
  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const myHeaders = new Headers();
      const storedToken = localStorage.getItem("token");
      myHeaders.append("Authorization", `Bearer ${storedToken}`);
      myHeaders.append("Content-Type", "application/json");

      const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") + " 00:00:00"  : null;
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") + " 00:00:00"  : null;

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          name: name,
          site: site,
          kpi_names: selectedKPIs,
          language: language,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          operation: operation,
        }),
      };

      const response = await fetch(
        `https://api-656930476914.europe-west1.run.app/api/v1.0/report/`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to create");
      }

      const data = await response.json();

      if (data?.data) {
        const link = document.createElement("a");
        link.href = data.data.url;
        link.download = name || "report"; // If user doesn't provide a name, default to report
        link.target = "_blank"; // Opens in a new tab
        document.body.appendChild(link); // Append to DOM temporarily
        link.click();
        document.body.removeChild(link); // Clean up
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-report-container align-items-center">
      {/* Name Input */}
      <div className="name-input-container">
        <label htmlFor="report-name" className="name-label">
          {translate.CreateReport.name}
        </label>
        <input
          id="report-name"
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder={translate.CreateReport.insert}
          className="name-input"
        />
      </div>

      {/* Language Dropdown */}
      <div className="dropdown-container">
        <label htmlFor="language" className="dropdown-label">
          {translate.CreateReport.language}
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="dropdown-select"
        >
          <option value="" disabled>
            {translate.CreateReport.select_language}
          </option>
          <option value="italian">{translate.CreateReport.it}</option>
          <option value="english">{translate.CreateReport.eng}</option>
          <option value="french">{translate.CreateReport.fr}</option>
        </select>
      </div>

      {
        auth?.site === null && (
          <div className="dropdown-container">
            <label htmlFor="site" className="dropdown-label">
              {translate.CreateReport.site}
            </label>
            <select
              id="site"
              value={site}
              onChange={(e) => handleSiteChange(e.target.value)}
              className="dropdown-select"
            >
              <option value="" disabled>
              {translate.CreateReport.select_site}
              </option>
              <option value="1">1</option>
              <option value="0">2</option>
              <option value="2">3</option>
            </select>
          </div>
        )
      }
      

      {/* Date Pickers */}
      <div className="date-picker-container">
        <label htmlFor="start-date" className="date-label">
        {translate.CreateReport.start_date}
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy/MM/dd"
          className="date-picker"
          placeholderText={translate.CreateReport.select_sdate}
        />
      </div>

      <div className="date-picker-container">
        <label htmlFor="end-date" className="date-label">
        {translate.CreateReport.end_date}
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy/MM/dd"
          className="date-picker"
          placeholderText={translate.CreateReport.select_edate}
        />
      </div>

      {/* Operation Dropdown */}
      <div className="dropdown-container">
        <label htmlFor="operation" className="dropdown-label">
          {translate.CreateReport.op}
        </label>
        <select
          id="operation"
          value={operation}
          onChange={(e) => handleOperationChange(e.target.value)}
          className="dropdown-select"
        >
          <option value="" disabled>
            {translate.CreateReport.select_op}
          </option>
          <option value="avg">{translate.CreateReport.op_avg}</option>
          <option value="min">{translate.CreateReport.op_min}</option>
          <option value="max">{translate.CreateReport.op_max}</option>
          <option value="sum">{translate.CreateReport.op_sum}</option>
          <option value="std">{translate.CreateReport.op_std}</option>
        </select>
      </div>

      {/* Select KPIs Dropdown (Multi-choice) */}
      <div className="dropdown-container">
        <label htmlFor="kpis" className="dropdown-label">
          {translate.CreateReport.kpis}
        </label>
        <select
          id="kpis"
          multiple
          value={selectedKPIs}
          onChange={handleKPIChange}
          className="dropdown-select"
        >
          {loadingKPIs && <option>Loading KPIs...</option>} {/* Loading state */}
          {error && <option>Error loading KPIs</option>} {/* Error state */}
          {!loadingKPIs &&
            !error &&
            kpis.map((kpi) => (
              <option key={kpi.id} value={kpi.id}>
                {kpi.name}
              </option>
            ))}
        </select>
        <small>{translate.CreateReport.press_ctrl}</small>
      </div>

      {/* Download Button */}
      <div className="button-container">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="generate-report-button"
        >
          {loading ? `${translate.CreateReport.generate_loading}` : `${translate.CreateReport.generate_button}`}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CreateReport;