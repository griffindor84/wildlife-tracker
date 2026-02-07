import Card from "../../src/components/Card";
import AdminLayout from "./AdminLayout";

const Dashboard = () => {
  const stats = [
    { title: "Tracked Species", value: "120+" },
    { title: "Monitored Animals", value: "5400+" },
    { title: "Protected Zones", value: "35" },
    { title: "Alerts Generated", value: "280+" },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-grid">
        {stats.map((stat) => (
          <Card key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
