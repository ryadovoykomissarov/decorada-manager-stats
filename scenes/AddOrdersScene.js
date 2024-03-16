import { Scenes } from "telegraf";
import { exportToExcel } from "../utilities/Markup.js";
import { getNewOrders, getWarehouse, patchSupplyWithOrders } from "../controllers/WildberriesController.js";

export const addOrder = new Scenes.BaseScene('addOrder');

let ordersForReport = [];

addOrder.enter(async (ctx) => {
    try {
        let keyboard = exportToExcel;
        let message = await formMessageWithOpenOrders(ctx);
        await ctx.telegram.sendMessage(ctx.chat.id, '<b>Важно!</b>\n\n В пустую поставку можно добавить сборочное задание любого габаритного типа. После добавления первого задания поставка приобретает габаритный тип этого задания. После этого добавить в поставку можно только те задания, габаритный тип которых соответствует таковому у поставки.', { parse_mode: 'HTML' });
        await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }
})

addOrder.hears('Назад', async (ctx) => {
    await deleteSupply(ctx.state.supplyId)
    await ctx.scene.enter('main');
})

addOrder.action('e_toExcel', async (ctx) => {
    try {
        let filePath = await write(ordersForReport);
        await ctx.telegram.sendDocument(ctx.chat.id, {
            source: filePath,
            filename: 'ЭкспортированнаяСтатистика.xlsx'
        });

        await erase(filePath);
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }
})

addOrder.hears(/^\d+(\s*,\s*\d+)*$/, async (ctx) => {
    try {
        let idList = ctx.message.text;
        let ids = idList.split(',');
        for (let id of ids) {
            id = id.trim();
            await patchSupplyWithOrders(ctx.state.supplyId, id);
            await ctx.telegram.sendMessage(ctx.chat.id, `Сборочное задание с идентификатором ${id} добавлено к поставке`)
        }

        ctx.state.orderIds = ids;
        await ctx.scene.enter('createTrbx');
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }
})

addOrder.leave(async (ctx) => {

})

const getDeliveryType = async (deliveryTypeCode) => {
    switch (deliveryTypeCode) {
        case 'fbs':
            return 'Доставка на склад Wildberries';
        case 'dbs':
            return 'Доставка силами продавца';
        case 'wbgo':
            return 'Доставка курьером';
    }
}

const formMessageWithOpenOrders = async (ctx) => {
    try {
        let mainHeader = '<i>[Шаг 2/5]</i>\n\nВведите идентификатор сборочного задания для добавления в поставку. Для добавление нескольких значений сразу введите их через запятую\n\n';
        let orders = await getNewOrders();
        ordersForReport = orders;
        let message = mainHeader + '<b>Доступные сборочные задания: </b>\n\n';
        for (const [index, order] of orders.entries()) {
            let orderHeder = `[${index + 1}/${orders.length}]\n`
            let id = `Идентификатор: ${order.id}\n`
            let article = `Артикул продавца: ${order.article}\n`

            let deliveryType = await getDeliveryType(order.deliveryType);
            let delivery = `Тип доставки: ${deliveryType}\n`;

            let warehouseObject = await getWarehouse(order.warehouseId);
            let warehouse = `Склад: ${warehouseObject.name}\n`;

            let cargoType = defineCargoType(order.cargoType);
            let cargoTypeRow = `Тип поставки: ${cargoType}\n\n`;
            message = message + orderHeder + id + article + delivery + warehouse + cargoTypeRow;
        }
        return message;
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }
}

const defineCargoType = (cargoType) => {
    switch (cargoType) {
        case 0:
            return 'Тип поставки не обозначен';
        case 1:
            return 'Обычная';
        case 2:
            return 'СГТ (Содержит сверхгабаритные товары)';
        case 3:
            return 'КГТ (Содержит крупногабаритные товары)';
        default:
            return 'Тип поставки не обозначен';
    }
}