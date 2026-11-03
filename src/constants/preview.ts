import { AuthLevel, User, UserType } from "@/types/user";

/**
 * Always on for the preview/restyle branch. Vercel preview has no env vars
 * and no backend, so this is not gated on NEXT_PUBLIC_PREVIEW_MODE.
 */
export const PREVIEW_MODE = true;

export const previewUser: User = {
  _id: "preview",
  account: "preview",
  password: "",
  displayName: "Preview",
  authLevel: AuthLevel.ADMIN,
  type: UserType.COMPANY,
  isEnabled: true,
  representativeName: "Preview",
  albumCount: 0,
  contactPersonList: [],
  fileList: [],
};

/** Empty lists so stores can assign response.data.* without throwing. */
export const previewApiData = {
  album: null,
  albumList: [],
  albumFileList: [],
  totalCount: 0,
  announcementList: [],
  artist: null,
  artistList: [],
  dspContractList: [],
  dspList: [],
  settlementDetailList: [],
  settlementTaxInvoiceList: [],
  settlementAdminInvoiceList: [],
  settlementFileList: [],
  track: null,
  trackList: [],
  urlList: [],
  user: null,
  userList: [],
  userContract: null,
  userContractList: [],
  video: null,
  videoList: [],
};
