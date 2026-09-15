import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Lock,
  Mail,
  User,
  Check,
  X,
  Loader2,
  KeyRound,
  Layers,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";

interface AdminItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isSuperAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const AVAILABLE_PAGES = [
  {
    id: "products",
    label: "Products Management",
    description: "Create, edit, price, and delete artisanal cheese inventory",
  },
  {
    id: "orders",
    label: "Orders Management",
    description: "Manage customer orders, shipments, delivery status & receipts",
  },
  {
    id: "users",
    label: "Users Management",
    description: "View registered customer accounts, profiles & wishlists",
  },
  {
    id: "reviews",
    label: "Customer Reviews",
    description: "Moderate ratings, approve customer photos & remove spam",
  },
  {
    id: "blogs",
    label: "Stories & Blogs",
    description: "Publish stories, cheese pairing guides & culinary articles",
  },
  {
    id: "banners",
    label: "Banners & Breadcrumbs",
    description: "Manage page banner sliders, background images, titles & overlays",
  },
  {
    id: "settings",
    label: "System Settings",
    description: "Manage coupons, announcements, delivery options & brand configurations",
  },
];

const SUPER_ADMIN_EMAIL = "vp.expansions@hopemarket.in";

export default function AdminManagement() {
  const { email: currentUserEmail } = useUserStore();
  const { addToast } = useToastStore();

  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: ["products", "orders"] as string[],
    isActive: true,
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAdmins();
      if (res.success && res.data) {
        const payload = (res.data as any)?.data || res.data;
        setAdmins(Array.isArray(payload) ? payload : []);
      } else {
        addToast(res.message || "Failed to load admins list", "error");
      }
    } catch (err: any) {
      console.error(err);
      addToast("Failed to fetch admin accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      permissions: ["products", "orders", "reviews"],
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (admin: AdminItem) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      password: "", // Left blank unless super admin wants to reset password
      permissions: admin.permissions || [],
      isActive: admin.isActive !== false,
    });
    setIsModalOpen(true);
  };

  // Toggle page permission in checklist
  const handleTogglePermission = (pageId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(pageId);
      if (exists) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== pageId),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, pageId],
        };
      }
    });
  };

  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: AVAILABLE_PAGES.map((p) => p.id),
    }));
  };

  const handleDeselectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      addToast("Please fill in both name and email.", "error");
      return;
    }

    if (!editingAdmin && !formData.password.trim()) {
      addToast("Please provide a password for the new admin.", "error");
      return;
    }

    if (!editingAdmin && formData.password.length < 6) {
      addToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      addToast("New password must be at least 6 characters long.", "error");
      return;
    }

    if (formData.permissions.length === 0) {
      addToast("Please select at least one page permission for the admin.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingAdmin) {
        // Update Admin
        const updatePayload: any = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          permissions: formData.permissions,
          isActive: formData.isActive,
        };
        if (formData.password.trim()) {
          updatePayload.password = formData.password.trim();
        }

        const res = await adminAPI.updateAdmin(editingAdmin._id, updatePayload);
        if (res.success) {
          addToast(`Administrator "${formData.name}" updated successfully.`, "success");
          setIsModalOpen(false);
          fetchAdmins();
        } else {
          addToast(res.message || "Failed to update administrator", "error");
        }
      } else {
        // Create Admin
        const res = await adminAPI.createAdmin({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          permissions: formData.permissions,
          isActive: formData.isActive,
        });

        if (res.success) {
          addToast(`Administrator "${formData.name}" created successfully.`, "success");
          setIsModalOpen(false);
          fetchAdmins();
        } else {
          addToast(res.message || "Failed to create administrator", "error");
        }
      }
    } catch (err: any) {
      console.error(err);
      addToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async (admin: AdminItem) => {
    if (admin.email === SUPER_ADMIN_EMAIL || admin.isSuperAdmin) {
      addToast("Super Administrator cannot be deleted.", "error");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete administrator "${admin.name}" (${admin.email})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await adminAPI.deleteAdmin(admin._id);
      if (res.success) {
        addToast("Administrator deleted successfully", "success");
        setAdmins((prev) => prev.filter((a) => a._id !== admin._id));
      } else {
        addToast(res.message || "Failed to delete administrator", "error");
      }
    } catch (err: any) {
      console.error(err);
      addToast("Failed to delete administrator", "error");
    }
  };

  // Filtered Admins
  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAdminsCount = admins.length;
  const activeAdminsCount = admins.filter((a) => a.isActive !== false).length;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Top Banner / Stats Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 lg:p-8 rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Shield size={14} className="text-amber-400" />
              Super Admin Control Center
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-2">
              Administrator Management & Permissions
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Manage internal administrative accounts, assign granular page-level access permissions,
              and enforce role-based access across the entire Le Pondy admin console.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-sm rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all transform active:scale-95 flex-shrink-0"
          >
            <UserPlus size={18} />
            <span>Add New Administrator</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Administrators</p>
            <p className="text-2xl font-black text-white mt-1">{totalAdminsCount}</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Staff Admins</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeAdminsCount}</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Super Administrator</p>
            <p className="text-xs font-bold text-amber-300 mt-2 truncate">{SUPER_ADMIN_EMAIL}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
          Showing <span className="font-bold text-gray-800">{filteredAdmins.length}</span> of {totalAdminsCount} admins
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-yellow-600 mb-3" size={36} />
            <p className="text-sm font-medium text-gray-500">Loading administrator directory...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
              <User size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No administrators found</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-4">
              {searchQuery
                ? `No accounts matched your query "${searchQuery}". Try another keyword.`
                : "No sub-administrators created yet. Click 'Add New Administrator' to invite one."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-xs font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-black uppercase tracking-wider text-gray-500">
                  <th className="py-4 px-6">Administrator</th>
                  <th className="py-4 px-6">Role & Status</th>
                  <th className="py-4 px-6">Assigned Page Access</th>
                  <th className="py-4 px-6">Created On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAdmins.map((admin) => {
                  const isSuper = admin.email === SUPER_ADMIN_EMAIL || admin.isSuperAdmin;

                  return (
                    <tr
                      key={admin._id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Administrator Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0 ${
                              isSuper
                                ? "bg-amber-500 text-white ring-2 ring-amber-400/40 shadow-amber-500/20"
                                : "bg-slate-800 text-white"
                            }`}
                          >
                            {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 truncate">
                                {admin.name}
                              </span>
                              {isSuper && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Shield size={11} className="text-amber-600" />
                                  Super Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} className="text-gray-400" />
                              <span className="truncate">{admin.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role & Status */}
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div>
                            {admin.isActive !== false ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Permissions Badges */}
                      <td className="py-4 px-6 max-w-xs lg:max-w-md">
                        {isSuper ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              <Sparkles size={13} className="text-amber-500" />
                              Full Unrestricted Access (All Pages)
                            </span>
                          </div>
                        ) : admin.permissions && admin.permissions.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {admin.permissions.map((p) => {
                              const match = AVAILABLE_PAGES.find((ap) => ap.id === p);
                              return (
                                <span
                                  key={p}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize"
                                >
                                  {match ? match.label.replace(" Management", "") : p}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 font-medium italic flex items-center gap-1">
                            <AlertTriangle size={13} />
                            No page access assigned
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium whitespace-nowrap">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(admin)}
                            className="p-2 text-slate-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors"
                            title="Edit Administrator & Permissions"
                          >
                            <Edit2 size={16} />
                          </button>

                          {!isSuper && (
                            <button
                              onClick={() => handleDeleteAdmin(admin)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Delete Administrator"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-5 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
                  {editingAdmin ? <Edit2 size={20} /> : <UserPlus size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingAdmin ? `Edit Admin: ${editingAdmin.name}` : "Create New Administrator"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingAdmin
                      ? "Update credentials and granular page access permissions"
                      : "Add a new staff administrator and specify allowed admin pages"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Admin Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      disabled={editingAdmin?.email === SUPER_ADMIN_EMAIL}
                      placeholder="e.g. admin@lepondicheese.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                        editingAdmin?.email === SUPER_ADMIN_EMAIL
                          ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                          : "bg-gray-50 border-gray-200 focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password {editingAdmin ? "(Leave blank to keep unchanged)" : <span className="text-red-500">*</span>}
                  </label>
                  {editingAdmin && (
                    <span className="text-[11px] text-gray-400 italic">
                      Only enter if resetting password
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required={!editingAdmin}
                    placeholder={editingAdmin ? "••••••••••••" : "Minimum 6 characters"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Password is automatically encrypted and hashed using bcrypt before storing in database.
                </p>
              </div>

              {/* Page Permissions Checklist */}
              {editingAdmin?.email === SUPER_ADMIN_EMAIL ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <Shield size={14} className="text-amber-600" />
                    Super Administrator Permissions
                  </p>
                  <p className="text-amber-700">
                    The Super Administrator account permanently possesses full unrestricted access to all admin panel modules and pages.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Page-Level Access Permissions <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Check the admin sections this user is authorized to view and manage.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="text-[11px] font-bold text-yellow-700 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllPermissions}
                        className="text-[11px] font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Checklist Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {AVAILABLE_PAGES.map((page) => {
                      const isChecked = formData.permissions.includes(page.id);

                      return (
                        <div
                          key={page.id}
                          onClick={() => handleTogglePermission(page.id)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isChecked
                              ? "bg-yellow-500/10 border-yellow-500 text-gray-900 shadow-2xs"
                              : "bg-gray-50/70 border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isChecked
                                ? "bg-yellow-500 text-slate-950 shadow-xs"
                                : "border border-gray-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check size={14} className="stroke-[3]" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-gray-900">{page.label}</p>
                            <p className="text-[11px] text-gray-500 leading-tight mt-0.5">
                              {page.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Toggle (For non-super admins) */}
              {editingAdmin?.email !== SUPER_ADMIN_EMAIL && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div>
                    <p className="font-bold text-xs text-gray-800">Account Status</p>
                    <p className="text-[11px] text-gray-500">
                      When inactive, this admin will be immediately blocked from logging in.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  <span>{editingAdmin ? "Save Changes" : "Create Administrator"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
