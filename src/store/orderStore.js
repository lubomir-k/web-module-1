const orders = [];

function findAll() {
  return orders;
}

function findById(id) {
  return orders.find((order) => order.id === id);
}

function add(order) {
  orders.push(order);
  return order;
}

function removeById(id) {
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return false;
  orders.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, add, removeById };
