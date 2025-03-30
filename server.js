const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// For parsing JSON in request bodies
app.use(express.json());

app.post('/api/v1/user/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials
  if (username === "demouser@easecommerce.in" && password === "cE7iQPP^") {
    return res.status(200).json({ token: "VALID_TOKEN" });
  }
  
  return res.status(401).json({ message: "Invalid credentials" });
});

app.get('/api/v1/warehouse', (req, res) => {
  // Validate Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  if (token !== "VALID_TOKEN") {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // Validate the 'group' query parameter
  const group = req.query.group;
  if (!group) {
    return res.status(400).json({ message: "Missing query parameter: group" });
  }
  
  // Return appropriate data based on the query parameter value
  if (group === "default") {
    return res.status(200).json({
      warehouses: [
        { id: 1, name: "Default Warehouse 1" },
        { id: 2, name: "Default Warehouse 2" }
      ]
    });
  } else if (group === "no_warehouse_group") {
    // Simulate scenario: no warehouses available for the requested group
    return res.status(200).json({
      warehouses: [],
      message: "No warehouses found for the specified group"
    });
  } else {
    // For any unrecognized group, return an empty list and a message.
    return res.status(200).json({
      warehouses: [],
      message: `No warehouses found for group: ${group}`
    });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});