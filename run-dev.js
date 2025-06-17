#!/usr/bin/env node

const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Parse command line arguments
const args = process.argv.slice(2);
const useDocker = args.includes("--docker") || args.includes("-d");
const port =
  args.find((arg) => arg.startsWith("--port="))?.split("=")[1] ||
  process.env.PORT ||
  5000;

console.log("🏪 EShop Microservices Development Server");
console.log("=========================================");

// Check if Docker is available
function checkDockerAvailable() {
  return new Promise((resolve) => {
    exec("docker --version", (error) => {
      resolve(!error);
    });
  });
}

// Check if .NET SDK is available
function checkDotNetAvailable() {
  return new Promise((resolve) => {
    exec("dotnet --version", (error) => {
      resolve(!error);
    });
  });
}

// Run Docker Compose
function runDockerCompose() {
  console.log("🐳 Starting services with Docker Compose...");

  const dockerComposePath = path.join(__dirname, "src");

  if (!fs.existsSync(path.join(dockerComposePath, "docker-compose.yml"))) {
    console.error("❌ docker-compose.yml not found in src directory");
    process.exit(1);
  }

  // First, ensure any existing containers are stopped
  console.log("🛑 Stopping any existing containers...");
  const stopCmd = spawn(
    "docker-compose",
    [
      "-f",
      "docker-compose.yml",
      "-f",
      "docker-compose.override.yml",
      "down",
      "--remove-orphans",
    ],
    {
      cwd: dockerComposePath,
      stdio: "inherit",
    },
  );

  stopCmd.on("close", (stopCode) => {
    console.log("🚀 Starting fresh containers...");

    const dockerComposeCmd = spawn(
      "docker-compose",
      [
        "-f",
        "docker-compose.yml",
        "-f",
        "docker-compose.override.yml",
        "up",
        "-d",
        "--build",
      ],
      {
        cwd: dockerComposePath,
        stdio: "inherit",
      },
    );

    dockerComposeCmd.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Services started successfully!");
        console.log("");
        console.log("🌐 Application URLs:");
        console.log("   - Shopping Web: http://localhost:6005");
        console.log("   - API Gateway: http://localhost:6004");
        console.log("   - Identity Server: http://localhost:6006");
        console.log("   - Info Server: http://localhost:" + port);
        console.log("");
        console.log("📊 Service URLs:");
        console.log("   - Catalog API: http://localhost:6000");
        console.log("   - Basket API: http://localhost:6001");
        console.log("   - Discount gRPC: http://localhost:6002");
        console.log("   - Ordering API: http://localhost:6003");
        console.log("");
        console.log("🗄️ Database URLs:");
        console.log("   - PostgreSQL (Catalog): localhost:5432");
        console.log("   - PostgreSQL (Basket): localhost:5433");
        console.log("   - SQL Server (Orders): localhost:1433");
        console.log("   - SQL Server (Identity): localhost:1434");
        console.log("   - Redis: localhost:6379");
        console.log("   - RabbitMQ: http://localhost:15672 (guest/guest)");
        console.log("");
        console.log(
          "⏳ Please wait 30-60 seconds for all services to initialize...",
        );

        // Also start the info server in parallel
        fallbackToInfoServer();
      } else {
        console.error(`❌ Docker Compose exited with code ${code}`);
        console.log("📋 Starting info server as fallback...");
        fallbackToInfoServer();
      }
    });
  });
}

// Run .NET services directly
function runDotNetServices() {
  console.log("🔧 Starting .NET services directly...");

  // Check if solution file exists
  const solutionPath = path.join(__dirname, "src", "eshop-microservices.sln");

  if (!fs.existsSync(solutionPath)) {
    console.error("❌ Solution file not found");
    fallbackToInfoServer();
    return;
  }

  // Restore packages first
  console.log("📦 Restoring NuGet packages...");
  const restore = spawn("dotnet", ["restore"], {
    cwd: path.join(__dirname, "src"),
    stdio: "inherit",
  });

  restore.on("close", (code) => {
    if (code === 0) {
      console.log("✅ Packages restored successfully");

      // Start the web application
      const webPath = path.join(__dirname, "src", "WebApps", "Shopping.Web");
      if (fs.existsSync(webPath)) {
        console.log("🚀 Starting Shopping.Web...");
        const webApp = spawn("dotnet", ["run"], {
          cwd: webPath,
          stdio: "inherit",
        });

        webApp.on("close", (code) => {
          console.log(`Shopping.Web exited with code ${code}`);
        });
      } else {
        console.error("❌ Shopping.Web project not found");
        fallbackToInfoServer();
      }
    } else {
      console.error("❌ Failed to restore packages");
      fallbackToInfoServer();
    }
  });
}

// Fallback to info server
function fallbackToInfoServer() {
  console.log("📋 Starting development info server...");
  console.log(`🌐 Server will be available at: http://localhost:${port}`);

  // Set the PORT environment variable for server.js
  process.env.PORT = port;

  // Start the info server
  require("./server.js");
}

// Main function
async function main() {
  const dockerAvailable = await checkDockerAvailable();
  const dotnetAvailable = await checkDotNetAvailable();

  console.log(
    `🐳 Docker: ${dockerAvailable ? "✅ Available" : "❌ Not available"}`,
  );
  console.log(
    `🔧 .NET SDK: ${dotnetAvailable ? "✅ Available" : "❌ Not available"}`,
  );
  console.log("");

  if (useDocker && dockerAvailable) {
    runDockerCompose();
  } else if (dotnetAvailable && !useDocker) {
    runDotNetServices();
  } else if (dockerAvailable) {
    console.log("💡 Falling back to Docker since .NET SDK is not available");
    runDockerCompose();
  } else {
    console.log("⚠️  Neither Docker nor .NET SDK is available.");
    console.log("📋 Starting development info server as fallback...");
    fallbackToInfoServer();
  }
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down development server...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down development server...");
  process.exit(0);
});

// Start the application
main().catch((error) => {
  console.error("❌ Failed to start development server:", error);
  console.log("📋 Starting info server as fallback...");
  fallbackToInfoServer();
});
