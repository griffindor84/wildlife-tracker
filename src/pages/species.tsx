import React, { useState } from 'react';
import './Species.css';

interface SpeciesData {
  id: number;
  name: string;
  scientificName: string;
  status: string;
  habitat: string;
  imageUrl: string;
}

const SPECIES_LIST: SpeciesData[] = [
  {
    id: 1,
    name: "African Elephant",
    scientificName: "Loxodonta africana",
    status: "Endangered",
    habitat: "Savannah",
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500"
  },
  {
    id: 2,
    name: "Grevy's Zebra",
    scientificName: "Equus grevyi",
    status: "Vulnerable",
    habitat: "Semi-arid Scrubland",
    imageUrl: "https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=500"
  },
  {
    id: 3,
    name: "Black Rhino",
    scientificName: "Diceros bicornis",
    status: "Endangered",
    habitat: "Grasslands",
    imageUrl: "https://images.unsplash.com/photo-1534190240409-90656094254c?w=500"
  }
];

function Species() {
  const [search, setSearch] = useState("");

  const filteredItems = SPECIES_LIST.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="species-container">
      <header className="species-header">
        <h1>WildPath Species Catalog</h1>
        <input 
          type="text" 
          placeholder="Search wildlife..." 
          className="search-bar"
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <div className="species-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="species-card">
            <div className="card-image-container">
              <img src={item.imageUrl} alt={item.name} />
              <span className={`status-badge ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
            <div className="card-content">
              <h2>{item.name}</h2>
              <p className="scientific-name">{item.scientificName}</p>
              <p className="habitat-info"><strong>Habitat:</strong> {item.habitat}</p>
              <button className="details-btn">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Species;