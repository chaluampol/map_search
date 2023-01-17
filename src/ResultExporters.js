import React, { useEffect } from "react";
import { withSearch } from "@elastic/react-search-ui";
import "./styles.css";

// https://github.com/elastic/search-ui/blob/master/ADVANCED.md#build-your-own-component
function ResultExporters({ filters, clearFilters, results, facets }) {
  const hideExportable = () => {
    console.log("here");
    document.getElementById("export-div").style.display = "none";
  };

  const handleClickJson = () => {
    console.log("Exported to JSON");
    // alert("Exported to KML");
    let d = document.getElementById("dump-results");
    // let j = JSON.parse(d.innerText);
    document.getElementById("export-div").innerText = d.innerText;
    document.getElementById("export-div").style.display = "";
  };

  const handleClickKml = () => {
    console.log("Exported to KML");
    // alert("Exported to KML");
    // let d = document.getElementById("dump-results");
    // let j = JSON.parse(d.innerText);
    document.getElementById("export-div").innerText =
      "Why are you still using XML";
    document.getElementById("export-div").style.display = "";
  };

  const handleClickExcel = () => {
    console.log("Exported to CSV");
    document.getElementById("export-div").style.display = "";
    let d = document.getElementById("dump-results");
    let j = JSON.parse(d.innerText);
    let x = "";
    for (let i in j) {
      let e = j[i];
      console.log(e);
      let a = [
        e.title.snippet,
        e.id.raw,
        e.nps_link.raw,
        e.description.snippet,
        e.location.raw
      ];
      console.log(a);
      let b = a.join(",") + "\n";
      console.log(b);
      x = x + b;
    }
    document.getElementById("export-div").innerText = x;
  };

  useEffect(() => {
    document.getElementById("export-div").style.display = "none";
  });

  return (
    <div className="export-buttons">
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={handleClickJson}
        style={{ marginRight: "10px" }}
      >
        Export to JSON
      </button>

      <button
        type="button"
        className="btn btn-sm btn-info"
        onClick={handleClickKml}
        style={{ marginRight: "10px" }}
      >
        Export to KML
      </button>

      <button
        type="button"
        className="btn btn-sm btn-success"
        onClick={handleClickExcel}
        style={{ marginRight: "10px" }}
      >
        Export to Excel
      </button>

      <button
        className="btn btn-sm btn-outline-secondary"
        onClick={hideExportable}
      >
        Hide File Exports
      </button>

      <div id="dump-results" style={{ display: "none" }}>
        {JSON.stringify(
          results.map(e => {
            return e;
          })
        )}
      </div>

      <div
        id="export-div"
        style={{
          display: "none",
          margin: "10px",
          border: "1px",
          padding: "10px",
          borderStyle: "solid",
          borderColor: "black"
        }}
      >
        {JSON.stringify(
          results.map(e => {
            return e;
          })
        )}
      </div>
    </div>
  );
}

export default withSearch(({ filters, clearFilters, results, facets }) => ({
  filters,
  clearFilters,
  results,
  facets
}))(ResultExporters);
