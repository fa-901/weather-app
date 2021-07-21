import React, { useState } from 'react';

const AppContext = React.createContext();

export const AppProvider = (props) => {
    const [weatherData, setWeatherData] = useState(null);

    return (
        <AppContext.Provider value={{weatherData, setWeatherData}} >
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext;
