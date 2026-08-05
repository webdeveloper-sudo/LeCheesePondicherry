import React, { useEffect, useState, useMemo } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  Trash2,
  Eye,
  MapPin,
  CreditCard,
  Package,
  Check,
  X,
  AlertTriangle,
  Phone,
  Download,
  Filter,
  Search,
  RotateCcw,
  TrendingUp,
  PackageCheck,
  Calendar,
} from "lucide-react";
import { exportToCSV } from "@/utils/exportCsv";

const OrderManagement: React.FC = () => {
  const { orders, fetchOrders, updateOrder, deleteOrder, isLoading } =
    useAdminStore();

  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter States
  const [timePreset, setTimePreset] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [trackingData, setTrackingData] = useState({
    trackingNumber: "",
    courierPartner: "",
    estimatedDeliveryDate: "",
  });

  const [newLog, setNewLog] = useState({
    status: "placed",
    title: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Preset Click
  const handlePresetClick = (preset: string) => {
    setTimePreset(preset);
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    switch (preset) {
      case "7d": {
        const s = new Date();
        s.setDate(now.getDate() - 7);
        setStartDate(formatDate(s));
        setEndDate(formatDate(now));
        break;
      }
      case "1m": {
        const s = new Date();
        s.setDate(now.getDate() - 30);
        setStartDate(formatDate(s));
        setEndDate(formatDate(now));
        break;
      }
      case "3m": {
        const s = new Date();
        s.setMonth(now.getMonth() - 3);
        setStartDate(formatDate(s));
        setEndDate(formatDate(now));
        break;
      }
      case "6m": {
        const s = new Date();
        s.setMonth(now.getMonth() - 6);
        setStartDate(formatDate(s));
        setEndDate(formatDate(now));
        break;
      }
      case "this_year": {
        const s = new Date(now.getFullYear(), 0, 1);
        setStartDate(formatDate(s));
        setEndDate(formatDate(now));
        break;
      }
      case "2025": {
        setStartDate("2025-01-01");
        setEndDate("2025-12-31");
        break;
      }
      case "all":
      default: {
        setStartDate("");
        setEndDate("");
        break;
      }
    }
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setTimePreset("custom");
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setTimePreset("custom");
  };

  // Filtered orders list based on date ranges, delivery status, and search query
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.orderPlacedOn);

      // 1. Date Range Filtering (Between startDate and endDate)
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }

      // 2. Delivery Status Filter
      if (deliveryStatusFilter !== "all") {
        if (deliveryStatusFilter === "in_transit") {
          if (!["shipped", "out_for_delivery"].includes(order.orderStatus))
            return false;
        } else if (deliveryStatusFilter === "processing_all") {
          if (!["placed", "confirmed", "processing"].includes(order.orderStatus))
            return false;
        } else if (deliveryStatusFilter === "cancelled_all") {
          if (!["cancelled", "returned"].includes(order.orderStatus))
            return false;
        } else {
          if (order.orderStatus !== deliveryStatusFilter) return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const address = order.deliveryAddress || {};
        const orderIdStr = (order.orderId || "").toLowerCase();
        const nameStr = (address.name || order.user?.name || "").toLowerCase();
        const emailStr = (order.user?.email || "").toLowerCase();
        const phoneStr = (address.mobile || order.user?.mobile || "").toLowerCase();
        const cityStr = (address.city || "").toLowerCase();
        const itemsStr = (order.items || [])
          .map((i: any) => i.productName || "")
          .join(" ")
          .toLowerCase();

        const isMatch =
          orderIdStr.includes(q) ||
          nameStr.includes(q) ||
          emailStr.includes(q) ||
          phoneStr.includes(q) ||
          cityStr.includes(q) ||
          itemsStr.includes(q);

        if (!isMatch) return false;
      }

      return true;
    });
  }, [orders, startDate, endDate, deliveryStatusFilter, searchQuery]);

  // Order Metrics Summary for Filtered View
  const summaryMetrics = useMemo(() => {
    let totalRevenue = 0;
    let deliveredCount = 0;
    let inTransitCount = 0;
    let processingCount = 0;
    let cancelledCount = 0;

    filteredOrders.forEach((o) => {
      totalRevenue += Number(o.finalAmount || 0);
      const st = o.orderStatus;
      if (st === "delivered") {
        deliveredCount++;
      } else if (st === "shipped" || st === "out_for_delivery") {
        inTransitCount++;
      } else if (st === "cancelled" || st === "returned") {
        cancelledCount++;
      } else {
        processingCount++;
      }
    });

    return {
      totalOrders: filteredOrders.length,
      totalRevenue,
      deliveredCount,
      inTransitCount,
      processingCount,
      cancelledCount,
    };
  }, [filteredOrders]);

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

  const handleStatusChange = async (
    orderId: string,
    newStatus: string,
    e?: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e) e.stopPropagation();
    await updateOrder(orderId, { orderStatus: newStatus });
  };

  const handleSaveTracking = async (orderId: string) => {
    await updateOrder(orderId, {
      ...trackingData,
      orderStatus: "shipped",
    });
    setEditingOrder(null);
  };

  const handleDeleteLog = async (order: any, indexToDelete: number) => {
    const updatedHistory = order.trackingHistory.filter(
      (_: any, idx: number) => idx !== indexToDelete
    );
    await updateOrder(order._id, { trackingHistory: updatedHistory });
  };

  const handleAddLog = async (orderId: string, currentHistory: any[]) => {
    if (!newLog.title.trim() || !newLog.description.trim()) {
      alert("Please fill in both title and description for the update.");
      return;
    }
    const updatedHistory = [
      ...(currentHistory || []),
      { ...newLog, timestamp: new Date() },
    ];
    await updateOrder(orderId, { trackingHistory: updatedHistory });
    setNewLog({
      status: "placed",
      title: "",
      description: "",
      location: "",
    });
  };

  const startEditing = (order: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingOrder(order._id);
    setTrackingData({
      trackingNumber: order.trackingNumber || "",
      courierPartner: order.courierPartner || "Delhivery",
      estimatedDeliveryDate: order.estimatedDeliveryDate
        ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteOrder(orderToDelete._id);
      if (success) {
        if (selectedOrderDetails?._id === orderToDelete._id) {
          setSelectedOrderDetails(null);
        }
        setOrderToDelete(null);
      }
    } catch (err) {
      console.error("Delete order failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetFilters = () => {
    setTimePreset("all");
    setStartDate("");
    setEndDate("");
    setDeliveryStatusFilter("all");
    setSearchQuery("");
  };

  const handleExportCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) return;

    const headers = [
      "Order ID",
      "Placed Date",
      "Customer Name",
      "Customer Email",
      "Phone Number",
      "Address Type",
      "Delivery Address",
      "Items Summary",
      "Subtotal (INR)",
      "Discount (INR)",
      "Delivery Charge (INR)",
      "GST Tax (INR)",
      "Total Amount (INR)",
      "Payment Status",
      "Payment Mode",
      "Order Status",
      "Courier Partner",
      "Tracking Number",
    ];

    const rows = filteredOrders.map((o) => {
      const address = o.deliveryAddress || {};
      const fullAddrStr = [
        address.addressLine1,
        address.addressLine2,
        address.landmark,
        address.city,
        address.state,
        address.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      const itemsStr = (o.items || [])
        .map((i: any) => `${i.productName || "Product"} (x${i.quantity})`)
        .join("; ");

      return [
        o.orderId,
        o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN") : "N/A",
        address.name || o.user?.name || "Guest User",
        o.user?.email || "N/A",
        address.mobile || o.user?.mobile || "N/A",
        address.type || "home",
        fullAddrStr || "N/A",
        itemsStr || "N/A",
        o.orderAmount || 0,
        o.discount || 0,
        o.deliveryCharge || 0,
        o.taxAmount || 0,
        o.finalAmount || 0,
        o.paymentStatus || "pending",
        o.paymentMode || "online",
        o.orderStatus || "placed",
        o.courierPartner || "N/A",
        o.trackingNumber || "N/A",
      ];
    });

    const rangeLabel = startDate && endDate ? `${startDate}_to_${endDate}` : timePreset.toUpperCase();
    const filename = `orders_export_${rangeLabel}_${new Date().toISOString().split("T")[0]}.csv`;
    exportToCSV(filename, headers, rows);
  };

  if (isLoading && orders.length === 0)
    return <div className="p-8 text-center text-xl">Loading orders...</div>;

  return (
    <div className="p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Order Management
            <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-2.5 py-1 rounded-full border border-yellow-200">
              {filteredOrders.length} / {orders.length} Orders
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Filter orders between date ranges, presets, delivery status & export CSV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="bg-[#2C5530] hover:bg-[#1a3a20] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
          <span className="px-3 py-2 bg-green-100 text-green-800 text-xs font-bold rounded-xl border border-green-200 uppercase tracking-tighter">
            Live Sync
          </span>
        </div>
      </div>

      {/* Filter Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4 text-left">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            <Filter size={16} className="text-[#C9A961]" /> Order Filters & Date Ranges
          </div>

          {(timePreset !== "all" ||
            startDate !== "" ||
            endDate !== "" ||
            deliveryStatusFilter !== "all" ||
            searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw size={12} /> Reset Filters
            </button>
          )}
        </div>

        {/* Time Preset Buttons */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Quick Date Presets:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Time" },
              { id: "7d", label: "Past 7 Days" },
              { id: "1m", label: "1 Month" },
              { id: "3m", label: "3 Months" },
              { id: "6m", label: "6 Months" },
              { id: "this_year", label: "This Year (2026)" },
              { id: "2025", label: "Year 2025" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  timePreset === p.id && !startDate && !endDate
                    ? "bg-[#2C5530] text-white border-[#2C5530] shadow-xs"
                    : timePreset === p.id
                    ? "bg-[#2C5530]/90 text-white border-[#2C5530]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Controls Grid (Date Range Pickers, Status & Search) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-gray-50">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-[#C9A961]" /> From Date (Start):
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-[#C9A961]" /> To Date (End):
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Delivery Status:
            </label>
            <select
              value={deliveryStatusFilter}
              onChange={(e) => setDeliveryStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="placed">Placed</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit (Shipped / Out for Delivery)</option>
              <option value="delivered">Delivered Only</option>
              <option value="processing_all">Processing Pipeline (Placed/Confirmed/Processing)</option>
              <option value="cancelled_all">Cancelled / Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Search Orders:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Order ID, Customer, Phone, City..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Order Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <ShoppingBag size={14} className="text-gray-600" /> Filtered Orders
          </div>
          <div className="text-xl font-black text-gray-900">
            {summaryMetrics.totalOrders}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <CheckCircle size={14} className="text-green-600" /> Delivered
          </div>
          <div className="text-xl font-black text-green-700">
            {summaryMetrics.deliveredCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Truck size={14} className="text-purple-600" /> In Transit
          </div>
          <div className="text-xl font-black text-purple-700">
            {summaryMetrics.inTransitCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <Clock size={14} className="text-amber-600" /> Processing
          </div>
          <div className="text-xl font-black text-amber-700">
            {summaryMetrics.processingCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs text-left col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            <TrendingUp size={14} className="text-[#C9A961]" /> Revenue
          </div>
          <div className="text-xl font-black text-[#2C5530]">
            ₹{summaryMetrics.totalRevenue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const address = order.deliveryAddress || {};
          const fullAddressString = [
            address.addressLine1,
            address.addressLine2,
            address.landmark,
            address.city,
            address.state,
            address.pincode,
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={order._id}
              onClick={() => setSelectedOrderDetails(order)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group hover:border-yellow-500/30"
            >
              {/* Order Item Header Bar */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      #{order.orderId}
                      <span
                        className={`px-2.5 py-0.5 text-[10px] uppercase font-black rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-black rounded-full border ${
                          order.paymentStatus === "completed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">
                      Placed by{" "}
                      <span className="text-gray-900 font-bold">
                        {address.name || order.user?.name || "Guest User"}
                      </span>{" "}
                      • {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Amount
                    </div>
                    <div className="text-lg font-black text-gray-900">
                      ₹{order.finalAmount}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value, e)
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
                        onClick={(e) => startEditing(order, e)}
                        className="text-xs font-bold text-[#2C5530] hover:underline px-2 py-1 bg-green-50 rounded-lg border border-green-200"
                      >
                        Ship Order
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrderDetails(order);
                      }}
                      className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg border border-gray-200 transition-all"
                      title="View Full Order Details"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Delete Icon Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrderToDelete(order);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-100 transition-all"
                      title="Delete Order"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Address Display Banner */}
              <div className="px-5 py-2.5 bg-[#FAF7F2] border-t border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={14} className="text-[#C9A961] flex-shrink-0" />
                  <span className="font-bold text-gray-800">
                    Delivery Address:
                  </span>
                  <span className="text-gray-600 truncate">
                    {fullAddressString || "Address not specified"}
                  </span>
                  {address.type && (
                    <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-white rounded border border-gray-200 text-gray-600">
                      {address.type}
                    </span>
                  )}
                </div>
                {address.mobile && (
                  <div className="flex items-center gap-1 text-[#2C5530] font-bold text-xs">
                    <Phone size={12} />
                    {address.mobile}
                  </div>
                )}
              </div>

              {/* Tracking Details Quick Summary / Items List */}
              <div className="px-5 py-3 bg-gray-50/50 flex items-center justify-between gap-4 overflow-x-auto">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Items:
                  </span>
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-gray-100 shadow-2xs"
                    >
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-5 h-5 object-cover rounded"
                        />
                      )}
                      <span className="text-xs font-bold text-gray-800">
                        {item.productName}
                      </span>
                      <span className="text-[10px] font-black text-yellow-700 bg-yellow-50 px-1 rounded">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#2C5530] group-hover:translate-x-1 transition-transform">
                  Full Details <ChevronRight size={16} />
                </div>
              </div>

              {/* Shipping Editor Section */}
              {editingOrder === order._id && (
                <div
                  className="p-5 bg-[#FAF7F2] border-t border-gray-200 space-y-6 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
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
                        className="px-3 py-2 border bg-white rounded-lg text-sm"
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
                        className="px-3 py-2 border bg-white rounded-lg text-sm"
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
                        className="px-3 py-2 border bg-white rounded-lg text-sm"
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleSaveTracking(order._id)}
                        className="bg-[#2C5530] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1a3a20] transition-colors"
                      >
                        Save Shipping Info
                      </button>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="text-gray-500 text-xs font-bold hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Custom Tracking History Section */}
                  <div className="border-t border-gray-200/60 pt-5">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                      Tracking Updates Logs (
                      {order.trackingHistory?.length || 0})
                    </h4>

                    {/* List Logs */}
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                      {order.trackingHistory &&
                      order.trackingHistory.length > 0 ? (
                        order.trackingHistory.map(
                          (log: any, lidx: number) => (
                            <div
                              key={lidx}
                              className="flex justify-between items-start gap-4 bg-white p-3 rounded-lg border border-gray-100 text-xs shadow-sm"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="font-extrabold text-[#2C5530] uppercase text-[9px] bg-[#2C5530]/5 px-1.5 py-0.5 rounded">
                                    {log.status}
                                  </span>
                                  <span className="font-bold text-gray-800">
                                    {log.title}
                                  </span>
                                  {log.location && (
                                    <span className="text-[10px] text-[#C9A961] font-bold">
                                      📍 {log.location}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-500 mt-1">
                                  {log.description}
                                </p>
                                <span className="text-[9px] text-gray-400 font-medium block mt-0.5">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDeleteLog(order, lidx)}
                                className="text-red-500 hover:text-red-700 font-bold hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No tracking updates recorded.
                        </p>
                      )}
                    </div>

                    {/* Add Log Form */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Add Status Update
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select
                          value={newLog.status}
                          onChange={(e) =>
                            setNewLog({ ...newLog, status: e.target.value })
                          }
                          className="px-3 py-2 border rounded-lg text-xs font-medium focus:ring-1 focus:ring-yellow-500 bg-white"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="out_for_delivery">
                            Out for Delivery
                          </option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="returned">Returned</option>
                        </select>
                        <input
                          placeholder="Update Title (e.g. Dispatched)"
                          value={newLog.title}
                          onChange={(e) =>
                            setNewLog({ ...newLog, title: e.target.value })
                          }
                          className="px-3 py-2 border rounded-lg text-xs"
                        />
                        <input
                          placeholder="Location (e.g. Pondicherry)"
                          value={newLog.location}
                          onChange={(e) =>
                            setNewLog({ ...newLog, location: e.target.value })
                          }
                          className="px-3 py-2 border rounded-lg text-xs"
                        />
                      </div>
                      <textarea
                        placeholder="Detailed description of status update..."
                        value={newLog.description}
                        onChange={(e) =>
                          setNewLog({
                            ...newLog,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                        rows={2}
                      />
                      <button
                        onClick={() =>
                          handleAddLog(order._id, order.trackingHistory)
                        }
                        className="bg-[#2C5530] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1a3a20] transition-colors"
                      >
                        Add Update to Timeline
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            No orders match the selected date range or status filters.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-scale-in text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 border border-red-100">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Order Permanently?
                </h3>
                <p className="text-xs text-gray-500">
                  Order ID: #{orderToDelete.orderId}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              Are you sure you want to delete order{" "}
              <strong className="text-gray-900">#{orderToDelete.orderId}</strong>{" "}
              placed by{" "}
              <strong className="text-gray-900">
                {orderToDelete.deliveryAddress?.name ||
                  orderToDelete.user?.name ||
                  "Guest User"}
              </strong>
              ? This action will permanently erase the order from the database
              and user history.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setOrderToDelete(null)}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {isDeleting ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={16} /> Yes, Delete Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                  Order Details (Admin View)
                </p>
                <h3 className="font-bold text-lg">
                  #{selectedOrderDetails.orderId}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const ord = selectedOrderDetails;
                    setSelectedOrderDetails(null);
                    setOrderToDelete(ord);
                  }}
                  className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold px-3"
                  title="Delete Order"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
              {/* Status Tracker */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-gray-100">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#2C5530]" /> Delivery
                  Timeline
                </h4>

                {/* Stepper Steps */}
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-2 mb-6 border-b border-gray-200/60 pb-6">
                  {[
                    "placed",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                  ].map((st, sidx) => {
                    const keys = [
                      "placed",
                      "confirmed",
                      "processing",
                      "shipped",
                      "delivered",
                    ];
                    const currentIdx = keys.indexOf(
                      selectedOrderDetails.orderStatus
                    );
                    const stepIdx = keys.indexOf(st);
                    const isCompleted =
                      stepIdx <= currentIdx &&
                      selectedOrderDetails.orderStatus !== "cancelled";
                    const isCurrent = stepIdx === currentIdx;

                    const stepLabels: Record<string, string> = {
                      placed: "Placed",
                      confirmed: "Confirmed",
                      processing: "Processing",
                      shipped: "Shipped",
                      delivered: "Delivered",
                    };

                    return (
                      <div
                        key={st}
                        className="flex-1 flex flex-col items-center min-w-[70px] text-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCompleted
                              ? "bg-[#2C5530] text-white"
                              : isCurrent
                              ? "bg-[#C9A961] text-gray-900"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {isCompleted ? <Check size={14} /> : sidx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-bold mt-2 capitalize ${
                            isCompleted ? "text-[#2C5530]" : "text-gray-400"
                          }`}
                        >
                          {stepLabels[st] || st}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking History Logs */}
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrderDetails.trackingHistory &&
                  selectedOrderDetails.trackingHistory.length > 0 ? (
                    selectedOrderDetails.trackingHistory
                      .slice()
                      .reverse()
                      .map((log: any, lidx: number) => (
                        <div
                          key={lidx}
                          className="flex gap-4 relative pl-5 border-l-2 border-[#2C5530]/20 last:border-0 pb-4 last:pb-0"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2C5530] absolute -left-[6px] top-1.5 shadow-sm shadow-[#2C5530]/20"></span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <p className="text-xs font-bold text-gray-900">
                                {log.title}
                              </p>
                              <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString(
                                  "en-IN",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                              {log.description}
                            </p>
                            {log.location && (
                              <span className="inline-block text-[9px] font-bold text-[#C9A961] bg-[#C9A961]/10 px-1.5 py-0.5 rounded mt-1.5">
                                📍 {log.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No tracking updates logged yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Details */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-2xs">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#C9A961]" /> Delivery
                      Address
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">
                        {selectedOrderDetails.deliveryAddress?.name ||
                          selectedOrderDetails.user?.name ||
                          "Customer"}
                      </p>
                      {selectedOrderDetails.deliveryAddress?.type && (
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-gray-100 rounded text-gray-600">
                          {selectedOrderDetails.deliveryAddress.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {selectedOrderDetails.deliveryAddress?.addressLine1}
                      {selectedOrderDetails.deliveryAddress?.addressLine2 && (
                        <>
                          <br />
                          {selectedOrderDetails.deliveryAddress.addressLine2}
                        </>
                      )}
                      {selectedOrderDetails.deliveryAddress?.landmark && (
                        <>
                          <br />
                          <span className="text-gray-400 italic">
                            Near: {selectedOrderDetails.deliveryAddress.landmark}
                          </span>
                        </>
                      )}
                      <br />
                      {selectedOrderDetails.deliveryAddress?.city},{" "}
                      {selectedOrderDetails.deliveryAddress?.state} -{" "}
                      {selectedOrderDetails.deliveryAddress?.pincode}
                    </p>
                    <p className="text-xs font-bold text-[#2C5530] mt-3 flex items-center gap-1">
                      📞{" "}
                      {selectedOrderDetails.deliveryAddress?.mobile ||
                        selectedOrderDetails.user?.mobile ||
                        "N/A"}
                    </p>
                  </div>

                  {selectedOrderDetails.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-50 bg-[#FAF7F2] p-3 rounded-xl border border-dashed border-gray-200">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Courier Tracking
                      </p>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        {selectedOrderDetails.courierPartner || "Courier"}:{" "}
                        <span className="text-[#2C5530] select-all">
                          {selectedOrderDetails.trackingNumber}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment & Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4 shadow-2xs">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#C9A961]" /> Bill
                    Details
                  </h4>
                  <div className="text-xs space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Basket Subtotal</span>
                      <span>
                        ₹
                        {Number(
                          selectedOrderDetails.orderAmount || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    {selectedOrderDetails.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discounts</span>
                        <span>
                          -₹
                          {Number(
                            selectedOrderDetails.discount
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>
                        ₹
                        {Number(
                          selectedOrderDetails.deliveryCharge || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (4%)</span>
                      <span>
                        ₹
                        {Number(
                          selectedOrderDetails.taxAmount || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900 text-sm">
                      <span>Total Paid</span>
                      <span className="text-[#2C5530]">
                        ₹
                        {Number(
                          selectedOrderDetails.finalAmount || 0
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase border-t border-gray-50">
                    <span>
                      Method: {selectedOrderDetails.paymentMode || "Online"}
                    </span>
                    <span>Status: {selectedOrderDetails.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-2xs">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Package size={14} className="text-[#C9A961]" /> Items Ordered
                </h4>
                <div className="divide-y divide-gray-50 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrderDetails.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-cheese.webp";
                            }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-900 leading-tight">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.weight}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-medium text-gray-500 mr-4">
                          ₹{item.price} x {item.quantity}
                        </span>
                        <span className="font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
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

export default OrderManagement;
