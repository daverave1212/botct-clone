// Install sharp before running: npm install sharp
import sharp from "sharp";
import path from "path";
import fs from "fs";
import os from "os";

const FOLDER_PATH = "E:\\Work\\GitHub\\Werewolf\\botct-clone\\static\\images\\role-thumbnails";

// Get all image names from arguments
// const imageNames = process.argv.slice(2);
const imageNames = [
    'Barber',
    'Butler',
    'Damsel',
    'Drunk',
    'Golem',
    'Goon',
    'Hatter',
    'Heretic',
    'Hermit',
    'Klutz',
    'Lunatic',
    'Moonchild',
    'Mutant',
    'Ogre',
    'Plague Doctor',
    'Politician',
    'Puzzlemaster',
    'Recluse',
    'Saint',
    'Snitch',
    'Sweetheart',
    'Tinker',
    'Zealot'
]

if (imageNames.length === 0) {
    console.error("No image names provided!");
    process.exit(1);
}

(async () => {
    for (const name of imageNames) {
        const imgName = name + '.webp'
        try {
            const filePath = path.join(FOLDER_PATH, imgName);

            if (!fs.existsSync(filePath)) {
                console.warn(`⚠ File not found: ${filePath}`);
                continue;
            }
            
            // Read → process → save to temp file
            await sharp(filePath)
                .tint('#3700ffff')
                .withMetadata()
                .webp({quality: 100, lossless: true})
                .toFile(path.join(FOLDER_PATH, 'rehued', imgName));

            console.log(`✅ Processed: ${imgName}`);
        } catch (err) {
            console.error(`❌ Error processing ${imgName}:`, err.message);
        }
    }
})();