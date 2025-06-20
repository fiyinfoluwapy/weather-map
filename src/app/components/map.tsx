'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Droplet, Wind, Sun } from 'lucide-react'
import ReactDOMServer from 'react-dom/server'
import * as AnimatedWeather from 'react-animated-weather'
import { motion } from 'framer-motion'

const AnimatedWeatherIcon = AnimatedWeather.default

type City = {
  id: string | number
  name: string
  country: string
  lat: number
  lng: number
}

type WeatherData = {
  temp: number
  description: string
  humidity: number
  wind: number
  tomorrow: {
    temp: number
    description: string
  }
}

type MapProps = {
  cities: City[]
  selectedCity: City | null
  setSelectedCity: (city: City) => void
  weatherData?: WeatherData | null
  darkMode: boolean
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 10)
  }, [center, map])
  return null
}

export default function Map({
  cities,
  selectedCity,
  setSelectedCity,
  weatherData,
  darkMode,
}: MapProps) {
  const [center, setCenter] = useState<[number, number]>([20, 0])

  useEffect(() => {
    if (selectedCity) {
      setCenter([selectedCity.lat, selectedCity.lng])
    }
  }, [selectedCity])

  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const markerIcon = new L.DivIcon({
    html: ReactDOMServer.renderToString(<MapPin size={32} color="limegreen" />),
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  const getIconType = (desc: string) => {
    const lower = desc.toLowerCase()
    if (lower.includes('cloud')) return 'CLOUDY'
    if (lower.includes('rain')) return 'RAIN'
    if (lower.includes('clear')) return 'CLEAR_DAY'
    if (lower.includes('snow')) return 'SNOW'
    return 'PARTLY_CLOUDY_DAY'
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 h-[70vh] relative">
        <MapContainer
          center={center}
          zoom={5}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
          className="shadow-lg"
        >
          <TileLayer url={tileUrl} />
          <RecenterMap center={center} />
          {cities.map((city) => (
            <Marker
              key={city.id}
              position={[city.lat, city.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => setSelectedCity(city),
              }}
            >
              <Popup>
                <div>
                  <h2 className="font-semibold">{city.name}</h2>
                  <p>{city.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Weather Info Panel */}
      {weatherData && selectedCity ? (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-80 p-6 bg-white dark:bg-gray-800 text-black dark:text-white overflow-auto"
        >
          <h2 className="text-xl font-bold mb-1">
            {selectedCity.name}, {selectedCity.country}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Weather Breakdown
          </p>

          <div className="flex items-center gap-3 mb-4">
            <AnimatedWeatherIcon
              icon={getIconType(weatherData.description)}
              color={darkMode ? '#4ade80' : '#0a3875'}
              size={48}
              animate
            />
            <div>
              <p className="text-lg font-semibold">{weatherData.temp}°C</p>
              <p className="capitalize text-sm">{weatherData.description}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Droplet size={18} /> Humidity: {weatherData.humidity}%
            </p>
            <p className="flex items-center gap-2">
              <Wind size={18} /> Wind Speed: {weatherData.wind} m/s
            </p>
            <p className="flex items-center gap-2">
              <Sun size={18} /> Tomorrow: {weatherData.tomorrow.temp}°C,{' '}
              {weatherData.tomorrow.description}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="w-full lg:w-80 p-6 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>Select a city to view weather info.</p>
        </div>
      )}
    </div>
  )
}
