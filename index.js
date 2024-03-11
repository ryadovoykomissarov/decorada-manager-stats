import { Context, Scenes, Telegraf, session } from 'telegraf';
import { getDate } from './utils/DateTimeUtils.js';
import { onStartKeyboard } from './utilities/Markup.js';
import { summaryScene } from './scenes/SummaryScene.js';
import { supplyInitialScene } from './scenes/SupplyInitialScene.js';
import { supplyListScene } from './scenes/SupplyListScene.js';
import { createSupply } from './scenes/CreateSupplyScene.js';
import { addOrder } from './scenes/AddOrdersScene.js';
import { createTrbx } from './scenes/CreateTrbxScene.js';
import { getStickers } from './scenes/GetStickersScene.js';
import { ordersToTrbxes } from './scenes/OrdersToTrbxesScene.js';
const { enter, leave } = Scenes.Stage;

let bot_token = '7185482816:AAGE3SOcno9v4ZPi2ejBmRqehPHLXWvKSz0';
const bot = new Telegraf(bot_token);

const stage = new Scenes.Stage([summaryScene, supplyInitialScene, supplyListScene, createSupply, addOrder, createTrbx, ordersToTrbxes, getStickers]);

bot.start(async (ctx) => {
    await ctx.reply('Выберите функцию', onStartKeyboard);
});

bot.use(session());
bot.use(stage.middleware());

bot.hears('Статистика за период', async (ctx) => {
    await ctx.scene.enter('summaryScene');
});

bot.hears('Работа с поставками', async (ctx) => {
    await ctx.scene.enter('supplyInitial');
});

bot.hears('Сформировать поставку', async (ctx) => {

});

bot.launch();