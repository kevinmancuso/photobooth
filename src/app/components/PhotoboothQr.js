"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../css/photobooth-print.css';
import { QRCodeSVG } from 'qrcode.react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import app from '../lib/firebase';

const Photoboothqr = ({ data }) => {
  const [downloadURL, setDownloadURL] = useState(null);
  const [storageRef, setStorageRef] = useState(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const uploadToFirebase = async () => {
      try {
        console.log("Uploading QR code to Firebase...");
        
        if (!data) {
          throw new Error("No image data provided");
        }

        const storage = getStorage(app);
        if (!storage) {
          throw new Error("Firebase storage not initialized");
        }

        // Create a unique filename with timestamp
        const filename = `photobooth_qr_${Date.now()}.jpg`;
        const storageRef = ref(storage, filename);

        // Upload the data URL
        await uploadString(storageRef, data, 'data_url');
        const url = await getDownloadURL(storageRef);
        
        setDownloadURL(url);
        setStorageRef(filename);
      } catch (err) {
        console.error("QR Upload Error:", err);
        alert("Error generating QR code. Please try again.");
        window.location.reload();
      }
    };

    uploadToFirebase();
  }, [data]);

  return (
    <div className='print-loader'>
      <div className='print-loader__icon-wrapper'>
        {!downloadURL ? (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>Generating Your QR Code...</h2>
          </div>
        ) : (
          <div className='print-loader__icon-success'>
            <span></span>
            <h2>Scan to Download Your Photo</h2>
            <div className="qr-wrapper" style={{ marginTop: '20px', textAlign: 'center' }}>
              <QRCodeSVG value={`${window.location.origin}/download/${storageRef}`} size={220} />
              <p style={{ marginTop: '10px', color: '#fff' }}>
                Scan with your phone camera to download
              </p>
              <button
                style={{
                  marginTop: '24px',
                  padding: '12px 24px',
                  fontSize: '1.1em',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#fff',
                  color: '#000',
                  cursor: 'pointer'
                }}
                onClick={() => window.location.reload()}
              >
                Return to the Party
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photoboothqr;
