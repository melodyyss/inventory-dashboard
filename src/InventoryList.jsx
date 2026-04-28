import { useEffect, useState } from "react";

function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    status: "Available",
  });

  const fetchInventory = async () => {
    const response = await fetch("http://localhost:3001/inventory");
    const data = await response.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch("http://localhost:3001/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        quantity: Number(formData.quantity),
      }),
    });

    setFormData({
      name: "",
      category: "",
      quantity: "",
      status: "Available",
    });

    fetchInventory();
  };

  return (
    <div>
      <h2>Inventory</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Item name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <button type="submit">Add Item</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;