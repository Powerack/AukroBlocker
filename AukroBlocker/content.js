chrome.storage.sync.get("blockEnabled", function (data) {
  var blockEnabled = data.blockEnabled !== undefined ? data.blockEnabled : true;

  if (window.location.hostname === "aukro.cz" && blockEnabled) {
    chrome.storage.sync.get("blockedUsers", function (data) {
      var blockedUsers = data.blockedUsers || [];

      function findAndHideBlockedOffers() {
        blockedUsers.forEach(function (username) {
          var offerCards = document.querySelectorAll("auk-list-card");
          offerCards.forEach(function (offerCard) {
            var usernameElement = offerCard.querySelector("a.small-user-name");
            if (usernameElement && usernameElement.textContent.trim() === username) {
              offerCard.style.display = "none";
            }
          });
        });
      }

      findAndHideBlockedOffers();

      var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
          if (mutation.type === "childList") {
            findAndHideBlockedOffers();
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
});
