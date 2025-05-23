"use client";

import React, { useState, useEffect } from 'react';
import '../css/photobooth-preview.css';
import { WebcamCapture } from './Webcam';
import Photoboothprint from './PhotoboothPrint.js';
import Photoboothsms from './PhotoboothSms.js';
import PhotoboothtakeShot from './PhotoboothTakeShot.js';

import Photoboothqr from './PhotoboothQr.js';
import Image from 'next/image';

const Photoboothpreview = ({ data }) => {
    const [redirectToCamera, setRedirect] = useState(false);
    const [finalImage, setFinalImage] = useState('');
    const [step, setStep] = useState('preview'); // "preview", "print", "sms", "qr"

    const userOption = sessionStorage.getItem("userOptions"); // 'print' | 'text' | 'qrCode'


    useEffect(() => {
        // Use the original image data directly
        setFinalImage(data.photoData);
    }, [data.photoData]);

    if (redirectToCamera) return <WebcamCapture />;

    if (step === 'print') {
        return <Photoboothprint data={finalImage} />;
    }

    if (step === 'sms') {
        return <Photoboothsms data={finalImage} />;
    }

    if (step === 'takeShot') {
        return <PhotoboothtakeShot data={finalImage} />;
    }

    if (step === 'qr') {
        return <Photoboothqr data={finalImage} />;
    }

    const handleSubmit = () => {
        if (userOption === 'qrCode') setStep('qr');
        else if (userOption === 'text') setStep('sms');
        else if (userOption === 'takeShot') setStep('takeShot');
        else setStep('print');
    };

    return (
        <div className='preview-container'>
            <div className='preview-container__print-preview-wrapper' id="print-preview">
                <div className='preview-container__print-preview' id="film-strip">
                    <Image
                        width={259}
                        height={992}    
                        alt="Photobooth"
                        src={data.photoData}
                        unoptimized
                    />
                </div>
            </div>

            <div className='preview-container__preview'>
                <button className='preview-container__preview-back' onClick={() => setRedirect(true)} />
                <div className='preview-container__preview-container'>
                    <Image
                        width={259}
                        height={992}  
                        alt="Photobooth"
                        src={data.photoData}
                        unoptimized
                    />
                    <div className='title'>Love It Or Hate It? <br />We Won&apos;t Judge.</div>
                </div>
                <button className='preview-container__preview-print' onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Photoboothpreview;
