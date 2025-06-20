'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, LocateIcon, Moon, Sun } from 'lucide-react'
import { getCityCoordinates } from '../utils/get-city-coordinates'

type City = {
  id: string | number
  name: string
  country: string
  lat: number
  lng: number
}

type NavbarProps = {
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
  onCitySelect: (city: City) => void
}


function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  onCitySelect,
}) => {
  const hasMounted = useHasMounted()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!hasMounted) return
    const updateIsMobile = () => setIsMobile(window.innerWidth < 768)
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [hasMounted])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    try {
      const { lat, lng, country } = await getCityCoordinates(searchTerm)
      onCitySelect({
        id: `${searchTerm.toLowerCase()}-${lat}-${lng}`,
        name: searchTerm,
        country,
        lat,
        lng,
      })
      setSearchTerm('')
      if (isMobile) setIsSearchOpen(false)
    } catch (err) {
      console.error('City not found:', err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  if (!hasMounted) return null

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 py-3 shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <LocateIcon className="h-6 w-6 text-blue-500 dark:text-green-400" />
          <span>Weather Explorer</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800" />
            )}
          </button>

          {/* Mobile search toggle */}
          {isMobile && (
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Search"
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isSearchOpen || !isMobile ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  )
}
