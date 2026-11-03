import { AuthLevel, User, UserType } from "@/types/user";

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

/** Empty lists so stores can read response.data.* without throwing. */
export const previewApiData = {
  album: null,
  albumList: [] as unknown[],
  albumFileList: [] as unknown[],
  totalCount: 0,
  announcementList: [] as unknown[],
  artist: null,
  artistList: [] as unknown[],
  dspContractList: [] as unknown[],
  dspList: [] as unknown[],
  settlementDetailList: [] as unknown[],
  settlementTaxInvoiceList: [] as unknown[],
  settlementAdminInvoiceList: [] as unknown[],
  settlementFileList: [] as unknown[],
  track: null,
  trackList: [] as unknown[],
  urlList: [] as unknown[],
  user: null,
  userList: [] as unknown[],
  userContract: null,
  userContractList: [] as unknown[],
  video: null,
  videoList: [] as unknown[],
};

const LIST_KEYS = Object.keys(previewApiData).filter((key) =>
  Array.isArray(previewApiData[key as keyof typeof previewApiData]),
);

/** Turn missing or null list fields into [] so .map/.length do not throw. */
export function ensureListFields(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return;
  }
  const record = payload as Record<string, unknown>;
  for (const key of LIST_KEYS) {
    if (!Array.isArray(record[key])) {
      record[key] = [];
    }
  }
}
