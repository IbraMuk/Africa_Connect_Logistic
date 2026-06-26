"use client";

import Logo from "@/components/Logo";
import { formatLargeAmount } from "@/config/currency";
import {
    ArrowRightIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    ExclamationCircleIcon,
    MapPinIcon,
    TruckIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState({
    revenue: 0,
    transports: 0,
    clients: 0,
    delivery: 0,
  });

  useEffect(() => {
    const animateValue = (
      key: keyof typeof animatedStats,
      target: number,
      duration: number,
    ) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedStats((prev) => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    animateValue("revenue", 2450000, 2000);
    animateValue("transports", 1247, 2000);
    animateValue("clients", 8934, 2000);
    animateValue("delivery", 98.5, 2000);
  }, []);

  const stats = [
    {
      title: "Revenus Mensuels",
      value: formatLargeAmount(animatedStats.revenue),
      change: "+12.5%",
      trend: "up",
      icon: CurrencyDollarIcon,
      color: "from-green-500 to-emerald-600",
      description: "vs mois précédent",
    },
    {
      title: "Transports Effectués",
      value: animatedStats.transports.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: TruckIcon,
      color: "from-blue-500 to-indigo-600",
      description: "ce mois-ci",
    },
    {
      title: "Clients Actifs",
      value: animatedStats.clients.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: UserGroupIcon,
      color: "from-purple-500 to-pink-600",
      description: "total clients",
    },
    {
      title: "Taux de Livraison",
      value: `${animatedStats.delivery}%`,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircleIcon,
      color: "from-orange-500 to-red-600",
      description: "ponctualité",
    },
  ];

  const recentActivities = [
    {
      action: "Nouvelle réservation",
      detail: "Transport Kinshasa - Lubumbashi",
      time: "Il y a 5 min",
      icon: TruckIcon,
      status: "success",
    },
    {
      action: "Facture créée",
      detail: "FAC-2024-0012 pour Client XYZ",
      time: "Il y a 15 min",
      icon: DocumentTextIcon,
      status: "success",
    },
    {
      action: "Retard signalé",
      detail: "Vol TR-234 en retard de 30 min",
      time: "Il y a 1 heure",
      icon: ExclamationCircleIcon,
      status: "warning",
    },
    {
      action: "Nouveau client",
      detail: "Entreprise Congo Logistics",
      time: "Il y a 2 heures",
      icon: UserGroupIcon,
      status: "success",
    },
  ];

  const quickActions = [
    {
      title: "Nouvelle Réservation",
      icon: TruckIcon,
      color: "bg-blue-500",
      href: "/transport-personnel",
    },
    {
      title: "Créer Facture",
      icon: DocumentTextIcon,
      color: "bg-green-500",
      href: "/facturation",
    },
    {
      title: "Ajouter Client",
      icon: UserGroupIcon,
      color: "bg-purple-500",
      href: "/clients",
    },
    {
      title: "Voir Tracking",
      icon: MapPinIcon,
      color: "bg-orange-500",
      href: "/tracking",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div>
            <Logo
              size={72}
              showText={true}
              textClassName="text-gray-900"
              subTitle={
                <span className="flex items-center text-gray-500">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  Lubumbashi, RD Congo
                </span>
              }
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <span className="text-lg font-bold text-gray-900 tabular-nums">
              {currentTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques Cards - Modern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div
                  className={`flex items-center text-sm font-semibold px-2.5 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3.5 w-3.5 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex items-center space-x-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div
                className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {action.title}
              </span>
              <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Évolution des revenus
                </h3>
                <p className="text-sm text-gray-500">Performance mensuelle</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-xs text-gray-500">Revenus</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2 px-4">
              {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center space-y-2"
                  >
                    <div className="w-full relative">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ height: `${height * 1.8}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {
                        [
                          "J",
                          "F",
                          "M",
                          "A",
                          "M",
                          "J",
                          "J",
                          "A",
                          "S",
                          "O",
                          "N",
                          "D",
                        ][i]
                      }
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Types de transport
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Personnel", value: 45, color: "bg-blue-500" },
                  { label: "Marchandises", value: 35, color: "bg-emerald-500" },
                  { label: "Import/Export", value: 20, color: "bg-violet-500" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Performance</h3>
              <p className="text-blue-100 text-sm mb-6">
                Taux de satisfaction client
              </p>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeDasharray={`${2.51 * 98.5} ${251 - 2.51 * 98.5}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">
                      {animatedStats.delivery}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Activities */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Activités récentes
              </h3>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Live
              </span>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activity.status === "success"
                        ? "bg-green-100 text-green-600 group-hover:bg-green-200"
                        : "bg-amber-100 text-amber-600 group-hover:bg-amber-200"
                    } transition-colors`}
                  >
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {activity.detail}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              Voir toutes les activités
            </button>
          </div>

          {/* Mini Calendar / Upcoming */}
          <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">À venir</h3>
            <div className="space-y-3">
              {[
                {
                  title: "Livraison Kinshasa",
                  time: "14:30",
                  color: "bg-blue-500",
                },
                {
                  title: "Réunion équipe",
                  time: "16:00",
                  color: "bg-violet-500",
                },
                {
                  title: "Départ Lubumbashi",
                  time: "18:15",
                  color: "bg-emerald-500",
                },
              ].map((event, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {event.title}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {event.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
