import { Scenes } from "telegraf";
import { doneOrCancel, next } from "../utilities/Markup.js";
import { deleteSupply, getStickersForTrbx, getTrbxInfo } from "../controllers/WildberriesController.js";
import fs from 'fs';
import { erase } from "../utilities/Excel.js";
import { getSupply } from "../model/SuppliesModel.js";

export const getStickers = new Scenes.BaseScene('getStickers');

getStickers.enter(async (ctx) => {
    let message = '<i>[Шаг 5/5]</i>\n\nПроверьте правильность добавленных заказов.\n\n';

    let trbxes = await getTrbxInfo(ctx.state.supplyId);
    for (const obj of trbxes) {
        let header = `Короб ${obj.id}: `;
        for (const id of obj.orders) {
            header = header + id + ', '
        }
        header = header + '\n';
        message = message + header;
    }

    message = message + '\nЕсли данные верны, нажмите "Готово". Если в данных есть ошибка, нажмите "Отмена" и попробуйте создать поставку заново.';
    let keyboard = doneOrCancel;
    await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard});
})

getStickers.action('s_done', async (ctx) => {
    let stickers = await getStickersForTrbx(ctx.state.supplyId, 'png', ctx.state.trbxIds);
    for (const obj of stickers) {
        let barcode = obj.barcode;
        barcode = barcode.replaceAll(':', '_');
        barcode = barcode.replace('$', '_');
        let file = obj.file;
        await decodeBase64(file, barcode);
        await ctx.telegram.sendDocument(ctx.chat.id, {
            source: `${barcode}.png`,
            filename: `${barcode}.png`
        });

        await erase(`${barcode}.png`);
    }

    await ctx.scene.leave();
});

const decodeBase64 = async (base64String, filename) => {
    let base64Image = base64String.split(';base64').pop();
    fs.writeFile(`${filename}.png`, base64Image, { encoding: 'base64'}, function (err) {
        if(err) throw err;
    })
}

getStickers.action('s_cancel', async (ctx) => {
    await deleteSupply(ctx.state.supplyId);
    await ctx.scene.leave();
})

getStickers.leave(async (ctx) => {

})