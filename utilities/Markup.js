export const onStartKeyboard = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Статистика за период', callback_data: 'periodic_stats' }],
            [{ text: 'Работа с поставками', callback_data: 'delivery_management' }],
            [{ text: 'Управление магазином', callback_data: 'market_management' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
}

export const selectPeriodKeyboard = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Сегодня', callback_data: 'p_today' }],
            [{ text: 'Неделя', callback_data: 'p_week' }],
            [{ text: 'Месяц', callback_data: 'p_month' }],
            [{ text: '3 месяца', callback_data: 'p_max' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
}

export const exportToExcel = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Экспорт в Excel', callback_data: 'e_toExcel' }]
    ]
})

export const supplyInitialKeyboard = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Создать поставку', callback_data: 's_create' }],
            [{ text: 'Получить список поставок', callback_data: 's_list' }],
            [{ text: 'Назад', callback_data: 's_back' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
}

export const supplyListParameters = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{ text: 'Сегодня', callback_data: 's_today' }],
            [{ text: 'Неделя', callback_data: 's_week' }],
            [{ text: 'Месяц', callback_data: 's_month' }],
            [{ text: '3 месяца', callback_data: 's_max' }],
            [{ text: 'По номеру', callback_data: 's_byNumber' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
}

export const createSupply = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Продолжить', callback_data: 's_continue' }]
    ]
});

export const done = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Готово', callback_data: 's_done' }]
    ]
});

export const doneOrCancel = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Готово', callback_data: 's_done' }],
        [{ text: 'Отмена', callback_data: 's_cancel' }]
    ]
});

export const next = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Далее', callback_data: 's_next' }]
    ]
});

export const oneMoreOrder = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Добавить еще один заказ', callback_data: 's_oneMoreOrder' }],
        [{ text: 'Далее', callback_data: 's_next' }]
    ]
});

export const showOpenOrders = JSON.stringify({
    inline_keyboard: [
        [{ text: 'Показать новые сборочные задания', callback_data: 's_showOpenOrders' }]
    ]
});