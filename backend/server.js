const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let inventory = [
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

app.get("/inventory", (req, res) => {
  res.json(inventory);
});

app.post("/inventory", (req, res) => {
  const newItem = {
    id: inventory.length + 1,
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    status: req.body.status,
  };

  inventory.push(newItem);

  res.json({
    message: "item added successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});