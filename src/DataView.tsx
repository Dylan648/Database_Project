
const TablePage = () => {
  // Example data
  const data = [
    { id: 1, name: "John Doe", age: 28, city: "New York" },
    { id: 2, name: "Jane Smith", age: 34, city: "San Francisco" },
    { id: 3, name: "Sam Johnson", age: 22, city: "Los Angeles" },
    { id: 4, name: "Emily Brown", age: 41, city: "Chicago" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Data Table</h1>
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
            <th className="border border-gray-300 px-4 py-2 text-left">City</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 even:bg-gray-100 odd:bg-white"
            >
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.age}</td>
              <td className="border border-gray-300 px-4 py-2">{item.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
