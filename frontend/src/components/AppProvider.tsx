import React, { Suspense } from "react";
import { createGlobalStyle } from "styled-components/macro";
import { normalize } from "polished";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.StrictMode>
      <GlobalStyles />
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </React.StrictMode>
  );
}

const GlobalStyles = createGlobalStyle`
  ${normalize()}

  html,body,#root {
    min-height: 100%;
  }

  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }

  body {
    --window-height: 100vh;
  }
`;
