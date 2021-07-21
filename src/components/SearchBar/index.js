import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import AppContext from '../AppContext';
import List from './List';
import _ from 'lodash';

export default function SearchBar(props) {
    const [location, setLoc] = useState('');
    const inputRef = useRef(null);
    const [loading, setLoad] = useState(false);
    const [showList, toggleShow] = useState(false);
    const [cityList, setList] = useState([]);
    const debounceLoadData = useCallback(_.debounce(getSuggests, 500), []);
    const context = useContext(AppContext);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        document.addEventListener("mousedown", handleClickOutside, false);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside, false);
        };
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
            .then(data => { toggleShow(true); setList(data?.data || []) });
    }

    function inputChange(e) {
        const { value } = e.currentTarget;
        setLoc(value);
        debounceLoadData(value);
    }

    function handleClickOutside(e) {
        if (inputRef.current && !inputRef.current.contains(e.target)) {
            toggleShow(false);
        }
    }

    function keyDownFn(e) {
        /**TODO: listen to up/down arrow key presses for list navigation */
        switch (e.key) {
            case 'Enter':
                toggleShow(false);
                loadWeatherData();
                break;
            default:
                break;
        }
    }

    function loadWeatherData(_city, _country) {
        const str = _city ? [_city, _country].join(',') : location;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${str}&appid=${process.env.API_KEY}&units=metric`;
        fetch(url)
            .then(response => {
                setLoad(false);
                if (response.ok) {
                    return response.json()
                }
                else {
                    return Promise.reject(`lol failed ${response.status}`)
                }
            })
            .then(data => { context.setWeatherData(data) })
            .catch(err=>{ console.log(err) });
    }

    return (
        <div className='search-input' ref={inputRef}>
            <div className='input-glass d-flex mb-1'>
                <input
                    className='flex-fill'
                    placeholder='Search by city...'
                    type="text"
                    onChange={inputChange}
                    onFocus={() => { toggleShow(true) }}
                    value={location}
                    onKeyDown={keyDownFn}
                />
                <div className='border-start ps-2'>
                    <i className={loading ? 'fas fa-spinner fa-spin' : "fas fa-search-location"}></i>
                </div>
            </div>
            <List
                list={cityList}
                show={showList}
                onClick={(e, c) => { setLoc(e); toggleShow(false); loadWeatherData(e, c) }}
            />
        </div>
    )
}