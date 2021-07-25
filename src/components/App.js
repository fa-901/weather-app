import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import SearchBar from './SearchBar';
import Display from './Display';
import DailyDisplay from './DailyDisplay';

export default function App(props) {

    return (
        <AppProvider>
            <div className='d-flex flex-column container-md'>
                <div className=''>
                    <SearchBar />
                    <Display />
                    <DailyDisplay />
                </div>
                <div className="text-center mt-auto mb-2 footer">
                    Created by <a className='text-r' href="https://github.com/fa-901" rel='noopener noreferrer' target="_blank">fa-901</a>
                </div>
            </div>
        </AppProvider>
    )
}