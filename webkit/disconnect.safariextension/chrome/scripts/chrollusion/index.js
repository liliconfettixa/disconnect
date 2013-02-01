var backgroundPage = chrome.extension.getBackgroundPage();
var deserialize = backgroundPage.deserialize;
var sidebarCollapsed = parseInt(localStorage.sidebarCollapsed, 10);
var sitesHidden = deserialize(localStorage.sitesHidden);
var updateClosed = deserialize(localStorage.updateClosed);
var recommendsActivated =
    deserialize(localStorage.recommendsExperiment) &&
        !deserialize(localStorage.recommendsClosed);
var addon = CollusionAddon;
var whitelist = deserialize(localStorage.whitelist) || {};
var siteWhitelist;
var blacklist = deserialize(localStorage.blacklist) || {};
var siteBlacklist;
var graph;

/* Paints the graph UI. */
function renderGraph() {
  if (SAFARI) {
    $("body").add("#update").add("#chart").addClass("safari");
    $("#update .safari").show();
    $("#logo").attr({
      src: "../images/chrollusion/safari.png", alt: "Collusion for Safari"
    });
  } else {
    if (!deserialize(localStorage.promoHidden)) {
      localStorage.promoHidden = true;
      setTimeout(function() {
        chrome.browserAction.setBadgeText({text: ''});
      }, 200);
    }
    $("#update .chrome").show();
    $("#logo").attr({
      src: "../images/chrollusion/chrome.png", alt: "Collusion for Chrome"
    });
  }
  $("a").click(function() {
    chrome.tabs.create({url: $(this).attr("href")});
    return false;
  });
  $("#domain-infos").hide();
  $("#show-instructions").hide();
  if (false) {
    $("#unblock-tracking").addClass("invisible").html("Block tracking sites");
  } else {
    $("#unblock-tracking").html("Unblock tracking sites");
  }
  updateClosed || $("#update").show();
  recommendsActivated && $("#recommends").show();

  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    var domain = backgroundPage.GET(tabs[0].url);
    siteWhitelist = whitelist[domain] || {};
    siteBlacklist = blacklist[domain] || {};
    var runner = GraphRunner.Runner({
      width: sidebarCollapsed ? SAFARI ? 791 : 794 : SAFARI ? 576 : 575,
      height:
          updateClosed ?
              (SAFARI ? 597 : (recommendsActivated ? 536 : 586)) :
                  (SAFARI ? 556 : (recommendsActivated ? 489 : 548)),
      hideFavicons: false 
    });
    graph = runner.graph;

    if (addon.isInstalled()) {
      // You should only ever see this page if the addon is installed, anyway
      if (sidebarCollapsed) {
        $("#show-sidebar").slideDown(100);
        $("#chart").addClass("fullscreen");
      } else
        $("#sidebar").slideDown('fast');
      graph.update(backgroundPage.LOG);
      $("#update .close").click(function() {
        localStorage.updateClosed = true;
        window.location.reload();
      });
      $("#recommends .close").click(function() {
        setTimeout(function() {
          window.location.reload();
          localStorage.recommendsClosed = true;          
        }, 100);
      });
      $("#unblock-tracking").click(function() {
        localStorage.trackingUnblocked = !trackingUnblocked;
        window.location.reload();
      });
      $("#show-list").click(function() {
        $('#graph').fadeOut(function() {
          localStorage.displayMode = 'standard';
          $('#chart svg').remove();
          $('#standard').fadeIn(function() {
            var visualization = $('.visualization table');

            animate(visualization.find('img')[0], function() {
              visualization.mouseenter(handleHover);
            });
          });
        });
      });
      $("#hide-sidebar").click(function() {
        localStorage.sidebarCollapsed = 3;
        $("#sidebar, #domain-infos, #show-instructions").slideUp('fast');
        window.setTimeout(function() { window.location.reload(); }, 200);
      });
      $("#show-instructions").click(function() {
        $("#domain-infos, #show-instructions").hide();
        $(".live-data").show();
      });
      $("#show-sidebar").click(function() {
        delete localStorage.sidebarCollapsed;
        $("#show-sidebar").slideUp(100);
        window.setTimeout(function() { window.location.reload(); }, 100);
      });
    }
  });
}
