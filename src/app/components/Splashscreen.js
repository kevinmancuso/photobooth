"use client";

import React, { useState } from 'react';
import '../css/splash-screen.css';
import PhotoboothScreen from './Photoboothscreen.js';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';

function SplashScreen() {
    const [count, setCount] = useState(false);

    function qrCode() {
        setCount(true);
        sessionStorage.setItem("userOptions", "qrCode");
    }

    function takeShot() {
        setCount(true);
        sessionStorage.setItem("userOptions", "takeShot");
    }

    function resetPaperCounter() {
        sessionStorage.setItem("printerCounter", 1);
        alert('Printer was restocked. Counter was successfully reset.');
        window.location.reload();
    }

    if (!count) {
        return (
            <div className="splash">
                <div className="splash-container">
                    <div className="splash-container__content">
                        <div className='logo' onClick={resetPaperCounter}>{count}</div>
                        <div className='title'>Grab a prop <span>&</span> strike an awesome pose</div>
                        <div className='buttons'>
                            {isOfflineMode ? (
                                <button className='button' onClick={takeShot}>Take a Shot</button>
                            ) : (
                                <button className='button' onClick={qrCode}>QR Code</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <PhotoboothScreen />;
    }
}

export default SplashScreen;
