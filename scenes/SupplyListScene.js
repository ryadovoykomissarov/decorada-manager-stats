import { Scenes } from "telegraf";
import { exportToExcel, supplyListParameters } from "../utilities/Markup.js";
import { addToCurrent, substractFromCurrent } from "../utilities/DateUtil.js";
import { getSupplies, getSupply } from "../model/SuppliesModel.js";
import { erase, write } from "../utilities/Excel.js";
import { deleteSupply } from "../controllers/WildberriesController.js";

export const supplyListScene = new Scenes.BaseScene("supplyListScene");

supplyListScene.enter(async (ctx) => {
    try {
        let options = supplyListParameters;
        await ctx.reply('Укажите период, за которой необходимо получить статистику. Для получения информации о конкретной поставке выберите "По номеру"', options);

        let suppliesForReport;

        supplyListScene.hears('Сегодня', async (ctx) => {
            let startDate = await substractFromCurrent(1);
            let keystart = startDate + 'T21:00:00Z';
            let endDate = await substractFromCurrent(0);
            let keyend = endDate + 'T21:00:00Z';

            let supplies = await getSupplies(keystart, keyend);
            suppliesForReport = supplies;
            let message = await formMessage(supplies);
            let keyboard = exportToExcel;
            if (supplies.length == 0) {
                await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
            } else await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        supplyListScene.hears('Неделя', async (ctx) => {
            let startDate = await substractFromCurrent(8);
            let keystart = startDate + 'T21:00:00Z';
            let endDate = await substractFromCurrent(0);
            let keyend = endDate + 'T21:00:00Z';

            let supplies = await getSupplies(keystart, keyend);
            suppliesForReport = supplies;
            let message = await formMessage(supplies);
            let keyboard = exportToExcel;
            if (supplies.length == 0) {
                await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
            } else await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        supplyListScene.hears('Месяц', async (ctx) => {
            let startDate = await substractFromCurrent(31);
            let keystart = startDate + 'T21:00:00Z';
            let endDate = await substractFromCurrent(0);
            let keyend = endDate + 'T21:00:00Z';

            let supplies = await getSupplies(keystart, keyend);
            suppliesForReport = supplies;
            let message = await formMessage(supplies);
            let keyboard = exportToExcel;
            if (supplies.length == 0) {
                await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
            } else await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        supplyListScene.hears('3 месяца', async (ctx) => {
            let startDate = await substractFromCurrent(91);
            let keystart = startDate + 'T21:00:00Z';
            let endDate = await substractFromCurrent(0);
            let keyend = endDate + 'T21:00:00Z';

            let supplies = await getSupplies(keystart, keyend);
            suppliesForReport = supplies;
            let message = await formMessage(supplies);
            let keyboard = exportToExcel;
            if (supplies.length == 0) {
                await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
            } else await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        supplyListScene.hears('По номеру', async (ctx) => {
            await ctx.telegram.sendMessage(ctx.chat.id, 'Введите номер поставки. \n\n<i>Пример:</i> WB-GI-10018003', { parse_mode: 'HTML' });
        });

        supplyListScene.hears(/\bWB-GI-\d{8}\b/, async (ctx) => {
            let supply = await getSupply(ctx.message.text);
            let message = await formSingleSupplyMessage(supply);
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
        });

        supplyListScene.action('e_toExcel', async (ctx) => {
            console.log(suppliesForReport);
            let filePath = await write(suppliesForReport);
            await ctx.telegram.sendDocument(ctx.chat.id, {
                source: filePath,
                filename: 'ЭкспортированнаяСтатистика.xlsx'
            });

            await erase(filePath);
        })

        supplyListScene.hears('Назад', async (ctx) => {
            await deleteSupply(ctx.state.supplyId)
            await ctx.scene.enter('main');
        })

        supplyListScene.leave();
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь кнопки "Назад" или перезапустите бота командой /start', { parse_mode: 'HTML', reply_markup: keyboard });
        await ctx.scene.leave();
    }

});

const formMessage = async (data) => {
    let message = '';
    if (data.length < 1) {
        message = 'За текущий период созданных поставок не найдено.'
    } else {
        message = '<b>Созданные поставки за выбранный период:</b> \n\n';
    }

    data.forEach(obj => {
        let done = obj.done;
        let doneString = '';
        if (done) {
            doneString = 'ЗАВЕРШЕНА';
        } else {
            doneString = 'НЕ ЗАВЕРШЕНА'
        }

        message = message + 'ID ' + '<b>' + obj.id + '</b>' + ': создана ' + obj.createdAt + ', статус - ' + doneString + ' \n';
    })

    return message;
};

const formSingleSupplyMessage = async (data) => {
    let header = '<b>Поставка ' + data.id + '</b>\n\n';
    let name = '<b>Наименование поставки: </b>' + data.name + '\n';

    let cargoType = defineCargoType(data.cargoType);
    let cargoTypeRow = '<b>Тип поставки: </b>' + cargoType + '\n';

    let createdAt = '<b>Дата создания: </b>' + data.createdAt + '\n\n';

    let status = defineStatus(data);
    let statusRow = '<b>Статус: </b>' + status + '\n';

    let scanDt = '';
    let closedAt = '';
    if (status == 'ОТСКАНИРОВАНО') {
        scanDt = '<b>Дата скана: </b>' + data.scanDt;
    };
    if (status == 'ЗАКРЫТО') {
        scanDt = '<b>Дата скана: </b>' + data.scanDt + '\n';
        closedAt = '<b>Дата закрытия: </b>' + data.closedAt + '\n';
    };

    let message = header + name + cargoTypeRow + createdAt + statusRow + scanDt + closedAt;
    return message;
}

const defineStatus = (data) => {
    let statuses = ['НОВАЯ', 'ОТСКАНИРОВАНО', 'ЗАКРЫТО'];
    let status = '';
    if (data.scanDt == null && data.closedAt == null) {
        status = statuses[0];
    } else if (data.scanDt !== null && data.closedAt == null) {
        status = statuses[1];
    } else if (data.closedAt !== null) {
        status = statuses[2];
    }
    return status;
}

const defineCargoType = (cargoType) => {
    switch (cargoType) {
        case '0':
            return 'Тип поставки не обозначен';
        case '1':
            return 'Обычная';
        case '2':
            return 'СГТ (Содержит сверхгабаритные товары)';
        case '3':
            return 'КГТ (Содержит крупногабаритные товары)';
        default:
            return 'Тип поставки не обозначен';
    }
}