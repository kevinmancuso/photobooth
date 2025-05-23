"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function DownloadPage() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        throw new Error(`Fetch failed: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const triggerDownload = (blob, fileName) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl); // Clean up immediately
  };

  useEffect(() => {
    const downloadImage = async () => {
      try {
        setIsDownloading(true);
        const response = await fetchWithRetry(`/api/get-image?id=${params.id}`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        triggerDownload(blob, `photobooth-photo-${params.id}`);
      } catch (error) {
        console.error('Download error:', error);
        setError(error.message || 'Failed to load image. Please try again.');
      } finally {
        setIsDownloading(false);
      }
    };

    if (params.id) {
      downloadImage();
    }
  }, [params.id]);

  const handleManualDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetchWithRetry(`/api/get-image?id=${params.id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();
      triggerDownload(blob, `photobooth-photo-${params.id}`);
    } catch (error) {
      console.error('Manual download error:', error);
      setError('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: '#000',
        color: '#fff',
        fontFamily: 'sans-serif',
        gap: '20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
          margin: '0',
          lineHeight: '1.2',
        }}
      >
        {isDownloading ? 'Downloading your photo...' : 'Photo Ready'}
      </h1>

      {error && (
        <p
          style={{
            color: '#ff6b6b',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            maxWidth: '600px',
            margin: '0',
          }}
        >
          Error: {error}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <button
          onClick={handleManualDownload}
          disabled={isDownloading}
          style={{
            padding: '12px 24px',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            borderRadius: '8px',
            border: 'none',
            background: isDownloading ? '#666' : '#8bffa1',
            color: isDownloading ? '#999' : '#000',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '200px',
          }}
          onMouseOver={(e) =>
            isDownloading ? null : (e.target.style.background = '#66b975')
          }
          onMouseOut={(e) =>
            isDownloading ? null : (e.target.style.background = '#8bffa1')
          }
        >
          {isDownloading ? 'Downloading...' : 'Download Photo'}
        </button>

        Return to the Party!
        {/* <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 24px',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            borderRadius: '8px',
            border: '2px solid #8bffa1',
            background: 'transparent',
            color: '#8bffa1',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '200px',
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#8bffa1';
            e.target.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#8bffa1';
          }}
        >
          Return to Photo Booth
        </button> */}
      </div>
    </div>
  );
}