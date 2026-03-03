const Wildlife = () => {
  const species = [
    { name: "Elephant", population: 120 },
    { name: "Lion", population: 50 },
    { name: "Rhino", population: 35 },
    { name: "Giraffe", population: 60 },
  ];

  return (
    <div>
      <h2 className="admin-page-title">Wildlife Management</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Species</th>
            <th>Population</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {species.map((animal) => (
            <tr key={animal.name}>
              <td>{animal.name}</td>
              <td>{animal.population}</td>
              <td>
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

export default Wildlife;
