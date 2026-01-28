"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Clock,
  UserPlus,
  Shield,
  LogOut,
  Menu,
  X,
  Building2,
  FileText,
  ChevronDown,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ("customer" | "admin" | "super_admin")[];
  children?: MenuItem[];
}

export function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["customer", "admin", "super_admin"],
    },
    {
      title: "Appointments",
      href: "/appointments",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["customer", "admin", "super_admin"],
      children: [
        {
          title: "Book Appointment",
          href: "/appointments/book",
          icon: <Calendar className="h-4 w-4" />,
          roles: ["customer"],
        },
        {
          title: "My Appointments",
          href: "/appointments/my",
          icon: <FileText className="h-4 w-4" />,
          roles: ["customer"],
        },
        {
          title: "Manage Appointments",
          href: "/appointments/manage",
          icon: <Settings className="h-4 w-4" />,
          roles: ["admin", "super_admin"],
        },
        {
          title: "All Appointments",
          href: "/appointments/all",
          icon: <FileText className="h-4 w-4" />,
          roles: ["admin", "super_admin"],
        },
      ],
    },
    {
      title: "Queue Management",
      href: "/queue",
      icon: <Clock className="h-5 w-5" />,
      roles: ["customer", "admin", "super_admin"],
      children: [
        {
          title: "Join Queue",
          href: "/queue/join",
          icon: <Users className="h-4 w-4" />,
          roles: ["customer"],
        },
        {
          title: "Queue Status",
          href: "/queue/status",
          icon: <BarChart3 className="h-4 w-4" />,
          roles: ["customer", "admin", "super_admin"],
        },
        {
          title: "Manage Queues",
          href: "/queue/manage",
          icon: <Settings className="h-4 w-4" />,
          roles: ["admin", "super_admin"],
        },
      ],
    },
    {
      title: "Branches",
      href: "/branches",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["admin", "super_admin"],
      children: [
        {
          title: "My Branches",
          href: "/branches/assigned",
          icon: <Building2 className="h-4 w-4" />,
          roles: ["admin"],
        },
        {
          title: "All Branches",
          href: "/branches/all",
          icon: <Building2 className="h-4 w-4" />,
          roles: ["super_admin"],
        },
        {
          title: "Manage Branches",
          href: "/branches/manage",
          icon: <Settings className="h-4 w-4" />,
          roles: ["super_admin"],
        },
      ],
    },
    {
      title: "User Management",
      href: "/users",
      icon: <Users className="h-5 w-5" />,
      roles: ["super_admin"],
      children: [
        {
          title: "All Users",
          href: "/dashboard/super-admin/users",
          icon: <Users className="h-4 w-4" />,
          roles: ["super_admin"],
        },
        {
          title: "Create User",
          href: "/dashboard/super-admin/users/create",
          icon: <UserPlus className="h-4 w-4" />,
          roles: ["super_admin"],
        },
        {
          title: "Manage Roles",
          href: "/dashboard/super-admin/users/roles",
          icon: <Shield className="h-4 w-4" />,
          roles: ["super_admin"],
        },
      ],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin", "super_admin"],
      children: [
        {
          title: "Appointment Reports",
          href: "/reports/appointments",
          icon: <FileText className="h-4 w-4" />,
          roles: ["admin", "super_admin"],
        },
        {
          title: "Queue Analytics",
          href: "/reports/queue",
          icon: <BarChart3 className="h-4 w-4" />,
          roles: ["admin", "super_admin"],
        },
        {
          title: "System Reports",
          href: "/reports/system",
          icon: <Shield className="h-4 w-4" />,
          roles: ["super_admin"],
        },
      ],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["customer", "admin", "super_admin"],
      children: [
        {
          title: "Profile",
          href: "/settings/profile",
          icon: <UserPlus className="h-4 w-4" />,
          roles: ["customer", "admin", "super_admin"],
        },
        {
          title: "System Settings",
          href: "/settings/system",
          icon: <Settings className="h-4 w-4" />,
          roles: ["super_admin"],
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isSubmenuOpen = (title: string) => openSubmenus.includes(title);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        pathname === href ||
        (pathname.startsWith("/dashboard/") && pathname !== href)
      );
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSignOut = async () => {
    try {
      // Import signOut function dynamically to avoid circular dependencies
      const { signOut } = await import("@/lib/auth");
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 h-full z-10 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-gray-800">SAS</h2>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.title}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        {!isCollapsed && (
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isSubmenuOpen(item.title) ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {!isCollapsed && isSubmenuOpen(item.title) && (
                      <ul className="mt-2 ml-4 space-y-1">
                        {item.children
                          .filter((child) => child.roles.includes(user.role))
                          .map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                  isActive(child.href)
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-100 text-gray-600"
                                }`}
                              >
                                {child.icon}
                                <span className="text-sm">{child.title}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="text-sm text-gray-600">
                <p className="font-medium truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs capitalize">
                  {user.role.replace("_", " ")}
                </p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && (
                <span className="text-sm font-medium">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
