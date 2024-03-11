import { Scenes } from "telegraf";
import { patchTrbxWithOrders } from "../controllers/WildberriesController.js";
import { done } from "../utilities/Markup.js";

export const ordersToTrbxes = new Scenes.BaseScene('ordersToTrbxes');

ordersToTrbxes.enter(async (ctx) => {
    let message = '<i>[Шаг 4/5]</i>\n\nРаспределите заказы по коробам. Для этого отправьте сообщение формата: <i>"Идентификатор короба: Идентификатор заказа 1, идентификатор заказа 2, ..., идентификатор заказа N"</i>\n' +
    'Если коробов несколько, необходимо распределять по одному коробу за сообщение.'

    await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
});

ordersToTrbxes.hears(/^WB-TRBX-\d{7}:\s*\d+(?:\s*,\s*\d+)*$/, async (ctx) => {
    let trbxId = ctx.message.text.split(':')[0];
    
    let orderIdsString = ctx.message.text.split(':')[1];
    let orderIds = orderIdsString.split(',');
    for (let orderId of orderIds) {
        orderId = orderId.trim();
    };

    await patchTrbxWithOrders(ctx.state.supplyId, trbxId, orderIds);

    let message = `Короб ${trbxId} пополнен заказами ${orderIds}. Для заполнения следующего короба отправьте еще одно сообщение. Если вы завершили распределять заказы, нажмите "Готово"`
    
    let keyboard = done;
    await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
})

ordersToTrbxes.action('s_done', async (ctx) => {
    await ctx.scene.enter('getStickers');
})

ordersToTrbxes.leave(async (ctx) => {

})