function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}

/**
 * KAG-{serial de fecha/hora}-{uuid}: el serial deja el código ordenable
 * por fecha de creación y el uuid garantiza unicidad entre brigadas offline.
 */
export function generateCaseCode(date: Date = new Date()): string {
  const serial = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(
    date.getHours()
  )}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  return `KAG-${serial}-${uuid}`;
}
