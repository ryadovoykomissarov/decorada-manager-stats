import { ordersStorage } from "../couchdb.js";
import { shortenUtc } from "../utils/DateTimeUtils.js";

const getOrders = async () => {
    let database = ordersStorage;
    let result = [];
    const docsList = await database.list().then((body) => {
        body.rows.forEach((doc) => {
            result.push(doc);
        })
    });
    return result;
}

export const getOrdersByDate = async (date) => {
    let result = [];
    let orders = await getOrders();
    orders.forEach(order => {
        let orderDate = order.date;
        if (orderDate) {
            orderDate = shortenUtc(orderDate);
            if (orderDate == date) {
                result.push(order)
            }
        }
    })
    return result;
}

export const getOrdersInPeriod = async (dates) => {
    let result = [];
    let orders = await getOrders();
    orders.forEach(order => {
        let orderDate = order.date;
        if (orderDate) {
            orderDate = shortenUtc(orderDate);
            dates.forEach(requiredDate => {
                if (orderDate == requiredDate) {
                    result.push(order)
                }
            })
        }
    })
    return result;
}