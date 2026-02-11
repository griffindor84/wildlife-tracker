import React, { useState } from 'react';
import './Observations.css';

// Interface to ensure data accuracy 
interface Sighting {
  id: number;
  userId: string; 
  speciesName: string;
  date: string;
  location: string;
  type: 'General Sighting' | 'Injured Animal' | 'Illegal Activity';
  notes: string;
}

const ALL_DATA: Sighting[] = [
  { 
    id: 1, 
    userId: "ian_mathai", 
    speciesName: "African Elephant", 
    date: "2026-02-07", 
    location: "Maasai Mara", 
    type: "General Sighting", 
    notes: "A large herd of around 15 elephants was seen moving toward the southern riverbank during the golden hour. Truly a majestic sight." 
  },
  { 
    id: 2, 
    userId: "Ian_mathai", 
    speciesName: "Black Rhino", 
    date: "2026-02-05", 
    location: "Nyeri", 
    type: "Injured Animal", 
    notes: "Spotted near the edge of the conservancy. It appeared to have a slight limp on its left front leg. Reported to local rangers." 
  },
  { 
    id: 3, 
    userId: "other_user", 
    speciesName: "Mountain Gorilla", 
    date: "2026-02-01", 
    location: "Bwindi", 
    type: "General Sighting", 
    notes: "This shouldn't be visible to Ian." 
  }
];

function Observations() {
  // Simulate the logged-in user session
  const currentUserId = "ian_mathai"; 
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filter only the data belonging to the current user
  const myObservations = ALL_DATA.filter(obs => obs.userId === currentUserId);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="observations-container">
      <header className="observations-header">
        <div className="header-content">
          <h1>My Field Reports</h1>
          <p>Personal log of wildlife sightings and alerts.</p>
        </div>
        <div className="stats-badge">
          Total Reports: {myObservations.length}
        </div>
      </header>

      <div className="table-wrapper">
        <table className="observations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Species</th>
              <th>Location</th>
              <th>Type</th>
              <th>Notes (Click to expand)</th>
            </tr>
          </thead>
          <tbody>
            {myObservations.map((obs) => (
              <tr 
                key={obs.id} 
                onClick={() => toggleExpand(obs.id)} 
                className={`obs-row ${expandedId === obs.id ? 'active' : ''}`}
              >
                <td className="date-cell">{obs.date}</td>
                <td className="species-cell">{obs.speciesName}</td>
                <td>{obs.location}</td>
                <td>
                  <span className={`type-tag ${obs.type.replace(/\s+/g, '-').toLowerCase()}`}>
                    {obs.type}
                  </span>
                </td>
                <td className={`notes-text ${expandedId === obs.id ? 'full' : 'truncated'}`}>
                  {obs.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {myObservations.length === 0 && (
        <div className="empty-state">
          <p>You haven't added any observations yet.</p>
        </div>
      )}
    </div>
  );
}

export default Observations;