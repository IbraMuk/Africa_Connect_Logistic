"use client";

import AdminDropdown from "@/components/AdminDropdown";
import ThemeSelector from "@/components/ThemeSelector";
import { useAuth } from "@/hooks/useAuth";
import {
    ArrowRightOnRectangleIcon,
    BanknotesIcon,
    BellIcon,
    BoltIcon,
    CalendarIcon,
    ChartBarIcon,
    ChevronDownIcon,
    CubeIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MapIcon,
    MapPinIcon,
    CubeIcon as PackageIcon,
    TagIcon,
    TicketIcon,
    TruckIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    WrenchScrewdriverIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

interface MenuItem {
  title: string;
  href?: string;
  icon: any;
  current?: boolean;
  badge?: string;
  children?: MenuItem[];
}

export default function SharedLayout({
  children,
  currentPage = "",
}: {
  children: React.ReactNode;
  currentPage?: string;
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
      current: currentPage === "dashboard",
    },
    {
      title: "Clients",
      href: "/clients",
      icon: UserGroupIcon,
      current: currentPage === "clients",
      badge: "12",
    },
    {
      title: "Marchandise",
      href: "/marchandise",
      icon: PackageIcon,
      current: currentPage === "marchandise",
      badge: "8",
    },
    {
      title: "Catégories",
      href: "/categories",
      icon: TagIcon,
      current: currentPage === "categories",
    },
    {
      title: "Tracking",
      href: "/tracking",
      icon: MapIcon,
      current: currentPage === "tracking",
      badge: "5",
    },
    {
      title: "Facturation",
      href: "/facturation",
      icon: CurrencyDollarIcon,
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
      href: "/billetterie",
      icon: TicketIcon,
      children: [
        { title: "Réservations", href: "/billetterie", icon: CalendarIcon },
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
      title: "Services Généraux",
      icon: WrenchScrewdriverIcon,
      children: [
        {
          title: "Maintenance",
          href: "/services-generaux/maintenance",
          icon: WrenchScrewdriverIcon,
        },
        {
          title: "Approvisionnement",
          href: "/services-generaux/approvisionnement",
          icon: PackageIcon,
        },
        {
          title: "Carburant",
          href: "/services-generaux/carburant",
          icon: BoltIcon,
        },
      ],
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
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex flex-col shadow-lg shadow-gray-200/50`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          <div
            className={`flex items-center ${!sidebarOpen && "justify-center"}`}
          >
            <Logo size={44} showText={sidebarOpen} />
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon
              className={`h-4 w-4 text-gray-400 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div
            className={`flex items-center ${!sidebarOpen && "justify-center"}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.prenom?.[0] || "U"}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-900">
                  {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                </p>
                <p className="text-xs text-gray-400 capitalize">
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
                  className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    item.current
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
          {sidebarOpen && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
              <p>Africa Connect System</p>
              <p>Version 1.1</p>
              <p>Développeur: Andy Mukonde</p>
              <p>© 2026</p>
            </div>
          )}
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
        {/* Top Header - Modern */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 z-10">
          <div className="flex items-center flex-1">
            <div className="max-w-lg w-full lg:max-w-sm">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/80 text-gray-900 placeholder-gray-400 transition-all hover:bg-white"
                />
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AdminDropdown />
            <ThemeSelector />
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
