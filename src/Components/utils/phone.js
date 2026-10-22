// Sri Lankan numbers are stored in local format (0XXXXXXXXX for mobiles,
// 0X... landlines). formatPhone() renders them in international form so the
// country code is always visible wherever a number is shown.
//
//   0771234567   -> +94771234567
//   +94771234567 -> +94771234567
//   "" / null    -> ""
export function formatPhone(value) {
  if (value === null || value === undefined) return "";

  const raw = String(value).trim();
  if (!raw) return "";

  const compact = raw.replace(/\s+/g, "");

  if (/^\+94\d+$/.test(compact)) return compact;
  if (/^0094\d+$/.test(compact)) return "+94" + compact.slice(4);
  if (/^94\d{9,}$/.test(compact)) return "+" + compact;
  if (/^0\d{6,}$/.test(compact)) return "+94" + compact.slice(1);

  return raw;
}
