import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

const startServer = async () => {
  // 1. Initialize Database Connection
  await connectDB();

  // 2. Start HTTP Listener
  const server = app.listen(config.port, () => {
    console.log(
      "\n=======================================================\n" +
      `  RxDesk Backend API Server Running!\n` +
      `  Port:        ${config.port}\n` +
      `  Environment: ${config.nodeEnv}\n` +
      `  Health:      http://localhost:${config.port}/api/health\n` +
      `  Client URL:  ${config.clientUrl}\n` +
      "=======================================================\n"
    );
  });

  // 3. Graceful Shutdown Handlers
  const shutdown = (signal) => {
    console.log(`\n[Server]: Received ${signal}. Closing HTTP server gracefully...`);
    server.close(() => {
      console.log("[Server]: HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((err) => {
  console.error("[Server Error]: Fatal error during startup:", err);
  process.exit(1);
});

