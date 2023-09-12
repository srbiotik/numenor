import fs from 'fs';

// Get settings from settings.json
export function getDefaultSettings() {
    const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
    return settings;
}
