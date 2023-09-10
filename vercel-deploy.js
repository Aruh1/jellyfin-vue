const fs = require("fs");
const path = require("path");

/**
 * Default server can be set by providing the `DEFAULT_SERVER` environment variable.
 * in the Vercel dashboard, go to Settings > Environment Variables and add a new variable.
 *
 * Or when you create a new project, you can define it there.
 */
const defaultServer = process.env.DEFAULT_SERVER;
const rootDir = path.join(__dirname, "..", "frontend");
console.log("Root directory:", rootDir, __dirname);
console.log("Default server:", defaultServer);
const distDir = path.join(rootDir, "dist");
const configPath = path.join(distDir, "config.json");

if (defaultServer && fs.existsSync(configPath)) {
  const configJson = JSON.parse(fs.readFileSync(configPath));
  let currentServers = configJson.defaultServerURLs;
  if (!Array.isArray(currentServers)) {
    currentServers = [currentServers];
  } else {
    currentServers = currentServers.filter(
      (server) => server !== defaultServer
    );
    currentServers.push(defaultServer);
  }
  configJson.defaultServerURLs = currentServers;

  console.log("Updating config.json with default server", defaultServer);
  fs.writeFileSync(configPath, JSON.stringify(configJson, undefined, 2));
}
