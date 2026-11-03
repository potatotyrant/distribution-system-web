/**
 * Shared vertical rhythm for the top bar, the page title, and the first
 * sidebar row. The first menu item's top is this sum, so it stays aligned
 * with the page heading without a one-off pixel nudge.
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
} as const;

export const pageTitleTop =
  layout.topBarHeight +
  layout.contentPaddingTop +
  layout.pageHeaderPaddingTop;

const wordmarkBlockHeight =
  layout.wordmarkPaddingTop +
  layout.wordmarkFontSize * layout.wordmarkLineHeight +
  layout.wordmarkPaddingBottom;

/** Extra space under the wordmark so the first menu row starts at pageTitleTop. */
export const wordmarkMarginBottom =
  pageTitleTop -
  (layout.sidebarPaddingTop + wordmarkBlockHeight + layout.sidebarGap);
