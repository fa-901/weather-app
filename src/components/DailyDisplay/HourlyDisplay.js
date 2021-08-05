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
    const [attribute, setAttribute] = useState('Temperature');

    const { weatherData, unit, hourlyData } = context;
    const { skip } = props;

    const startTime = dayjs(weatherData.daily[skip].dt * 1000).tz(weatherData.timezone).startOf('day');
    const endTime = startTime.endOf('day');

    const isCurrentDay = skip === 0;
    const dataList = isCurrentDay ? (weatherData.hourly) : (hourlyData?.list || []); /**if on current day, show hourly data from weatherData.hourly instead */
    const graphData = dataList.filter((e) => {
        return dayjs(e.dt * 1000).isBetween(startTime, endTime, 'minute', '[]')
    }).map((e) => {
        const time = dayjs.tz((e.dt * 1000), weatherData.timezone).format('h A');
        const temp = tempConversion((isCurrentDay ? e.temp : e.main.temp), unit)
        const wind = isCurrentDay ? e.wind_speed : e?.wind?.speed;
        const prec = e.pop;
        const value = attribute === 'Temperature' ? temp : attribute === 'Wind' ? wind : prec;
        return {
            time: time,
            value: value,
        }
    });

    if (graphData.length < 1) {
        return null;
    }

    const btnList = ['Temperature', 'Precipitation', 'Wind'].map((e) => {
        return (
            <button className={`btn btn-glass ${(e === attribute) && 'active'}`} key={e} onClick={() => { setAttribute(e) }}>{e}</button>
        )
    });

    const yUnit = attribute === 'Temperature' ? `°${unit}` : attribute === 'Wind' ? 'm/s' : '%';

    const xAxisTicks = []; /**format ticks to 3hour intervals */
    graphData.map((e, i) => {
        const len = graphData.length;
        if ((len > 8) && ((i % 3) === 0)) {
            xAxisTicks.push(e.time);
        }
    })

    return (
        <div className='hourly mb-3'>
            <div className="d-flex justify-content-between align-items-end mb-2">
                <div className="label">
                    Hourly Forecast, {startTime.format('D MMM')}
                </div>
                <div className="btn-group">
                    {btnList}
                </div>
            </div>
            <div className="chart-area">
                <ResponsiveContainer width="100%" aspect={5}>
                    <ComposedChart data={graphData}>
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis
                            padding={{ left: 15, right: 15 }}
                            dataKey="time"
                            label={{ value: 'Time', offset: -5, position: 'insideBottom' }}
                            ticks={xAxisTicks}
                        />
                        <YAxis
                            label={{ value: attribute, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={<CustomTooltip unit={yUnit} />}
                        />
                        <Line
                            isAnimationActive={!context.dataLoading}
                            // type="monotone"
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

const CustomTooltip = ({ payload, unit }) => {
    const value = payload[0]?.payload || {};
    return (
        <div className='chart-tooltip p-2'>
            <div>
                {value.time}
            </div>
            <div>
                {value.value} {unit}
            </div>
        </div>
    )
}