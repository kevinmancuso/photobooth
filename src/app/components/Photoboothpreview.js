"use client";

import React, { useState, useEffect } from 'react';
import '../css/photobooth-preview.css';
import domtoimage from 'dom-to-image';
import { WebcamCapture } from './Webcam';
import Photoboothprint from './PhotoboothPrint.js';
import Photoboothsms from './PhotoboothSms.js';
import Photoboothqr from './PhotoboothQr.js';


const Photoboothpreview = ({ data }) => {
    const [redirectToCamera, setRedirect] = useState(false);
    const [finalImage, setFinalImage] = useState('');
    const [step, setStep] = useState('preview'); // "preview", "print", "sms", "qr"

    const userOption = sessionStorage.getItem("userOptions"); // 'print' | 'text' | 'qrCode'

    useEffect(() => {
        setTimeout(async () => {
            const node = document.getElementById("film-strip");
            const jpeg = await domtoimage.toJpeg(node);
            setFinalImage(jpeg);
        }, 50);
    }, []);

    if (redirectToCamera) return <WebcamCapture />;

    if (step === 'print') {
        return <Photoboothprint data={finalImage} />;
    }

    if (step === 'sms') {
        return <Photoboothsms data={finalImage} />;
    }

    if (step === 'qr') {
        return <Photoboothqr data={finalImage} />;
    }

    const handleSubmit = () => {
        if (userOption === 'qrCode') setStep('qr');
        else if (userOption === 'text') setStep('sms');
        else setStep('print');
    };

    return (
        <div className='preview-container'>
            <div className='preview-container__print-preview-wrapper' id="print-preview">
                <div className='preview-container__print-preview' id="film-strip">
                    <img alt="Photobooth" src={data.photoData} />
                    {/* <img alt="Photobooth" src={data.photoData} /> */}
                </div>
            </div>

            <div className='preview-container__preview'>
                <button className='preview-container__preview-back' onClick={() => setRedirect(true)} />
                <div className='preview-container__preview-container'>
                    <img alt="Photobooth" src={data.photoData} />
                    <div className='title'>Love It Or Hate It? <br />We Won’t Judge.</div>
                </div>
                <button className='preview-container__preview-print' onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Photoboothpreview;
