import axios from 'axios';

/**
 * [getFetchRequest get]
 * @param {string} url
 * @param {object} config
 * @return Promise
 */
function getFetchRequest(url, config = {}) {
  if (!config.timeout) {
    config.timeout = 20000;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}

export {getFetchRequest};
