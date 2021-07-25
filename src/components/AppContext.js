import React, { useState } from 'react';

const AppContext = React.createContext();

export const AppProvider = (props) => {
    const [weatherData, setWeatherData] = useState(null);
    const [dataLoading, toggleDataLoad] = useState(null);
    const [unit, toggleUnit] = useState('C');

    const contextProperties = {
        weatherData,
        setWeatherData,
        dataLoading,
        toggleDataLoad,
        unit,
        toggleUnit,
    }

    return (
        <AppContext.Provider value={contextProperties} >
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext;
