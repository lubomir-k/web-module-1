const { randomUUID } = require("node:crypto");
const store = require("../store/orderStore");

const DEFAULT_ORDER_STATUS = "created";

function makeOrderId() {
  return `ord-${randomUUID().slice(0, 8)}`;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTotal(items) {
  return roundMoney(
    items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  );
}

function createOrder({ customerName, items }) {
  const normalizedItems = items.map((item) => ({
    name: item.name.trim(),
    quantity: item.quantity,
    price: item.price,
  }));

  return store.add({
    id: makeOrderId(),
    customerName: customerName.trim(),
    items: normalizedItems,
    total: calculateTotal(normalizedItems),
    status: DEFAULT_ORDER_STATUS,
  });
}

function allOrders() {
  return store.findAll();
}

function getOrder(id) {
  return store.findById(id);
}

function deleteOrder(id) {
  return store.removeById(id);
}

module.exports = { createOrder, allOrders, getOrder, deleteOrder };
