chrome.storage.sync.get(["blockEnabled", "blockedUsers", "blockedRegex"], function (data) {
    var blockEnabled = data.blockEnabled !== undefined ? data.blockEnabled : true;

    if (window.location.hostname === "aukro.cz" && blockEnabled) {
        var blockedUsers = data.blockedUsers || [];
        var blockedRegexList = data.blockedRegex || [];

        function findAndHideBlockedOffers() {
            blockedUsers.forEach(function (username) {
                var offerCards = document.querySelectorAll("auk-advanced-item-card");
                offerCards.forEach(function (offerCard) {
                    var usernameElement = offerCard.querySelector(".small-user-name");
                    if (usernameElement && usernameElement.textContent.trim() === username) {
                        offerCard.style.display = "none";
                    }
                });
            });

            blockedRegexList.forEach(function (regex) {
                var offerCards = document.querySelectorAll("auk-advanced-item-card");
                offerCards.forEach(function (offerCard) {
                    var titleElement = offerCard.querySelector("auk-basic-item-card-title");
                    if (titleElement && titleElement.textContent.match(new RegExp(regex, 'i'))) {
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
    }
});
