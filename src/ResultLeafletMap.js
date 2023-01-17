import React, { useEffect, useState } from "react";
import { withSearch } from "@elastic/react-search-ui";
import { Map, Marker, Popup, TileLayer, FeatureGroup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "./styles.css";

// https://github.com/elastic/search-ui/blob/master/ADVANCED.md#build-your-own-component
function ResultLeafletMap({ filters, clearFilters, results, facets }) {
  const [parkMarkers, setParkMarkers] = useState([]);
  const [ctr, setCtr] = useState([38.86, -77.069]);
  const [bbox, setBbox] = useState([[32.2499, -110.5], [32.25, -110.5001]]);

  const hideMapExportable = () => {
    document.getElementById("map-export-div").style.display = "none";
  };

  const handleClickShowMapExport = () => {
    // console.log("handleClickShowPoints");
    document.getElementById("map-export-div").style.display = "";
    let x = results.map((pos, idx) => {
      return {
        idx: `marker-${idx}`,
        title: `${pos.title.snippet}`,
        location: `${pos.location.raw.split(",")}`
      };
    });
    document.getElementById("map-export-div").innerText = JSON.stringify(x);
  };

  useEffect(() => {
    document.getElementById("map-export-div").style.display = "none";

    // document.getElementById("map-export-div").style.display = "none";
    let pm = results.map((pos, idx) => {
      let key = `marker-${idx}`;
      let p = pos.location.raw.split(",");
      // console.debug(pos, idx);
      return [key, p];
    });
    setParkMarkers(pm);

    // Calculate the bounding box
    // https://gis.stackexchange.com/questions/172554/calculating-bounding-box-of-given-set-of-coordinates-from-leaflet-draw
    let lats = results.map((pos, idx) => {
      let lat = pos.location.raw.split(",")[0];
      // console.debug(pos, idx);
      return parseFloat(lat);
    });
    let lngs = results.map((pos, idx) => {
      let lng = pos.location.raw.split(",")[1];
      // console.debug(pos, idx);
      return parseFloat(lng);
    });

    if (lats.length === 1) {
      // calc the min and max lng and lat
      let minlat = Math.min.apply(null, lats),
        maxlat = Math.max.apply(null, lats);
      let minlng = Math.min.apply(null, lngs),
        maxlng = Math.max.apply(null, lngs);

      // create a bounding rectangle that can be used in leaflet
      let bb = [
        [minlat - 0.001, minlng - 0.001],
        [maxlat + 0.001, maxlng + 0.001]
      ];
      console.info(`Setting bbox to: ${bb}`);
      setBbox(bb);
    }
    if (lats.length > 1) {
      // calc the min and max lng and lat
      let minlat = Math.min.apply(null, lats),
        maxlat = Math.max.apply(null, lats);
      let minlng = Math.min.apply(null, lngs),
        maxlng = Math.max.apply(null, lngs);

      // create a bounding rectangle that can be used in leaflet
      let bb = [[minlat, minlng], [maxlat, maxlng]];
      console.info(`Setting bbox to: ${bb}`);
      setBbox(bb);
    }
  }, [results]);

  let leafletMap = (
    <Map
      bounds={bbox}
      center={ctr}
      zoom={2}
      style={{ height: "270px" }}
      useFlyTo={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <FeatureGroup>
        {results.map((pos, idx) => (
          <Marker key={`marker-${idx}`} position={pos.location.raw.split(",")}>
            <Popup>
              <h4>{pos.title.snippet}</h4>
              {pos.description.snippet}
            </Popup>
          </Marker>
        ))}
      </FeatureGroup>
    </Map>
  );
  return (
    <>
      {leafletMap}

      <div className="export-buttons">
        <button
          className="btn btn-sm btn-warning"
          onClick={handleClickShowMapExport}
          style={{ marginRight: "10px" }}
        >
          Show Map Export
        </button>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={hideMapExportable}
        >
          Hide Map Export
        </button>

        <div id="map-dump-results" style={{ display: "none" }}>
          {JSON.stringify(
            results.map(e => {
              return e.location.raw;
            })
          )}
        </div>

        <div
          id="map-export-div"
          style={{
            display: "none",
            height: "200px",
            margin: "10px",
            border: "1px",
            padding: "10px",
            borderStyle: "solid",
            borderColor: "gray",
            overflow: "scroll",
            background: "CornSilk"
          }}
        >
          {parkMarkers}
        </div>
      </div>
    </>
  );
}

export default withSearch(({ filters, clearFilters, results, facets }) => ({
  filters,
  clearFilters,
  results,
  facets
}))(ResultLeafletMap);
