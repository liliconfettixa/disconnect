/*
  A content script that filters on requests to blacklisted domains.

  Copyright 2010, 2011 Brian Kennish

  Licensed under the Apache License, Version 2.0 (the "License"); you may not
  use this file except in compliance with the License. You may obtain a copy of
  the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  License for the specific language governing permissions and limitations under
  the License.

  Brian Kennish <byoogle@gmail.com>
*/

/* Picks out which of a bucket of domains is part of a URL, regex free. */
function index(url, services) {
  const SERVICE_COUNT = services.length - 2;

  services:
  for (var i = 0; i < SERVICE_COUNT; i++) {
    var domains = services[i][1];
    var domainCount = domains.length;
    for (var j = 0; j < domainCount; j++)
        if (url.toLowerCase().indexOf(domains[j], 7) >= 7) break services;
            // A good URL has seven-plus characters ("http://") then the domain.
  }

  return i < SERVICE_COUNT ? i : -1;
}

/* Compute the layout of resource masks. */
function reflow() {
  const ELEMENT_COUNT = ELEMENTS.length;

  for (var i = 0; i < ELEMENT_COUNT; i++) {
    var element = ELEMENTS[i][0];
    var highlight = ELEMENTS[i][1];
    highlight.style.left = element.offsetLeft + LENGTH_UNIT;
    highlight.style.top = element.offsetTop + LENGTH_UNIT;
    highlight.style.width = element.offsetWidth + LENGTH_UNIT;
    highlight.style.height = element.offsetHeight + LENGTH_UNIT;
  }
}

/* The blocked resources and resource masks. */
const ELEMENTS = [];

/* The unit of measurement. */
const LENGTH_UNIT = 'px';

/* The "extension" API. */
const EXTENSION = chrome.extension;

document.addEventListener('load', reflow, true);
onresize = reflow;

/* Traps and selectively cancels a request and messages such. */
EXTENSION.sendRequest({initialized: true}, function(response) {
  const BLACKLIST = response.blacklist;
  var serviceIndex;
  if ((serviceIndex = index(location.href, BLACKLIST)) >= 0)
      BLACKLIST.splice(serviceIndex, 1);
  const SERVICE_COUNT = BLACKLIST.length - 2;
  const DEPERSONALIZED = BLACKLIST[SERVICE_COUNT];

  for (var i = 0; i < SERVICE_COUNT; i++) {
    var service = BLACKLIST[i];
    if (DEPERSONALIZED && service[2] && service[3]) service[1].splice(0, 1);
  }

  document.addEventListener('beforeload', function(event) {
    if ((serviceIndex = index(event.url, BLACKLIST)) >= 0) {
      const SERVICE = BLACKLIST[serviceIndex];

      if (SERVICE[3]) {
        event.preventDefault();
        const ELEMENT = event.target;

        switch (BLACKLIST[SERVICE_COUNT + 1]) {
          case 0:
          const PARENT = ELEMENT.parentNode;
          const HIGHLIGHT = document.createElement('div');
          HIGHLIGHT.className = 'disconnect-highlighted';
          HIGHLIGHT.title = 'Unblock ' + SERVICE[0];

          HIGHLIGHT.onclick = function(serviceIndex) {
            EXTENSION.sendRequest(
              {serviceIndex: serviceIndex, unblocked: true}, function() {
                delete SERVICE[3];
                ELEMENT.src += '';
                ELEMENT.style.visibility = 'visible';
                PARENT.removeChild(HIGHLIGHT);
              }
            );

            return false;
          }.bind(null, serviceIndex);

          ELEMENT.style.visibility = 'hidden';
          PARENT.appendChild(HIGHLIGHT);
          ELEMENTS.push([ELEMENT, HIGHLIGHT]);
          reflow();
          break;

          case 1: ELEMENT.className = 'disconnect-collapsed';
        }
      }

      EXTENSION.sendRequest({serviceIndex: serviceIndex});
    }
  }, true);
});
