'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Vehicle {
  id: string
  name: string
  driver: string
  plateNumber: string
  status: string
  speed: number
  fuel: number
  battery: number
  lastUpdate: Date
  position: { lat: number; lng: number }
  destination?: string | null
  estimatedArrival?: string | null
  route?: { lat: number; lng: number }[]
}

interface LeafletMapProps {
  center: { lat: number; lng: number }
  zoom: number
  vehicles: Vehicle[]
  selectedVehicle: Vehicle | null
  onVehicleSelect: (vehicle: Vehicle) => void
}

export default function LeafletMap({ 
  center, 
  zoom, 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect 
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const routesRef = useRef<L.Polyline[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    // Handle window resize and container resize
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
    window.addEventListener('resize', handleResize)

    // Observe container resize (e.g. sidebar toggle)
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && mapRef.current) {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(handleResize, 100)
      })
      resizeObserver.observe(mapRef.current)
    }

    // Trigger initial resize after mount
    setTimeout(handleResize, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver && mapRef.current) {
        resizeObserver.unobserve(mapRef.current)
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update center and zoom when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView([center.lat, center.lng], zoom, { animate: true })
  }, [center, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove())
    routesRef.current.forEach(route => route.remove())
    markersRef.current = []
    routesRef.current = []

    // Add vehicle markers
    vehicles.forEach(vehicle => {
      const iconColor = vehicle.status === 'active' ? 'green' : 
                      vehicle.status === 'idle' ? 'yellow' : 
                      vehicle.status === 'maintenance' ? 'orange' : 'red'
      
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${iconColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5c-.66 0-1.21.42-1.42 1.01L13 13v7c0 .55.45 1 1 1s1-.45 1-1v-7l3.08-6.99zM12 2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1zM5.92 6.01C5.72 5.42 5.16 5 4.5 5c-.66 0-1.21.42-1.42 1.01L0 13v7c0 .55.45 1 1 1s1-.45 1-1v-7l3.08-6.99z"/>
            </svg>
            ${vehicle.status === 'active' ? `
              <div style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: white;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                font-weight: bold;
                color: ${iconColor};
              ">${vehicle.speed}</div>
            ` : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      })

      const marker = L.marker([vehicle.position.lat, vehicle.position.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; font-weight: bold;">${vehicle.name}</h3>
            <p style="margin: 5px 0;"><strong>Plaque:</strong> ${vehicle.plateNumber}</p>
            <p style="margin: 5px 0;"><strong>Chauffeur:</strong> ${vehicle.driver}</p>
            <p style="margin: 5px 0;"><strong>Statut:</strong> ${vehicle.status}</p>
            ${vehicle.status === 'active' ? `
              <p style="margin: 5px 0;"><strong>Vitesse:</strong> ${vehicle.speed} km/h</p>
              <p style="margin: 5px 0;"><strong>Destination:</strong> ${vehicle.destination || 'N/A'}</p>
            ` : ''}
          </div>
        `)
        .on('click', () => onVehicleSelect(vehicle))

      markersRef.current.push(marker)

      // Add route if vehicle is active
      if (vehicle.status === 'active' && vehicle.route && vehicle.route.length > 0) {
        const routeCoordinates = vehicle.route.map(point => [point.lat, point.lng])
        const polyline = L.polyline(routeCoordinates as [number, number][], {
          color: iconColor,
          weight: 3,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(mapInstanceRef.current!)
        
        routesRef.current.push(polyline)
      }
    })

    // Fit map to show all vehicles
    if (vehicles.length > 0 && mapInstanceRef.current) {
      const group = new L.FeatureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [vehicles, onVehicleSelect])

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVehicle) return

    // Center map on selected vehicle
    mapInstanceRef.current.setView(
      [selectedVehicle.position.lat, selectedVehicle.position.lng],
      16,
      { animate: true }
    )

    // Open popup for selected vehicle
    const marker = markersRef.current.find(m => 
      m.getLatLng().lat === selectedVehicle.position.lat && 
      m.getLatLng().lng === selectedVehicle.position.lng
    )
    if (marker) {
      marker.openPopup()
    }
  }, [selectedVehicle])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  )
}
