import "./addobservation.css";
import { useState } from "react";

export default function AddObservation() {
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const analyzeImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/analyze-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to analyze image");
    }

    return res.json(); // expected: { labels: string[] }
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
        // Auto-fill with top prediction
        setSpecies(result.labels[0]);
      }
    } catch (err) {
      console.error(err);
      alert("AI analysis failed. You can still enter the species manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image for this observation.");
      return;
    }

    console.log({
      species,
      location,
      date,
      notes,
      image,
    });

    alert("Observation added successfully!");

    // Reset form
    setSpecies("");
    setLocation("");
    setDate("");
    setNotes("");
    setImage(null);
    setAiSuggestions([]);

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="observation-container">
      <h1>Add Observation</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="species">Species</label>
        <input
          type="text"
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Enter species name"
          required
        />

        {analyzing && <p>🔍 Analyzing image with AI...</p>}

        {aiSuggestions.length > 0 && (
          <div className="ai-suggestions">
            <p>AI Suggestions:</p>
            <ul>
              {aiSuggestions.map((label, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setSpecies(label)}
                  >
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
        ></textarea>

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <button type="submit" disabled={analyzing}>
          {analyzing ? "Analyzing..." : "Add Observation"}
        </button>
      </form>
    </div>
  );
}
