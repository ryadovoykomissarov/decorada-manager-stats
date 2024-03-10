import reader from "xlsx";
import { unlink, writeFile as fsWriteFile } from 'fs';

export const write = async (data) => {
    const wb = reader.utils.book_new();
    const ws = reader.utils.json_to_sheet(data);

    reader.utils.book_append_sheet(wb, ws, "Статистика");
    const newFilepath = "./report.xlsx";
    reader.writeFile(wb, newFilepath)

    return newFilepath;
}

export const erase = async (link) => {
    unlink(link, (err) => {
        if (err) throw err;
        console.log(link + ' was deleted');
    });
}

