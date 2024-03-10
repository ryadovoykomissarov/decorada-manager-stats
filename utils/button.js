const { Markup } = require('telegraf');

const mainMenu = 
    Markup.keyboard([
        ['Выборка статистики'],
        ['Информация о поставках'],
        ['Формирование поставки']
    ]).resize();

const backButton = 
    Markup.keyboard([
        ['В меню']
    ]).resize();

module.exports = {
    mainMenu,
    backButton
}