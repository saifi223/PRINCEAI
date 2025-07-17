// index.js
import express from 'express';
import chalk from 'chalk';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';

// Set up __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from lib/source
app.use(express.static(path.join(__dirname, 'lib/source')));

// Default route
app.get('/', (req, res) => {
  res.redirect('/prince.html');
});

// Health check endpoint
app.get('/status', (req, res) => {
  res.json({ running: true });
});

// Start server
app.listen(port, () => {
  console.log(chalk.green(`🌐 Server is running on port ${port}`));
  showBotInfo();
  import('./main.js'); // run the bot directly
});

// Optional: Print system & package info
async function showBotInfo() {
  try {
    const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
    const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
    const packageJsonPath = path.join(__dirname, 'package.json');
    const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    const time = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(new Date());

    console.log(chalk.cyan(`📦 Name: ${pkg.name}`));
    console.log(chalk.cyan(`📌 Version: ${pkg.version}`));
    console.log(chalk.cyan(`👤 Author: ${pkg.author?.name || pkg.author}`));
    console.log(chalk.cyan(`🖥️ RAM: ${ramInGB.toFixed(2)} GB total, ${freeRamInGB.toFixed(2)} GB free`));
    console.log(chalk.cyan(`🕒 Time: ${time}`));
  } catch (err) {
    console.log(chalk.red(`❌ Error reading package.json: ${err}`));
  }
  }
