import React, { useEffect, useState, useCallback, Fragment } from 'react';
import _ from 'lodash';

export default function SearchBar(props) {
    const [location, setLoc] = useState('');
    const [loading, setLoad] = useState(false);
    const [cityList, setList] = useState([]);
    const debounceLoadData = useCallback(_.debounce(getSuggests, 750), []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }, []);

    function showPosition(position) {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`
        fetch(url)
            .then(response => response.json())
            .then(data => { });
    }

    function getSuggests(val) {
        if (!val) {
            setList([]);
            return
        }
        setLoad(true);
        const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${val}&sort=name,countryCode`;
        fetch(url)
            .then(response => { setLoad(false); return response.json() })
            .then(data => { setList(data?.data || []) });
    }

    function inputChange(e) {
        const { value } = e.currentTarget;
        setLoc(value);
        debounceLoadData(value);
    }

    const list = cityList.map((e) => {
        return (
            <li key={e.id} className={`list-group-item`}>
                <div className={``}>{e.city}</div>
                <div className={``}>{e?.region}, {e?.country}</div>
            </li>
        )
    })

    const ul = (
        <ul className='list-group city-list'>
            {list}
        </ul>
    )

    return (
        <Fragment>
            <div className='input-glass d-flex mb-1'>
                <input
                    className='flex-fill'
                    placeholder='Search by city...'
                    type="text"
                    onChange={inputChange}
                />
                <div className='border-start ps-2'>
                    <i className={loading ? 'spinner-border spinner-border-sm' : "fas fa-search-location"}></i>
                </div>
            </div>
            {list.length > 0 && ul}
        </Fragment>
    )
}