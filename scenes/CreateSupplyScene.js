import { Scenes } from "telegraf";
import { postSupply } from "../controllers/WildberriesController.js";
import { next } from "../utilities/Markup.js";

export const createSupply = new Scenes.BaseScene("createSupply");

createSupply.enter(async (ctx) => {
    await ctx.telegram.sendMessage(ctx.chat.id, '<i>[Шаг 1/5]</i>\n\nВведите название новой поставки', { parse_mode: 'HTML' });

    createSupply.on('text', async (ctx) => {
        let supplyName = ctx.message.text;
        let supplyId = await postSupply(supplyName);
        ctx.state.supplyId = supplyId;
        let message = `Поставка создана, идентификатор поставки: <b>${supplyId}</b>`;
        let keyboard = next;
        await ctx.telegram.sendMessage(ctx.chat.id, message, {parse_mode: 'HTML', reply_markup: keyboard});
    });

    createSupply.action('s_next', async (ctx) => {
        await ctx.scene.enter("addOrder")
    })
})