import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import SearchBar from './SearchBar';

export default function App(props) {

    return (
        <AppProvider>
            <div className='d-flex flex-column h-100'>
                <div className='p-2'>
                    <SearchBar />
                </div>
                <div className="text-center mt-auto footer">
                    Created by <a className='text-r' href="https://github.com/fa-901" rel='noopener noreferrer' target="_blank">fa-901</a>
                </div>
            </div>
        </AppProvider>
    )
}