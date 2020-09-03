import axios from 'axios';

/**
 * [getFetchRequest get]
 * @param {string} url
 * @param {object} config
 * @return Promise
 */
function getFetchRequest(url, config = {}) {
  if (!config.timeout) {
    config.timeout = 30000;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then(res => resolve(res.data))
      .catch(error => reject(error));
  });
}
function postFetchRequest(url, params, config = {}) {
  const Param = params && params._parts.length ? params : '';
  if (!config.timeout) {
    config.timeout = 30000;
    // config.headers = {
    //   'Content-Type': 'application/json',
    // };
  }
  console.log(Param, '=====Param');
  return new Promise((resolve, reject) => {
    axios
      .post(url, Param, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(error => reject(error));
  });
}
export {getFetchRequest, postFetchRequest};
