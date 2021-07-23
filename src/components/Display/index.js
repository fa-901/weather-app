import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';

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
    const date = new Date(weatherData.dt * 1000);

    return (
        <div className='glass p-3'>
            <div className="current">
                <div className='current-location'>
                    {weatherData.name}
                </div>
                <div className='current-temp'>
                    {Math.round(weatherData.main.temp)} &deg;C
                </div>
                <div className='current-desc'>
                    {weatherData.weather[0].main}
                </div>
            </div>

            <div className='row gx-0 text-center'>
                <div className="col-lg-4">
                    Feels Like {Math.round(weatherData.main.feels_like)} &deg;C
                </div>
                <div className="col-lg-4">
                    {/* <i className="fas fa-long-arrow-alt-up" style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}></i> */}
                    Wind {weatherData.wind.speed * 3.6} km/h
                </div>
                <div className="col-lg-4">
                    Humidity {weatherData.main.humidity}%
                </div>
            </div>
        </div>
    )

}