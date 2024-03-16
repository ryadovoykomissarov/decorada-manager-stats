import { Scenes } from "telegraf";
import { exportToExcel, selectPeriodKeyboard } from "../utilities/Markup.js";
import { getOrders } from "../controllers/WildberriesController.js";
import { getDate, substractFromCurrent } from "../utilities/DateUtil.js";
import { write } from "../utilities/Excel.js";

export const summaryScene = new Scenes.BaseScene('summaryScene');

summaryScene.enter(async (ctx) => {
    try {
        const options = selectPeriodKeyboard;
        await ctx.reply('Укажите период, за который необходимо получить статистику.', options);

        let ordersForReport;

        summaryScene.hears('Назад', async (ctx) => {
            await ctx.scene.enter('main');
        })

        summaryScene.hears('Сегодня', async (ctx) => {
            let date = await substractFromCurrent(0);
            let orders = await getOrders(date);
            ordersForReport = orders;
            let result = await dispenseOrders(orders, ctx);
            let sortedResult = await sortOrders(result);
            let message = await formMessage(sortedResult);
            const keyboard = exportToExcel;
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        summaryScene.hears('Неделя', async (ctx) => {
            let date = await substractFromCurrent(7);
            let orders = await getOrders(date);
            ordersForReport = orders;
            let result = await dispenseOrders(orders, ctx);
            let message = await formMessage(result);
            const keyboard = exportToExcel;
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        summaryScene.hears('Месяц', async (ctx) => {
            let date = await substractFromCurrent(30);
            let orders = await getOrders(date);
            ordersForReport = orders;
            let result = await dispenseOrders(orders, ctx);
            let message = await formMessage(result);
            const keyboard = exportToExcel;
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        summaryScene.hears('3 месяца', async (ctx) => {
            let date = await substractFromCurrent(90);
            let orders = await getOrders(date);
            ordersForReport = orders;
            let result = await dispenseOrders(orders, ctx);
            let message = await formMessage(result);
            const keyboard = exportToExcel;
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        summaryScene.action('e_toExcel', async (ctx) => {
            let filePath = await write(ordersForReport);
            await ctx.telegram.sendDocument(ctx.chat.id, {
                source: filePath,
                filename: 'ЭкспортированнаяСтатистика.xlsx'
            });

            await erase(filePath);
        })

        summaryScene.leave();
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: options });
        await ctx.scene.leave();
    }
});

const dispenseOrders = async (arr, ctx) => {
    try {
        let counts = {};

        arr.forEach(obj => {
            if (obj.orderType == 'Клиентский' && obj.isCancel == false) {
                const article = obj.nmId;
                counts[article] = counts[article] ? counts[article] + 1 : 1;
            }
        });

        const result = Object.keys(counts).map(article => ({ art: article, count: counts[article] }));

        result.sort((a, b) => b.count - a.count);

        return result;
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: options });
        await ctx.scene.leave();
    }
}

const sortOrders = async (data) => {
    data.sort((a, b) => {
        a.count < b.count ? 1 : b.count < a.count ? -1 : 0
    });
    return data;
}

const formMessage = async (data) => {
    let message = '';
    if (data.length < 1) {
        message = 'За текущий период заказов не найдено.'
    } else {
        message = '<b>Заказы за выбранный период:</b> \n\n';
    }

    data.forEach(obj => {
        message = message + 'Артикул ' + '<b>' + obj.art + '</b>' + ' - ' + obj.count + ' шт. \n';
    })

    return message;
}

summaryScene.leave(async (ctx) => {

});