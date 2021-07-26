import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';

import { tempConversion } from '../../utils/functions';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

export default function HourlyDisplay(props) {
    const context = useContext(AppContext);

    const { weatherData, unit, hourlyData } = context;
    const { skip } = props;

    const startTime = dayjs(weatherData.daily[skip].dt * 1000).startOf('day');
    const endTime = startTime.endOf('day');

    const isCurrentDay = skip === 0;
    const dataList = isCurrentDay ? (weatherData.hourly) : (hourlyData?.list || []); /**if on current day, show hourly data from weatherData.hourly instead */
    const graphData = dataList.filter((e) => {
        return dayjs(e.dt * 1000).isBetween(startTime, endTime, 'minute', '[]')
    }).map((e) => {
        const time = dayjs.tz((e.dt * 1000), weatherData.timezone).format('h A');
        const temp = tempConversion((isCurrentDay ? e.temp : e.main.temp), unit)
        const value = temp;
        return {
            time: time,
            value: value,
        }
    });

    if (graphData.length < 1) {
        return null;
    }

    return (
        <div className='hourly mb-3'>
            <div className="label">
                Hourly Forecast, {startTime.format('D MMM')}
            </div>
            <div className="chart-area">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={graphData}>
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis
                            padding={{ left: 15, right: 15 }}
                            dataKey="time"
                            label={{ value: 'Time', offset: -5, position: 'insideBottom' }}
                        />
                        <YAxis
                            label={{ value: 'Temperature', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={<CustomTooltip/>}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#fff"
                            name="Value"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

const CustomTooltip = ({payload}) => {
    const value = payload[0]?.payload || {};
    return (
        <div className='glass p-2'>
            <div>
                {value.time}
            </div>
            <div>
                {value.value}
            </div>
        </div>
    )
}