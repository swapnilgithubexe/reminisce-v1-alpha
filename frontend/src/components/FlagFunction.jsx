import { LANGUAGE_TO_FLAG } from "../constants";

const FlagFunction = (language) => {
  if (!language) return null;

  //! to match the flag codes from constants
  const languageLowerCase = language.toLowerCase();

  const countryCode = LANGUAGE_TO_FLAG[languageLowerCase];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${languageLowerCase} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  } else {
    return null;
  }
};

export default FlagFunction;
