/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {createProxyMiddleware} = require('http-proxy-middleware');
const https = require('https');
// adding proxy on `bedrock-express.configure.routes` does not work because
// other default middleware interferes with proper proxy operation resulting
// in request timeouts
bedrock.events.on('bedrock-express.init', app => {
  // TODO: route is configurable, also, support N proxied routes?
  app.use('/foo', createProxyMiddleware({
    agent: new https.Agent({
      keepAlive: true,
      // TODO: should be configurable, but bedrock-https-agent is not a valid
      // option for this use case because the target will likely be a system
      // running behind the firewall that does not have a valid SSL certificate
      rejectUnauthorized: false,
    }),
    // TODO: configurable
    target: 'https://localhost:45443',
    // TODO: configurable
    // false = origin is this server (dev localhost:38443)
    // true = origin is the target
    changeOrigin: false
  }));
});
