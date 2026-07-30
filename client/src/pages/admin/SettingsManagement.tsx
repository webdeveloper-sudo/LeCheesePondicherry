import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { useToastStore } from "@/store/useToastStore";
import { Save, AlertCircle, ShieldAlert, Sparkles, Truck } from "lucide-react";

export default function SettingsManagement() {
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [validTime, setValidTime] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [deliveryChargesEnabled, setDeliveryChargesEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatForDateTimeLocal = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/settings`);
      if (response.data.success) {
        const {
          flashSaleEnabled,
          couponName,
          validTime,
          discountRate,
          deliveryChargesEnabled,
        } = response.data.data;

        setFlashSaleEnabled(flashSaleEnabled || false);
        setCouponName(couponName || "");
        setValidTime(formatForDateTimeLocal(validTime));
        setDiscountRate(discountRate || 0);
        setDeliveryChargesEnabled(
          deliveryChargesEnabled !== undefined ? deliveryChargesEnabled : true
        );
      }
    } catch (error: any) {
      console.error("Failed to fetch settings:", error);
      addToast("Failed to load settings from server", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = JSON.parse(
        localStorage.getItem("lepondy-user-storage") || "{}"
      ).state?.token;

      const payload = {
        flashSaleEnabled,
        couponName: couponName.trim().toUpperCase(),
        validTime: validTime ? new Date(validTime).toISOString() : null,
        discountRate: Number(discountRate),
        deliveryChargesEnabled,
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/settings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        addToast("Settings updated successfully!", "success");
      } else {
        addToast(response.data.message || "Failed to update settings", "error");
      }
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      addToast(
        error.response?.data?.message || "Failed to save settings to server",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          System Configuration
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage system-wide parameters such as the active flash sale discount, coupon validity, and delivery charges logic.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Flash Sale Banner & Coupon Settings Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Flash Sale Banner & Coupon Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Configure promotion code and countdown timer visible to all customers.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {flashSaleEnabled ? "Active" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={() => setFlashSaleEnabled(!flashSaleEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  flashSaleEnabled ? "bg-yellow-600" : "bg-gray-200"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    flashSaleEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className={`p-6 space-y-6 transition-opacity duration-300 ${flashSaleEnabled ? "opacity-100" : "opacity-50"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupon Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  Coupon Name
                </label>
                <input
                  type="text"
                  required={flashSaleEnabled}
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  placeholder="e.g. FLASH25"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none uppercase font-semibold text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Unique coupon code for applying discount on Checkout.
                </p>
              </div>

              {/* Discount Rate */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  required={flashSaleEnabled}
                  min={0}
                  max={100}
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                  placeholder="e.g. 25"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-semibold text-gray-800"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Percentage off total subtotal value.
                </p>
              </div>
            </div>

            {/* Valid Date/Time */}
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2">
                Valid Expiry Time (Limited Time)
              </label>
              <input
                type="datetime-local"
                required={flashSaleEnabled}
                value={validTime}
                onChange={(e) => setValidTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none font-semibold text-gray-800"
              />
              <p className="text-xs text-gray-400 mt-1">
                The exact date and time when the flash sale and coupon will strictly expire.
              </p>
            </div>

            {/* Status Information Box */}
            {flashSaleEnabled && validTime && (
              <div className={`p-4 rounded-xl border flex gap-3 text-sm ${
                new Date() < new Date(validTime)
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
                <AlertCircle size={20} className="shrink-0" />
                <div>
                  <p className="font-bold">
                    {new Date() < new Date(validTime) ? "Promotion Active" : "Expired"}
                  </p>
                  <p className="text-xs mt-1">
                    {new Date() < new Date(validTime)
                      ? `This promotion will automatically expire on ${new Date(validTime).toLocaleString()}`
                      : `The configured expiry time is in the past! The banner will not display.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shipping & Delivery Charge Settings Box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Shipping & Delivery Charges
                </h3>
                <p className="text-xs text-gray-500">
                  Control whether customer delivery costs are computed or free.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {deliveryChargesEnabled ? "Charges Enabled" : "Free Delivery"}
              </span>
              <button
                type="button"
                onClick={() => setDeliveryChargesEnabled(!deliveryChargesEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  deliveryChargesEnabled ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    deliveryChargesEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex gap-3">
              <ShieldAlert size={20} className="shrink-0" />
              <div>
                <p className="font-bold">
                  {deliveryChargesEnabled ? "Normal Delivery Fees Applied" : "Free Delivery Activated"}
                </p>
                <p className="text-xs mt-1">
                  {deliveryChargesEnabled
                    ? "Weight-based delivery fees will be calculated at checkout as standard."
                    : "ALL checkouts will dynamically compute ₹0 shipping costs. The backend will strictly validate this."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-yellow-600 text-white font-bold rounded-xl shadow-lg hover:bg-yellow-700 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
