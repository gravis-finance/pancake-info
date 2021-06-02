import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M13.6753 8.5365C13.6753 5.95391 12.4218 3.72972 11.4672 3.00782C11.4672 3.00782 11.3937 2.96714 11.4013 3.07136C11.3228 8.06116 8.78293 9.41346 7.38764 11.2335C4.16656 15.4378 7.15973 20.0463 10.2137 20.8979C11.9154 21.3758 9.81864 20.054 9.54768 17.2655C9.21595 13.9 13.6753 11.3275 13.6753 8.5365Z"
        fill="white"
      />
      <path
        d="M15.1384 10.2369C15.1181 10.2242 15.0903 10.2141 15.0725 10.2471C15.0194 10.875 14.3812 12.2171 13.5709 13.4525C10.8234 17.6365 12.3883 19.6548 13.2696 20.7402C13.7811 21.368 13.2696 20.7402 14.5458 20.0971C16.1234 19.1362 17.1465 17.4738 17.2984 15.6283C17.5491 12.6543 15.7715 10.7809 15.1384 10.2369Z"
        fill="#3F7FFF"
      />
    </Svg>
  )
}

export default Icon
