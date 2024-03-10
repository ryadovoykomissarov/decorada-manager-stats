import axios from "axios";
import { shortenUtc } from "../utilities/DateUtil.js";
import configuration from '../config.json' assert { type: "json" };

export const deleteSupply = async (supplyId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    await axios.delete(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}`, config)
        .then(function (response) {
        }).catch(function (error) {
            console.log(error);
        });
}

export const getStickersForTrbx = async (supplyId, format, trbxIds) => {
    let stickers = [];
    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    const bodyParams = {
        trbxIds: trbxIds
    };

    await axios.get(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}/trbx/stickers?type=${format}`, bodyParams, config)
        .then(function (response) {
             stickers = response.data.stickers;
        }).catch(function (error) {
            console.log(error);
        });
    return stickers;    
}

export const getTrbxInfo = async (supplyId) => {
    let trbxes = [];
    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    await axios.get(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}/trbx`, config)
        .then(function (response) {
             trbxes = response.data.trbxes; 
        }).catch(function (error) {
            console.log(error);
        });
    return trbxes;
}

export const patchTrbxWithOrders = async (supplyId, trbxId, orderIds) => {
    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

        const bodyParams = {
        orderIds: orderIds
    };


    await axios.patch(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}/trbx/${trbxId}`, bodyParams, config)
        .then(function (response) {
        }).catch(function (error) {
            console.log(error);
        });
}

export const patchSupplyWithOrders = async (supplyId, orderId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    await axios.patch(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}/orders/${orderId}`, config)
        .then(function (response) {
        }).catch(function (error) {
            console.log(error);
        });
}

export const postTrbx = async (supplyId, amount) => {
    let trbxIds;

    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    const bodyParams = {
        amount: amount
    };

    await axios.post(`https://suppliers-api.wildberries.ru/api/v3/supplies/${supplyId}/trbx`, bodyParams, config)
        .then(function (response) {
            trbxIds = response.data.trbxIds;
        }).catch(function (error) {
            console.log(error);
        });

    return trbxIds;
}

export const getWarehouse = async (id) => {
    let warehouses;
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://suppliers-api.wildberries.ru/api/v3/warehouses',
        headers: { 
            'Authorization': `Bearer ${configuration.wildberries_token}`
        }
    }

    try{
        const response = await axios.request(config);
        warehouses = response.data;
    } catch (error) {
        console.log(error)
    }

    let res;

    for (const wh of warehouses) {
        if (wh.id==id) {
            res = wh;
            break;
        }
    }

    return res;
}

export const postSupply = async (supplyName) => {
    let supplyId;

    const config = {
        headers: {
            Authorization: `Bearer ${configuration.wildberries_token}`
        }
    };

    const bodyParams = {
        name: supplyName
    };

    await axios.post('https://suppliers-api.wildberries.ru/api/v3/supplies', bodyParams, config)
        .then(function (response) {
            supplyId = response.data.id;
        }).catch(function (error) {
            console.log(error);
        });

    return supplyId;
}

export const getNewOrders = async () => {
    let orders = [];
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://suppliers-api.wildberries.ru/api/v3/orders/new',
        headers: { 
            'Authorization': `Bearer ${configuration.wildberries_token}`
        }
    }

    try{
        const response = await axios.request(config);
        orders = response.data.orders;
    } catch (error) {
        console.log(error)
    }

    return orders;
}

export const getOrders = async (date) => {
    let orders = [];
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 120000;

    const fetchData = async () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://statistics-api.wildberries.ru/api/v1/supplier/orders?dateFrom=${date}`,
            headers: { 
                'Authorization': `Bearer ${configuration.wildberries_token}`
            }
        }

        try{
            const response = await axios.request(config);
            orders = response.data;
        } catch (error) {
            if (error.response && retryCount < maxRetries) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                await fetchData();
            } else {
                console.log(error);
            }
        }
    }
    
    await fetchData();

    return orders;
}

export const getSales = async (date) => {
    let sales = [];
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 120000;

    const fetchData = async () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=${date}`,
            headers: {
                'Authorization': `Bearer ${configuration.wildberries_token}`
            }
        }

        try{
            const response = await axios.request(config);
            sales = response.data;
        } catch (error) {
            if (error.response && retryCount < maxRetries) {
                retryCount++;
                dInfo(`Received ${error.response.status} error. Retrying (${retryCount})/(${maxRetries}). ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                await fetchData();
            } else {
                console.log(error);
            }
        }
    }

    await fetchData();

    return sales;
}

export const getOrdersByDate = async (date) => {
    let result = [];
    let orders = await getOrders();
    orders.forEach(async order => {
        let orderDate = shortenUtc(order.date);
        let orderType = order.orderType;
        if (orderDate == date && orderType == 'Клиентский') result.push(order);
    });
    return result;
}

export const getChangedOrdersByDate = async (date) => {
    let result = [];
    let orders = await getOrders();
    orders.forEach(async order => {
        let orderChangeDate = shortenUtc(order.lastChangeDate);
        let orderType = order.orderType;
        if(orderChangeDate == date && orderType == 'Клиентский') result.push(order);  
    });
    return result;
}

export const getSalesByDate = async (date) => {
    let result = [];
    let sales = getSales();
    sales.forEach(async sale => {
        let orderDate = shortenUtc(sale.date);
        let orderType = sale.orderType;
        if (orderDate == date && orderType == 'Клиентский') result.push(sale);
    });
    return result;
}

export const getStocksByArticle = async (date, article) => {
    let allStocks = [];
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 120000;
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=${date}`,
        headers: {
            'Authorization': `Bearer ${configuration.wildberries_token}`
        }
    }
    try {
        const response = await axios.request(config);
        allStocks = response.data;
    } catch (error) {
        if (error.response && retryCount < maxRetries) {
            retryCount++;
            console.log(`Received ${error.response.status} error. Retrying (${retryCount})/(${maxRetries}). ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            await getStocksByArticle(date, article);
        } else {
            console.error(error);
        }
    }
    
    const foundStock = allStocks.find(obj => obj.nmId === article);
    
    if (foundStock) {
        return foundStock;
    } else {
        console.log(`Stock for article ${article} not found`);
        return null; // or return a default value as needed
    }
}