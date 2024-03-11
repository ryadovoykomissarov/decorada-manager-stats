import Nano from 'nano';
let nano = Nano('http://admin:admin@localhost:5984');

let ordersStorageName = 'rnd-orders';
let salesStorageName = 'rnd-sales';
let productsStorageName = 'rnd-products';
let suppliesStorageName = 'rnd-supplies';

export const suppliesMainViewUri = 'http://admin:Vtkrjyju18!@http://195.58.54.86:5984/rada-notifications-qa-supplies/_design/supplies_doc/_view/supplies_view';

export let ordersStorage = nano.use(ordersStorageName);
export let salesStorage = nano.use(salesStorageName);
export let productsStorage = nano.use(productsStorageName);
export let suppliesStorage = nano.use(suppliesStorageName);

