const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = { pick };
// Utility function to pick specific keys from an object. This is useful for filtering out unwanted fields from request bodies or query parameters before processing them further in the application. The function takes an object and an array of keys, and returns a new object containing only the specified keys if they exist in the original object.