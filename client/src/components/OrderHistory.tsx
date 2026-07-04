import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "@/lib/api";
import { X, ChevronRight, Calendar, MapPin, CreditCard, Package, Truck, Check } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("3m");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
                            "/placeholder-cheese.webp";
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

              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2C5530] hover:underline"
                >
                  View Details & Track <ChevronRight size={14} />
                </button>

                {order.estimatedDeliveryDate && (
                  <p className="text-[10px] text-gray-400 font-medium">
                    Est. Arrival:{" "}
                    {new Date(order.estimatedDeliveryDate).toLocaleDateString(
                      "en-IN",
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                  Order Details
                </p>
                <h3 className="font-bold text-lg">#{selectedOrder.orderId}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              {/* Status Tracker */}
              <div className="bg-bg-cream-light p-5 rounded-2xl">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Truck size={14} className="text-brand-green" /> Delivery Timeline
                </h4>
                
                {/* Stepper Steps */}
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-2 mb-6 border-b border-gray-100 pb-6">
                  {["placed", "confirmed", "processing", "shipped", "delivered"].map((st, sidx) => {
                    const keys = ["placed", "confirmed", "processing", "shipped", "delivered"];
                    const currentIdx = keys.indexOf(selectedOrder.orderStatus);
                    const stepIdx = keys.indexOf(st);
                    const isCompleted = stepIdx <= currentIdx && selectedOrder.orderStatus !== "cancelled";
                    const isCurrent = stepIdx === currentIdx;

                    const stepLabels: Record<string, string> = {
                      placed: "Placed",
                      confirmed: "Confirmed",
                      processing: "Processing",
                      shipped: "Shipped",
                      delivered: "Delivered",
                    };

                    return (
                      <div key={st} className="flex-1 flex flex-col items-center min-w-[70px] text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? "bg-brand-green text-white"
                            : isCurrent
                              ? "bg-brand-gold text-text-primary"
                              : "bg-gray-200 text-gray-400"
                        }`}>
                          {isCompleted ? <Check size={14} /> : sidx + 1}
                        </div>
                        <span className={`text-[10px] font-bold mt-2 capitalize ${isCompleted ? "text-brand-green" : "text-gray-400"}`}>
                          {stepLabels[st] || st}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking History Logs */}
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                    selectedOrder.trackingHistory.slice().reverse().map((log: any, lidx: number) => (
                      <div key={lidx} className="flex gap-4 relative pl-5 border-l-2 border-brand-green/20 last:border-0 pb-4 last:pb-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-green absolute -left-[6px] top-1.5 shadow-sm shadow-brand-green/20"></span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-xs font-bold text-gray-900">{log.title}</p>
                            <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{log.description}</p>
                          {log.location && (
                            <span className="inline-block text-[9px] font-bold text-[#C9A961] bg-[#C9A961]/10 px-1.5 py-0.5 rounded mt-1.5">
                              📍 {log.location}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No tracking updates logged yet.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#C9A961]" /> Delivery Address
                    </h4>
                    <p className="font-bold text-sm text-gray-900">{selectedOrder.deliveryAddress?.name}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {selectedOrder.deliveryAddress?.addressLine1 || selectedOrder.deliveryAddress?.address}
                      <br />
                      {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}
                    </p>
                    <p className="text-xs font-bold text-brand-green mt-2 flex items-center gap-1">
                      📞 {selectedOrder.deliveryAddress?.mobile || selectedOrder.deliveryAddress?.phone}
                    </p>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-50 bg-[#FAF7F2] p-3 rounded-xl border border-dashed border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Courier Tracking</p>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        {selectedOrder.courierPartner}: <span className="text-[#2C5530] select-all">{selectedOrder.trackingNumber}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment & Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#C9A961]" /> Bill Details
                  </h4>
                  <div className="text-xs space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Basket Subtotal</span>
                      <span>₹{Number(selectedOrder.orderAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discounts</span>
                        <span>-₹{Number(selectedOrder.discount).toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>₹{Number(selectedOrder.deliveryCharge || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (4%)</span>
                      <span>₹{Number(selectedOrder.taxAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900 text-sm">
                      <span>Total Paid</span>
                      <span className="text-brand-green">₹{Number(selectedOrder.finalAmount || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase border-t border-gray-50">
                    <span>Method: {selectedOrder.paymentMode || "COD"}</span>
                    <span>Status: {selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border border-gray-100 rounded-2xl p-5">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Package size={14} className="text-[#C9A961]" /> Items Ordered
                </h4>
                <div className="divide-y divide-gray-50 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder-cheese.webp";
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-900 leading-tight">{item.productName}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.weight}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-medium text-gray-500 mr-4">₹{item.price} x {item.quantity}</span>
                        <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
