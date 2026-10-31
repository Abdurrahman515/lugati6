const DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** للعرض فقط. القيم والحسابات تبقى بالأرقام العادية. */
export function toArabicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DIGITS[Number(d)])
}