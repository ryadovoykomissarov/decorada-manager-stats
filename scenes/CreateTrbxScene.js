import { Scenes } from "telegraf";
import { next } from "../utilities/Markup.js";
import { postTrbx } from "../controllers/WildberriesController.js";

export const createTrbx = new Scenes.BaseScene('createTrbx');

createTrbx.enter(async (ctx) => {
    try {
        let message = '<i>[Шаг 3/5]</i>\n\nВведите количество коробов, которые необходимо добавить к поставке.\n\n';
        await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь команды /start');
        await ctx.scene.leave();
    }
})

createTrbx.hears(/\b([1-9]\d{0,2}|1000)\b/, async (ctx) => {
    try {
        let keyboard = next;
        let trbxIds = await postTrbx(ctx.state.supplyId, ctx.message.text);
        ctx.state.trbxIds = trbxIds;

        let message = 'Короба успешно добавлены в поставку. Идентификаторы: \n\n';
        for (const trbxId of trbxIds) {
            message = message + `${trbxId} \n`;
        };

        message = message + '\nДля продолжения нажмите далее';

        await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь команды /start');
        await ctx.scene.leave();
    }

})

createTrbx.action('s_next', async (ctx) => {
    try {
        await ctx.scene.enter('ordersToTrbxes');
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь команды /start');
        await ctx.scene.leave();
    }

})

createTrbx.leave(async (ctx) => {

})