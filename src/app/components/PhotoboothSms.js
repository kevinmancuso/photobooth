"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../css/photobooth-print.css';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import app from '../lib/firebase';
const Photoboothsms = ({ data }) => {
  const [status, setStatus] = useState('uploading'); // "uploading", "sending", "done", "error"
  const [downloadURL, setDownloadURL] = useState(null);
  const hasRunRef = useRef(false); // 🛑 Prevent duplicate execution

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const uploadToFirebase = async () => {
      try {
        console.log("Uploading SMS image to Firebase...");
        const storage = getStorage(app);
        if (!storage) {
          throw new Error("Firebase storage not initialized");
        }        const storageRef = ref(storage, 'photobooth_sms_' + Date.now());
        await uploadString(storageRef, data, 'data_url');
        const url = await getDownloadURL(storageRef);
        setDownloadURL(url);
      } catch (err) {
        console.error("SMS Upload Error:", err);
        alert("Error uploading image for SMS. Please try again.");
        window.location.reload();
      }
    };

    uploadToFirebase();
  }, [data]);

  useEffect(() => {
    if (!downloadURL) return;

    const sendSMS = async () => {
      const phone = prompt("Enter your phone number with no spaces:");
      if (!phone) {
        alert("No phone number entered.");
        return window.location.reload();
      }

      try {
        setStatus('sending');
        sessionStorage.setItem("firebasePath", downloadURL);

        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: phone, imageUrl: downloadURL })
        });

        const result = await response.json();
        if (result.success) {
          setStatus('done');
          setTimeout(() => window.location.reload(), 4000);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error("SMS error:", err);
        alert("Failed to send SMS.");
        setStatus('error');
        setTimeout(() => window.location.reload(), 3000);
      }
    };

    sendSMS();
  }, [downloadURL]);

  return (
    <div className='print-loader'>
      <div className='print-loader__icon-wrapper'>
        {status === 'uploading' && (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>Uploading Your Photo...</h2>
          </div>
        )}
        {status === 'sending' && (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>Sending Your Text...</h2>
          </div>
        )}
        {status === 'done' && (
          <div className='print-loader__icon-success'>
            <span></span>
            <h2>Photo Sent Successfully!<br />Get Back to Dancing.</h2>
          </div>
        )}
        {status === 'error' && (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>Something went wrong. Try again.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photoboothsms;
