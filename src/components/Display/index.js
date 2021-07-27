import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { tempConversion } from '../../utils/functions';
import WeatherIcon from '../Common/WeatherIcon';

dayjs.extend(utc)
dayjs.extend(timezone)

export default function Display(props) {
    const context = useContext(AppContext);


    if (context.dataLoading) {
        return (
            <div className='text-center'>
                <i className="fas fa-spinner fa-spin"></i>
            </div>
        );
    }

    if (!context.weatherData) {
        return null;
    }

    const { weatherData, unit, toggleUnit } = context;
    const time = dayjs.tz((weatherData.current.dt * 1000), weatherData.timezone).format('D MMMM YYYY, h:mm A')

    return (
        <div className='glass p-3 current mb-3'>
            <div className="current-container">
                <div className='current-location'>
                    {weatherData.location}
                </div>
                <div className='current-time'>
                    {time}
                </div>
                <div className='current-temp'>
                    <WeatherIcon className={'current-icon'} icon={weatherData.current.weather[0].icon} />
                    <span className='mx-3'>{Math.round(tempConversion(weatherData.current.temp, unit))}&deg;</span>
                    <div className='d-inline-block units'>
                        <span className={`d-block ${unit === 'C' && 'text-decoration-underline'}`} onClick={() => { toggleUnit('C') }} >C</span>
                        <span className={`d-block ${unit === 'F' && 'text-decoration-underline'}`} onClick={() => { toggleUnit('F') }}>F</span>
                    </div>
                </div>
                <div className='current-desc'>
                    {weatherData.current.weather[0].main}
                </div>
            </div>

            <div className='row gx-0 text-center'>
                <div className="col-lg-4">
                    Feels Like <b>{Math.round(tempConversion(weatherData.current.feels_like, unit))} &deg;{unit}</b>
                </div>
                <div className="col-lg-4">
                    {/* <i className="fas fa-long-arrow-alt-up" style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}></i> */}
                    Wind <b>{_.round((weatherData.current.wind_speed * 3.6), 1)} km/h</b>
                </div>
                <div className="col-lg-4">
                    Humidity <b>{_.round(weatherData.current.humidity, 1)}%</b>
                </div>
            </div>
        </div>
    )

}