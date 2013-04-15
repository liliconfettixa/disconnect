/*
  An overlay script that makes the web faster, more private, and more secure.

  Copyright 2010-2013 Disconnect, Inc.

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

/**
 * The Disconnect namespace.
 */
if (typeof Disconnect == 'undefined') {
  var Disconnect = {
    /**
     * Tallies the number of tracking requests.
     */
    getCount: function() {
      var tabRequests = requestCounts[gBrowser.contentWindow.location] || {};
      var count = 0;
      var blocked = true;

      for (var categoryName in tabRequests) {
        var category = tabRequests[categoryName];

        for (var serviceName in category) {
          var service = category[serviceName]
          count += service.count;
          blocked = blocked && service.blocked;
        }
      }

      return {count: count, blocked: blocked};
    },

    /**
     * Resets the number of tracking requests.
     */
    clearBadge: function(button, badge) {
      button.removeClass(Disconnect.badgeName);
      badge.removeClass(
        Disconnect.blockedName + ' ' + Disconnect.unblockedName
      );
    },

    /**
     * Refreshes the number of tracking requests.
     */
    updateBadge: function(button, badge, count, blocked, referrerUrl) {
      var currentUrl = gBrowser.contentWindow.location;

      if (!referrerUrl || currentUrl == referrerUrl) {
        count == 1 && Disconnect.clearBadge(button, badge);
        button.addClass(Disconnect.badgeName);
        badge.
          addClass(blocked ? Disconnect.blockedName : Disconnect.unblockedName).
          val(count);
      }
    },

    /**
     * Outputs major third-party details as per the blocking state.
     */
    renderShortcut: function(
      name,
      lowercaseName,
      blocked,
      requestCount,
      control,
      wrappedControl,
      badge,
      text,
      animation,
      callback
    ) {
      var count =
          animation > 1 ||
              Disconnect.whitelistingClicked && Disconnect.whitelistingClicked--
                  ? 21 : animation;
      var deactivatedName = Disconnect.deactivatedName;
      var offsetX = -Disconnect.shortcutNames.indexOf(name) * 24;

      if (blocked) {
        wrappedControl[count < 2 ? 'removeClass' : 'addClass'](deactivatedName);
        control.title = Disconnect.unblockName + name;
        for (var i = 0; i < count; i++)
            setTimeout(function(index) {
              index || wrappedControl.off('mouseenter').off('mouseleave');
              var offsetY = index < 18 ? index : 34 - index;
              badge.css({top: -(offsetY * 24 + offsetY), left: offsetX});

              if (index > count - 2) {
                wrappedControl.
                  mouseenter(function() { badge.css('left', offsetX - 72); }).
                  mouseleave(function() { badge.css('left', offsetX); });

                callback && wrappedControl.click(callback);
              }
            }, i * 40, i);
      } else {
        wrappedControl[count < 2 ? 'addClass' : 'removeClass'](deactivatedName);
        control.title = Disconnect.blockName + name;
        for (var i = 0; i < count; i++)
            setTimeout(function(index) {
              index || wrappedControl.off('mouseenter').off('mouseleave');
              var offsetY =
                  index < 14 ? index + 14 : 3 - Math.abs(3 - index % 14);
              badge.css({top: -(offsetY * 24 + offsetY), left: offsetX});

              if (index > count - 2) {
                wrappedControl.
                  mouseenter(function() { badge.css('left', offsetX - 72); }).
                  mouseleave(function() { badge.css('left', offsetX); });

                callback && wrappedControl.click(callback);
              }
            }, i * 40, i);
      }

      text.textContent = requestCount;
    },

    /**
     * Restricts the animation of major third parties to 1x per click.
     */
    handleShortcut: function(
      domain,
      url,
      name,
      lowercaseName,
      requestCount,
      control,
      wrappedControl,
      badge,
      text
    ) {
      wrappedControl.off(Disconnect.clickName);
      var preferences = Disconnect.preferences;
      var whitelistName = Disconnect.whitelistName;
      var whitelist = JSON.parse(preferences.getCharPref(whitelistName));
      var siteWhitelist = whitelist[domain] || (whitelist[domain] = {});
      var disconnectWhitelist =
          siteWhitelist.Disconnect ||
              (siteWhitelist.Disconnect = {whitelisted: false, services: {}});
      var shortcutWhitelist = disconnectWhitelist.services;
      shortcutWhitelist[name] = !shortcutWhitelist[name];
      preferences.setCharPref(whitelistName, JSON.stringify(whitelist));

      Disconnect.renderShortcut(
        name,
        lowercaseName,
        shortcutWhitelist[name],
        requestCount,
        control,
        wrappedControl,
        badge,
        text,
        2,
        function() {
          Disconnect.handleShortcut(
            domain,
            url,
            name,
            lowercaseName,
            requestCount,
            control,
            wrappedControl,
            badge,
            text
          );
        }
      );

      Disconnect.renderWhitelisting(siteWhitelist);
      content.location.reload();
    },

    /**
     * Outputs minor third-party details as per the blocking state.
     */
    renderCategory: function(
      name,
      lowercaseName,
      blocked,
      requestCount,
      control,
      wrappedControl,
      badge,
      badgeIcon,
      text,
      textName,
      textCount,
      animation,
      callback
    ) {
      var contentCategory = name == Disconnect.contentName;
      var count =
          animation > 1 ||
              Disconnect.whitelistingClicked && Disconnect.whitelistingClicked--
                  && !(
                    contentCategory &&
                        $('.whitelisting').filter('.text').text() ==
                            'Blacklist site'
                  ) ? 21 : animation;
      var deactivatedName = Disconnect.deactivatedName;
      var wrappedBadge = $(badge);
      var offsetX = -Disconnect.categoryNames.indexOf(name) * 24;

      if (blocked) {
        wrappedControl[count < 2 ? 'removeClass' : 'addClass'](deactivatedName);
        badge.title =
            Disconnect.unblockName + lowercaseName +
                (contentCategory ? ' (recommended)' : '');
        for (var i = 0; i < count; i++)
            setTimeout(function(badgeIcon, lowercaseName, index) {
              index || wrappedBadge.off('mouseenter').off('mouseleave');
              badgeIcon = $(badgeIcon);
              var offsetY = index < 18 ? index : 34 - index;
              badgeIcon.css({top: -(offsetY * 24 + offsetY), left: offsetX});

              if (index > count - 2) {
                wrappedBadge.
                  mouseenter(function() {
                    badgeIcon.css('left', offsetX - 96);
                  }).
                  mouseleave(function() { badgeIcon.css('left', offsetX); });

                callback && wrappedBadge.click(callback);
              }
            }, i * 40, badgeIcon, lowercaseName, i);
      } else {
        wrappedControl[count < 2 ? 'addClass' : 'removeClass'](deactivatedName);
        badge.title =
            Disconnect.blockName + lowercaseName +
                (contentCategory ? ' (not recommended)' : '');
        for (var i = 0; i < count; i++)
            setTimeout(function(badgeIcon, lowercaseName, index) {
              index || wrappedBadge.off('mouseenter').off('mouseleave');
              badgeIcon = $(badgeIcon);
              var offsetY =
                  index < 14 ? index + 14 : 3 - Math.abs(3 - index % 14);
              badgeIcon.css({top: -(offsetY * 24 + offsetY), left: offsetX});

              if (index > count - 2) {
                wrappedBadge.
                  mouseenter(function() {
                    badgeIcon.css('left', offsetX - 96);
                  }).
                  mouseleave(function() { badgeIcon.css('left', offsetX); });

                callback && wrappedBadge.click(callback);
              }
            }, i * 40, badgeIcon, lowercaseName, i);
      }

      textName.text(name);
      textCount.text(requestCount + ' request' + (requestCount - 1 ? 's' : ''));
    },

    /**
     * Restricts the animation of minor third parties to 1x per click.
     */
    handleCategory: function(
      domain,
      url,
      name,
      lowercaseName,
      requestCount,
      categoryControl,
      wrappedCategoryControl,
      badge,
      badgeIcon,
      text,
      textName,
      textCount,
      serviceSurface
    ) {
      $(badge).off(Disconnect.clickName);
      var preferences = Disconnect.preferences;
      var whitelistName = Disconnect.whitelistName;
      var whitelist = JSON.parse(preferences.getCharPref(whitelistName));
      var siteWhitelist = whitelist[domain] || (whitelist[domain] = {});
      var contentCategory = name == Disconnect.contentName;
      var categoryWhitelist =
          siteWhitelist[name] ||
              (siteWhitelist[name] =
                  {whitelisted: contentCategory, services: {}});
      var serviceWhitelist = categoryWhitelist.services;
      var whitelisted = categoryWhitelist.whitelisted;
      whitelisted =
          categoryWhitelist.whitelisted =
              !(whitelisted || contentCategory && whitelisted !== false);
      var blacklistName = Disconnect.blacklistName;
      var blacklist = JSON.parse(preferences.getCharPref(blacklistName));
      var siteBlacklist = blacklist[domain] || (blacklist[domain] = {});
      var categoryBlacklist = siteBlacklist[name] || (siteBlacklist[name] = {});
      for (var serviceName in serviceWhitelist)
          serviceWhitelist[serviceName] = whitelisted;
      for (var serviceName in categoryBlacklist)
          categoryBlacklist[serviceName] = !whitelisted;
      preferences.setCharPref(whitelistName, JSON.stringify(whitelist));
      preferences.setCharPref(blacklistName, JSON.stringify(blacklist));
      Disconnect.renderCategory(
        name,
        lowercaseName,
        whitelisted,
        requestCount,
        categoryControl,
        wrappedCategoryControl,
        badge,
        badgeIcon,
        text,
        textName,
        textCount,
        2,
        function() {
          Disconnect.handleCategory(
            domain,
            url,
            name,
            lowercaseName,
            requestCount,
            categoryControl,
            wrappedCategoryControl,
            badge,
            badgeIcon,
            text,
            textName,
            textCount,
            serviceSurface
          );
        }
      );

      $(serviceSurface[0].getElementsByTagName('html:input')).
        each(function(index) {
          if (index) this.checked = !whitelisted;
        });

      Disconnect.renderWhitelisting(siteWhitelist);
      content.location.reload();
    },

    /**
     * Refreshes third-party details.
     */
    updateServices: function(url, domain) {
      var tabRequests = requestCounts[url] || {};
      var shortcutRequests = tabRequests.Disconnect || {};
      var shortcutNames = Disconnect.shortcutNames;
      var preferences = Disconnect.preferences;
      var whitelist =
          JSON.parse(preferences.getCharPref(Disconnect.whitelistName));
      var siteWhitelist = whitelist[domain] || {};
      var shortcutWhitelist =
          (siteWhitelist.Disconnect || {}).services || {};
      for (var name in shortcutRequests)
          if (gBrowser.contentWindow.location == url) {
            var count = shortcutRequests[name].count;

            setTimeout(function(name, count) {
              $(
                document.
                  getElementsByClassName('shortcut')[
                    shortcutNames.indexOf(name) + 1
                  ].getElementsByClassName('text')[0]
              ).text(count);
            }, count * 100, name, count);
          }
    },

    /**
     * Resets third-party details.
     */
    clearServices: function(url, shortcutCount) {
      if (gBrowser.contentWindow.location == url) {
        for (var i = 0; i < shortcutCount; i++)
            $(
              document.
                getElementsByClassName('shortcut')[i + 1].
                getElementsByClassName('text')[0]
            ).text(0);
      }
    },

    /**
     * Outputs the global blocking state.
     */
    renderWhitelisting: function(siteWhitelist) {},

    /**
     * Outputs a blocked request.
     */
    renderBlockedRequest: function(url, blockedCount, totalCount, weighted) {
      if (gBrowser.contentWindow.location == url) {
        d3.select('.subtotal.speed').remove();
        var dashboard = Disconnect.dashboard;
        var height = (blockedCount / totalCount || 0) * 35;
        var speedHeight =
            Math.round(
              height *
                  (weighted ? 1 :
                      Disconnect.trackingResourceTime / Disconnect.resourceTime)
            );
        var bandwidthHeight =
            Math.round(
              height *
                  (weighted ? 1 :
                      Disconnect.trackingResourceSize / Disconnect.resourceSize)
            );
        dashboard.
          insert('svg:rect', '.control.speed').
          attr('class', 'subtotal speed').
          attr('x', 29).
          attr('y', 38 - speedHeight).
          attr('width', 8).
          attr('height', speedHeight).
          attr('fill', '#ff7f00');
        d3.select('.subtotal.bandwidth').remove();
        dashboard.
          insert('svg:rect', '.control.bandwidth').
          attr('class', 'subtotal bandwidth').
          attr('x', 95).
          attr('y', 38 - bandwidthHeight).
          attr('width', 8).
          attr('height', bandwidthHeight).
          attr('fill', '#ffbf3f');
      }
    },

    /**
     * Outputs a secured request.
     */
    renderSecuredRequest: function(url, securedCount, totalCount) {
      if (gBrowser.contentWindow.location == url) {
        d3.select('.subtotal.security').remove();
        var height = Math.round((securedCount / totalCount || 0) * 35);
        Disconnect.
          dashboard.
          insert('svg:rect', '.control.security').
          attr('class', 'subtotal security').
          attr('x', 161).
          attr('y', 38 - height).
          attr('width', 8).
          attr('height', height).
          attr('fill', '#00bfff');
      }
    },

    /**
     * Outputs total, blocked, and secured requests.
     */
    renderGraphs: function(url) {
      d3.select('.subtotal.speed').remove();
      d3.select('.total.speed').remove();
      d3.select('.subtotal.bandwidth').remove();
      d3.select('.total.bandwidth').remove();
      d3.select('.subtotal.security').remove();
      d3.select('.total.security').remove();
      var tabDashboard = dashboardCounts[url] || {};
      var blockedCount = tabDashboard.blocked || 0;
      var totalCount = tabDashboard.total || 0;
      var securedCount = tabDashboard.secured || 0;
      var iterations = Math.round(Math.max(
        (blockedCount / totalCount || 0) *
            Disconnect.trackingResourceTime / Disconnect.resourceTime,
        securedCount / totalCount || 0
      ) * 13) + 23;
      var dashboard = Disconnect.dashboard;
      var dummyCount = totalCount || 1;
      var renderBlockedRequest = Disconnect.renderBlockedRequest;
      var weighted = iterations == 23;
      var renderSecuredRequest = Disconnect.renderSecuredRequest;

      for (var i = 1; i < iterations; i++) {
        setTimeout(function(index, delay) {
          if (index < 21) {
            d3.select('.total.speed').remove();
            var height = (index > 19 ? 19 - index % 19 : index) * 2;
            var y = 38 - height;
            dashboard.
              insert('svg:rect', '.subtotal.speed').
              attr('class', 'total speed').
              attr('x', 28).
              attr('y', y).
              attr('width', 10).
              attr('height', height).
              attr('fill', '#ff3f00');
            d3.select('.total.bandwidth').remove();
            dashboard.
              insert('svg:rect', '.subtotal.bandwidth').
              attr('class', 'total bandwidth').
              attr('x', 94).
              attr('y', y).
              attr('width', 10).
              attr('height', height).
              attr('fill', '#ff7f00');
            d3.select('.total.security').remove();
            dashboard.
              insert('svg:rect', '.subtotal.security').
              attr('class', 'total security').
              attr('x', 160).
              attr('y', y).
              attr('width', 10).
              attr('height', height).
              attr('fill', '#007fff');
          }

          if (index > 15) {
            var defaultCount = dummyCount * .28;
            var offsetIndex = index - 15;
            var modulus = iterations - 17;
            var fraction = (
              offsetIndex > modulus ? modulus - offsetIndex % modulus :
                  offsetIndex
            ) / (iterations - 18);
            renderBlockedRequest(
              url,
              Math.min(blockedCount + defaultCount, dummyCount) * fraction,
              dummyCount,
              weighted
            );
            renderSecuredRequest(
              url,
              Math.min(securedCount + defaultCount, dummyCount) * fraction,
              dummyCount
            );
          }

          Disconnect.timeouts[url] =
              Disconnect.timeouts[url] == null ? 1600 :
                  (iterations - index - 1) * 25;
        }, i * 25, i);
      }
    },

    /**
     * Plays an expanding or collapsing animation.
     */
    animateAction: function(action, button, name) {
      button = $(button);
      var collapsed = button.css('top') == '-28px';
      action.title = (collapsed ? 'Collapse' : 'Expand') + ' ' + name;
      var previousFrame;
      var currentFrame;
      for (var i = 0; i < 10; i++)
          setTimeout(function(index) {
            button.css(
              'top',
              -(
                collapsed ? index < 8 ? index + 3 : 17 - index :
                    index < 8 ? 7 - index : Math.abs(7 - index)
              ) * 14
            );
          }, i * 25, i);
    },

    /**
     * Registers event handlers.
     */
    initialize: function() {
      Components.utils['import']('resource://modules/state.js');
      var interfaces = Components.interfaces;
      var loader =
          Components.
            classes['@mozilla.org/moz/jssubscript-loader;1'].
            getService(interfaces.mozIJSSubScriptLoader);
      loader.loadSubScript('chrome://disconnect/content/sitename-firefox.js');
      loader.loadSubScript(
        'chrome://disconnect/skin/scripts/vendor/jquery/jquery.js'
      );
      loader.loadSubScript('chrome://disconnect/skin/scripts/vendor/d3/d3.js');
      loader.loadSubScript(
        'chrome://disconnect/skin/scripts/vendor/d3/d3.layout.js'
      );
      loader.loadSubScript(
        'chrome://disconnect/skin/scripts/vendor/d3/d3.geom.js'
      );
      loader.loadSubScript('chrome://disconnect/content/debug.js');
      var preferences =
          Components.
            classes['@mozilla.org/preferences-service;1'].
            getService(interfaces.nsIPrefService).
            getBranch('extensions.disconnect.');
      var observer =
          Components.
            classes['@mozilla.org/observer-service;1'].
            getService(interfaces.nsIObserverService);
      var tabs = gBrowser.tabContainer;
      var get = (new Sitename).get;
      var getCount = this.getCount;
      var clearBadge = this.clearBadge;
      var updateBadge = this.updateBadge;
      var renderShortcut = this.renderShortcut;
      var handleShortcut = this.handleShortcut;
      var renderCategory = this.renderCategory;
      var handleCategory = this.handleCategory;
      var updateServices = this.updateServices;
      var clearServices = this.clearServices;
      var renderBlockedRequest = this.renderBlockedRequest;
      var renderSecuredRequest = this.renderSecuredRequest;
      var renderGraphs = this.renderGraphs;
      var animateAction = this.animateAction;
      var shortcutNames = this.shortcutNames;
      var shortcutCount = shortcutNames.length;
      var categoryNames = this.categoryNames;
      var categoryCount = categoryNames.length;
      var categoryClasses = this.categoryClasses;
      var buildName = 'build';
      var navbarName = 'nav-bar';
      var currentSetName = 'currentset';
      var browsingHardenedName = 'browsingHardened';
      var whitelistName = this.whitelistName;
      var blacklistName = this.blacklistName;
      var contentName = this.contentName;
      var highlightedName = this.highlightedName;
      var clickName = this.clickName;
      var imageExtension = this.imageExtension;
      var currentBuild = 2;
      var previousBuild = preferences.getIntPref(buildName);
      var whitelist = JSON.parse(preferences.getCharPref(whitelistName));
      var browsingHardened = preferences.getBoolPref(browsingHardenedName);
      this.preferences = preferences;

      if (!previousBuild) {
        var toolbar = document.getElementById(navbarName);
        toolbar.insertItem('disconnect-item');
        toolbar.setAttribute(currentSetName, toolbar.currentSet);
        document.persist(navbarName, currentSetName);
      }

      if (!previousBuild || previousBuild < currentBuild) {
        var date = new Date();
        var month = date.getMonth() + 1;
        month = (month < 10 ? '0' : '') + month;
        var day = date.getDate();
        day = (day < 10 ? '0' : '') + day;
        date = date.getFullYear() + '-' + month + '-' + day;
        var migratedWhitelist = {};
        preferences.
          setCharPref('pwyw', JSON.stringify({date: date, bucket: 'trying'}));

        for (var domain in whitelist) {
          var siteWhitelist =
              (migratedWhitelist[domain] = {}).Disconnect =
                  {whitelisted: false, services: {}};
          for (var service in whitelist[domain])
              siteWhitelist.services[service] = true;
        }

        preferences.
          setCharPref(whitelistName, JSON.stringify(migratedWhitelist));
        preferences.setIntPref(buildName, currentBuild);
      }

      var button = $(document.getElementById('disconnect-button'));
      var badge = $(document.getElementById('disconnect-badge'));
      var shortcutSurface =
          document.
            getElementById('shortcuts').getElementsByTagName('html:td')[0];
      var shortcutTemplate =
          shortcutSurface.getElementsByClassName('shortcut')[0];
      var shortcutSurface =
          document.
            getElementById('shortcuts').getElementsByTagName('html:td')[0];
      var shortcutTemplate =
          shortcutSurface.getElementsByClassName('shortcut')[0];
      var categorySurface = $(document.getElementById('categories'));
      var categoryTemplate = categorySurface.children();
      var wifi =
          document.
            getElementsByClassName('wifi')[0].
            getElementsByTagName('html:input')[0];

      tabs.addEventListener('TabOpen', function() {
        clearBadge(button, badge);
      }, false);

      tabs.addEventListener('TabClose', function(event) {
        delete requestCounts[
          gBrowser.getBrowserForTab(event.target).contentWindow.location
        ];
      }, false);

      tabs.addEventListener('TabSelect', function() {
        var countReturn = getCount();
        var count = countReturn.count;
        count ? updateBadge(button, badge, count, countReturn.blocked) :
            clearBadge(button, badge);
      }, false);

      observer.addObserver({observe: function(subject, topic, data) {
        var countReturn = getCount();
        var count = countReturn.count;

        setTimeout(function() {
          updateBadge(button, badge, count, countReturn.blocked, data);
        }, count * 100);

        updateServices(data, get(data));
        var tabDashboard = dashboardCounts[data] || {};
        var blockedCount = tabDashboard.blocked || 0;
        var totalCount = tabDashboard.total || 0;
        var timeout = Disconnect.timeouts[data] || 0;
        var securedCount = tabDashboard.secured || 0;

        blockedCount && setTimeout(function() {
          renderBlockedRequest(
            data,
            Math.min(blockedCount + totalCount * .28, totalCount),
            totalCount
          );
        }, timeout);

        securedCount && setTimeout(function() {
          renderSecuredRequest(
            data,
            Math.min(securedCount + totalCount * .28, totalCount),
            totalCount
          );
        }, timeout);
      }}, 'disconnect-request', false);

      observer.addObserver({observe: function(subject, topic, data) {
        clearServices(data, get(data));
      }}, 'disconnect-load', false);

      $(document.getElementById('navbar').getElementsByTagName('html:img')).
        mouseenter(function() {
          this.src = this.src.replace('.', highlightedName);
        }).
        mouseleave(function() {
          this.src = this.src.replace(highlightedName, '.');
        });

      $(document.getElementsByTagName('html:a')).on(clickName, function() {
        gBrowser.selectedTab = gBrowser.addTab($(this).attr('href'));
        return false;
      });

      for (var i = 0; i < shortcutCount; i++)
          shortcutSurface.
            appendChild(shortcutTemplate.cloneNode(true)).
            getElementsByTagName('html:img')[0].
            alt = shortcutNames[i];
      for (i = 0; i < categoryCount; i++)
          categoryTemplate.
            clone(true).appendTo(categorySurface).find('.badge')[0].alt =
                categoryNames[i];
      wifi.checked = browsingHardened;

      wifi.addEventListener(clickName, function() {
        browsingHardened = !browsingHardened;
        preferences.setBoolPref(browsingHardenedName, browsingHardened);
        this.checked = browsingHardened;
      }, false);

      this.dashboard =
          d3.
            select('#data').
            append('svg:svg').
            attr('width', 198).
            attr('height', 40);
      this.
        dashboard.
        append('svg:rect').
        attr('class', 'control speed').
        attr('x', 10).
        attr('y', 0).
        attr('width', 46).
        attr('height', 40).
        attr('fill', 'transparent');
      this.
        dashboard.
        append('svg:rect').
        attr('class', 'control bandwidth').
        attr('x', 76).
        attr('y', 0).
        attr('width', 46).
        attr('height', 40).
        attr('fill', 'transparent');
      this.
        dashboard.
        append('svg:rect').
        attr('class', 'control security').
        attr('x', 142).
        attr('y', 0).
        attr('width', 46).
        attr('height', 40).
        attr('fill', 'transparent');

      document.getElementById('disconnect-popup').addEventListener(
        'popupshowing', function() {
          var url = gBrowser.contentWindow.location;
          var domain = get(url.hostname);
          var tabRequests = requestCounts[url] || {};
          var disconnectRequests = tabRequests.Disconnect || {};
          whitelist = JSON.parse(preferences.getCharPref(whitelistName));
          var siteWhitelist = whitelist[domain] || {};
          var shortcutWhitelist =
              (siteWhitelist.Disconnect || {}).services || {};

          for (var i = 0; i < shortcutCount; i++) {
            var control = document.getElementsByClassName('shortcut')[i + 1];
            var wrappedControl = $(control);
            var name = shortcutNames[i];
            var lowercaseName = name.toLowerCase();
            var shortcutRequests = disconnectRequests[name];
            var requestCount = shortcutRequests ? shortcutRequests.count : 0;
            var badge = $(control.getElementsByTagName('html:img'));
            var text = control.getElementsByClassName('text')[0];
            wrappedControl.off(clickName);
            renderShortcut(
              name,
              lowercaseName,
              !shortcutWhitelist[name],
              requestCount,
              control,
              wrappedControl,
              badge,
              text,
              1,
              function(
                name,
                lowercaseName,
                requestCount,
                control,
                wrappedControl,
                badge,
                text
              ) {
                handleShortcut(
                  domain,
                  url,
                  name,
                  lowercaseName,
                  requestCount,
                  control,
                  wrappedControl,
                  badge,
                  text
                );
              }.bind(
                null,
                name,
                lowercaseName,
                requestCount,
                control,
                wrappedControl,
                badge,
                text
              )
            );
          }

          $('.services').each(function() {
            $(this.getElementsByTagName('html:div')).
              removeClass('i ii iii iv v vi vii viii ix x');
          });

          $('#list').height(318);

          $('.category .action').each(function() {
            $(this.getElementsByTagName('html:img')).css('top', -28);
          });

          $('.service').not(':first-child').remove();
          var siteBlacklist =
              JSON.parse(preferences.getCharPref(blacklistName))[domain] || {};
          var serviceTemplate = categoryTemplate.find('.service');
          var activeServices = $();

          for (i = 0; i < categoryCount; i++) {
            var name = categoryNames[i];
            var lowercaseName = name.toLowerCase();
            var categoryRequests = tabRequests[name];
            var requestCount = 0;
            var countingIndex = i + 1;
            var categoryControls =
                $(document.getElementsByClassName('category')[countingIndex]).
                  add(document.getElementsByClassName('border')[countingIndex]).
                  add(
                    document.getElementsByClassName('services')[countingIndex]
                  );
            var wrappedCategoryControl = categoryControls.filter('.category');
            var categoryControl = wrappedCategoryControl[0];
            var serviceContainer = $(
              categoryControls.
                filter('.services')[0].getElementsByTagName('html:div')
            );
            var serviceSurface = $(
              serviceContainer[0].getElementsByTagName('html:tbody')
            );
            var wrappedBadge = wrappedCategoryControl.find('.badge');
            var badge = wrappedBadge[0];
            var badgeIcon = wrappedBadge[0].getElementsByTagName('html:img')[0];
            var wrappedText = wrappedCategoryControl.find('.text');
            var text = wrappedText[0];
            var textName = wrappedText.find('.name');
            var textCount = wrappedText.find('.count');
            var categoryWhitelist = siteWhitelist[name] || {};
            var whitelisted = categoryWhitelist.whitelisted;
            whitelisted =
                whitelisted || name == contentName && whitelisted !== false;
            var categoryBlacklist = siteBlacklist[name] || {};

            for (var serviceName in categoryRequests) {
              var serviceControl = serviceTemplate.clone(true);
              var checkbox =
                  serviceControl[0].getElementsByTagName('html:input')[0];
              checkbox.checked =
                  !whitelisted &&
                      !(categoryWhitelist.services || {})[serviceName] ||
                          categoryBlacklist[serviceName];

              checkbox.onclick = function(name, serviceName) {
                var whitelist =
                    JSON.parse(preferences.getCharPref(whitelistName));
                var siteWhitelist =
                    whitelist[domain] || (whitelist[domain] = {});
                var contentCategory = name == contentName;
                var categoryWhitelist =
                    siteWhitelist[name] ||
                        (siteWhitelist[name] =
                            {whitelisted: contentCategory, services: {}});
                var serviceWhitelist = categoryWhitelist.services;
                var whitelisted = serviceWhitelist[serviceName];
                var blacklist =
                    JSON.parse(preferences.getCharPref(blacklistName));
                var siteBlacklist =
                    blacklist[domain] || (blacklist[domain] = {});
                var categoryBlacklist =
                    siteBlacklist[name] || (siteBlacklist[name] = {});
                this.checked =
                    serviceWhitelist[serviceName] =
                        !(categoryBlacklist[serviceName] =
                            whitelisted ||
                                contentCategory && categoryWhitelist.whitelisted
                                    && whitelisted !== false);
                preferences.setCharPref(
                  whitelistName, JSON.stringify(whitelist)
                );
                preferences.setCharPref(
                  blacklistName, JSON.stringify(blacklist)
                );
                content.location.reload();
              }.bind(null, name, serviceName);

              var link = serviceControl[0].getElementsByTagName('html:a')[0];
              link.title += serviceName;
              var service = categoryRequests[serviceName];
              link.href = service.url;
              $(link).text(serviceName);
              var serviceRequestCount = service.count;
              serviceControl.
                find('.text').
                text(
                  serviceRequestCount + ' request' +
                      (serviceRequestCount - 1 ? 's' : '')
                );
              serviceSurface.append(serviceControl);
              requestCount += serviceRequestCount;
            }

            renderCategory(
              name,
              lowercaseName,
              !whitelisted,
              requestCount,
              categoryControl,
              wrappedCategoryControl,
              badge,
              badgeIcon,
              text,
              textName,
              textCount,
              1
            );
            wrappedBadge.off(clickName);

            wrappedBadge.click(function(
              name,
              lowercaseName,
              requestCount,
              categoryControl,
              wrappedCategoryControl,
              badge,
              badgeIcon,
              text,
              textName,
              textCount,
              serviceSurface
            ) {
              handleCategory(
                domain,
                url,
                name,
                lowercaseName,
                requestCount,
                categoryControl,
                wrappedCategoryControl,
                badge,
                badgeIcon,
                text,
                textName,
                textCount,
                serviceSurface
              );
            }.bind(
              null,
              name,
              lowercaseName,
              requestCount,
              categoryControl,
              wrappedCategoryControl,
              badge,
              badgeIcon,
              text,
              textName,
              textCount,
              serviceSurface
            ));

            var wrappedAction = wrappedCategoryControl.find('.action');
            var action = wrappedAction[0];
            action.title = text.title = 'Expand ' + lowercaseName;
            var button = wrappedAction[0].getElementsByTagName('html:img')[0];

            wrappedText.
              add(wrappedAction).
              off('mouseenter').
              off('mouseleave').
              off('click');
            wrappedText.add(wrappedAction).mouseenter(function(button) {
              button.src =
                  button.src.replace(
                    imageExtension, highlightedName + imageExtension
                  );
            }.bind(null, button)).mouseleave(function(button) {
              button.src =
                  button.src.replace(
                    highlightedName + imageExtension, imageExtension
                  );
            }.bind(null, button)).click(function(
              serviceContainer, action, button, name
            ) {
              var expandedServices =
                  activeServices.filter(function() {
                    return $(this).css('height') != '0px';
                  });

              if (
                expandedServices.length && serviceContainer != activeServices
              ) {
                animateAction(
                  action,
                  expandedServices.
                    parent().
                    parent().
                    prev().
                    prev().
                    find('.action')[0].
                    getElementsByTagName('html:img')[0],
                  name
                );
                expandedServices.removeClass('i ii iii iv v vi vii viii ix x');

                setTimeout(function() {
                  animateAction(action, button, name);
                  var serviceCount =
                      Math.min(
                        serviceContainer.find('.service').length - 1, 10
                      );
                  $('#list').height(serviceCount * 18 + 325);
                  activeServices =
                      serviceContainer.addClass(categoryClasses[serviceCount]);
                }, 200);
              } else {
                animateAction(action, button, name);
                var collapsed = $('#list').height() == 318;
                var serviceCount =
                    Math.min(serviceContainer.find('.service').length - 1, 10);

                setTimeout(function() {
                  $('#list').height(function() {
                    return collapsed ? serviceCount * 18 + 325 : 318;
                  });
                }, collapsed ? 0 : 200);

                activeServices =
                    serviceContainer.toggleClass(categoryClasses[serviceCount]);
              }
            }.bind(null, serviceContainer, action, button, lowercaseName));
          }

          renderGraphs(url);
        }, false);
    },

    /**
     * Global variables.
     */
    preferences: null,
    timeouts: {},
    shortcutNames: ['Facebook', 'Google', 'Twitter'],
    categoryNames: ['Advertising', 'Analytics', 'Social', 'Content'],
    categoryClasses:
        ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'],
    whitelistName: 'whitelist',
    blacklistName: 'blacklist',
    contentName: 'Content',
    badgeName: 'badge',
    blockedName: 'blocked',
    unblockedName: 'unblocked',
    deactivatedName: 'deactivated',
    highlightedName: '-highlighted.',
    clickName: 'click',
    blockName: 'Block ',
    unblockName: 'Unblock ',
    imageExtension: '.png',
    trackingResourceTime: 72.6141083689391,
    resourceTime: 55.787731003361,
    trackingResourceSize: 8.51145760261889,
    resourceSize: 10.4957370842049,
    dashboard: {},
    whitelistingClicked: 0
  };
}

/**
 * Initializes the object.
 */
addEventListener('load', function() { Disconnect.initialize(); }, false);
