import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import Card from "../../src/components/Card";

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
    <AdminLayout>
      <div className="dashboard-grid">
        <Card title="Species Tracked" value={stats.species} />
        <Card title="Animals Monitored" value={stats.animals} />
        <Card title="Protected Zones" value={stats.zones} />
        <Card title="Active Alerts" value={stats.alerts} />
      </div>

      {/* System Status */}
      <section className="system-status">
        <h3>System Status</h3>
        <ul>
          <li>🟢 GPS Tracking: Online</li>
          <li>🟢 Database: Connected</li>
          <li>🟡 Alerts Engine: Monitoring</li>
        </ul>
      </section>

      {/* Recent Activity */}
      <section className="activity-log">
        <h3>Recent Activity</h3>
        <ul>
          <li>🐘 Elephant movement recorded – 5 mins ago</li>
          <li>🚨 Alert triggered in Zone A – 12 mins ago</li>
          <li>🦁 Lion location updated – 30 mins ago</li>
          <li>👤 New ranger added – 1 hour ago</li>
        </ul>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <button className="primary">➕ Add Species</button>
        <button className="secondary">➕ Add User</button>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
