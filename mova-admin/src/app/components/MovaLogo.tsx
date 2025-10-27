import React from 'react';

export default function MovaLogo({ size = 120 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: 'linear-gradient(135deg, #5546CC, #4930a3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(73, 48, 163, 0.3)',
      }}
    >
      <span style={{
        fontWeight: 'bold',
        color: '#fff',
        fontSize: size * 0.32,
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: 1,
      }}>
        Mova
      </span>
    </div>
  );
}