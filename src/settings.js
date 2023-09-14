const fs = require('fs');
const { fileURLToPath } = require('url');
const { dirname, resolve } = require('path');

// Get settings from settings.json
function getDefaultSettings() {
    const __dirname = dirname(dirname(__filename));
    const settings_file = resolve(__dirname, 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settings_file, 'utf8'));
    return settings;
}

module.exports = { getDefaultSettings };
