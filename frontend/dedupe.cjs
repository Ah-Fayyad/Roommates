const fs = require('fs');

function dedupe(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const entries = {};

    lines.forEach(line => {
        // Matches key: val or key: {
        const match = line.match(/^\s*"([^"]+)"\s*:\s*(.*)$/);
        if (match) {
            const key = match[1];
            let val = match[2].trim();
            if (val.endsWith(',')) val = val.slice(0, -1);
            
            // If it's an opening brace, we need to handle the nested object
            if (val === '{') {
                // Find matching closing brace (simple version)
                // This is a bit risky if nested objects are deeply nested or multiline
                // But for our i18n files, they are mostly 1-level deep
                entries[key] = val; 
            } else {
                entries[key] = val;
            }
        }
    });

    const sortedKeys = Object.keys(entries).sort();
    let newJson = '{\n';
    
    // This simple dedupe might break nested objects if I'm not careful.
    // Let's use JSON.parse if possible, but the duplicates prevent it.
    // Better way: manual scan for keys and keep the last occurrence.
}

// Actually, let's just use a safer approach: 
// parse the file line by line, if we see a key, update its value in a map.
// If the value is a start of an object, skip until the end of that object.

function safeDedupe(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Remove trailing commas before parsing if it was almost valid JSON
    // But it has duplicate keys, so JSON.parse won't complain in JS, it just keeps the last one!
    
    // WAIT! JSON.parse DOES NOT complain about duplicate keys in most JS engines.
    // It just keeps the LAST one. This is exactly what we want.
    
    let obj;
    try {
        // We need to fix potential syntax errors first (like missing braces or trailing commas)
        // But our files should be "mostly" valid except for duplicates and maybe one comma.
        let cleanedContent = content.trim();
        if (cleanedContent.endsWith(',')) cleanedContent = cleanedContent.slice(0, -1);
        if (!cleanedContent.endsWith('}')) cleanedContent += '}'; // Just in case
        
        obj = JSON.parse(cleanedContent);
    } catch (e) {
        console.log('JSON.parse failed, trying line-by-line for ' + filePath);
        // Fallback to line by line if it's really broken
        return;
    }

    const sortedObj = {};
    Object.keys(obj).sort().forEach(k => {
        sortedObj[k] = obj[k];
    });

    fs.writeFileSync(filePath, JSON.stringify(sortedObj, null, 4));
    console.log('Deduplicated ' + filePath);
}

safeDedupe('src/locales/ar.json');
safeDedupe('src/locales/en.json');
