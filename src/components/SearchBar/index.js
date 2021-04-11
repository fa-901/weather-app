import React, { useEffect, useState } from 'react';

export default function SearchBar(props) {
    const [location, setLoc] = useState('');

    useEffect(() => {
        console.log(process.env.API_KEY)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }, []);

    function showPosition(position) {
        console.log(position)
    }

    function getSuggests() {
        const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${location}&sort=name,countryCode`;
        console.log(url)
    }



    return (
        <div>
            <input
                className='input-glass'
                placeholder='Search by city...'
                type="text"
                onChange={() => { }}
            />
        </div>
    )
}