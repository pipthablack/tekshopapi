/**
 * Create an object composed of the picked object properties
 * @param {Object} object 
 * @param {string[]} keys 
 * @returns {Object} 
 */
const pick = (object, keys) => {
    
    return keys.reduce((obj, key) => {
  
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      
        obj[key] = object[key];
      }
      // Return the updated object
      return obj;
    }, {});
  };
  
  // Export the pick function for use in other modules
  export default pick;
  