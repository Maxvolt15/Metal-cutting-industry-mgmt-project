import React, { useState, useEffect } from "react";
import "./css/Sites.css";
import KPI from "../components/KPIs";
import { TranslationContext } from "../hooks/translation";

// This is a page that only the SMO has access to.
// The sites pages allow the user to see in details the different sites

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const { translate } = React.useContext(TranslationContext); // Gets the context of the translation

  useEffect(() => {
    // Fetch the sites data from JSON file
    fetch("./Sitesdata.json")
      .then((response) => response.json())
      .then((data) => setSites(data))
      .catch((error) => console.error("Error fetching site data:", error));
  }, []);

  const selectSite = (site) => {
    setSelectedSite(site);
  };

  return (
    <div className="sites-page d-flex flex-column overflow-scroll w-100 m-4">
      <h1 className="page-title">{translate.Sites.title}</h1>
      <div className="sites-grid">
        {sites.map((site) => (
          <div className="site-card no-border" key={site.id}>
            <h2 className="site-name">{site.name}</h2>
            <p className="site-location">{site.location}</p>
            <p className="ffm-details">
              <strong>FFM:</strong> {site.ffm}
            </p>
            <p className="stats">
              <strong>{translate.Sites.tot_machines}</strong> {site.machines}
            </p>
            <p className="stats alerts">
              <strong>{translate.Sites.alerts}</strong> {site.alerts}
            </p>
            <p className="last-maintenance">
              <strong>{translate.Sites.last_maint}</strong>{" "}
              {site.lastMaintenance}
            </p>
            <button
              className="view-details-btn"
              onClick={() => selectSite(site)}
              disabled={site.id !== 1}
            >
              {translate.Sites.details}
            </button>
          </div>
        ))}
      </div>

      {selectedSite && (
        <div className="site-detail">
          <button className="close-btn" onClick={() => setSelectedSite(null)}>
            {translate.Sites.close_button}
          </button>
          <KPI />
        </div>
      )}
    </div>
  );
};

export default SitesPage;
