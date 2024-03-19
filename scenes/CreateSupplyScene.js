import { Scenes } from "telegraf";
import { deleteSupply, postSupply } from "../controllers/WildberriesController.js";
import { next } from "../utilities/Markup.js";

export const createSupply = new Scenes.BaseScene("createSupply");

createSupply.enter(async (ctx) => {
    try {
        await ctx.telegram.sendMessage(ctx.chat.id, '<i>[Шаг 1/5]</i>\n\nВведите название новой поставки', { parse_mode: 'HTML' });

        createSupply.on('text', async (ctx) => {
            let supplyName = ctx.message.text;
            let supplyId = await postSupply(supplyName);
            ctx.state.supplyId = supplyId;
            let message = `Поставка создана, идентификатор поставки: <b>${supplyId}</b>`;
            let keyboard = next;
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        createSupply.action('s_next', async (ctx) => {
            await ctx.scene.enter("addOrder")
        })

        createSupply.hears('Назад', async (ctx) => {
            if(ctx.state.supplyId) {
                await deleteSupply(ctx.state.supplyId);
            };

            await ctx.scene.enter('main');
        })
        
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }

})