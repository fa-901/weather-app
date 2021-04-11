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



    return (
        <div>
            <input 
                className='glass'
                type="text"
                onChange={()=>{}}
            />
        </div>
    )
}