import React from 'react';

export default function MovaLogo({ size = 120 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: 'linear-gradient(90deg, #6746a8, #6b25f9, #07b9ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #fff',
        margin: '0 auto 24px auto',
      }}
    >
      <span style={{
        fontWeight: 'bold',
        color: '#fff',
        fontSize: size * 0.32,
        fontFamily: 'sans-serif',
        letterSpacing: 2,
      }}>
        Mova
      </span>
    </div>
  );
}