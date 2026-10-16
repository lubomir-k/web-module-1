const express = require("express");
const orderService = require("../services/orderService");
const { validateCreateOrder, validationProblem } = require("../validation/orderValidation");

const router = express.Router();


function notFoundProblem() {
  return {
    error: {
      code: "ORDER_NOT_FOUND",
      message: "Order not found",
    },
  };
}

function copyItem(item) {
  return {
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  };
}

function orderResponse(order) {
  return {
    id: order.id,
    customerName: order.customerName,
    items: order.items.map(copyItem),
    total: order.total,
    status: order.status,
  };
}

router.post("/", (req, res) => {
  const validationErrors = validateCreateOrder(req.body);
  if (validationErrors.length > 0) {
    return res
        .status(400)
        .json(validationProblem("Invalid order", validationErrors));
  }

  const order = orderService.createOrder(req.body);
  return res
    .status(201)
    .location(`/orders/${order.id}`)
    .json(orderResponse(order));
});

router.get("/", (req, res) => {
  const orders = orderService.allOrders().map(orderResponse);
  res.status(200).json({ orders, count: orders.length });
});

router.get("/:id", (req, res) => {
  const order = orderService.getOrder(req.params.id);
  if (!order) return res.status(404).json(notFoundProblem());
  return res.status(200).json(orderResponse(order));
});

router.delete("/:id", (req, res) => {
  if (!orderService.deleteOrder(req.params.id)) {
    return res.status(404).json(notFoundProblem());
  }
  return res.status(204).send();
});

module.exports = router;
