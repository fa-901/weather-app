import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';

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

    const { weatherData } = context;
    const date = new Date(weatherData.current.dt * 1000);
    const time = dayjs.tz(date, weatherData.timezone).format('D MMMM YYYY, h:mm A')

    return (
        <div className='glass p-3 current'>
            <div className="current-container">
                <div className='current-location'>
                    {weatherData.location}
                </div>
                <div className='current-time'>
                    {time}
                </div>
                <div className='current-temp'>
                    {Math.round(weatherData.current.temp)} &deg;C
                </div>
                <div className='current-desc'>
                    {weatherData.current.weather[0].main}
                </div>
            </div>

            <div className='row gx-0 text-center'>
                <div className="col-lg-4">
                    Feels Like {Math.round(weatherData.current.feels_like)} &deg;C
                </div>
                <div className="col-lg-4">
                    {/* <i className="fas fa-long-arrow-alt-up" style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}></i> */}
                    Wind {_.round((weatherData.current.wind_speed * 3.6),1)} km/h
                </div>
                <div className="col-lg-4">
                    Humidity {_.round(weatherData.current.humidity, 1)}%
                </div>
            </div>
        </div>
    )

}