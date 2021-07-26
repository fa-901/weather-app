import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import AppContext from '../AppContext';
import List from './List';
import _ from 'lodash';

export default function SearchBar(props) {
    const [location, setLoc] = useState('');
    const inputRef = useRef(null);
    const [loading, setLoad] = useState(false);
    const [showList, toggleShow] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [cityList, setList] = useState([]);
    const debounceLoadData = useCallback(_.debounce(getSuggests, 500), []);
    const context = useContext(AppContext);

    /** TODO: abort all previous API calls when weather data is loading */
    // var controller = new AbortController();
    // var signal = controller.signal;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLocationData, (error) => {
                setErrMsg(`Error: ${error.message}. Try searching manually.`);
            });
        }
        document.addEventListener("mousedown", handleClickOutside, false);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside, false);
        };
    }, []);

    function getLocationData(position) {
        const { latitude, longitude } = position.coords;
        const locationStr = `${encodePlusMinus(latitude)}${_.round(latitude, 4)}${encodePlusMinus(longitude)}${_.round(longitude, 4)}`;
        const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&location=${locationStr}&sort=-population`;
        context.toggleDataLoad(true);
        fetch(url)
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(data => {
                loadWeatherData(data.data[0]?.city, data.data[0]?.country, { lat: latitude, lng: longitude })
            })
            .catch(err => { console.log(err); });;
    }

    function encodePlusMinus(num) {
        return encodeURIComponent(num >= 0 ? '+' : '-');
    }

    function getSuggests(val) {
        if (!val) {
            setList([]);
            return
        }
        const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${val}&sort=name,countryCode`;
        fetch(url)
            .then(response => {
                setLoad(false);
                return response.ok ? response.json() : Promise.reject(response)
            })
            .then(data => { toggleShow(true); setList(data?.data || []) })
            .catch(err => { console.log(err); });
    }

    function inputChange(e) {
        const { value } = e.currentTarget;
        setLoc(value);
        setLoad(true);
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

    function loadWeatherData(_city, _country, _coords) {
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${_coords.lat}&lon=${_coords.lng}&exclude=minutely,alerts&appid=${process.env.API_KEY}&units=metric`;
        const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${_coords.lat}&lon=${_coords.lng}&appid=${process.env.API_KEY}&units=metric`;
        context.toggleDataLoad(true);
        fetch(url)
            .then(response => {
                setLoad(false);
                if (response.ok) {
                    return response.json()
                }
                else {
                    return Promise.reject(`Error: Data for "${location}" is not available.`)
                }
            })
            .then(data => {
                data.location = [_city, _country].join(', ')
                context.setWeatherData(data);
            })
            .catch(err => { setErrMsg(err); context.setWeatherData(null) })
            .finally(() => {
                context.toggleDataLoad(false);
            });

        fetch(hourlyUrl)
            .then(response => {
                setLoad(false);
                if (response.ok) {
                    return response.json()
                }
                else {
                    return Promise.reject(`oops.`)
                }
            })
            .then(data => {
                context.setHourlyData(data);
            })
            .catch(err => { });
    }

    const errDisplay = errMsg && (
        <div className="text-center text-error fw-bold">
            {/* <i className="fas fa-dizzy me-2"></i> */}
            {errMsg}
        </div>
    )

    return (
        <div className='search-input' ref={inputRef}>
            <div className='input-glass d-flex mb-1'>
                <input
                    className='flex-fill'
                    placeholder='Search by city...'
                    type="text"
                    onChange={inputChange}
                    onFocus={() => { toggleShow(true); setErrMsg(null); }}
                    value={location}
                // onKeyDown={keyDownFn}
                />
                <div className='border-start ps-2'>
                    <i className={`align-middle ${loading ? 'fas fa-spinner fa-spin' : "fas fa-search-location"}`}></i>
                </div>
            </div>
            {errDisplay}
            <List
                list={cityList}
                show={showList}
                onClick={(e, country, coords) => { setLoc(e); toggleShow(false); loadWeatherData(e, country, coords) }}
            />
        </div>
    )
}