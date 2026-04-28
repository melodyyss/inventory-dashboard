const inventory = [
  {
    id: 1,
    name: "Arduino Kit",
    category: "Hardware",
    quantity: 5,
    status: "Available",
  },
  {
    id: 2,
    name: "Figma License",
    category: "Software",
    quantity: 20,
    status: "Available",
  },
];

function InventoryList() {
  return (
    <div>
      <h2>Inventory</h2>

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