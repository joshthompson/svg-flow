export type SvgPathCommand = 'L' | 'M';
export type SvgPathSegment = `${SvgPathCommand}${number} ${number}`;

export function svgPath(...strings: SvgPathSegment[]) {
  return strings.join('');
}
