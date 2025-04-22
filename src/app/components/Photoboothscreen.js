"use client";

import React, { useState } from 'react';
import '../css/photobooth-screen.css'
import { WebcamCapture } from './Webcam'

function Photobooth() {
    return (
        <div className="photobooth">
            <div className="photobooth-container">
                <WebcamCapture />
            </div>
        </div>
    );
}
export default Photobooth;