"use client";

import React, { useState, useEffect, useRef } from 'react';
import '../css/photobooth-print.css';

const Photoboothqr = ({ }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  }, []);

  return (
    <div className='print-loader'>
      <div className='print-loader__icon-wrapper'>
        {isProcessing ? (
          <div className='print-loader__icon-loading'>
            <span></span>
            <h2>Processing Your Photo...</h2>
          </div>
        ) : (
          <div className='print-loader__icon-success'>
            <span></span>
            <h2>The wedding couple will love this!</h2>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ marginTop: '10px', color: '#fff' }}>
                Your photo has been saved
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
                Take Another Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photoboothqr;
