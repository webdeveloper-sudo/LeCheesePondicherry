import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { userAPI } from "@/lib/api";
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Check,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  Home,
  Briefcase,
  MoreVertical,
} from "lucide-react";

// Shared country data
const countries = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
].sort((a, b) => a.name.localeCompare(b.name));

interface Address {
  _id: string;
  type: "home" | "work" | "other";
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  countryCode: string;
  mobile: string;
  isDefault: boolean;
}

export default function EditUserProfile() {
  const navigate = useNavigate();
  const {
    uid,
    name,
    email,
    mobile,
    countryCode,
    addresses,
    syncProfile,
    setUser,
  } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: name || "",
    mobile: mobile || "",
    countryCode: countryCode || "+91",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    type: "home" as "home" | "work" | "other",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    countryCode: "+91",
    mobile: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!uid) {
      navigate("/user/login");
      return;
    }
    syncProfile();
  }, [uid]);

  useEffect(() => {
    setPersonalInfo({
      name: name || "",
      mobile: mobile || "",
      countryCode: countryCode || "+91",
    });
  }, [name, mobile, countryCode]);

  // Validation
  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!personalInfo.name) newErrors.name = "Name is required";
    else if (!/^[a-zA-Z\s]+$/.test(personalInfo.name))
      newErrors.name = "Alphabets only";

    if (!personalInfo.mobile) newErrors.mobile = "Mobile is required";
    else if (!/^\d+$/.test(personalInfo.mobile))
      newErrors.mobile = "Numeric only";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressForm = () => {
    const newErrors: Record<string, string> = {};
    if (!addressForm.addressLine1)
      newErrors.addressLine1 = "Address is required";
    if (!addressForm.city) newErrors.city = "City is required";
    if (!addressForm.state) newErrors.state = "State is required";
    if (!addressForm.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d+$/.test(addressForm.pincode))
      newErrors.pincode = "Numeric only";

    if (!addressForm.mobile) newErrors.addressMobile = "Mobile is required";
    else if (!/^\d+$/.test(addressForm.mobile))
      newErrors.addressMobile = "Numeric only";

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePersonalInfo = async () => {
    if (!validatePersonalInfo()) return;

    setLoading(true);
    try {
      const result = await userAPI.updateProfile({
        name: personalInfo.name,
        mobile: personalInfo.mobile,
      });
      if (result.success) {
        setUser({
          name: personalInfo.name,
          mobile: personalInfo.mobile,
        });
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;

    setLoading(true);
    try {
      let result;
      if (editingAddressId) {
        result = await userAPI.updateAddress(editingAddressId, addressForm);
      } else {
        result = await userAPI.addAddress(addressForm);
      }

      if (result.success) {
        await syncProfile();
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({
          type: "home",
          addressLine1: "",
          city: "",
          state: "",
          pincode: "",
          countryCode: "+91",
          mobile: "",
          isDefault: false,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const result = await userAPI.deleteAddress(id);
      if (result.success) await syncProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const result = await userAPI.setDefaultAddress(id);
      if (result.success) await syncProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      type: addr.type,
      addressLine1: addr.addressLine1,
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode,
      countryCode: addr.countryCode || "+91",
      mobile: addr.mobile,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate("/user")}
          className="flex items-center gap-2 text-[#2C5530] font-semibold mb-8 hover:underline"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="">
          {/* Sidebar */}
          {/* <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                <ShieldCheck className="text-[#2C5530]" size={24} /> Account
                Settings
              </h2>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-[#F5E6D3] text-[#2C5530] font-bold transition-all">
                  Personal Details
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
                  Security & Password
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
                  Notifications
                </button>
              </nav>
            </div>
          </div> */}

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                Personal Details
              </h3>

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2">
                  <Check size={20} /> {success}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                        errors.name
                          ? "border-red-300 ring-4 ring-red-50"
                          : "border-gray-100 focus:border-[#2C5530]"
                      }`}
                      value={personalInfo.name}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address (Read-only)
                  </label>
                  <div className="relative opacity-60">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-100 rounded-xl cursor-not-allowed"
                      value={email}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex gap-3">
                    <div className="w-24">
                      <div className="relative">
                        <select
                          className="w-full pl-3 pr-8 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none appearance-none font-medium"
                          value={personalInfo.countryCode}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              countryCode: e.target.value,
                            })
                          }
                        >
                          {countries.map((c) => (
                            <option key={c.name} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          size={14}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="tel"
                          className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                            errors.mobile
                              ? "border-red-300 ring-4 ring-red-50"
                              : "border-gray-100 focus:border-[#2C5530]"
                          }`}
                          value={personalInfo.mobile}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              mobile: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {errors.mobile && (
                    <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleUpdatePersonalInfo}
                    disabled={loading}
                    className="bg-[#2C5530] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Address Management (Amazon-Style) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">
                  Your Addresses
                </h3>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm({
                        type: "home",
                        addressLine1: "",
                        pincode: "",
                        countryCode: "+91",
                        mobile: "",
                        isDefault: false,
                      });
                      setShowAddressForm(true);
                    }}
                    className="flex items-center gap-2 text-[#2C5530] font-bold hover:bg-[#2C5530] hover:text-white px-4 py-2 rounded-lg border border-[#2C5530] transition-all"
                  >
                    <Plus size={20} /> Add New
                  </button>
                )}
              </div>

              {/* Address Form (Modal/Inline) */}
              {showAddressForm && (
                <div className="bg-[#FAF7F2] border border-[#F5E6D3] rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-bold text-lg">
                      {editingAddressId ? "Edit Address" : "Add New Address"}
                    </h4>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 mb-4">
                      {["home", "work", "other"].map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            setAddressForm({
                              ...addressForm,
                              type: type as any,
                            })
                          }
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all capitalize font-medium ${
                            addressForm.type === type
                              ? "bg-[#2C5530] text-white border-[#2C5530]"
                              : "bg-white text-gray-500 border-gray-200 hover:border-[#2C5530]"
                          }`}
                        >
                          {type === "home" && <Home size={16} />}
                          {type === "work" && <Briefcase size={16} />}
                          {type === "other" && <MapPin size={16} />}
                          {type}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Complete Address
                      </label>
                      <textarea
                        rows={2}
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#2C5530] resize-none"
                        value={addressForm.addressLine1}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            addressLine1: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#2C5530]"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#2C5530]"
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#2C5530]"
                          value={addressForm.pincode}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              pincode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:border-[#2C5530]"
                          value={addressForm.mobile}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              mobile: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressForm.isDefault}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-[#2C5530] focus:ring-[#2C5530] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm font-medium"
                      >
                        Set as default address
                      </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        onClick={handleSaveAddress}
                        disabled={loading}
                        className="flex-1 bg-[#2C5530] text-white py-3 rounded-xl font-bold hover:bg-[#1a3a20] transition-all disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Address"}
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 gap-4">
                {addresses && addresses.length > 0 ? (
                  addresses.map((addr: Address) => (
                    <div
                      key={addr._id}
                      className={`relative p-6 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? "bg-white border-[#2C5530] shadow-md ring-1 ring-[#2C5530]"
                          : "bg-gray-50 border-gray-100 hover:border-[#2C5530]"
                      }`}
                    >
                      {addr.isDefault && (
                        <div className="absolute top-0 right-6 translate-y-[-50%] bg-[#2C5530] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          Default
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-white rounded-lg border border-gray-100 text-[#2C5530]">
                              {addr.type === "home" && <Home size={14} />}
                              {addr.type === "work" && <Briefcase size={14} />}
                              {addr.type === "other" && <MapPin size={14} />}
                            </span>
                            <span className="font-bold text-[#1A1A1A] capitalize">
                              {addr.type}
                            </span>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-medium">
                            {addr.addressLine1}
                          </p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                            {addr.city}, {addr.state}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1 font-semibold">
                              <MapPin size={14} /> {addr.pincode}
                            </span>
                            <span className="flex items-center gap-1 font-semibold">
                              <Phone size={14} /> {addr.countryCode}{" "}
                              {addr.mobile}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => openEditAddress(addr)}
                            className="p-2 text-gray-400 hover:text-[#2C5530] hover:bg-white rounded-lg transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr._id)}
                          className="mt-4 text-xs font-bold text-[#C9A961] hover:underline"
                        >
                          Set as default
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400">No addresses saved yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
