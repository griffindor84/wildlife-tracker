import "./reports.css";

function Reports() {
  return (
    <div className="reports-page">
      
      <section className="page-header">
        <div className="container">
          <h1>🐾 Submit Wildlife Report</h1>
          <center><p>
            Help protect wildlife by reporting sightings, unusual activities, or
            conservation concerns.
          </p></center>
        </div>
      </section>

      <div className="container">
        <div className="form-container">
        
          <div className="form-section">
            <div className="form-header">
              <h2>📝 Report Details</h2>
            </div>

            <div className="form-body">
              <form>
                <div className="form-group">
                  <label>Report Type</label>
                  <select className="form-control">
                    <option>Illegal Activity</option>
                    <option>Injured Animal</option>
                    <option>Habitat Destruction</option>
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
                  <div className="location-inputs">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Latitude"
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Longitude"
                    />
                  </div>
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

        
          <div className="form-section">
            <div className="form-header">
              <h2>🗺️ Location Preview</h2>
            </div>
            <div className="form-body">
              <div className="map-container">
                <div className="map-placeholder">
                  <h3>Map Preview</h3>
                  <p>Location will appear here</p>
                </div>
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
