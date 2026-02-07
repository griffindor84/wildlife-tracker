import React, { useState } from 'react';
import './Observations.css';

interface Sighting {
  id: number;
  speciesName: string;
  date: string;
  location: string;
  type: 'General Sighting' | 'Injured Animal' | 'Illegal Activity';
  reporter: string;
  notes: string;
}

const MOCK_OBSERVATIONS: Sighting[] = [
  {
    id: 1,
    speciesName: "African Elephant",
    date: "2026-02-07",
    location: "Maasai Mara, Kenya",
    type: "General Sighting",
    reporter: "Ian Mathai",
    notes: "A herd of 12 elephants moving towards the watering hole."
  },
  {
    id: 2,
    speciesName: "Black Rhino",
    date: "2026-02-05",
    location: "Ol Pejeta Conservancy",
    type: "Injured Animal",
    reporter: "Ranger John",
    notes: "Adult male found with a minor limp on the rear left leg."
  },
  {
    id: 3,
    speciesName: "Mountain Gorilla",
    date: "2026-01-28",
    location: "Bwindi Forest",
    type: "General Sighting",
    reporter: "Sarah W.",
    notes: "Silverback spotted with three juveniles near the trailhead."
  }
];

function Observations() {
  const [filter, setFilter] = useState('');

  const filteredObservations = MOCK_OBSERVATIONS.filter(obs =>
    obs.speciesName.toLowerCase().includes(filter.toLowerCase()) ||
    obs.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="observations-container">
      <header className="observations-header">
        <div className="header-text">
          <h1>Field Observations</h1>
          <p>Real-time sightings and reports from WildPath users.</p>
        </div>
        
        <div className="filter-box">
          <input 
            type="text" 
            placeholder="Filter by species or location..." 
            className="filter-input"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </header>

      <div className="table-wrapper">
        <table className="observations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Species</th>
              <th>Location</th>
              <th>Report Type</th>
              <th>Reporter</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredObservations.map((obs) => (
              <tr key={obs.id}>
                <td>{obs.date}</td>
                <td className="species-name-cell">{obs.speciesName}</td>
                <td>{obs.location}</td>
                <td>
                  <span className={`type-badge ${obs.type.replace(/\s+/g, '-').toLowerCase()}`}>
                    {obs.type}
                  </span>
                </td>
                <td>{obs.reporter}</td>
                <td className="notes-cell">{obs.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredObservations.length === 0 && (
        <div className="no-results">
          No observations match your search criteria.
        </div>
      )}
    </div>
  );
}

export default Observations;