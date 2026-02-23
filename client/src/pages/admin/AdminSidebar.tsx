import React from "react";
import { Users, Package, ShoppingCart, LogOut, BookOpen } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const menuItems = [
    { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "blogs", label: "Blogs", icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-500">Le Pondy Admin</h2>
      </div>

      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-6 py-4 transition-colors ${
              activeTab === item.id
                ? "bg-yellow-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-6 py-4 text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
