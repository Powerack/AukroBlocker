document.addEventListener("DOMContentLoaded", function () {
  var blockedUsersSelect = document.getElementById("blockedUsersSelect");
  var newBlockedUserInput = document.getElementById("newBlockedUser");
  var addBlockedUserButton = document.getElementById("addBlockedUser");
  var removeBlockedUserButton = document.getElementById("removeBlockedUser");
  var blockSwitch = document.getElementById("blockSwitch");

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

  loadBlockedUsers();

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

  blockSwitch.addEventListener("change", function () {
    var isBlocked = blockSwitch.checked;
    chrome.storage.sync.set({ blockEnabled: isBlocked }, function () {
      // Obnovit aktivní kartu, pokud je na doméně aukro.cz
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
