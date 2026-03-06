const fs = require('fs');
const file = 'c:/Users/Eduar/Desktop/OSART/osart-store/src/lib/mockData.ts';
let code = fs.readFileSync(file, 'utf8');
let inProducts = false;
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export const MOCK_LOCAL_PRODUCTS')) inProducts = true;
    if (inProducts && lines[i].includes('name: ')) {
        const nameMatch = lines[i].match(/name: '([^']+)'/);
        if (nameMatch && !lines[i + 1].includes('slug: ')) {
            const slug = nameMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            lines[i] = lines[i] + '\n        slug: \'' + slug + '\',';
        }
    }
}
fs.writeFileSync(file, lines.join('\n'));
console.log('Slugs regenerated in mockData.ts successfully.');
