declare module 'react-animated-weather' {
  import { ComponentType } from 'react'

  interface WeatherIconProps {
    icon: string
    color?: string
    size?: number
    animate?: boolean
  }

  const ReactAnimatedWeather: ComponentType<WeatherIconProps>
  export default ReactAnimatedWeather
}
