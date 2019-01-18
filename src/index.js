'use strict';

// Load NPM modules
import hashKey from 'md5';
import circularJson from 'circular-json';

// Export
export default function checkDispatch(fatal = true) {
  // Track hash of last action
  let lastActionHash = '';
  // Declare functions
  const getHash = (action = '') => hashKey(circularJson.stringify(action));
  const checkHash = (action = '') => !(getHash(action) === lastActionHash);
  const updateHash = (action = '') => (lastActionHash = getHash(action));
  // Middleware
  return store => next => action => {
    if (checkHash(action)) {
      return updateHash(action) && next(action);
    } else {
      // Define message
      let message = `[redux-duplicate-actions] A duplicate action has been detected. MORE INFO: ${circularJson.stringify(
        action,
        null,
        2
      )}`;
      // Handle fatal or not?
      if (fatal) {
        throw new TypeError(message);
      } else {
        return console.warn(message) || next(action);
      }
    }
  };
}
