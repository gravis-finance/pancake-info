import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
    return (
        <Svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76.54 77.67" {...props}>
            <path
                d="M66.54,46.41a4.08,4.08,0,0,1-4.17.28C60.83,45.82,60,43.78,60,41V32.48c0-4.09-1.62-7-4.33-7.79-4.58-1.34-8,4.27-9.32,6.38l-8.1,13.11v-16c-.09-3.69-1.29-5.9-3.56-6.56-1.5-.44-3.75-.26-5.94,3.08L10.64,53.77A32,32,0,0,1,7,38.83C7,21.31,21,7.06,38.25,7.06s31.3,14.25,31.3,31.77V39c.17,3.39-.93,6.09-3,7.4Zm10-7.57v-.17C76.4,17.32,59.28,0,38.25,0S0,17.42,0,38.83,17.16,77.67,38.25,77.67a37.82,37.82,0,0,0,26-10.36,3.56,3.56,0,0,0,.18-5,3.42,3.42,0,0,0-4.84-.24h0a30.93,30.93,0,0,1-43.73-1.15c-.28-.31-.57-.62-.84-.93L31.3,33.8V45.89c0,5.81,2.25,7.69,4.14,8.24s4.78.17,7.81-4.75l9-14.57c.28-.47.55-.87.79-1.22V41c0,5.43,2.18,9.77,6,11.91a11,11,0,0,0,11.21-.45c4.2-2.73,6.49-7.67,6.25-13.62Z"
                transform="translate(0 0)"
                fill="#676767"
            />
        </Svg>
    )
}

export default Icon
