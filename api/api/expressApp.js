const express = require('express');
// ... all your imports

const app = express();

// All your middleware, routes, etc.
app.use(securityHeadersMiddleware);
// ... other middlewares

app.get("/api/charities", async (req, res) => {
  // your logic
});

// Export the full Express app
module.exports = app;
