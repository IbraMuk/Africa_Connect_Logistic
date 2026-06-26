"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    ArrowRightOnRectangleIcon,
    BellIcon,
    CalendarIcon,
    ChartBarIcon,
    ChevronDownIcon,
    CubeIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    HomeIcon,
    MapPinIcon,
    TicketIcon,
    TruckIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  badgeColor?: string;
  children?: MenuItem[];
}

interface DashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardDrawerFixed({
  isOpen,
  onClose,
}: DashboardDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: UserGroupIcon,
      badge: "12",
      badgeColor: "bg-blue-500/20 text-blue-300",
    },
    {
      title: "Facturation",
      href: "/facturation",
      icon: CurrencyDollarIcon,
      badge: "3",
      badgeColor: "bg-amber-500/20 text-amber-300",
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
          badgeColor: "bg-emerald-500/20 text-emerald-300",
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
        {
          title: "Tarifs",
          href: "/billetterie/tarifs",
          icon: CurrencyDollarIcon,
        },
      ],
    },
    {
      title: "Import/Export",
      href: "/import-export",
      icon: GlobeAltIcon,
      badge: "2",
      badgeColor: "bg-violet-500/20 text-violet-300",
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

  const isActive = (href?: string) => !!href && pathname === href;

  const isParentActive = (children?: MenuItem[]): boolean => {
    if (!children) return false;
    return children.some(
      (child) => isActive(child.href) || isParentActive(child.children),
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
    onClose();
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`.toUpperCase() || "U";
  };

  const getRoleLabel = () => {
    if (!user) return "Chargement...";
    if (user.role === "admin") return "Administrateur";
    if (user.role === "chauffeur") return "Chauffeur";
    return "Client";
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const active = isActive(item.href);
    const parentActive = isParentActive(item.children);
    const isExpanded = expandedMenus.includes(item.title);
    const hasChildren = !!item.children;

    const baseClass =
      depth === 0
        ? `relative w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 group ${
            active
              ? "bg-blue-600/15 text-blue-300 shadow-sm shadow-blue-500/10"
              : parentActive || isExpanded
                ? "bg-slate-800 text-slate-200"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
          }`
        : `w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
            active
              ? "bg-blue-600/10 text-blue-300"
              : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
          }`;

    return (
      <div key={item.title}>
        <button
          onClick={() =>
            hasChildren
              ? toggleMenu(item.title)
              : handleNavigation(item.href || "#")
          }
          className={baseClass}
        >
          {active && depth === 0 && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" />
          )}
          <div className="flex items-center space-x-3 min-w-0">
            <item.icon
              className={`flex-shrink-0 ${depth === 0 ? "h-5 w-5" : "h-4 w-4"}`}
            />
            <span className="truncate">{item.title}</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {item.badge && (
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  active
                    ? "bg-blue-500/20 text-blue-300"
                    : item.badgeColor || "bg-slate-700 text-slate-400"
                }`}
              >
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </button>

        {hasChildren && isExpanded && item.children && (
          <div
            className={`mt-1 space-y-0.5 ${
              depth === 0
                ? "ml-4 pl-3 border-l border-slate-700/50"
                : "ml-3 pl-2 border-l border-slate-700/30"
            }`}
          >
            {item.children.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-700/50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
    >
      {/* Logo Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
            <TruckIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              Africa Connect
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              Logistic Platform
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors lg:hidden"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* User Profile */}
      <div className="px-4 py-4 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            <span className="text-white text-sm font-bold">
              {getUserInitials()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
            </p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <p className="text-xs text-slate-400 truncate">{getRoleLabel()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
        <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Navigation
        </p>
        <nav className="space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.title}>{renderMenuItem(item)}</div>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-slate-700/50 bg-slate-950/60 p-3 flex-shrink-0 space-y-1">
        <button
          onClick={() => handleNavigation("/notifications")}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
        >
          <div className="flex items-center space-x-3">
            <BellIcon className="h-5 w-5 flex-shrink-0" />
            <span>Notifications</span>
          </div>
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
            3
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
