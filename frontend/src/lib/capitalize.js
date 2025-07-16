export const capitalizeString = (str) => {
  //! takes the 1st character makes it go thru toUpperCase fx, rest remains the same
  if (typeof str !== "string" || str.length === 0) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);

}