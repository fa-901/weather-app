import React, { useEffect } from 'react';

export default function List(props) {

    const list = props.list.map((e) => {
        return (
            <li key={e.id} className={`list-group-item`} onClick={() => { props.onClick(e.city, e.country, { lat: e.latitude, lng: e.longitude })}}>
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

    return ((list.length > 0) && props.show) ? ul : null;
}