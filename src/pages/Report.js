import React, { useContext, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTable } from "react-table"; 
import { Link } from "react-router-dom";
import "./css/Report.css";
import { TranslationContext } from '../hooks/translation'

// The report page is the Report History page, allows the user to see all the history they created
// there is also a button called create report that routes them to the create report page

const Report = () => {
  const [reports, setReports] = useState([]); // State to hold reports
  const [loadingReports, setLoadingReports] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for error
  const { translate } = useContext(TranslationContext)
  // Fetch reports on page load
  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      setError(null);

      const storedToken = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${storedToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://api-656930476914.europe-west1.run.app/api/v1.0/report/",
          requestOptions
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const result = await response.json(); // Parse the JSON response
        if (result.success) {
          setReports(result.data); // Store the data in the state
        } else {
          throw new Error(result.message || "Failed to fetch reports");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  // Handle deleting the report from the API and UI
  const handleDelete = async (reportId) => {
    const storedToken = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${storedToken}`);

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      // Make the API DELETE request to delete the report
      const response = await fetch(
        `https://api-656930476914.europe-west1.run.app/api/v1.0/report/${reportId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      // If the deletion is successful, update the UI by filtering out the deleted report
      setReports(prevReports => prevReports.filter(report => report._id !== reportId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Define columns for react-table
  const columns = React.useMemo(
    () => [
      {
        Header: translate.Report.header_1,
        accessor: "name", // Corresponds to the "name" field in the API response
      },
      {
        Header: translate.Report.header_2,
        accessor: "url", // Corresponds to the "url" field in the API response
        Cell: ({ value }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {translate.Report.header_2}
          </a>
        ), // Custom cell rendering to create a clickable link
      },
      {
        Header: translate.Report.header_3,
        Cell: ({ row }) => (
          <button
            className="delete-button"
            onClick={() => handleDelete(row.original._id)} // Pass the report id to the delete handler
          >
          <RiDeleteBin6Line />
          </button>
        ),
      },
    ],
    [translate.Report.header_1, translate.Report.header_2, translate.Report.header_3] // Re-render on data change
  );

  const data = React.useMemo(() => reports, [reports]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="Report d-flex flex-grow-1">
      <div className="container d-flex flex-column pt-3 gap-3">
        <h1>{translate.Report.title}</h1>
        <div className="d-flex align-items-center">
          <p>{translate.Report.subtitle}</p>

          {/* Button to create a new report */}
          <div className=" ms-auto">
            <Link to="/report/createreport" className="create-report-button">
              <span>{translate.Report.create_report}</span>
            </Link>
          </div>
        </div>

        {/* Show loading spinner or error */}
        {loadingReports && <p>{translate.Report.loading}</p>}
        {error && <p className="error">{error}</p>}

        {/* Table for displaying reports */}
        {!loadingReports && reports.length > 0 && (
          <table {...getTableProps()} className="reports-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* No reports available */}
        {!loadingReports && reports.length === 0 && !error && (
          <p>{translate.Report.no_reports}</p>
        )}
      </div>
    </div>
  );
};

export default Report;
