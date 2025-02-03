const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Adds security headers

// ✅ Rate Limiter (Protect Login API from brute force attacks)
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 requests per 10 min
    message: "Too many login attempts, please try again later.",
});

app.use("/api/auth/signin", loginLimiter); // Apply only to signin route

// ✅ Mount Routes
app.use("/api/auth", authRoutes);

// ✅ Sync Database and Start Server
sequelize.sync()
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
