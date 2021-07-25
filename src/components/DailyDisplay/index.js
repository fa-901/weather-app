import React, { useEffect, useState, useContext, useRef } from 'react';
import AppContext from '../AppContext';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(timezone)

export default function DisplayDisplay(props) {
    const context = useContext(AppContext);
    const [activeIndex, setActive] = useState(0);


    if (!context.weatherData) {
        return null;
    }

    const { weatherData } = context;

    const dailyList = weatherData.daily.map((e, i) => {
        return (
            <div className='col-md' key={e.dt}>
                <div className={`daily-detail ${activeIndex === i && 'active'}`} onClick={() => { setActive(i) }}>
                    <span className="max me-2">
                        {Math.round(e.temp.max)}&deg;
                    </span>
                    <span className="min">
                        {Math.round(e.temp.min)}&deg;
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