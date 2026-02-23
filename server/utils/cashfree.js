const axios = require("axios");

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "TEST";

const BASE_URL =
  CASHFREE_ENV === "TEST"
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";

const createOrderSession = async (orderData) => {
  try {
    // Ensure phone is exactly 10 digits (Cashfree sandbox requirement)
    let phone = (orderData.customerPhone || "1234567890").replace(/\D/g, "");
    if (phone.length > 10) phone = phone.slice(-10);

    const data = {
      order_id: orderData.orderId,
      order_amount: orderData.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: orderData.customerId,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/checkout/status?order_id={order_id}`,
      },
    };

    console.log("Creating Cashfree Order with:", JSON.stringify(data, null, 2));

    const response = await axios.post(`${BASE_URL}/orders`, data, {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });

    return response.data;
  } catch (error) {
    const errorDetail = error.response ? error.response.data : error.message;
    console.error(
      "Cashfree Create Order Error:",
      JSON.stringify(errorDetail, null, 2),
    );
    throw new Error(
      typeof errorDetail === "object"
        ? errorDetail.message || JSON.stringify(errorDetail)
        : errorDetail,
    );
  }
};

const getCashfreeOrder = async (orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Cashfree Get Order Error:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

module.exports = {
  createOrderSession,
  getCashfreeOrder,
};
