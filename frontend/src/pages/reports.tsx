import { useState } from "react";
import LocationMap from "../components/LocationMap";
import type { Coords } from "../components/LocationMap";
import "./reports.css";

function Reports() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coords, setCoords] = useState<Coords | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reportData = {
      locationText: selectedLocation,
      coordinates: coords,
    };

    console.log("Submitting report:", reportData);
    alert("Report submitted! (Check console for data)");
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentCoords: Coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoords(currentCoords);
          setSelectedLocation(
            `Lat: ${currentCoords.lat.toFixed(5)}, Lng: ${currentCoords.lng.toFixed(5)}`
          );
        },
        (error) => {
          alert("Unable to get your location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="reports-page">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>🐾 Submit Wildlife Report</h1>
          <center>
            <p>
              Help protect wildlife by reporting sightings, unusual activities, or conservation concerns.
            </p>
          </center>
        </div>
      </section>

      <div className="container">
        <div className="form-container">
          {/* Left: Report Form */}
          <div className="form-section">
            <div className="form-header">
              <h2>📝 Report Details</h2>
            </div>

            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Report Type</label>
                  <select className="form-control">
                    <option>Illegal Activity</option>
                    <option>Injured Animal</option>
                    <option>Habitat Destruction</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Species</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. African Elephant"
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Click on the map to select location"
                    value={selectedLocation}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCurrentLocation}
                    style={{ marginTop: "0.5rem" }}
                  >
                    📍 Use Current Location
                  </button>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input type="datetime-local" className="form-control" />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Describe what you observed..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Upload Photo</label>
                  <input type="file" className="form-control" />
                </div>

                <div className="form-actions">
                  <button type="reset" className="btn btn-secondary">
                    Clear
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Map + Guidelines */}
          <div className="form-section">
            <div className="form-header">
              <h2>🗺️ Location Preview</h2>
            </div>

            <div className="form-body">
              <div className="map-container">
                <LocationMap
                  onLocationSelect={(coords: Coords) => {
                    setCoords(coords);
                    setSelectedLocation(
                      `Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}`
                    );
                  }}
                  initialCoords={coords}
                />
              </div>

              <div className="guidelines">
                <h3>Reporting Guidelines</h3>
                <ul>
                  <li>Be specific about location and time</li>
                  <li>Include photos when possible</li>
                  <li>Do not approach dangerous animals</li>
                  <li>For emergencies, contact authorities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
