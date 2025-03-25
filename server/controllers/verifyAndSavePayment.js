const { initializeConnection } = require("../config/database");

exports.verifyAndSavePayment = async (req, res) => {
  let connection;
  try {
    console.log("Payment verification request received:", req.body);

    const { paymentId, orderId, courseIds } = req.body;
    const userId = req.user.id;

    if (!paymentId || !orderId || !Array.isArray(courseIds)) {
      return res.status(400).json({ error: "Missing payment details or courseIds" });
    }
    
    connection = await initializeConnection();
    
    // Start transaction
    await connection.query('START TRANSACTION');

    // Save each course purchase in DB
    for (const courseId of courseIds) {
      await connection.query(
        "INSERT IGNORE INTO purchased_courses (user_id, course_id, payment_id, order_id) VALUES (?, ?, ?, ?)",
        [userId, courseId, paymentId, orderId]
      );
    }
    
    // Commit transaction
    await connection.query('COMMIT');

    res.status(200).json({ success: true, message: "Payment verified and courses saved." });
  } catch (err) {
    console.error("Error verifying payment and saving courses:", err.message);
    
    // Rollback transaction if there was an error
    if (connection) {
      await connection.query('ROLLBACK');
    }
    
    res.status(500).json({ error: "Server error during payment verification." });
  } finally {
    // Always release the connection
    if (connection) {
      connection.end();
    }
  }
};