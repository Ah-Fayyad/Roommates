const fs = require('fs');
const path = require('path');

function cleanJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // We can't use JSON.parse because it might lose order or handle duplicates unpredictably for our needs
    // But actually, JSON.parse then JSON.stringify(obj, null, 4) WILL remove duplicates and keep the LAST one.
    try {
        const obj = JSON.parse(content);
        const cleaned = JSON.stringify(obj, null, 4);
        fs.writeFileSync(filePath, cleaned);
        console.log(`Cleaned ${filePath}`);
    } catch (e) {
        console.error(`Error cleaning ${filePath}: ${e.message}`);
    }
}

const enPath = path.resolve('d:/Ahmed pc/test-roommates/frontend/src/locales/en.json');
const arPath = path.resolve('d:/Ahmed pc/test-roommates/frontend/src/locales/ar.json');

cleanJson(enPath);
cleanJson(arPath);
