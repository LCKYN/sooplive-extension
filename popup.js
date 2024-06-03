document.addEventListener('DOMContentLoaded', function () {
    const headerColorInput = document.getElementById('headerColor');
    const chatColorInput = document.getElementById('chatColor');
    const saveButton = document.getElementById('save');

    // Load saved settings
    chrome.storage.sync.get(['headerColor', 'chatColor'], function (data) {
        if (data.headerColor) {
            headerColorInput.value = data.headerColor;
        }
        if (data.chatColor) {
            chatColorInput.value = data.chatColor;
        }
    });

    // Save settings
    saveButton.addEventListener('click', function () {
        const headerColor = headerColorInput.value;
        const chatColor = chatColorInput.value;

        chrome.storage.sync.set({ headerColor, chatColor }, function () {
            console.log('Settings saved', { headerColor, chatColor });

            // Send a message to the content script to update the colors
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateColors',
                    headerColor,
                    chatColor
                });
            });
        });
    });
});
