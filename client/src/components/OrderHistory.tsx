import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "@/lib/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("3m");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders();
      if (res.success && res.data) {
        const list = res.data.data || [];
        setOrders(list);
        setFilteredOrders(list);
        console.log(list);
      }
    } catch (err) {
      console.error("Fetch orders err:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const now = new Date();

    const filtered = orders.filter((order) => {
      const created = new Date(order.createdAt);

      if (range === "3m") {
        const d = new Date();
        d.setMonth(d.getMonth() - 3);
        return created >= d;
      }

      if (range === "6m") {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        return created >= d;
      }

      if (range === "year") {
        return created.getFullYear() === now.getFullYear();
      }

      return true;
    });

    setFilteredOrders(filtered);
  }, [range, orders]);

  const getStatusClass = (status: string) => {
    return status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "shipped"
        ? "bg-blue-100 text-blue-700"
        : status === "delivered"
          ? "bg-purple-100 text-purple-700"
          : "bg-orange-100 text-orange-700";
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-[#6B6B6B]">Loading orders...</div>
    );
  }

  return (
    <div className="space-y-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Your Orders
        </h1>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] bg-white"
          >
            <option value="3m">Past 3 months</option>
            <option value="6m">Past 6 months</option>
            <option value="year">This year</option>
          </select>

          <Link
            to="/shop"
            className="text-sm font-bold text-[#2C5530] hover:underline"
          >
            New Purchase
          </Link>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-100 text-center">
          <p className="text-[#6B6B6B] mb-4">
            You haven't placed any orders in this period.
          </p>
          <Link to="/shop" className="btn btn-primary px-8">
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#C9A961] transition-all hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order ID
                  </p>
                  <p className="font-bold text-[#1A1A1A]">{order.orderId}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </p>
                  <p className="font-bold text-[#1A1A1A]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="font-bold text-[#2C5530]">
                    ₹{Number(order.finalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(
                      order.orderStatus || "",
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-gray-100 min-w-[160px]"
                  >
                    <div className="relative w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.productId?.image || item.productImage}
                        alt={item.productId?.name || item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-cheese.png";
                        }}
                      />
                      <div className="absolute top-0 right-0 bg-[#2C5530] text-white text-[8px] font-bold px-1 rounded-bl">
                        {item.quantity}x
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">
                        {item.productId?.name || item.productName}
                      </p>
                      <p className="text-[9px] text-[#6B6B6B]">
                        {item.weight || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <p className="text-xs font-medium text-gray-600">
                      Track:{" "}
                      <span className="text-[#1A1A1A] font-bold">
                        {order.trackingNumber}
                      </span>{" "}
                      via{" "}
                      <span className="font-semibold">
                        {order.courierPartner}
                      </span>
                    </p>
                  </div>

                  {order.estimatedDeliveryDate && (
                    <p className="text-[10px] text-gray-400">
                      Est. Arrival:{" "}
                      {new Date(order.estimatedDeliveryDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
