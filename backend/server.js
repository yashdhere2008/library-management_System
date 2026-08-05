import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import connectDB from "./db.js";
import authRoutes from "./controllers/authroutes.js";
import bookRoutes from "./controllers/bookRoutes.js";
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());

// ✅ Allow flexible CORS for development (localhost, 127.0.0.1, and local network IPs)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    try {
      const url = new URL(origin);
      const hostname = url.hostname;

      // Allow localhost and 127.0.0.1
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return callback(null, true);
      }

      // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      const ip = hostname;
      if (ip.match(/^(192\.168|10\.|172\.(1[6-9]|2[0-9]|3[01]))\./)) {
        return callback(null, true);
      }

      // Allow explicitly configured hosts
      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, log but allow; in production, reject
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`CORS: Allowing origin ${origin}`);
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS: " + origin));
        }
      }
    } catch (e) {
      // If error, allow in development
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(e);
      }
    }
  },
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API Running");
});

const createDemoUsers = async () => {
  try {
    const demoAccounts = [
      {
        email: "admin@example.com",
        name: "Admin User",
        password: "admin123",
        role: "admin",
      },
      {
        email: "student@example.com",
        name: "Student User",
        password: "student123",
        role: "student",
      },
      {
        email: "librarian@example.com",
        name: "Librarian User",
        password: "librarian123",
        role: "librarian",
      },
    ];

    for (const account of demoAccounts) {
      const hashedPassword = await bcrypt.hash(account.password, 10);
      const result = await User.updateOne(
        { email: account.email.toLowerCase() },
        {
          $setOnInsert: {
            name: account.name,
            email: account.email.toLowerCase(),
            password: hashedPassword,
            role: account.role,
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        console.log(`Created demo ${account.role}: ${account.email} / ${account.password}`);
      }
    }
  } catch (error) {
    console.warn("Failed to create demo users:", error.message);
  }
};

const startServer = async () => {
  try {
    const dbReady = await connectDB();
    if (dbReady) {
      await createDemoUsers();
    }

    const basePort = parseInt(process.env.PORT, 10) || 5008;
    const maxRetries = 10;

    const tryListen = (port, remainingTries) => {
      const server = app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${port}`);
        console.log(`   Local access:   http://localhost:${port}`);
        console.log(`   Network access: http://<your-ip>:${port}`);
        if (!dbReady) {
          console.warn("⚠️ MongoDB is not connected, but the server is running in fallback mode.");
        }
      });

      server.on("error", (err) => {
        if (err && err.code === "EADDRINUSE" && remainingTries > 0) {
          console.warn(`Port ${port} in use, trying port ${port + 1}...`);
          setTimeout(() => tryListen(port + 1, remainingTries - 1), 200);
        } else {
          console.error("Failed to start server:", err && err.message ? err.message : err);
          process.exit(1);
        }
      });
    };

    tryListen(basePort, maxRetries);
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();