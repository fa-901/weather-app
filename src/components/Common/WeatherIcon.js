import React from 'react';
import iconMap from './iconMap.json';

export default function WeatherIcon(props) {
    const iconClass = iconMap.find((e) => e.icon === props.icon);
    return(
        <i className={`wi ${iconClass.className} ${props.className}`}></i>
    )
}