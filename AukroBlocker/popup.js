document.addEventListener("DOMContentLoaded", function () {
    var blockedUsersSelect = document.getElementById("blockedUsersSelect");
    var newBlockedUserInput = document.getElementById("newBlockedUser");
    var addBlockedUserButton = document.getElementById("addBlockedUser");
    var removeBlockedUserButton = document.getElementById("removeBlockedUser");
    var blockSwitch = document.getElementById("blockSwitch");
    var newBlockedRegexInput = document.getElementById("newBlockedRegex");
    var addBlockedRegexButton = document.getElementById("addBlockedRegex");
    var blockedRegexSelect = document.getElementById("blockedRegexSelect");
    var removeBlockedRegexButton = document.getElementById("removeBlockedRegex");

    function loadBlockedUsers() {
        chrome.storage.sync.get("blockedUsers", function (data) {
            var blockedUsers = data.blockedUsers || [];
            blockedUsersSelect.innerHTML = "";
            blockedUsers.forEach(function (username) {
                addBlockedUserToSelect(username);
            });
            document.getElementById("blockedUsersCount").textContent = blockedUsers.length;
        });
    }

    function addBlockedUserToSelect(username) {
        var option = document.createElement("option");
        option.value = username;
        option.textContent = username;
        blockedUsersSelect.appendChild(option);
    }

    function loadBlockedRegexList() {
        chrome.storage.sync.get("blockedRegex", function (data) {
            var blockedRegexList = data.blockedRegex || [];
            blockedRegexSelect.innerHTML = "";
            blockedRegexList.forEach(function (regex) {
                addBlockedRegexToSelect(regex);
            });
        });
    }

    function addBlockedRegexToSelect(regex) {
        var option = document.createElement("option");
        option.value = regex;
        option.textContent = regex;
        blockedRegexSelect.appendChild(option);
    }

    loadBlockedUsers();
    loadBlockedRegexList();

    addBlockedUserButton.addEventListener("click", function () {
        var newUsername = newBlockedUserInput.value.trim();
        if (newUsername !== "") {
            chrome.storage.sync.get("blockedUsers", function (data) {
                var blockedUsers = data.blockedUsers || [];
                blockedUsers.push(newUsername);
                chrome.storage.sync.set({ blockedUsers: blockedUsers }, function () {
                    loadBlockedUsers();
                    newBlockedUserInput.value = "";
                });
            });
        }
    });

    removeBlockedUserButton.addEventListener("click", function () {
        var selectedUsername = blockedUsersSelect.value;
        if (selectedUsername) {
            chrome.storage.sync.get("blockedUsers", function (data) {
                var blockedUsers = data.blockedUsers || [];
                blockedUsers = blockedUsers.filter(function (user) {
                    return user !== selectedUsername;
                });
                chrome.storage.sync.set({ blockedUsers: blockedUsers }, loadBlockedUsers);
            });
        }
    });

    addBlockedRegexButton.addEventListener("click", function () {
        var newRegex = newBlockedRegexInput.value.trim();
        if (newRegex !== "") {
            chrome.storage.sync.get("blockedRegex", function (data) {
                var blockedRegexList = data.blockedRegex || [];
                blockedRegexList.push(newRegex);
                chrome.storage.sync.set({ blockedRegex: blockedRegexList }, function () {
                    loadBlockedRegexList();
                    newBlockedRegexInput.value = "";
                });
            });
        }
    });

    removeBlockedRegexButton.addEventListener("click", function () {
        var selectedRegex = blockedRegexSelect.value;
        if (selectedRegex) {
            chrome.storage.sync.get("blockedRegex", function (data) {
                var blockedRegexList = data.blockedRegex || [];
                blockedRegexList = blockedRegexList.filter(function (regex) {
                    return regex !== selectedRegex;
                });
                chrome.storage.sync.set({ blockedRegex: blockedRegexList }, loadBlockedRegexList);
            });
        }
    });

    blockSwitch.addEventListener("change", function () {
        var isBlocked = blockSwitch.checked;
        chrome.storage.sync.set({ blockEnabled: isBlocked }, function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var activeTab = tabs[0];
                if (activeTab && activeTab.url.includes("aukro.cz")) {
                    chrome.tabs.reload(activeTab.id);
                }
            });
        });
    });

    chrome.storage.sync.get("blockEnabled", function (data) {
        var isBlocked = data.blockEnabled !== undefined ? data.blockEnabled : true;
        blockSwitch.checked = isBlocked;
    });
});
