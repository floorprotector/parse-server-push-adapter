# parse-server-fp-push-adapter

[![Build Status](https://travis-ci.org/parse-server-modules/parse-server-onesignal-push-adapter.svg?branch=master)](https://travis-ci.org/parse-server-modules/parse-server-onesignal-push-adapter)
[![codecov.io](https://codecov.io/github/parse-server-modules/parse-server-onesignal-push-adapter/coverage.svg?branch=master)](https://codecov.io/github/parse-server-modules/parse-server-onesignal-push-adapter?branch=master)


Custom floorprotector Push adapter for parse-server

This push adapter is based on the official push adapter for parse-server - see [parse-server push configuration](https://github.com/ParsePlatform/parse-server/wiki/Push)

## Support for array of gcm sender configurations

If you want to use a single parse server for apps with different gcm sender settings.
Multiple apn settings are already supported by the official parse-server-push-adapter.

For now the gcm sender is selected by matching "appIdentifier" values of gcm sender and the FIRST device in the push device list. I.e. make sure that all devices for a push task have the same appIdentifier, otherwise split up the push task.


This adapter is only required until the pull request is merged with the offical parse-server-push-plugin.


## Installation

Add dependency to your parse-server package.json:

```
  ...
  "dependencies": {
    "express": "~4.11.x",
    "kerberos": "~0.0.x",
    "parse": "~1.8.0",
    "parse-server-fp-push-adapter": "@floorprotector/parse-server-fp-push-adapter",
    "parse-server": "~2.2.12"
  }
  ...
```

## Usage

```
var FpPushAdapter = require('parse-server-fp-push-adapter');

var pushConfig = {
  android: [
    {
      senderId: 'your-gcm-sender-id-1',
      apiKey: 'your-gcm-api-key-1',
      appIdentifier: 'your-appIdentifier-1' // will be compared with "appIdentifier" in parse-server db "_installation" table
    },
    {
      senderId: 'your-gcm-sender-id-2',
      apiKey: 'your-gcm-api-key-2',
      appIdentifier: 'your-appIdentifier-2' // will be compared with "appIdentifier" in parse-server db "_installation" table
    },
    {
      senderId: 'your-gcm-sender-id-3',
      apiKey: 'your-gcm-api-key-3',
      appIdentifier: 'your-appIdentifier-3' // will be compared with "appIdentifier" in parse-server db "_installation" table
    }],
  ios: [ // like official parse-server-push-plugin (already array compatible), e.g.:
      {
        pfx: '', // Dev PFX or P12
        bundleId: '',
        production: false // Dev
      },
      {
        pfx: '', // Prod PFX or P12
        bundleId: '',  
        production: true // Prod
      }
   ]
};

var fpPushAdapter = new FpPushAdapter(pushConfig);

var api = new ParseServer({
  push: {
    adapter: fpPushAdapter
  },
  ...otherOptions
});
```
