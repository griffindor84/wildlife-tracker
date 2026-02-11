import { useEffect, useState } from "react";
import Card from "../components/Card"; // correct relative path

const Dashboard = () => {
  const [stats, setStats] = useState({
    species: 0,
    animals: 0,
    zones: 0,
    alerts: 0,
  });

  useEffect(() => {
    const target = {
      species: 8,
      animals: 120,
      zones: 15,
      alerts: 34,
    };

    const interval = setInterval(() => {
      setStats((prev) => ({
        species: prev.species < target.species ? prev.species + 1 : target.species,
        animals: prev.animals < target.animals ? prev.animals + 5 : target.animals,
        zones: prev.zones < target.zones ? prev.zones + 1 : target.zones,
        alerts: prev.alerts < target.alerts ? prev.alerts + 2 : target.alerts,
      }));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-grid">
      <Card title="Species Tracked" value={stats.species} />
      <Card title="Animals Monitored" value={stats.animals} />
      <Card title="Protected Zones" value={stats.zones} />
      <Card title="Active Alerts" value={stats.alerts} />
    </div>
  );
};

export default Dashboard;
