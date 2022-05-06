const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    /** @type {import('http-proxy-middleware/dist/types').Options} */
    target: 'https://api.nhtsa.gov/', // target host with the same base path
    
    changeOrigin: true, // needed for virtual hosted sites
    logLevel: 'debug',
    onProxyReq(proxyReq, req, res) {
      proxyReq.path =+ '?'
      
    }





    } 
    
    

const filter = function(pathname, req) {
  return pathname.match('^/recalls') && req.method === "GET";
}

  const carsApiProxy = createProxyMiddleware(filter, options);

  module.exports = carsApiProxy; 

