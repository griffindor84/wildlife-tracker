const Users = () => {
  const users = [
    { id: 1, name: "John Doe", role: "Ranger" },
    { id: 2, name: "Jane Smith", role: "Researcher" },
    { id: 3, name: "Admin", role: "Administrator" },
  ];

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Users Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th style={{ textAlign: "right" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>

              {/* ✅ FIXED ACTION CELL */}
              <td className="action-cell">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;