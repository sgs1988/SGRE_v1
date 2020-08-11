const lat = /^[+]?([0-9]|[1-8][0-9])(\.[0-9]{1,6})?$/;
const long = /^[-]?([0-9]|[1-8][0-9])(\.[0-9]{1,6})?$/;
const hemix = /^([1-9]|[1-5][0-9]|60)[CDEFGHJKLM  NPQRSTUVWX]$/;
const hemiEast = /^[0-9]{6}$/;
const hemiNorth = /^[0-9]{7}$/;

const latitude = (coordinate: any) => lat.test(coordinate);
const longitude = (coordinate: any) => long.test(coordinate);
const latLong = (lat: any, long: any) => latitude(lat) && longitude(long);

const xhemis = (coordinate: any) => hemix.test(coordinate);
const yhemis = (coordinate: any) => hemiEast.test(coordinate);
const zhemis = (coordinate: any) => hemiNorth.test(coordinate);
const hemis = (x: any,y: any,z: any) => xhemis(x) && yhemis(y) && zhemis(z);

export const validationLatitudeLongitude = {
  latitude,
  longitude,
  latLong,
  xhemis,
  yhemis,
  zhemis,
  hemis
};
