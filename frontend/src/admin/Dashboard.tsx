import { useEffect, useState } from "react";
import Card from "../components/Card";
import api from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    species:      0,
    observations: 0,
    reports:      0,
    users:        0,
  });

  const [animated, setAnimated] = useState({
    species:      0,
    observations: 0,
    reports:      0,
    users:        0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wildlifeRes, observationsRes, reportsRes, usersRes] = await Promise.all([
          api.get('/wildlife'),
          api.get('/observations'),
          api.get('/reports'),
          api.get('/users'),
        ]);

        setStats({
          species:      wildlifeRes.data.length,
          observations: observationsRes.data.length,
          reports:      reportsRes.data.length,
          users:        usersRes.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  // Animate numbers counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimated(prev => ({
        species:      prev.species      < stats.species      ? prev.species + 1      : stats.species,
        observations: prev.observations < stats.observations ? prev.observations + 1 : stats.observations,
        reports:      prev.reports      < stats.reports      ? prev.reports + 1      : stats.reports,
        users:        prev.users        < stats.users        ? prev.users + 1        : stats.users,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div>
      <h2 className="admin-page-title">Dashboard</h2>
      <div className="dashboard-grid">
        <Card title="Species Tracked"      value={animated.species} />
        <Card title="Total Observations"   value={animated.observations} />
        <Card title="Reports Submitted"    value={animated.reports} />
        <Card title="Registered Users"     value={animated.users} />
      </div>
    </div>
  );
};

export default Dashboard;