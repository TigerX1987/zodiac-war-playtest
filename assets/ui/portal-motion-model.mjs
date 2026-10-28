// Pixel anchors refer to the 1672 × 941 transparent guardians source artwork.
export const ART_SIZE = [1672, 941];
// The upper artwork coordinates stay fixed; completed legs extend below them.
export const FULLBODY_SIZE = [1672, 1500];
export const ANCHORS = {
  leoEye: [367, 207], libraEye: [1302, 258], scalesPivot: [1555, 248],
  leo: [260, 480, 210, 310], libra: [1330, 535, 175, 310], scales: [1555, 365, 112, 103]
};
export const SCALES_LAYER = [1555, 363, 115, 115];
export const EYELID_LAYERS = {leo:[367,207,22,13],libra:[1302,258,22,13]};
export const LEO_SIGIL_LAYER = [180,365,80,80];
export const LEO_PENDANT_LAYER = [424,507,30,73];
export const ZODIAC_SIGNS = [
  ['aries','♈','白羊座'],['taurus','♉','金牛座'],['gemini','♊','双子座'],['cancer','♋','巨蟹座'],
  ['leo','♌','狮子座'],['virgo','♍','处女座'],['libra','♎','天秤座'],['scorpio','♏','天蝎座'],
  ['sagittarius','♐','射手座'],['capricorn','♑','摩羯座'],['aquarius','♒','水瓶座'],['pisces','♓','双鱼座']
];
// Centers calibrated against the individual cartouches in the 1254px source.
// The painted rim is not a mathematically uniform set of ideal sectors.
export const DIAL_SLOT_CENTERS = [
  [773,105],[1023,260],[1146,460],[1146,760],[1020,980],[774,1119],
  [465,1116],[232,980],[100,760],[100,460],[229,260],[465,105]
];
export const DIAL_SYMBOL_RATIO = .058;
export const DIAL_PERIOD_MS = 180000;
export function dialSpeedStep(rate, target, seconds) {
  return target + (rate - target) * Math.exp(-Math.max(0, seconds) / .45);
}
export function blinkFrames() {
  return [{opacity:0,offset:0},{opacity:1,offset:.25},{opacity:1,offset:.6},{opacity:0,offset:1}];
}
export function scaleAngle(seconds, direction = 1, reduced = false) {
  if (reduced || seconds < 0 || seconds > 4.5) return 0;
  return direction * .18 * Math.exp(-seconds * 1.5) * Math.sin(seconds * 8.8);
}
export function fitGuardians(box, fit = 'cover') {
  const scale = (fit === 'contain' ? Math.min : Math.max)(box.width / ART_SIZE[0], box.height / ART_SIZE[1]);
  return { scale, x: box.x + (box.width - ART_SIZE[0] * scale) / 2, y: box.y + (box.height - ART_SIZE[1] * scale) / 2 };
}
export function mapHitArea(area, fit) {
  const [x, y, rx, ry] = area;
  return {left: fit.x + (x - rx) * fit.scale, top: fit.y + (y - ry) * fit.scale, width: rx * 2 * fit.scale, height: ry * 2 * fit.scale};
}
