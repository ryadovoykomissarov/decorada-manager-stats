import axios from "axios";
import { suppliesMainViewUri, suppliesStorage } from "../couchdb.js"

export const getSupplies = async (keystart, keyend) => {
    let database = suppliesStorage;
    let ids = [];
    let result = [];

    let uri = suppliesMainViewUri + `?startkey="${keystart}"&endkey="${keyend}"`;
    const res = await axios.get(uri);

    res.data.rows.forEach((elem) => {
        ids.push(elem.id);
    });

    for (const id of ids) {
        let supply = await database.get(id);
        result.push(supply);
    }

    return result;
}

export const getSupply = async (id) => {
    let database = suppliesStorage;

    let supplyId = undefined;
    const body = await database.view('supplies_doc', 'supplies_view_id', {key: id});
    body.rows.forEach((elem) => {
        supplyId = elem.id;
    });

    let supply = await database.get(supplyId);
    return supply;
}