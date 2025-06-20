export async function getCityCoordinates(cityName: string) {
  const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`

  const res = await fetch(proxyUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch coordinates for ${cityName}`)
  }

  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error('Opps ! City not found try to check the spellings')
  }

  const { lat, lon, display_name } = data[0]
  const parts = display_name?.split(',').map((part: string) => part.trim())
  const country = parts?.[parts.length - 1] || 'Unknown'

  return {
    lat: parseFloat(lat),
    lng: parseFloat(lon),
    country,
  }
}
