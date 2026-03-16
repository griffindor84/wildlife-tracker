import "../pages/home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <main className="home">
            <header className="home-header">
                <div className="home-header-logo">🐾 Wildlife Tracker</div>
                <nav className="home-header-nav">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login"    className="nav-btn secondary">Sign In</Link>
                            <Link to="/register" className="nav-btn primary">Sign Up</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/observations"    className="nav-btn secondary">Observations</Link>
                            <Link to="/species"         className="nav-btn secondary">Species</Link>
                            <Link to="/reports"         className="nav-btn secondary">Reports</Link>
                            <Link to="/admin/dashboard" className="nav-btn primary">Admin Panel</Link>
                        </>
                    )}
                </nav>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h2>Protect Wildlife Through Smart Tracking</h2>
                    <p>
                        Track animal movements, monitor habitats, and support conservation
                        decisions using real-time data and analytics.
                    </p>
                    <div className="hero-buttons">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/register"><button className="primary">Get Started</button></Link>
                                <Link to="/login"><button className="secondary">Sign In</button></Link>
                            </>
                        ) : (
                            <>
                                <Link to="/observations"><button className="primary">Start Tracking</button></Link>
                                <Link to="/species"><button className="secondary">Explore Species</button></Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="stats">
                <Stat value="120+" label="Animals Tracked" />
                <Stat value="15"   label="Protected Zones" />
                <Stat value="24/7" label="Live Monitoring" />
                <Stat value="8"    label="Species Covered" />
            </section>

            <section className="features">
                <h2>What You Can Do</h2>
                <p className="section-subtitle">
                    Powerful tools designed for rangers, researchers, and conservationists
                </p>
                <div className="feature-grid">
                    <Feature icon="🗺️" title="Live Tracking"      description="Monitor animal locations in real time on an interactive map." />
                    <Feature icon="🐘" title="Species Management" description="Organize, monitor, and analyze different wildlife species." />
                    <Feature icon="📊" title="Reports & Insights" description="Generate movement and behavior reports for research." />
                    <Feature icon="🚨" title="Alerts & Safety"    description="Receive alerts for unusual movements or danger zones." />
                </div>
            </section>

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

            <section className="cta">
                <h2>Join the Mission to Protect Wildlife</h2>
                <p>Be part of a data-driven approach to conservation and environmental protection.</p>
                {!isAuthenticated ? (
                    <Link to="/register"><button className="primary large">Get Started</button></Link>
                ) : (
                    <Link to="/observations"><button className="primary large">Go to App</button></Link>
                )}
            </section>

            <footer className="footer">
                <p>© 2026 Wildlife Tracker | Conservation Through Technology</p>
            </footer>
        </main>
    );
};

export default Home;

type FeatureProps = { icon: string; title: string; description: string };
const Feature = ({ icon, title, description }: FeatureProps) => (
    <div className="card feature-card">
        <span className="feature-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

type StatProps = { value: string; label: string };
const Stat = ({ value, label }: StatProps) => (
    <div className="stat">
        <h3>{value}</h3>
        <p>{label}</p>
    </div>
);