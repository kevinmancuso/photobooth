"use client";

import React, { useState, useEffect } from 'react';
import '../css/splash-screen.css';
import PhotoboothScreen from './Photoboothscreen.js';

function SplashScreen() {
    const [count, setCount] = useState(false);
    const [lastPrintCount, setLastPrintCount] = useState(0);

    useEffect(() => {
        const stored = sessionStorage.getItem("printerCounter");
        if (stored) {
            setLastPrintCount(parseInt(stored));
        }
    }, []);

    function qrCode() {
        setCount(true);
        sessionStorage.setItem("userOptions", "qrCode");
    }

    function textMessage() {
        setCount(true);
        sessionStorage.setItem("userOptions", "text");
    }

    function print() {
        setCount(true);
        sessionStorage.setItem("userOptions", "print");
    }

    function resetPaperCounter() {
        sessionStorage.setItem("printerCounter", 1);
        alert('Printer was restocked. Counter was successfully reset.');
        window.location.reload();
    }

    const buttonActive = lastPrintCount > 2 ? 'disabled' : '';

    if (!count) {
        return (
            <div className="splash">
                <div className="splash-container">
                    <div className="splash-container__content">
                        <div className='logo' onClick={resetPaperCounter}>{count}</div>
                        <div className='title'>Grab a prop <span>&</span> strike an awesome pose</div>
                        <div className='buttons'>
                            <button className='button' onClick={qrCode}>QR Code</button>
                            <span>Or</span>
                            <button className='button' onClick={textMessage}>Text</button>
                            <span>Or</span>
                            <button className={"button " + buttonActive} onClick={print}>Print</button>
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
