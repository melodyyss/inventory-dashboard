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

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter((item) => item.quantity < 5).length;

  const itemsByCategory = inventory.reduce((groups, item) => {
    groups[item.category] = (groups[item.category] || 0) + item.quantity;
    return groups;
  }, {});

  const mlInsights = [
    {
      scene_id: "shelf_item_01",
      item: "USB Cable",
      event_type: "UNCERTAIN",
      confidence: 0.82,
      recommended_action: "Manual review required due to low confidence",
    },
    {
      scene_id: "shelf_item_02",
      item: "USB Cable",
      event_type: "DISCREPANCY",
      confidence: 0.94,
      recommended_action:
        "Shelf image predicts item exists, but database says unavailable",
    },
  ];

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
      <h2>Inventory Dashboard</h2>

      <h3>Data Science Summary Metrics</h3>
      <p>Total Items: {totalItems}</p>
      <p>Low Stock Items: {lowStockCount}</p>

      <h4>Items by Category</h4>
      <ul>
        {Object.entries(itemsByCategory).map(([category, quantity]) => (
          <li key={category}>
            {category}: {quantity}
          </li>
        ))}
      </ul>

      <h3>Add Inventory Item</h3>
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

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <button type="submit">Add Item</button>
      </form>

      <h3>Declared Inventory Database</h3>
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

      <h3>Observed Inventory from Shelf Analysis</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Scene</th>
            <th>Item</th>
            <th>Event Type</th>
            <th>Confidence</th>
            <th>Recommended Action</th>
          </tr>
        </thead>

        <tbody>
          {mlInsights.map((event, index) => (
            <tr key={index}>
              <td>{event.scene_id}</td>
              <td>{event.item}</td>
              <td>{event.event_type}</td>
              <td>{event.confidence}</td>
              <td>{event.recommended_action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;