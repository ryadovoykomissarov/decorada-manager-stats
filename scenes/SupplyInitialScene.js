import { Scenes } from "telegraf";
import { createSupply, supplyInitialKeyboard } from "../utilities/Markup.js";
import { supplyListScene } from "./SupplyListScene.js";
const { enter, leave } = Scenes.Stage;

export const supplyInitialScene = new Scenes.BaseScene('supplyInitial');

supplyInitialScene.enter(async (ctx) => {
    try {
        const options = supplyInitialKeyboard;
        await ctx.reply('Выберите действие: ', options);

        supplyInitialScene.hears('Создать поставку', async (ctx) => {
            let keyboard = createSupply;
            let message = 'Данная функция позволяет <b>создать новую поставку</b>. \n\n' +
                '<b>Ограничения Wildberries для работы с поставками:</b> \n' +
                '- Только для сборочных заданий по схеме "Везу на склад WB"\n' +
                '- При добалении в поставку все передаваемые сборочные задания в статусе "Новое" будут автоматически переведены в статус "На сборке"\n' +
                '- Обратите внимание, что если вы переведете сборочное задание в статус "Отмена продавца", то сборочное задание автоматически удалится из поставки, если было прикреплено к ней\n' +
                '- Поставку можно собрать только из сборочных заданий (заказов) одного габаритного типа. Новая поставка не обладает габаритным признаком. При добавлении в поставку она приобретает габаритный признак этого заказа\n\n' +
                'Нажмите <i>"Продолжить"</i>, чтобы запустить процесс создания поставки. '
            await ctx.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML', reply_markup: keyboard });
        });

        supplyInitialScene.action('s_continue', async (ctx) => {
            await ctx.scene.enter('createSupply');
        })

        supplyInitialScene.hears('Назад', async (ctx) => {
            await ctx.scene.leave();
        })

        supplyInitialScene.hears('Получить список поставок', async (ctx) => {
            await ctx.scene.enter('supplyListScene');
        });
    } catch (e) {
        console.log(e);
        await ctx.telegram.sendMessage(ctx.chat.id, 'Произошла ошибка. Вернитесь в главное меню с помощь команды /start');
        await ctx.scene.leave();
    }
});