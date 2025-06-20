declare module 'react-animated-weather' {
  import * as React from 'react'

  export interface WeatherIconProps {
    icon: string
    color?: string
    size?: number
    animate?: boolean
  }

  const AnimatedWeatherIcon: React.FC<WeatherIconProps>
  export default AnimatedWeatherIcon
}