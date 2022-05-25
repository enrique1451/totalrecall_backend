const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    /** @type {import('http-proxy-middleware/dist/types').Options} */
    target: 'https://api.nhtsa.gov/', // target host with the same base path
      
    changeOrigin: true, // needed for virtual hosted sites
    }   
    
    

const filter = function(pathname, req) {
  return pathname.match('^/recalls/recallsByVehicle/') && req.method === "GET";
}

  const carsApiProxy = createProxyMiddleware(filter, options);

  module.exports = carsApiProxy; 

