const NodeCache = require('node-cache');

const cache = new NodeCache();

const getUrlFromReq = (req) => {
  const { protocol, headers, originalUrl } = req;
  return `${protocol}://${headers.host}${originalUrl}`;
}

const set = (req, data) => {
  const url = getUrlFromReq(req);
  cache.set(url, data);
}

const get = (req, res, next) => {
  const url = getUrlFromReq(req);
  const content = cache.get(url);
  if (content) return res.status(200).send(content);
  return next();
}

module.exports = {
  set,
  get
}