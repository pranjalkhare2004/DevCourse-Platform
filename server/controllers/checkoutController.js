const razorpay = require("../services/razorpayClient");
const { initializeConnection } = require("../config/database");

const checkPurchasedCourses = async (userId, courseIds) => {
  try {
    const connection = await initializeConnection();
    const query = `SELECT course_id FROM purchased_courses WHERE user_id = ? AND course_id IN (${courseIds.map(() => '?').join(',')})`;
    const params = [userId, ...courseIds];
    const [results] = await connection.query(query, params);
    return results.map(result => result.course_id);
  } catch (err) {
    console.error("Error checking purchased courses:", err);
    throw new Error("Error checking purchased courses");
  }
};

const storeItems = new Map([
  [1, { priceInCents: 3000, name: "Learn About Kafka and Node.js" }],
  [2, { priceInCents: 2000, name: "React, but with webpack" }],
  [3, { priceInCents: 2000, name: "Learn About Terraform in Depth" }],
  [4, { priceInCents: 3000, name: "Kubernetes and Docker for deployment" }],
  [5, { priceInCents: 4000, name: "Create your own Serverless web app" }],
]);

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) throw new Error("User ID is not defined. Ensure the user is authenticated.");

    const courseIds = req.body.items.map((item) => item.id);

    // Check already purchased
    const purchasedCourseIds = await checkPurchasedCourses(userId, courseIds);
    if (purchasedCourseIds.length > 0) {
      return res.status(400).json({
        message: `You have already purchased courses with IDs: ${purchasedCourseIds.join(", ")}`,
        purchasedCourseIds,
      });
    }

    // Prepare total amount and course names
    let totalAmount = 0;
    const courseNames = [];
    req.body.items.forEach((item) => {
      const storeItem = storeItems.get(item.id);
      if (!storeItem) return;
      totalAmount += storeItem.priceInCents * item.quantity;
      courseNames.push(storeItem.name);
    });

    if (totalAmount === 0) throw new Error("No valid items found for checkout.");

    const options = {
      amount: totalAmount * 1, // already in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseIds,
      courseNames,
      clientKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("Error creating Razorpay order:", e.message);
    res.status(500).json({ error: e.message });
  }
};
