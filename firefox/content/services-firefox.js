/*
  A script that determines whether a domain name belongs to a third party. TODO:
  Document the API so other third-party lists can be plugged in.

  Copyright 2012, 2013 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

/* Destringifies an object. */
function deserialize(object) {
  return typeof object == 'string' ? JSON.parse(object) : object;
}

/* Retrieves the third-party metadata, if any, associated with a domain name. */
function getService(domain) { return moreServices[domain]; }

/* Rewrites a URL, if insecure. */
function harden(url) {
  var hardeningRules = [];
  if (preferences.getBoolPref('searchHardened'))
      hardeningRules = hardeningRules.concat(moreRules);
  if (preferences.getBoolPref('browsingHardened'))
      hardeningRules = hardeningRules.concat(hardeningRules);
  var ruleCount = hardeningRules.length;
  var hardenedUrl = url;
  var hardened;

  for (var i = 0; i < ruleCount; i++) {
    var hardeningRule = hardeningRules[i];
    hardenedUrl = url.replace(RegExp(hardeningRule[0]), hardeningRule[1]);

    if (hardenedUrl != url) {
      hardened = true;
      break;
    }
  }

  return {url: hardenedUrl, hardened: hardened};
}

/* The "setInterval" replacement. */
var timer =
    Components.classes['@mozilla.org/timer;1'].
      createInstance(Components.interfaces.nsITimer);

/* The "XMLHttpRequest" object. */
var xhr =
    new Components.Constructor('@mozilla.org/xmlextras/xmlhttprequest;1')();

/* The number of iterations. */
var index = 0;

/* The number of requests. */
var requestCount = 0;

/* The next iteration to make a request. */
var nextRequest = 0;

/*
  The categories and third parties, titlecased, and URL of their homepage and
  domain names they phone home with, lowercased.
*/
moreServices = {};

/* The matching regexes and replacement strings. */
hardeningRules = [];

/* The rest of the matching regexes and replacement strings. */
moreRules = [];

xhr.open('GET', 'https://dev.disconnect.me/services-pro.json');

/* Fetches the third-party metadata. */
xhr.onload = function() {
  if (xhr.status == 200) {
    timer.cancel();
    var data =
        deserialize(sjcl.decrypt(
          'af81cb8d-3203-4925-b16d-0f59d03a4d11', xhr.responseText
        ));
    var categories = data.categories;

    for (var categoryName in categories) {
      if (categoryName.length < 12) {
        var category = categories[categoryName];
        var serviceCount = category.length;

        for (var i = 0; i < serviceCount; i++) {
          var service = category[i];

          for (var serviceName in service) {
            var urls = service[serviceName];

            for (var homepage in urls) {
              var domains = urls[homepage];
              var domainCount = domains.length;
              for (var j = 0; j < domainCount; j++)
                  moreServices[domains[j]] = {
                    category: categoryName, name: serviceName, url: homepage
                  };
            }
          }
        }
      }
    }

    hardeningRules = data.hardeningRules;
    moreRules = data.moreRules;
  }
};

/* Retries unsuccessful requests. */
timer.init({observe: function() {
  if (index == nextRequest) {
    try { xhr.send(); } catch (exception) {}
    nextRequest = index + Math.pow(2, Math.min(requestCount++, 6));
  }

  index++;
}}, 1000, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
