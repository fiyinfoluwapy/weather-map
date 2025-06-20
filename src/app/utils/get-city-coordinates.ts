export async function getCityCoordinates(cityName: string) {
  const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
  const proxyUrl = `https://corsproxy.io/?${targetUrl}`

  const res = await fetch(proxyUrl)

  if (!res.ok) {
    throw new Error(`Failed to fetch coordinates for ${cityName}`)
  }

  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error('Oops! City not found. Please check the spelling.')
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
