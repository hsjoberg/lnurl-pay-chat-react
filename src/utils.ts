export const stringToUint8Array = (str: string) => {
  return Uint8Array.from(str, (x) => x.charCodeAt(0));
};
