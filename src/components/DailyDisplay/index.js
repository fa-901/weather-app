import React, { useEffect, useState, useContext, Fragment } from 'react';
import AppContext from '../AppContext';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { tempConversion } from '../../utils/functions';

import HourlyDisplay from './HourlyDisplay';
import WeatherIcon from '../Common/WeatherIcon';

dayjs.extend(utc)
dayjs.extend(timezone)

export default function DailyDisplay(props) {
    const context = useContext(AppContext);
    const [activeIndex, setActive] = useState(0);


    if (!context.weatherData) {
        return null;
    }

    const { weatherData, unit } = context;

    const dailyList = weatherData.daily.slice(0, 5).map((e, i) => {
        const time = dayjs.tz((e.dt * 1000), weatherData.timezone).format('MMM D')
        return (
            <div className='col-md' key={e.dt}>
                <div className={`daily-detail ${activeIndex === i && 'active'}`} onClick={() => { setActive(i) }}>
                    <div className="date">
                        {time}
                    </div>
                    <div>
                        <WeatherIcon className={'daily-icon my-2'} icon={e.weather[0].icon} />
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

    if (context.dataLoading) {
        return null;
    }

    return (
        <Fragment>
            <div className='daily mb-4'>
                <div className='label mb-2'>
                    Daily Forecast
                </div>
                <div className='row g-3'>
                    {dailyList}
                </div>
            </div>
            <HourlyDisplay skip={activeIndex} />
        </Fragment>
    )
}