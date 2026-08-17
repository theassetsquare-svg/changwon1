import type { AccessVenue } from "./types";
import { SEOUL } from "./data-seoul";
import { GYEONGGI } from "./data-gyeonggi";
import { CHUNGCHEONG } from "./data-chungcheong";
import { YEONGNAM } from "./data-yeongnam";
import { HONAM_JEJU } from "./data-honam-jeju";

export type { AccessVenue } from "./types";
export { ACCESS_BASE } from "./types";

/** /access/ 40곳. 순서는 지역별 묶음 그대로 둔다. */
export const ACCESS_VENUES: AccessVenue[] = [
  ...SEOUL,
  ...GYEONGGI,
  ...CHUNGCHEONG,
  ...YEONGNAM,
  ...HONAM_JEJU,
];

export const VENUE_BY_SLUG: Record<string, AccessVenue> = Object.fromEntries(
  ACCESS_VENUES.map((v) => [v.slug, v])
);

/** 허브 페이지 목록용 지역 묶음 */
export const ACCESS_GROUPS = [
  { key: "seoul", label: "서울", venues: SEOUL },
  { key: "gyeonggi", label: "경기·인천", venues: GYEONGGI },
  { key: "chungcheong", label: "충청", venues: CHUNGCHEONG },
  { key: "yeongnam", label: "영남", venues: YEONGNAM },
  { key: "honam", label: "호남·제주", venues: HONAM_JEJU },
] as const;
