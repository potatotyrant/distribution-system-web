const theme = {
  colors: {
    black: "#0a0a0a",
    white: "#FFFFFF",
    gray: {
      25: "#f6f6f6",
      50: "#eaeaea",
      100: "#cacaca",
      // 200: "#b0b0b0",
      300: "#8a8a8a",
      400: "#6a6a6a",
      500: "#4a4a4a",
      600: "#3a3a3a",
      // 700: "#2a2a2a",
      800: "#1a1a1a",
      // 900: "#0a0a0a",
    },
    // Key name kept. Values are the Audioguys orange accent (was purple).
    purple: {
      50: "#fff1eb",
      100: "#ffd8c8",
      // 200: "#ffb59a",
      // 300: "#ff8d66",
      // 400: "#ff7043",
      // 500: "#f2592a",
      600: "#f2592a",
      700: "#d4461b",
      800: "#a33312",
      // 900: "#6e210c",
    },
    red: {
      50: "#fff0f1",
      // 100: "#ffd6da",
      // 200: "#ffb3bb",
      300: "#ff9caa",
      400: "#f47c8c",
      500: "#e5484d",
      600: "#d0313a",
      // 700: "#b4232c",
      // 800: "#8f1820",
    },
    green: {
      // 50: "#f3fff8",
      100: "#e7fff4",
      // 200: "#b6f5d4",
      // 300: "#4fe699",
      // 400: "#2ed889",
      // 500: "#14b56a",
      600: "#0e9a56",
      // 700: "#0b7a44",
      // 800: "#085c34",
    },
    blue: {
      50: "#eef2ff",
      // 100: "#d5defc",
      // 200: "#b7c6fb",
      // 300: "#8aa4f8",
      // 400: "#5d82f5",
      500: "#2f5bff",
      600: "#1d3fd6",
      // 700: "#1632a8",
      // 800: "#102478",
    },
  },
  fonts: {
    title1: {
      semibold: `
        font-size: 28px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 28px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 28px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    title2: {
      semibold: `
        font-size: 24px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 24px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 24px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    heading1: {
      semibold: `
        font-size: 22px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 22px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 22px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    heading2: {
      semibold: `
        font-size: 20px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 20px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 20px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    heading3: {
      semibold: `
        font-size: 18px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 18px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 18px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    heading4: {
      semibold: `
        font-size: 17px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 17px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 17px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    body1: {
      semibold: `
        font-size: 16px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 16px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 16px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    body2: {
      semibold: `
        font-size: 15px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 15px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 15px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    label1: {
      semibold: `
        font-size: 14px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 14px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 14px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    label2: {
      semibold: `
        font-size: 13px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 13px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 13px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    caption1: {
      semibold: `
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 600;
      `,
      medium: `
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 500;
      `,
      regular: `
        font-size: 12px;
        line-height: 1.4;
        letter-spacing: -0.01em;
        font-weight: 400;
      `,
    },
    // Regular only. MD System Mono has no Hangul, so Korean glyphs fall through to Pretendard.
    mono: `
      font-family: "MD System Mono", "Fragment Mono", ui-monospace, monospace, var(--font-pretendard), sans-serif;
      font-weight: 400;
      font-style: normal;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    `,
  },
};

export default theme;
