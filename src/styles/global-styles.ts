"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: var(--font-pretendard), Pretendard, sans-serif;
    letter-spacing: -0.01em;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fafafa;
    color: #1a1a1a;
    font-synthesis: none;
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 1440px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    #__next {
      max-width: 100%;
      padding: 0 16px;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: inherit;
  }

  p, span, a, li, div {
    font-weight: 400;
    color: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button,
  [role="button"],
  .button {
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, opacity 180ms ease;
  }

  :focus-visible {
    outline: 1px solid #f2592a;
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f6f6f6;
  }
  ::-webkit-scrollbar-thumb {
    background: #cacaca;
    border-radius: 0;
  }

  .react-datepicker {
    font-family: var(--font-pretendard), Pretendard, sans-serif;
    border: 1px solid #eaeaea;
    border-radius: 2px;
    box-shadow: none;
    color: #1a1a1a;
  }

  .react-datepicker__header {
    background: #fafafa;
    border-bottom: 1px solid #eaeaea;
  }

  .react-datepicker__day,
  .react-datepicker__day-name,
  .react-datepicker__current-month {
    color: #1a1a1a;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__time-list-item--selected {
    background-color: #0a0a0a !important;
    color: #fafafa !important;
    border-radius: 2px;
  }

  .react-datepicker__day:hover,
  .react-datepicker__time-list-item:hover {
    border-radius: 2px;
    background-color: #f3f3f3;
  }

  .react-datepicker__triangle {
    display: none;
  }

  .ReactModal__Overlay {
    background-color: rgba(10, 10, 10, 0.72) !important;
  }

  .ReactModal__Content {
    border: 1px solid #eaeaea !important;
    border-radius: 2px !important;
    box-shadow: none !important;
  }

  .ql-toolbar.ql-snow,
  .ql-container.ql-snow {
    border-color: #eaeaea !important;
  }

  .ql-snow .ql-stroke {
    stroke: #3a3a3a;
  }

  .ql-snow .ql-fill {
    fill: #3a3a3a;
  }

  .ql-editor {
    font-family: var(--font-pretendard), Pretendard, sans-serif;
    color: #1a1a1a;
  }
`;
export default GlobalStyles;
