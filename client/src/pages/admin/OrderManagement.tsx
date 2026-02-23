import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
} from "lucide-react";

const OrderManagement: React.FC = () => {
  const { orders, fetchOrders, updateOrder, isLoading } = useAdminStore();
  const [editingOrder, setEditingOrder] = React.useState<string | null>(null);
  const [trackingData, setTrackingData] = React.useState({
    trackingNumber: "",
    courierPartner: "",
    estimatedDeliveryDate: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "confirmed":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrder(orderId, { orderStatus: newStatus });
  };

  const handleSaveTracking = async (orderId: string) => {
    await updateOrder(orderId, {
      ...trackingData,
      orderStatus: "shipped",
    });
    setEditingOrder(null);
  };

  const startEditing = (order: any) => {
    setEditingOrder(order._id);
    setTrackingData({
      trackingNumber: order.trackingNumber || "",
      courierPartner: order.courierPartner || "Delhivery",
      estimatedDeliveryDate: order.estimatedDeliveryDate
        ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
        : "",
    });
  };

  if (isLoading && orders.length === 0)
    return <div className="p-8 text-center text-xl">Loading orders...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 uppercase tracking-tighter">
            Live Updates
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    {order.orderId}
                    <span
                      className={`px-2.5 py-0.5 text-[10px] uppercase font-black rounded-full border ${getStatusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-black rounded-full border ${order.paymentStatus === "completed" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Placed by{" "}
                    <span className="text-gray-900 font-bold">
                      {order.user?.name || "Guest User"}
                    </span>{" "}
                    • {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Amount
                  </div>
                  <div className="text-lg font-black text-gray-900">
                    ₹{order.finalAmount}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500 transition-all cursor-pointer"
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {order.orderStatus === "confirmed" && (
                    <button
                      onClick={() => startEditing(order)}
                      className="text-xs font-bold text-[#2C5530] hover:underline"
                    >
                      Ship Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking Editor */}
            {editingOrder === order._id && (
              <div className="p-5 bg-[#FAF7F2] border-t border-gray-100">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Shipping Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Tracking ID"
                    value={trackingData.trackingNumber}
                    onChange={(e) =>
                      setTrackingData({
                        ...trackingData,
                        trackingNumber: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    placeholder="Courier Partner"
                    value={trackingData.courierPartner}
                    onChange={(e) =>
                      setTrackingData({
                        ...trackingData,
                        courierPartner: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={trackingData.estimatedDeliveryDate}
                    onChange={(e) =>
                      setTrackingData({
                        ...trackingData,
                        estimatedDeliveryDate: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleSaveTracking(order._id)}
                    className="bg-[#2C5530] text-white px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Save & Mark Shipped
                  </button>
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="text-gray-500 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4 overflow-x-auto">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Items:
                </span>
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-gray-100"
                  >
                    <span className="text-xs font-bold text-gray-800">
                      {item.productName}
                    </span>
                    <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-1 rounded">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
                {order.deliveryAddress?.pincode}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            No orders found in the system.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
