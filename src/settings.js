import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get settings from settings.json
export function getDefaultSettings() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(dirname(__filename));
    const settings_file = resolve(__dirname, 'settings.json');
    const settings = JSON.parse(fs.readFileSync(settings_file, 'utf8'));
    return settings;
}
