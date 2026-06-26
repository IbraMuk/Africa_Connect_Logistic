"use client";

import AdminDropdown from "@/components/AdminDropdown";
import Logo from "@/components/Logo";
import ThemeSelector from "@/components/ThemeSelector";
import { useAuth } from "@/hooks/useAuth";
import {
    ArrowRightOnRectangleIcon,
    BanknotesIcon,
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    ChevronDownIcon,
    CubeIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    TicketIcon,
    TruckIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  title: string;
  href?: string;
  icon: any;
  current?: boolean;
  badge?: string;
  children?: MenuItem[];
}

export default function FacturationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: HomeIcon,
      current: false,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: UserGroupIcon,
      badge: "12",
    },
    {
      title: "Facturation",
      href: "/facturation",
      icon: CurrencyDollarIcon,
      current: true,
      badge: "3",
    },
    {
      title: "Transport",
      icon: TruckIcon,
      children: [
        {
          title: "Transport Personnel",
          href: "/transport-personnel",
          icon: UsersIcon,
          children: [
            {
              title: "Réservations",
              href: "/transport-personnel/reservations",
              icon: CalendarIcon,
            },
            {
              title: "Véhicules",
              href: "/transport-personnel/vehicules",
              icon: TruckIcon,
            },
            {
              title: "Chauffeurs",
              href: "/transport-personnel/chauffeurs",
              icon: UserIcon,
            },
          ],
        },
        {
          title: "Transport Marchandises",
          href: "/transport-marchandise",
          icon: CubeIcon,
          badge: "5",
        },
      ],
    },
    {
      title: "Billetterie",
      icon: TicketIcon,
      children: [
        {
          title: "Réservations",
          href: "/billetterie/reservations",
          icon: CalendarIcon,
        },
        {
          title: "Itinéraires",
          href: "/billetterie/itineraires",
          icon: MapPinIcon,
        },
        { title: "Tarifs", href: "/billetterie/tarifs", icon: BanknotesIcon },
      ],
    },
    {
      title: "Import/Export",
      href: "/import-export",
      icon: GlobeAltIcon,
      badge: "2",
    },
    {
      title: "Rapports",
      icon: ChartBarIcon,
      children: [
        {
          title: "Rapports Financiers",
          href: "/rapports/financiers",
          icon: CurrencyDollarIcon,
        },
        {
          title: "Rapports d'Activité",
          href: "/rapports/activite",
          icon: ChartBarIcon,
        },
        {
          title: "Rapports Clients",
          href: "/rapports/clients",
          icon: UserGroupIcon,
        },
        {
          title: "Rapports Véhicules",
          href: "/rapports/vehicules",
          icon: TruckIcon,
        },
      ],
    },
  ];

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div
            className={`flex items-center ${!sidebarOpen && "justify-center"}`}
          >
            <Logo size={44} showText={sidebarOpen} />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon
              className={`h-5 w-5 text-gray-500 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div
            className={`flex items-center ${!sidebarOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.prenom?.[0] || "U"}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || "Client"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {!item.children ? (
                <Link
                  href={item.href || "#"}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3">{item.title}</span>}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      expandedMenus.includes(item.title)
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          expandedMenus.includes(item.title)
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </button>
                  {sidebarOpen && expandedMenus.includes(item.title) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <div key={childIndex}>
                          {!child.children ? (
                            <Link
                              href={child.href || "#"}
                              className="flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              <div className="flex items-center">
                                <child.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="ml-3">{child.title}</span>
                              </div>
                              {child.badge && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <div>
                              <button
                                onClick={() => toggleMenu(child.title)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                <div className="flex items-center">
                                  <child.icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="ml-3">{child.title}</span>
                                </div>
                                <ChevronDownIcon
                                  className={`h-3 w-3 transition-transform ${
                                    expandedMenus.includes(child.title)
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                />
                              </button>
                              {expandedMenus.includes(child.title) &&
                                child.children && (
                                  <div className="mt-1 ml-4 space-y-1">
                                    {child.children.map(
                                      (subChild, subChildIndex) => (
                                        <Link
                                          key={subChildIndex}
                                          href={subChild.href || "#"}
                                          className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-700"
                                        >
                                          <subChild.icon className="h-4 w-4 flex-shrink-0" />
                                          <span className="ml-3">
                                            {subChild.title}
                                          </span>
                                        </Link>
                                      ),
                                    )}
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <AdminDropdown />
            <ThemeSelector />
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
