// export async function getWeatherData(cityName: string) {
//   const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
//   const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast'
//   const url = `${baseUrl}?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`

//   const res = await fetch(url)

//   if (!res.ok) {
//     const errorText = await res.text()
//     throw new Error(`Failed to fetch weather data: ${errorText}`)
//   }

//   const data = await res.json()

//   const today = data.list[0]
//   const tomorrow = data.list.find(
//     (entry: any) => new Date(entry.dt_txt).getDate() !== new Date(today.dt_txt).getDate()
//   )

//   return {
//     today: {
//       temp: today.main.temp,
//       description: today.weather[0].description,
//       humidity: today.main.humidity,
//       wind: today.wind.speed,
//     },
//     tomorrow: {
//       temp: tomorrow.main.temp,
//       description: tomorrow.weather[0].description,
//     },
//   }
// }


export async function getWeatherData(cityName: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast'

  const url = `${baseUrl}?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`

  const res = await fetch(url)
  if (!res.ok) {
    const errorText = await res.text()
    console.error('❌ OpenWeather response error:', res.status, errorText)
    throw new Error('Failed to fetch weather data.')
  }

  const data = await res.json()

  const today = data.list[0]
  const tomorrow = data.list.find((entry: any) =>
    new Date(entry.dt_txt).getDate() !== new Date(today.dt_txt).getDate()
  )

  return {
    today: {
      temp: today.main.temp,
      description: today.weather[0].description,
      humidity: today.main.humidity,
      wind: today.wind.speed,
    },
    tomorrow: {
      temp: tomorrow.main.temp,
      description: tomorrow.weather[0].description,
    },
  }
}
