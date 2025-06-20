// 'use client'

// import { useEffect, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
// import { MapPin, Thermometer, Wind, Droplets, CalendarClock } from 'lucide-react'
// import ReactDOMServer from 'react-dom/server'
// import ReactAnimatedWeather from 'react-animated-weather'

// type City = {
//   id: string | number
//   name: string
//   country: string
//   lat: number
//   lng: number
// }

// type WeatherData = {
//   temp: number
//   description: string
//   humidity: number
//   wind: number
//   tomorrow: {
//     temp: number
//     description: string
//   }
// }

// type MapProps = {
//   cities: City[]
//   selectedCity: City | null
//   setSelectedCity: (city: City) => void
//   weatherData?: WeatherData | null
//   darkMode: boolean
// }

// function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
//   const map = useMap()
//   useEffect(() => {
//     map.setView([lat, lng], 8)
//   }, [lat, lng, map])
//   return null
// }

// const getWeatherIcon = (desc: string) => {
//   if (desc.includes('cloud')) return 'CLOUDY'
//   if (desc.includes('rain')) return 'RAIN'
//   if (desc.includes('sun') || desc.includes('clear')) return 'CLEAR_DAY'
//   if (desc.includes('snow')) return 'SNOW'
//   return 'PARTLY_CLOUDY_DAY'
// }

// export default function Map({
//   cities,
//   selectedCity,
//   setSelectedCity,
//   weatherData,
//   darkMode,
// }: MapProps) {
//   const [center, setCenter] = useState<[number, number]>([20, 0])

//   useEffect(() => {
//     if (selectedCity) {
//       setCenter([selectedCity.lat, selectedCity.lng])
//     }
//   }, [selectedCity])

//   const tileUrl = darkMode
//     ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
//     : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

//   const customIcon = new L.DivIcon({
//     html: ReactDOMServer.renderToString(<MapPin size={32} color="#f43f5e" />),
//     className: '',
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
//     popupAnchor: [0, -32],
//   })

//   return (
//     <div className="w-full h-full flex flex-col lg:flex-row">
//       <div className="h-[70vh] lg:h-full lg:w-2/3 w-full border-2 border-lime-500 relative">
//         <MapContainer
//           center={center}
//           zoom={5}
//           scrollWheelZoom={true}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer url={tileUrl} />
//           {selectedCity && <RecenterMap lat={selectedCity.lat} lng={selectedCity.lng} />}
//           {cities.map((city) => (
//             <Marker
//               key={city.id}
//               position={[city.lat, city.lng]}
//               icon={customIcon}
//               eventHandlers={{ click: () => setSelectedCity(city) }}
//             >
//               <Popup>
//                 <div>
//                   <h2 className="font-semibold">{city.name}</h2>
//                   <p>{city.country}</p>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       {weatherData && (
//         <div className="lg:w-1/3 w-full bg-white dark:bg-gray-800 p-6 overflow-y-auto transition-all animate-fade-in-up">
//           <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Weather Info</h3>
//           <div className="flex items-center gap-4 mb-4">
//             <ReactAnimatedWeather
//               icon={getWeatherIcon(weatherData.description.toLowerCase())}
//               color={darkMode ? 'white' : 'goldenrod'}
//               size={48}
//               animate={true}
//             />
//             <div>
//               <p className="text-lg font-medium capitalize text-gray-700 dark:text-gray-200">
//                 {weatherData.description}
//               </p>
//               <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
//                 <Thermometer size={16} /> {weatherData.temp}°C
//               </p>
//             </div>
//           </div>

//           <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
//             <Droplets size={16} /> Humidity: {weatherData.humidity}%
//           </p>
//           <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
//             <Wind size={16} /> Wind Speed: {weatherData.wind} m/s
//           </p>

//           <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
//             <CalendarClock size={16} /> Tomorrow
//           </h4>
//           <p className="text-gray-700 dark:text-gray-200">{weatherData.tomorrow.description}</p>
//           <p className="text-gray-700 dark:text-gray-200">{weatherData.tomorrow.temp}°C</p>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Droplet, Wind, Sun } from 'lucide-react'
import ReactDOMServer from 'react-dom/server'
import AnimatedWeatherIcon from 'react-animated-weather'
import { motion } from 'framer-motion'

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
          className='shadow-lg'
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
      {weatherData && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-80 p-6 bg-white dark:bg-gray-800 text-black dark:text-white overflow-auto"
        >
          <h2 className="text-xl font-bold mb-4">Weather Breakdown</h2>
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
      )}
    </div>
  )
}
