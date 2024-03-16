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

let bot_token = '7129251318:AAEKbTbMOwAFDaFsCIv8H3w4E7dY_DlVFuU';
const bot = new Telegraf(bot_token);

const mainScene = new Scenes.BaseScene('main');

const stage = new Scenes.Stage([mainScene, summaryScene, supplyInitialScene, supplyListScene, createSupply, addOrder, createTrbx, ordersToTrbxes, getStickers]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
    await ctx.scene.enter('main');
});

bot.launch();

mainScene.enter(async (ctx) => {
    await ctx.reply('Выберите функцию', onStartKeyboard);
})

mainScene.hears('Статистика за период', async (ctx) => {
    await ctx.scene.enter('summaryScene');
});

mainScene.hears('Работа с поставками', async (ctx) => {
    await ctx.scene.enter('supplyInitial');
});