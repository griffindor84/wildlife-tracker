
import "../App.css";
import { Link } from "react-router-dom";

{/* Somewhere in hero or CTA */ }
<Link to="/admin/dashboard">
    <button className="primary">Admin Panel</button>
</Link>


const Home = () => {
    return (
        <main className="home">
            {/* Header */}


            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <h2>Protect Wildlife Through Smart Tracking</h2>
                    <p>
                        Track animal movements, monitor habitats, and support conservation
                        decisions using real-time data and analytics.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary">Start Tracking</button>
                        <button className="secondary">Explore Live Map</button>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats">
                <Stat value="120+" label="Animals Tracked" />
                <Stat value="15" label="Protected Zones" />
                <Stat value="24/7" label="Live Monitoring" />
                <Stat value="8" label="Species Covered" />
            </section>

            {/* Features */}
            <section className="features">
                <h2>What You Can Do</h2>
                <p className="section-subtitle">
                    Powerful tools designed for rangers, researchers, and conservationists
                </p>

                <div className="feature-grid">
                    <Feature
                        icon="🗺️"
                        title="Live Tracking"
                        description="Monitor animal locations in real time on an interactive map."
                    />
                    <Feature
                        icon="🐘"
                        title="Species Management"
                        description="Organize, monitor, and analyze different wildlife species."
                    />
                    <Feature
                        icon="📊"
                        title="Reports & Insights"
                        description="Generate movement and behavior reports for research."
                    />
                    <Feature
                        icon="🚨"
                        title="Alerts & Safety"
                        description="Receive alerts for unusual movements or danger zones."
                    />
                </div>
            </section>

            {/* Species */}
            <section className="species">
                <h2>Tracked Species</h2>

                <div className="species-grid">
                    {["Elephant", "Lion", "Rhino", "Giraffe"].map((animal) => (
                        <div key={animal} className="card species-card">
                            <span className="species-icon">🐾</span>
                            <h3>{animal}</h3>
                            <p>Conservation monitored</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <h2>Join the Mission to Protect Wildlife</h2>
                <p>
                    Be part of a data-driven approach to conservation and environmental
                    protection.
                </p>
                <button className="primary large">Get Started</button>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 Wildlife Tracker | Conservation Through Technology</p>
            </footer>
        </main>
    );
};

export default Home;

/* Components  */

type FeatureProps = {
    icon: string;
    title: string;
    description: string;
};

const Feature = ({ icon, title, description }: FeatureProps) => (
    <div className="card feature-card">
        <span className="feature-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

type StatProps = {
    value: string;
    label: string;
};

const Stat = ({ value, label }: StatProps) => (
    <div className="stat">
        <h3>{value}</h3>
        <p>{label}</p>
    </div>
);
