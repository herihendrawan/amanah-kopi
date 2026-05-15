const Order = require('../models/Order');
const Menu = require('../models/Menu');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      totalMenus,
      totalUsers,
      revenueData,
      todayRevenue,
      statusBreakdown,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ status: { $in: ['pending', 'diproses'] } }),
      Menu.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.aggregate([
        { $match: { status: 'selesai' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { status: 'selesai', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    // Weekly revenue for chart (last 7 days)
    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          status: 'selesai',
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top selling menus
    const topMenus = await Menu.find().sort({ totalOrders: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalMenus,
        totalUsers,
        totalRevenue: revenueData[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
        statusBreakdown,
        weeklyRevenue,
        topMenus,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};
