'use strict';
// ParsePushAdapter is the default implementation of
// PushAdapter, it uses GCM for android push and APNS
// for ios push.

import { utils } from 'parse-server-push-adapter';
import ParsePushAdapter from 'parse-server-push-adapter';

const Parse = require('parse/node').Parse;



import log from 'npmlog';
import APNS from './APNS';
import GCM from './GCM';

const LOG_PREFIX = 'parse-server-fp-push-adapter';

export class FpPushAdapter {

  supportsPushTracking = true;

  constructor(pushConfig = {}) {
    this.validPushTypes = ['ios', 'android'];
    this.senderMap = {};
    // used in PushController for Dashboard Features
    this.feature = {
      immediatePush: true
    };
    let pushTypes = Object.keys(pushConfig);

    for (let pushType of pushTypes) {
      if (this.validPushTypes.indexOf(pushType) < 0) {
        throw new Parse.Error(Parse.Error.PUSH_MISCONFIGURED,
                              'Push to ' + pushTypes + ' is not supported');
      }
      switch (pushType) {
        case 'ios':
          this.senderMap[pushType] = new APNS(pushConfig[pushType]);
          break;
        case 'android':
          this.senderMap[pushType] = new GCM(pushConfig[pushType]);
          break;
      }
    }
  }

  static classifyInstallations(installations, validTypes) {
    return utils.classifyInstallations(installations, validTypes)
  }
  
  getValidPushTypes() {
    return this.validPushTypes;
  }


  send(data, installations) {
    let deviceMap = utils.classifyInstallations(installations, this.validPushTypes);
    let sendPromises = [];
    for (let pushType in deviceMap) {
      let sender = this.senderMap[pushType];
      let devices = deviceMap[pushType];
      if(Array.isArray(devices) && devices.length > 0)
      {
        if (!sender) {
          log.verbose(LOG_PREFIX, `Can not find sender for push type ${pushType}, ${data}`)
          let results = devices.map((device) => {
            return Promise.resolve({
              device,
              transmitted: false,
              response: {'error': `Can not find sender for push type ${pushType}, ${data}`}
            })
          });
          sendPromises.push(Promise.all(results));
        } else {
          sendPromises.push(sender.send(data, devices));
        }
      }
    }
    return Promise.all(sendPromises).then((promises) => {
      // flatten all
      return [].concat.apply([], promises);
    })
  }
}
export default FpPushAdapter;
