'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Navbar } from './components/navbar'
import { getWeatherData } from './utils/get-weather-data'

const Map = dynamic(() => import('./components/map'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading map...</div>,
})

type City = {
  id: string | number
  name: string
  country: string
  lat: number
  lng: number
}

const defaultCity: City = {
  id: 'default',
  name: 'Lagos',
  country: 'Nigeria',
  lat: 6.5244,
  lng: 3.3792,
}

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<City | null>(defaultCity)
  const [weatherData, setWeatherData] = useState<{
    temp: number
    description: string
    humidity: number
    wind: number
    tomorrow: {
      temp: number
      description: string
    }
  } | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city)
    setLoading(true)
    try {
      const data = await getWeatherData(city.name)
      setWeatherData({
        temp: data.today.temp,
        description: data.today.description,
        humidity: data.today.humidity,
        wind: data.today.wind,
        tomorrow: {
          temp: data.tomorrow.temp,
          description: data.tomorrow.description,
        },
      })
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="z-50">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onCitySelect={handleCitySelect} />
      </div>

      {isHydrated && (
        <div className="mt-16 grow relative h-[70vh]">
          <Map
            cities={[selectedCity || defaultCity]}
            selectedCity={selectedCity || defaultCity}
            setSelectedCity={handleCitySelect}
            weatherData={weatherData}
            darkMode={darkMode}
          />

          {loading && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded shadow-md z-50">
              Fetching weather data...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
