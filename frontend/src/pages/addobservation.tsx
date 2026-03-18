import "./addobservation.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Wildlife {
  id: number;
  name: string;
  species: string;
}

export default function AddObservation() {
  const navigate = useNavigate();
  const [wildlife, setWildlife]       = useState<Wildlife[]>([]);
  const [wildlifeId, setWildlifeId]   = useState<number | ''>('');
  const [species, setSpecies]         = useState("");
  const [location, setLocation]       = useState("");
  const [date, setDate]               = useState("");
  const [notes, setNotes]             = useState("");
  const [image, setImage]             = useState<File | null>(null);
  const [analyzing, setAnalyzing]     = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    // Load wildlife list for dropdown
    api.get('/wildlife').then(res => setWildlife(res.data)).catch(console.error);
  }, []);

  const analyzeImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze-image`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to analyze image");
    return res.json();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImage(file);
    try {
      setAnalyzing(true);
      setAiSuggestions([]);
      const result = await analyzeImage(file);
      if (result.labels && result.labels.length > 0) {
        setAiSuggestions(result.labels);
        setSpecies(result.labels[0]);
      }
    } catch (err) {
      console.error(err);
      alert("AI analysis failed. You can still enter the species manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/observations', {
        wildlife_id:  wildlifeId || null,
        location,
        notes,
        observed_at: date ? new Date(date).toISOString() : new Date().toISOString(),
      });

      alert("Observation added successfully!");
      navigate('/observations');
    } catch (err) {
      setError('Failed to add observation. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="observation-container">
      <h1>Add Observation</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* Wildlife dropdown */}
        <label htmlFor="wildlife">Species (from database)</label>
        <select
          id="wildlife"
          value={wildlifeId}
          onChange={(e) => setWildlifeId(Number(e.target.value))}
        >
          <option value="">-- Select a species --</option>
          {wildlife.map(w => (
            <option key={w.id} value={w.id}>{w.name} ({w.species})</option>
          ))}
        </select>

        {/* Manual species input */}
        <label htmlFor="species">Or enter species manually</label>
        <input
          type="text"
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Enter species name"
        />

        {analyzing && <p>🔍 Analyzing image with AI...</p>}

        {aiSuggestions.length > 0 && (
          <div className="ai-suggestions">
            <p>AI Suggestions:</p>
            <ul>
              {aiSuggestions.map((label, idx) => (
                <li key={idx}>
                  <button type="button" onClick={() => setSpecies(label)}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          required
        />

        <label htmlFor="date">Date of Observation</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any other details..."
        />

        <label htmlFor="image">Upload Image (optional — AI will analyze)</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit" disabled={analyzing || submitting}>
          {submitting ? 'Saving...' : analyzing ? 'Analyzing...' : 'Add Observation'}
        </button>
      </form>
    </div>
  );
}