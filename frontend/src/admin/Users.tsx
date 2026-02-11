import AdminLayout from "./AdminLayout";

const Users = () => {
    const users = [
        { id: 1, name: "John Doe", role: "Ranger" },
        { id: 2, name: "Jane Smith", role: "Researcher" },
        { id: 3, name: "Admin", role: "Administrator" },
    ];

    return (
        <AdminLayout>
            <h2>Users Management</h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Users;
