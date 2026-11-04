// localStorage that never throws: it can be blocked (private modes, strict
// cookie settings) or full. Reads give null, writes and removes do nothing.

export const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const remove = (...keys) => {
  try {
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* storage blocked: nothing to remove */
  }
};
