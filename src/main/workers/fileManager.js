import * as fs from 'fs';
import path from 'path';
import { app } from 'electron';

const saveFileName = 'zakupki-save.json';

const homeDirectory = app.getPath('appData');
const saveFilePath = path.join(homeDirectory, saveFileName);

export async function saveRows(rows) {
    try {
        const dir = path.dirname(saveFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const data = JSON.stringify(rows, null, 2);
        await fs.promises.writeFile(saveFilePath, data, 'utf8');
        
        return { success: true, message: 'Данные успешно сохранены' };
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        return { success: false, message: error.message };
    }
}

export async function loadRows() {
    try {
        if (!fs.existsSync(saveFilePath)) {
            return { success: false, message: 'Файл не найден', data: [] };
        }
        
        const content = await fs.promises.readFile(saveFilePath, 'utf8');
        const data = JSON.parse(content);
        
        return { success: true, message: 'Данные успешно загружены', data };
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return { success: false, message: error.message, data: [] };
    }
}