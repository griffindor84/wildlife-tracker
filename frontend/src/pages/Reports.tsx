import { useState, useEffect } from "react";
import LocationMap from "../components/LocationMap";
import type { Coords } from "../components/LocationMap";
import api from "../api/axios";
import "./Reports.css";

interface Report {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_name?: string;
}

function Reports() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("Illegal Activity");
  const [species, setSpecies] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoadingReports(false);
    }
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
          setSelectedLocation(`Lat: ${currentCoords.lat.toFixed(5)}, Lng: ${currentCoords.lng.toFixed(5)}`);
        },
        (error) => alert("Unable to get your location: " + error.message)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const fullTitle = `${reportType} — ${species || 'Unknown species'}`;
      const fullDescription = `${description}\n\nLocation: ${selectedLocation || 'Not specified'}\nDate: ${date || 'Not specified'}`;

      await api.post('/reports', {
        title: title || fullTitle,
        description: fullDescription,
      });

      setSuccess("Report submitted successfully!");
      setTitle("");
      setSpecies("");
      setDate("");
      setDescription("");
      setSelectedLocation("");
      setCoords(null);
      fetchReports();
    } catch (err) {
      setError("Failed to submit report. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reports-page">
      <section className="page-header">
        <div className="container">
          <h1>🐾 Submit Wildlife Report</h1>
          <center>
            <p>Help protect wildlife by reporting sightings, unusual activities, or conservation concerns.</p>
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
              {error   && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Report Type</label>
                  <select className="form-control" value={reportType} onChange={e => setReportType(e.target.value)}>
                    <option>Illegal Activity</option>
                    <option>Injured Animal</option>
                    <option>Habitat Destruction</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title (optional)</label>
                  <input type="text" className="form-control" placeholder="Brief report title"
                    value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Species</label>
                  <input type="text" className="form-control" placeholder="e.g. African Elephant"
                    value={species} onChange={e => setSpecies(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="form-control"
                    placeholder="Click on the map to select location"
                    value={selectedLocation} readOnly />
                  <button type="button" className="btn btn-secondary"
                    onClick={handleCurrentLocation} style={{ marginTop: "0.5rem" }}>
                    📍 Use Current Location
                  </button>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input type="datetime-local" className="form-control"
                    value={date} onChange={e => setDate(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" placeholder="Describe what you observed..."
                    value={description} onChange={e => setDescription(e.target.value)} />
                </div>

                <div className="form-actions">
                  <button type="reset" className="btn btn-secondary">Clear</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
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
                    setSelectedLocation(`Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}`);
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

        {/* My Reports Table */}
        <div className="my-reports-section">
          <h2>📋 My Reports</h2>
          {loadingReports ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="empty-state">You haven't submitted any reports yet.</p>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.title}</td>
                    <td>
                      <span className={`status-tag ${report.status}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;