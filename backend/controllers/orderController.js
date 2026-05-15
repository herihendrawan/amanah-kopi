const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Menu = require('../models/Menu');

// @desc    Create new order
// @route   POST /api/order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customerName, items, orderType, deliveryAddress, paymentMethod, notes } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menu = await Menu.findById(item.menuId);
      if (!menu) {
        return res.status(404).json({ success: false, message: `Menu ${item.menuId} tidak ditemukan.` });
      }
      if (!menu.isAvailable) {
        return res.status(400).json({ success: false, message: `${menu.name} sedang tidak tersedia.` });
      }

      const price = menu.isPromo && menu.promoPrice ? menu.promoPrice : menu.price;
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        menu: menu._id,
        name: menu.name,
        price,
        quantity: item.quantity,
        subtotal,
      });

      // Update total orders on menu
      await Menu.findByIdAndUpdate(menu._id, { $inc: { totalOrders: item.quantity } });
    }

    const order = await Order.create({
      user: req.user._id,
      customerName,
      items: orderItems,
      totalAmount,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      paymentMethod,
      notes,
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    await order.populate('items.menu');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to('admin-room').emit('new-order', {
        order,
        message: `Pesanan baru dari ${customerName}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Get user's orders
// @route   GET /api/order
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.menu');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Get single order
// @route   GET /api/order/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.menu');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/order/admin/all
// @access  Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name email')
      .populate('items.menu');

    const total = await Order.countDocuments(query);

    res.json({ success: true, count: orders.length, total, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/order/:id
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    order.status = status;
    if (status === 'selesai') order.paymentStatus = 'paid';
    await order.save();

    // Emit realtime update to user
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${order.user._id}`).emit('order-status-update', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status,
        message: getStatusMessage(status),
        timestamp: new Date(),
      });

      io.to('admin-room').emit('order-updated', { order });
    }

    res.json({
      success: true,
      message: `Status pesanan diupdate ke "${status}"`,
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};

const getStatusMessage = (status) => {
  const messages = {
    pending: 'Pesanan Anda sedang menunggu konfirmasi.',
    diproses: 'Pesanan Anda sedang diproses oleh barista kami! ☕',
    selesai: 'Pesanan Anda sudah selesai! Silakan ambil pesanan Anda.',
    dibatalkan: 'Pesanan Anda telah dibatalkan.',
  };
  return messages[status] || 'Status pesanan diupdate.';
};

// @desc    Delete order (admin)
// @route   DELETE /api/order/:id
// @access  Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    await order.deleteOne();
    res.json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};