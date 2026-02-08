import React, { useState, useEffect } from "react";
import "./Species.css";

// --- GBIF Types ---
interface GBIFSuggestResult {
  key: number;
  vernacularName?: string;
  canonicalName: string;
  scientificName: string;
  taxonomicStatus: string;
  kingdom: string;
  family?: string;
}

interface GBIFOccurrenceMedia {
  identifier: string;
}

interface GBIFOccurrenceResult {
  media?: GBIFOccurrenceMedia[];
}

// --- UI Type ---
interface SpeciesData {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  imageUrl: string;
}

// --- Component ---
function Species() {
  const [speciesList, setSpeciesList] = useState<SpeciesData[]>([]);
  const [search, setSearch] = useState<string>("Lion");
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<SpeciesData | null>(null);

  // Fetch image from GBIF occurrences
  const fetchSpeciesImage = async (scientificName: string, fallbackName: string, seed: number) => {
    try {
      const res = await fetch(
        `https://api.gbif.org/v1/occurrence/search?scientificName=${encodeURIComponent(
          scientificName
        )}&mediaType=StillImage&limit=1`
      );
      const data = await res.json();

      const result: GBIFOccurrenceResult | undefined = data.results?.[0];

      if (result?.media && result.media.length > 0) {
        return result.media[0].identifier;
      }
    } catch (err) {
      console.warn("Image fetch failed:", err);
    }

    // Fallback to Unsplash (cache-busted)
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(
      fallbackName + " animal wildlife"
    )}&random=${seed}-${Date.now()}`;
  };

  useEffect(() => {
    const fetchScientificData = async () => {
      if (!search || search.length < 2) return;
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.gbif.org/v1/species/suggest?q=${encodeURIComponent(
            search
          )}&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`
        );

        const data: GBIFSuggestResult[] = await response.json();

        const animals = data
          .filter((item) => item.kingdom === "Animalia")
          .slice(0, 6);

        const formattedData: SpeciesData[] = await Promise.all(
          animals.map(async (item) => {
            const commonName = item.vernacularName || item.canonicalName;

            const imageUrl = await fetchSpeciesImage(
              item.scientificName,
              commonName,
              item.key
            );

            return {
              id: item.key,
              name: commonName,
              scientificName: item.scientificName,
              family: item.family || "Animalia",
              imageUrl,
            };
          })
        );

        setSpeciesList(formattedData);
      } catch (error) {
        console.error("API Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchScientificData, 600);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="species-container">
      <header className="species-header">
        <div className="header-text">
          <h1 className="neon-text">WildPath Taxonomy</h1>
          <p className="subtitle">Scientific Intelligence System</p>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by name (e.g. Elephant, Shark)..."
            className="scientific-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="input-glow"></div>
        </div>
      </header>

      {loading ? (
        <div className="loader-box">
          <div className="pulse-loader"></div>
          <p>Scanning Global Databases...</p>
        </div>
      ) : (
        <div className="scientific-grid">
          {speciesList.map((item) => (
            <div key={item.id} className="scientific-card">
              <div className="card-media">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800";
                  }}
                />
                <div className="card-overlay">
                  <span className="family-label">{item.family}</span>
                </div>
              </div>

              <div className="card-body">
                <h2>{item.name}</h2>
                <p className="sci-tag">{item.scientificName}</p>
                <div className="meta-row">
                  <span className="id-tag">ID: {item.id}</span>
                  <span className="status-badge">ACCEPTED</span>
                </div>
                <button className="spec-btn" onClick={() => setSelected(item)}>
                  Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- FULL REPORT MODAL --- */}
      {selected && (
        <div className="report-modal">
          <div className="report-content">
            <button className="close-btn" onClick={() => setSelected(null)}>
              ✖
            </button>

            <h2>{selected.name}</h2>
            <p><strong>Scientific Name:</strong> {selected.scientificName}</p>
            <p><strong>Family:</strong> {selected.family}</p>
            <p><strong>GBIF ID:</strong> {selected.id}</p>

            <img src={selected.imageUrl} alt={selected.name} />

            <div className="report-section">
              <h3>Species Report</h3>
              <p>
                This species is registered in the Global Biodiversity Information Facility (GBIF).
                Data shown here is retrieved from international biodiversity records and observation datasets.
              </p>
              <p>
                This module can be extended to include distribution maps, conservation status,
                population trends, and ecological impact analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Species;
