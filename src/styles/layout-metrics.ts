/**
 * Shared vertical rhythm for the top bar and the page title.
 * The first sidebar row follows the wordmark instead of matching the title.
 */
export const layout = {
  topBarHeight: 96,
  contentPaddingTop: 8,
  pageHeaderPaddingTop: 42,
  sidebarPaddingTop: 28,
  wordmarkPaddingTop: 8,
  wordmarkFontSize: 19.5,
  wordmarkLineHeight: 1.3,
  wordmarkPaddingBottom: 12,
  sidebarGap: 28,
  /**
   * 500×130 mark, about 8% wider than the rendered wordmark (~197px)
   * and still inside the 272px sidebar content width.
   */
  logoWidth: 214,
  logoHeight: 55.64,
  logoGap: 32,
} as const;

/** Distance from the wordmark's bottom edge to the first menu row. */
export const wordmarkToMenuGap = 13.01;

export const wordmarkMarginBottom =
  wordmarkToMenuGap -
  layout.wordmarkPaddingBottom -
  layout.sidebarGap;
