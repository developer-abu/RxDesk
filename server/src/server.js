import app from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port);

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer().catch((error) => {
  process.exitCode = 1;
  throw error;
});
