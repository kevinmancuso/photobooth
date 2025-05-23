"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from "react-webcam";
import domtoimage from 'dom-to-image';
import '../css/webcam.css';
import Photoboothpreview from '../components/Photoboothpreview.js';
import Image from 'next/image';

const beep = "/sounds/beep.mp3";
const shutter = "/sounds/shutter.mp3";
const logo = '/img/wedding-icon-v2.png';

const isOfflineMode = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';

const videoConstraints = {
  facingMode: "user",
};

export const WebcamCapture = () => {
  const list = document.getElementsByClassName("app-container");
  if (list[0]) list[0].classList.add("app-container_no-border");

  const [filmStrip, setStripImage] = useState([]);
  const webcamRef = useRef(null);
  const [photo, photoset] = useState(0);
  const [redirctTo, setRedirctTo] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

  const hasStartedRef = useRef(false);
  const totalCaptured = useRef(0);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setStripImage(prev => [...prev, { img: imageSrc }]);
  }, []);

  const handleFinalImage = async (dataUrl) => {
    if (isOfflineMode) {
      // Create a download link for the image
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `photobooth-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setRedirctTo(true);
    } else {
      // Online mode - upload to Firebase
      // const storage = getStorage(firebaseApp);
      // const storageRef = ref(storage, 'photobooth' + Date.now());
      // await uploadString(storageRef, dataUrl, 'data_url');
      // sessionStorage.setItem("firebasePath", storageRef._location.path_);
      setRedirctTo(true);
    }
  };

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const startCountdown = () => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        new Audio(beep).play();

        const appBg = document.getElementsByClassName("app");
        appBg[0]?.classList.remove("app-flash");

        document.querySelectorAll("span[data-counter]").forEach(span => span.classList.remove("active"));
        document.querySelector(`span[data-counter="${count}"]`)?.classList.add("active");

        if (count === 3) {
          clearInterval(interval);
          new Audio(shutter).play();
          document.querySelector(".app")?.classList.add("app-flash");
          document.querySelector(".icon")?.classList.add("active");
          document.querySelector(".webcam-img")?.classList.add("active");

          capture();
          totalCaptured.current += 1;

          if (totalCaptured.current < 4) {
            setTimeout(() => startCountdown(), 1500);
          } else {
            setTimeout(async () => {
              appBg[0]?.classList.remove("app-flash");

              const node = document.getElementById("film-strip");
              const dataUrl = await domtoimage.toJpeg(node);
              photoset(dataUrl);
              await handleFinalImage(dataUrl);
            }, 1500);
          }
        }
      }, 1000);
    };

    setTimeout(() => {
      if (document.querySelector('.webcam-img video')) {
        startCountdown();
      }
    }, 1000);
  }, [capture]);

  const myData = {
    photoData: photo
  };

  if (redirctTo) {
    return <Photoboothpreview data={myData} />;
  }
  return (
    <div className='photobooth-container__content'>
      <div className="nav">
        <span data-counter="1" className='active'>3</span>
        <span data-counter="2">2</span>
        <span data-counter="3">1</span>
      </div>
      <div className="webcam-container">
        <div className="webcam-img">
          <Webcam
            audio={false}
            height={637}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={572.13}
            videoConstraints={videoConstraints}
            onUserMediaError={(err) => {
              console.error("Webcam error:", err);
              setWebcamError("Unable to access webcam. Please ensure you have granted camera permissions and try again.");
            }}
          />
          {webcamError && (
            <div className="webcam-error" style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
              {webcamError}
            </div>
          )}
        </div>
        <button onClick={(e) => {
          e.preventDefault();
          capture();
        }} className="webcam-btn">Capture</button>

        <div className="film-strip-preview" id="film-strip-preview">
          {filmStrip.map((strip, index) => (
            <li key={index}>
              <Image
                width={490}
                height={367}
                alt="Photobooth"
                src={strip.img}
                unoptimized
              />
            </li>
          ))}
        </div>

        {/* aspect-ratio: auto 725 / 655; */}

        <div className='film-strip_wrapper-preview'>
          <div className='film-strip_wrapper' id="film-strip">
            <div className="film-strip">
              {filmStrip.map((strip, index) => (
                <li key={index}>
                  <Image
                    width={490}
                    height={367}
                    alt="Photobooth"
                    src={strip.img}
                    unoptimized
                  />
                </li>
              ))}
              <li key='logo'>
                <Image
                  width={400}
                  height={500}
                  alt="Photobooth"
                  src={logo}
                  unoptimized
                />
              </li>
            </div>
          </div>
        </div>
      </div>
      <div className="icon"></div>
      <div className="title">Smile for the newly weds</div>
    </div>
  );
};