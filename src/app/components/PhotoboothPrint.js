"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../css/photobooth-print.css';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const Photoboothprint = ({ data }) => {
  const [loadingResults, setLoading] = useState(true);
  const [loadingResultsDoneRedirect, setLoadingRedirectDone] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const hasRunRef = useRef(false); // Prevent double print in dev

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const uploadToFirebase = async () => {
      try {
        console.log("Uploading print image to Firebase...");
        const storage = getStorage();
        const storageRef = ref(storage, 'photobooth_print_' + Date.now());
        await uploadString(storageRef, data, 'data_url');
        const url = await getDownloadURL(storageRef);
        setDownloadURL(url);
      } catch (err) {
        console.error("Print Upload Error:", err);
        alert("Error uploading image for print. Please try again.");
        window.location.reload();
      }
    };

    uploadToFirebase();
  }, [data]);

  useEffect(() => {
    if (!downloadURL) return;
    (async () => {
      const printJS = (await import('print-js')).default;

      printJS({
        printable: [downloadURL],
        type: 'image',
        header: '',
        style: '@page {size: 4in 7in; margin: 0;} body {background-color: #fff;}',
        imageStyle: 'padding-top: 1in; margin: 0 auto; width:100%;max-width:4in;height:100%;max-height:6.75in;',
        scanStyles: true,
        onLoadingStart: () => console.log('Printing...'),
        onLoadingEnd: () => console.log('Loaded.'),
        onPrintDialogClose: () => {
          setLoading(false);
          setTimeout(() => setLoadingRedirectDone(true), 3000);
        },
      });
    })();
  }, [downloadURL]);

  if (loadingResultsDoneRedirect) {
    function sendCounter() {
      let count = parseInt(sessionStorage.getItem("printerCounter")) || 0;
      count += 1;
      sessionStorage.setItem("printerCounter", count);

      const notifyPhoneNumbers = ["+16316174271", "+17177136357"];

      if (count === 19) {
        alert('Paper needs refilling!');
        notifyPhoneNumbers.forEach(phone => {
          fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: phone,
              imageUrl: "",
              body: "📟 Alert: The photo booth printer is low on paper. Please refill ASAP."
            })
          });
        });

        setTimeout(() => window.location.reload(), 1500);
      } else {
        window.location.reload();
      }
    }

    return <div>{sendCounter()}</div>;
  }

  return (
    <div className='print-loader'>
      <div className='print-loader__icon-wrapper'>
        {loadingResults ? (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>{!downloadURL ? "Preparing Your Print..." : "Perfection Takes A Moment."}</h2>
          </div>
        ) : (
          <div className='print-loader__icon-success'>
            <span></span>
            <h2>Your Photo Was Printed<br />Get Back To Dancing.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photoboothprint;
