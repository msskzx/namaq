export const HOURGLASS_FRAME = 'M6 2h12M6 22h12M7 2v4c0 3 4 5 5 6s5 3 5 6v4M17 2v4c0 3-4 5-5 6s-5 3-5 6v4';

export function hourglassSand(left: number) {
  const top = 4 * Math.sqrt(Math.max(0, Math.min(1, left)));
  const bottom = 4 * Math.sqrt(Math.max(0, Math.min(1, 1 - left)));
  return {
    top: `M${12 - top} ${10 - top}H${12 + top}L12 10Z`,
    bottom: `M8 19H16L12 ${19 - bottom}Z`,
    stream: left > 0 && left < 1 ? `M12 11V${19 - bottom}` : '',
  };
}
