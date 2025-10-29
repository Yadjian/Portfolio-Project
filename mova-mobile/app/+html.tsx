import { ScrollViewStyleReset } from 'expo-router/html';

/**
 * Root HTML Layout (+html.tsx)
 *
 * This file is used only for web builds with Expo Router.
 *
 * Main features:
 * - Defines the root HTML structure for every web page (html, head, body).
 * - Adds meta tags for charset, compatibility, and viewport.
 * - Applies a scroll reset so ScrollView behaves like on native.
 * - Injects global CSS to prevent background flicker in dark mode.
 * - Allows adding global <head> elements (fonts, favicon, etc.).
 *
 * Key logic:
 * - Only runs in Node.js/static rendering (never in the browser).
 * - Not used on native mobile builds.
 */

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
