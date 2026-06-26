"use client";

import PageHeader from "@/components/PageHeader";
import {
    Battery50Icon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    SignalIcon,
    TruckIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

// Importer Leaflet
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <TruckIcon className="h-12 w-12 text-gray-400" />
    </div>
  ),
});

export default function TrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mapCenter, setMapCenter] = useState({ lat: -4.4419, lng: 15.2663 }); // Kinshasa
  const [mapZoom, setMapZoom] = useState(12);

  // Simuler des données de véhicules
  useEffect(() => {
    const simulatedVehicles = [
      {
        id: "VH-001",
        name: "Toyota Hilux",
        driver: "Jean Mukendi",
        plateNumber: "CD-123-AB",
        status: "active",
        speed: 65,
        fuel: 75,
        battery: 90,
        lastUpdate: new Date(),
        position: { lat: -4.4419, lng: 15.2663 },
        destination: "Marché Central",
        estimatedArrival: "14:30",
        route: [
          { lat: -4.4419, lng: 15.2663 },
          { lat: -4.4329, lng: 15.2763 },
          { lat: -4.4239, lng: 15.2863 },
        ],
      },
      {
        id: "VH-002",
        name: "Mercedes Sprinter",
        driver: "Pierre Nsenga",
        plateNumber: "CD-456-CD",
        status: "idle",
        speed: 0,
        fuel: 45,
        battery: 85,
        lastUpdate: new Date(),
        position: { lat: -4.4519, lng: 15.2563 },
        destination: null,
        estimatedArrival: null,
        route: [],
      },
      {
        id: "VH-003",
        name: "Iveco Daily",
        driver: "Jacques Mbuyi",
        plateNumber: "CD-789-EF",
        status: "maintenance",
        speed: 0,
        fuel: 30,
        battery: 60,
        lastUpdate: new Date(),
        position: { lat: -4.4619, lng: 15.2463 },
        destination: null,
        estimatedArrival: null,
        route: [],
      },
      {
        id: "VH-004",
        name: "Ford Transit",
        driver: "Antoine Kalonji",
        plateNumber: "CD-321-GH",
        status: "active",
        speed: 45,
        fuel: 60,
        battery: 95,
        lastUpdate: new Date(),
        position: { lat: -4.4319, lng: 15.2763 },
        destination: "Aéroport",
        estimatedArrival: "15:45",
        route: [
          { lat: -4.4319, lng: 15.2763 },
          { lat: -4.4219, lng: 15.2863 },
          { lat: -4.4119, lng: 15.2963 },
        ],
      },
      {
        id: "VH-005",
        name: "Renault Master",
        driver: "Michel Lumbu",
        plateNumber: "CD-654-IJ",
        status: "offline",
        speed: 0,
        fuel: 20,
        battery: 10,
        lastUpdate: new Date(Date.now() - 3600000), // Il y a 1 heure
        position: { lat: -4.4719, lng: 15.2363 },
        destination: null,
        estimatedArrival: null,
        route: [],
      },
    ];
    setVehicles(simulatedVehicles);
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || vehicle.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "idle":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "maintenance":
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case "offline":
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return <SignalIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "En mouvement";
      case "idle":
        return "Au repos";
      case "maintenance":
        return "En maintenance";
      case "offline":
        return "Hors ligne";
      default:
        return "Inconnu";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "idle":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête moderne */}
      <PageHeader
        title="Tracking GPS"
        subtitle="Suivi en temps réel de votre flotte"
      />

      {/* Stats rapides */}
      <div className="flex items-center space-x-6 mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2 text-sm bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 font-medium">
            Actifs:{" "}
            <span className="text-gray-900 font-bold">
              {vehicles.filter((v) => v.status === "active").length}
            </span>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600 font-medium">
            Total:{" "}
            <span className="text-gray-900 font-bold">{vehicles.length}</span>
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un véhicule, chauffeur ou plaque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">En mouvement</option>
              <option value="idle">Au repos</option>
              <option value="maintenance">En maintenance</option>
              <option value="offline">Hors ligne</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Liste des véhicules */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedVehicle?.id === vehicle.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => {
                setSelectedVehicle(vehicle);
                setMapCenter(vehicle.position);
                setMapZoom(15);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(vehicle.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicle.plateNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}
                >
                  {getStatusText(vehicle.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Chauffeur:</span>
                  <span className="font-medium text-gray-900">
                    {vehicle.driver}
                  </span>
                </div>
                {vehicle.status === "active" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Vitesse:</span>
                      <span className="font-medium text-gray-900">
                        {vehicle.speed} km/h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Destination:</span>
                      <span className="font-medium text-gray-900">
                        {vehicle.destination || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Arrivée estimée:</span>
                      <span className="font-medium text-gray-900">
                        {vehicle.estimatedArrival || "-"}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Carburant:</span>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        vehicle.fuel > 50
                          ? "bg-green-500"
                          : vehicle.fuel > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-900">
                      {vehicle.fuel}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center">
                    <Battery50Icon className="h-4 w-4 mr-1" />
                    Batterie:
                  </span>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        vehicle.battery > 50
                          ? "bg-green-500"
                          : vehicle.battery > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-900">
                      {vehicle.battery}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carte */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-full p-4">
            <Map
              center={mapCenter}
              zoom={mapZoom}
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={setSelectedVehicle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
