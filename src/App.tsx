import React, { useState, useEffect } from "react";

interface MerchItem {
  ID: number;
  year_: number;
  inventory: number;
  original_price: number;
  current_price: number;
  type_: "sweatshirt" | "shirt" | "glassware" | "hat"; // Restrict to valid types
}

const App = () => {
  const [data, setData] = useState<MerchItem[]>([]);
  const [filteredData, setFilteredData] = useState<MerchItem[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state and form fields
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<MerchItem>({
    ID: 0,
    year_: new Date().getFullYear(),
    inventory: 0,
    original_price: 0,
    current_price: 0,
    type_: "sweatshirt",
  });

  // Fetch data from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/merch");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: MerchItem[] = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update filtered data whenever the filter value or data changes
  useEffect(() => {
    if (filter) {
      setFilteredData(data.filter((item) => item.type_ === filter));
    } else {
      setFilteredData(data);
    }
  }, [filter, data]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]:
        name === "year_" || name === "inventory" || name === "original_price" || name === "current_price"
          ? parseFloat(value)
          : value,
    }));
  };

// Handle form submission to add new item
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    console.log("Submitting new item:", newItem); // Log the item being submitted

    const response = await fetch("http://localhost:8080/merch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem), // Only send `newItem` without an `ID`
    });

    // Assuming the response contains the full item with the ID
    const result: MerchItem = await response.json();
    console.log("Item added successfully:", result); // Log the result received from the backend

    // After adding, fetch updated data and update the state
    setData((prevData) => [...prevData, result]); // Use `result` as the full item returned from the backend
    setFilteredData((prevFilteredData) => [...prevFilteredData, result]); // Update the filtered data as well
    setIsModalOpen(false);
    window.location.reload() // Close the modal after successful addition
  } catch (err) {
    console.error("Error adding new item:", err); // Log the actual error
    setError("Error adding new item.");
  }
};

  // Handle the delete action
  const handleDelete = async (id: number, type: string) => {
    try {
      const response = await fetch(`http://localhost:8080/merch/${type}/${id}`, {
        method: "DELETE",
      });

      setData((prevData) => prevData.filter((item) => item.ID !== id));
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((item) => item.ID !== id)
      );
    } catch (err) {
      setError(`Failed to delete item with ID ${id}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 flex">
      {/* Table */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">Merch Items</h1>
        <div className="mb-4">
          <label htmlFor="filter" className="block text-lg font-medium mb-2">
            Filter by Type:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg p-2 w-full max-w-sm"
          >
            <option value="">All</option>
            <option value="sweatshirt">Sweatshirt</option>
            <option value="hat">Hat</option>
            <option value="glassware">Glassware</option>
            <option value="shirt">Shirt</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Add New Item
        </button>

        <table className="table-auto w-full max-w-4xl mx-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Year</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Inventory</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Original Price</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Current Price</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.ID} className="hover:bg-gray-50 even:bg-gray-100 cursor-pointer">
                <td className="border border-gray-300 px-4 py-2 text-center">{item.ID}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.year_}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.inventory}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${item.original_price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">${item.current_price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{item.type_}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the row click event
                      handleDelete(item.ID, item.type_);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding new item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="year_">
                  Year:
                </label>
                <select
                  name="year_"
                  value={newItem.year_}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                  <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="type_">
                  Type:
                </label>
                <select
                  name="type_"
                  value={newItem.type_}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="sweatshirt">Sweatshirt</option>
                  <option value="hat">Hat</option>
                  <option value="glassware">Glassware</option>
                  <option value="shirt">Shirt</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="inventory">
                  Inventory:
                </label>
                <input
                  type="number"
                  name="inventory"
                  value={newItem.inventory}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="original_price">
                  Original Price:
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={newItem.original_price}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="current_price">
                  Current Price:
                </label>
                <input
                  type="number"
                  name="current_price"
                  value={newItem.current_price}
                  onChange={handleInputChange}
                  className="border rounded-lg p-2 w-full"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
