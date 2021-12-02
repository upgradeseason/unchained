export const validateString = (value, maxLength = 255, required = true) => {
  if (value === "" && required) {
    return "is required.";
  }
  if (value.length > maxLength) {
    return `cannot be longer than ${maxLength} characters.`;
  }
  return "";
};
