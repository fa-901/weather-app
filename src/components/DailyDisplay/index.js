import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { tempConversion } from '../../utils/functions';

dayjs.extend(utc)
dayjs.extend(timezone)

export default function DisplayDisplay(props) {
    const context = useContext(AppContext);
    const [activeIndex, setActive] = useState(0);


    if (!context.weatherData) {
        return null;
    }

    const { weatherData, unit } = context;

    const dailyList = weatherData.daily.map((e, i) => {
        const time = dayjs.tz((e.dt * 1000), weatherData.timezone).format('MMM D')
        return (
            <div className='col-md' key={e.dt}>
                <div className={`daily-detail ${activeIndex === i && 'active'}`} onClick={() => { setActive(i) }}>
                    <div className="date">
                        {time}
                    </div>
                    <span className="max me-2">
                        {Math.round(tempConversion(e.temp.max, unit))}&deg;
                    </span>
                    <span className="min">
                        {Math.round(tempConversion(e.temp.min, unit))}&deg;
                    </span>
                    <div className="desc">
                        {e.weather[0].main}
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className='daily'>
            <div className='label'>
                Daily Forecast
            </div>
            <div className='row g-2'>
                {dailyList}
            </div>
        </div>
    )
}