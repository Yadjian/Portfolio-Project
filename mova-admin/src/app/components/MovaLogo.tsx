import React from 'react';

// MovaLogo component:
// Renders a circular brand mark with a diagonal gradient and centered label.
// Props:
//  - size (optional): number controlling the width/height in pixels. Defaults to 120.
export default function MovaLogo({ size = 120 }: { size?: number }) {
  return (
    <div
      // Container: circular shape, gradient background, centered content, and shadow.
      style={{
        width: size,
        height: size,
        borderRadius: size / 2, // ensures a perfect circle based on the provided size
        background: 'linear-gradient(135deg, #5546CC, #4930a3)', // diagonal purple gradient
        display: 'flex', // use flexbox to center the label horizontally and vertically
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px rgba(73, 48, 163, 0.3)', // subtle elevation effect
      }}
    >
      <span style={{
        // Label styles: bold, white text scaled to the container, with a clean sans-serif.
        fontWeight: 'bold',
        color: '#fff',
        fontSize: size * 0.32, // scale text relative to the overall logo size
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: 1,
      }}>
        Mova
      </span>
    </div>
  );
}