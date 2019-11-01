import React from 'react';
import stars from '../assets/astrobase.gif';

// the Home page
export function Home() {

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Explore Your Sky!
                </h1>

                <img src={stars} className="App-logo" alt="logo" />

                Images automatically annotated by astrometry.net with
                <a
                    className="App-link"
                    href="http://uilennest.net:81/astrobase/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    AstroBase
                </a>
            </header>
        </div>
    );
}