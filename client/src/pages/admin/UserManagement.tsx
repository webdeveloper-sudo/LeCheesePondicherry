import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Download, Users } from "lucide-react";
import { exportToCSV } from "@/utils/exportCsv";

const UserManagement: React.FC = () => {
  const { users, fetchUsers, isLoading } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExportCSV = () => {
    if (!users || users.length === 0) return;

    const headers = [
      "User ID",
      "Name",
      "Email",
      "Mobile",
      "Role",
      "Orders Count",
      "Joined Date",
      "Status",
    ];

    const rows = users.map((u) => [
      u._id,
      u.name || "N/A",
      u.email || "N/A",
      u.mobile || "N/A",
      u.role || "user",
      u.orders?.length || 0,
      u.createdAt ? new Date(u.createdAt).toLocaleString("en-IN") : "N/A",
      u.isActive ? "Active" : "Inactive",
    ]);

    const filename = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    exportToCSV(filename, headers, rows);
  };

  if (isLoading && users.length === 0)
    return <div className="p-8 text-center text-xl">Loading users...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            User Management
            <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-2.5 py-1 rounded-full border border-yellow-200">
              {users.length} Users
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered accounts, order histories & export data.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={users.length === 0}
          className="bg-[#2C5530] hover:bg-[#1a3a20] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-yellow-50 text-yellow-700 font-bold flex items-center justify-center border border-yellow-200/60">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">
                        {user.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {user.mobile || "No phone"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-md border border-gray-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                  {user.orders?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 inline-flex text-[10px] font-black uppercase tracking-wider rounded-full border ${
                      user.isActive
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-12 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
