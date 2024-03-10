const { Telegraf, Scenes } = require('telegraf');
const { start, backMenu, startSummary } = require('./controllers/command.js');

const bot = new Telegraf('7185482816:AAGE3SOcno9v4ZPi2ejBmRqehPHLXWvKSz0');

const stage = new Scenes.Stage([]);

const setupBot = () => {

    bot.use(session({collectionName: 'sessions'}));
    bot.use(stage.middleware());

    bot.use((ctx, next) => {
        console.log(ctx);
        return next();
    });

    bot.start(start);

    bot.hears('В меню', backMenu);
    bot.hears('/summary', async (ctx) => {
         let date = await getDate();
        let message = 'Статистика на ' + date + ": \n\n" +
        'Артикул 00000001 - заказов 7, продаж 5 \n' +
        'Артикул 00000002 - заказов 1, продаж 0 \n' + 
        'Артикул 00000003 - заказов 11, продаж 9 \n' +
        'Артикул 00000004 - заказов 27, продаж 21 \n';

    await ctx.reply(message);
    await ctx.scene.leave();
    })

    return bot;
}

module.exports = {
    setupBot
}