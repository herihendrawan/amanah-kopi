const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
  createOrder, getUserOrders, getOrder,
  getAllOrders, updateOrderStatus, deleteOrder,
} = require('../controllers/orderController');

router.post('/',              protect, createOrder);
router.get('/my',             protect, getUserOrders);
router.get('/:id',            protect, getOrder);
router.get('/admin/all',      protect, adminOnly, getAllOrders);
router.put('/:id/status',     protect, adminOnly, updateOrderStatus);
router.delete('/:id',         protect, adminOnly, deleteOrder);

module.exports = router;