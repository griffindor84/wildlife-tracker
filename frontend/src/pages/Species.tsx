import React, { useState, useEffect } from "react";
import "./Species.css";
import api from '../api/axios';

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

interface GBIFSpeciesDetail {
  key: number;
  rank: string;
  taxonomicStatus: string;
  kingdom: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  scientificName: string;
  canonicalName: string;
}

// --- UI Type ---
interface SpeciesData {
  id: number;
  name: string;
  scientificName: string;
  family: string;
  imageUrl: string;
}

function Species() {
  const [speciesList, setSpeciesList] = useState<SpeciesData[]>([]);
  const [search, setSearch] = useState<string>("Panthera uncia");
  const [loading, setLoading] = useState<boolean>(false);

  const [selected, setSelected] = useState<SpeciesData | null>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<GBIFSpeciesDetail | null>(null);
  const [occurrenceCount, setOccurrenceCount] = useState<number>(0);


  const [trackedSpecies, setTrackedSpecies] = useState<any[]>([]);
useEffect(() => {
  api.get('/wildlife').then(res => setTrackedSpecies(res.data)).catch(console.error);
}, []);

{/* Tracked Species from Database */}
{trackedSpecies.length > 0 && (
  <div className="tracked-section">
    <h2 className="tracked-title">🐾 Our Tracked Species</h2>
    <div className="tracked-grid">
      {trackedSpecies.map((animal) => (
        <div key={animal.id} className="tracked-card">
          <div className="tracked-body">
            <h3>{animal.name}</h3>
            <p className="tracked-scientific">{animal.species || '—'}</p>
            <div className="tracked-meta">
              <span className="tracked-habitat">🌍 {animal.habitat || 'Unknown'}</span>
              <span className={`tracked-status ${animal.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {animal.status || 'Unknown'}
              </span>
            </div>
            {animal.description && (
              <p className="tracked-desc">{animal.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

  // Fetch image from GBIF occurrences
  const fetchSpeciesImage = async (
    scientificName: string,
    fallbackName: string,
    seed: number
  ): Promise<string> => {
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

  const openFullReport = async (item: SpeciesData) => {
    setSelected(item);
    setReportLoading(true);
    setReportData(null);

    try {
      const [detailRes, occRes] = await Promise.all([
        fetch(`https://api.gbif.org/v1/species/${item.id}`),
        fetch(`https://api.gbif.org/v1/occurrence/search?taxonKey=${item.id}&limit=0`),
      ]);

      const detailData: GBIFSpeciesDetail = await detailRes.json();
      const occData = await occRes.json();

      setReportData(detailData);
      setOccurrenceCount(occData.count || 0);
    } catch (err) {
      console.error("Failed to load full report", err);
    } finally {
      setReportLoading(false);
    }
  };

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
            placeholder="Search by scientific name (e.g. Panthera uncia)..."
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
                <button className="spec-btn" onClick={() => openFullReport(item)}>
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
            <button
              className="close-btn"
              onClick={() => {
                setSelected(null);
                setReportData(null);
              }}
            >
              ✖
            </button>

            {reportLoading || !reportData ? (
              <p>Loading full species report...</p>
            ) : (
              <>
                <h2>{reportData.canonicalName}</h2>
                <img src={selected.imageUrl} alt={selected.name} />

                <div className="report-grid">
                  <p><strong>Scientific Name:</strong> {reportData.scientificName}</p>
                  <p><strong>Rank:</strong> {reportData.rank}</p>
                  <p><strong>Status:</strong> {reportData.taxonomicStatus}</p>
                  <p><strong>Kingdom:</strong> {reportData.kingdom}</p>
                  <p><strong>Phylum:</strong> {reportData.phylum || "—"}</p>
                  <p><strong>Class:</strong> {reportData.class || "—"}</p>
                  <p><strong>Order:</strong> {reportData.order || "—"}</p>
                  <p><strong>Family:</strong> {reportData.family || "—"}</p>
                  <p><strong>Genus:</strong> {reportData.genus || "—"}</p>
                  <p><strong>GBIF Records:</strong> {occurrenceCount.toLocaleString()}</p>
                </div>

                <div className="report-section">
                  <h3>Scientific Summary</h3>
                  <p>
                    This taxon is registered in the Global Biodiversity Information Facility (GBIF).
                    The dataset currently contains <strong>{occurrenceCount.toLocaleString()}</strong> occurrence records worldwide.
                  </p>
                  <p>
                    Classification data is compiled from global biodiversity authorities and curated taxonomic sources.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Species;
