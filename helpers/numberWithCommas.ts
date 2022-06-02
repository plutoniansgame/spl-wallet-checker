export function numberWithCommas(x: string | undefined) {
  if (x == undefined) return "";
  else return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, `,`);
}
