"use client";

import ThemeSelector from "@/components/ThemeSelector";
import { useAuth } from "@/hooks/useAuth";
import {
    ArrowRightOnRectangleIcon,
    BanknotesIcon,
    Bars3Icon,
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
    ShieldCheckIcon,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const { logout } = useAuth();
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
    },
    {
      title: "Marchandise",
      href: "/marchandise",
      icon: PackageIcon,
      current: currentPage === "marchandise",
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
    },
    {
      title: "Facturation",
      href: "/facturation",
      icon: CurrencyDollarIcon,
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
      title: "Administration",
      href: "/administration",
      icon: ShieldCheckIcon,
      current: currentPage === "administration",
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
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto w-64 ${sidebarOpen ? "lg:w-64" : "lg:w-20"} transform transition-transform lg:transition-[width] duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 bg-gradient-to-b from-[#0a1f44] via-[#0d2a5e] to-[#0a1f44] border-r border-blue-900/40 flex flex-col shadow-2xl shadow-blue-950/40`}
      >
        {/* Sidebar Header */}
        <div className="relative h-16 flex items-center justify-between px-4 border-b border-blue-800/40 flex-shrink-0">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400" />
          <div
            className={`flex items-center min-w-0 flex-1 ${!sidebarOpen && "justify-center w-full"}`}
          >
            <Logo
              size={sidebarOpen ? 36 : 34}
              showText={sidebarOpen}
              textClassName="text-base text-white whitespace-nowrap"
              subTitle={null}
            />
          </div>
          {/* Fermer le menu mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-blue-800/50 transition-colors flex-shrink-0 lg:hidden"
          >
            <XMarkIcon className="h-4 w-4 text-blue-300" />
          </button>
          {/* Réduire/étendre le menu (desktop uniquement) */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-blue-800/50 transition-colors flex-shrink-0"
            >
              <XMarkIcon className="h-4 w-4 text-blue-300" />
            </button>
          )}
        </div>
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block mx-auto mt-2 p-1.5 rounded-lg hover:bg-blue-800/50 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="h-4 w-4 text-blue-300 rotate-180" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {!item.children ? (
                  <Link
                    href={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      item.current
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-white hover:bg-blue-800/40"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span className="ml-3">{item.title}</span>}
                  </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      expandedMenus.includes(item.title)
                        ? "bg-blue-800/40 text-white"
                        : "text-white hover:bg-blue-800/40"
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
                              className="flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors text-white hover:bg-blue-800/30"
                            >
                              <child.icon className="h-4 w-4 flex-shrink-0" />
                              <span className="ml-3">{child.title}</span>
                            </Link>
                          ) : (
                            <div>
                              <button
                                onClick={() => toggleMenu(child.title)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors text-white hover:bg-blue-800/30"
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
                                          className="flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-white hover:bg-blue-800/25"
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
        <div className="p-4 border-t border-blue-800/40 bg-[#081936]/70">
          {sidebarOpen && (
            <div className="text-xs text-blue-300/50 text-center mb-3">
              <p>Africa Connect System</p>
              <p>Version 1.1</p>
              <p>Développeur: Andy Mukonde</p>
              <p>© 2026</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Modern */}
        <header className="relative h-16 bg-white/90 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 z-10 shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800 flex-shrink-0"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-xs hidden sm:block">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50/80 text-gray-900 placeholder-gray-400 transition-all hover:bg-white"
            />
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <ThemeSelector />
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-3 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
