// remove-locales.js
const fs = require('fs');
const path = require('path');

const KEEP_LOCALES = ['en-US', 'ru'];

// Правильный экспорт для electron-builder
module.exports = async function(context) {
    console.log('AfterPack: Removing unnecessary locale files...');
    
    const localeDir = path.join(context.appOutDir, 'locales');
    console.log(`Checking locales directory: ${localeDir}`);
    
    if (fs.existsSync(localeDir)) {
        const files = fs.readdirSync(localeDir);
        console.log(`Found ${files.length} files in locales directory`);
        
        let removedCount = 0;
        files.forEach(file => {
            const localeName = path.basename(file, '.pak');
            if (!KEEP_LOCALES.includes(localeName)) {
                const filePath = path.join(localeDir, file);
                fs.unlinkSync(filePath);
                removedCount++;
                console.log(`Removed: ${file}`);
            }
        });
        
        console.log(`Removed ${removedCount} locale files`);
    } else {
        console.log('Locales directory not found, skipping');
    }
    
    console.log('AfterPack: Completed successfully');
};