"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../css/photobooth-print.css';
import { QRCodeSVG } from 'qrcode.react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const Photoboothqr = ({ data }) => {
  const [downloadURL, setDownloadURL] = useState(null);
  const hasRunRef = useRef(false); // Prevent double upload in dev

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const uploadToFirebase = async () => {
      try {
        console.log("Uploading QR code to Firebase...");
        
        const storage = getStorage();
        const storageRef = ref(storage, 'photobooth_qr_' + Date.now());
        await uploadString(storageRef, data, 'data_url');
        const url = await getDownloadURL(storageRef);
        setDownloadURL(url);
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
              <QRCodeSVG value={downloadURL} size={220} />
              <p style={{ marginTop: '10px', color: '#fff' }}>
                Use your phone camera to download the photo
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
