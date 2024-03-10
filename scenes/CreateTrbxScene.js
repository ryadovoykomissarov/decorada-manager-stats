import { Scenes } from "telegraf";
import { next } from "../utilities/Markup.js";
import { postTrbx } from "../controllers/WildberriesController.js";

export const createTrbx = new Scenes.BaseScene('createTrbx');

createTrbx.enter(async (ctx) => {
    let message = '<i>[Шаг 3/5]</i>\n\nВведите количество коробов, которые необходимо добавить к поставке.\n\n';
    await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML'});
})

createTrbx.hears(/\b([1-9]\d{0,2}|1000)\b/, async (ctx) => {
    let keyboard = next;
    let trbxIds = await postTrbx(ctx.state.supplyId, ctx.message.text);
    ctx.state.trbxIds = trbxIds;

    let message = 'Короба успешно добавлены в поставку. Идентификаторы: \n\n';
    for (const trbxId of trbxIds) {
        message = message + `${trbxId} \n`;
    };

    message = message + '\nДля продолжения нажмите далее';

    await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
})

createTrbx.action('s_next', async (ctx) => {
    await ctx.scene.enter('getStickers');
})

createTrbx.leave(async (ctx) => {

})