import express from "express";
import apiStatus from "./routes/apistatus.js";
import users from "./routes/users.js";
import login from "./routes/login.js";
import register from "./routes/register.js";

const app = express();
const PORT = 3000;

app.use(express.json());
// Import des routes créers dans le dossier routes
app.use("/api/status", apiStatus);
app.use("/users", users);
app.use("/login", login);
app.use("/register", register);

// Démarrage du serveur en local


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
