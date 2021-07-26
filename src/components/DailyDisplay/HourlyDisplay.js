import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';

import { tempConversion } from '../../utils/functions';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

export default function DisplayDisplay(props) {
    const context = useContext(AppContext);

    const { weatherData, unit, hourlyData } = context;
    const { skip } = props;

    const startTime = dayjs(weatherData.daily[skip].dt * 1000);
    const endTime = startTime.add(skip + 1, 'day');

    const graphData = (hourlyData?.list || []).filter((e) => {
        return dayjs(e.dt * 1000).isBetween(startTime, endTime, null, '[)')
    }).map((e) => {
        const time = dayjs.tz((e.dt * 1000), weatherData.timezone).format('D MMM, h A');
        const value = tempConversion(e.main.temp, unit);
        return {
            time: time,
            value: value,
        }
    });

    console.log(graphData);

    return (
        <div className='hourly mb-3'>
            <div className="label">
                Hourly Forecast
            </div>
        </div>
    )
}