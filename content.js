// Define the color set
const colorSet = [
    "#e4005e",
    "#f0172f",
    "#f04712",
    "#f07d0e",
    "#ecb414",
    "#cef210",
    "#2bed10",
    "#13f2ac",
    "#1299ec"
];

// Function to convert a string to a hash code
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    return hash;
}

// Function to apply styles to 'channel-text' elements and their emoticons
function applyStyles(elements) {
    elements.forEach(element => {
        const text = element.textContent.trim();
        const colorIndex = Math.abs(hashCode(text)) % colorSet.length;
        const color = colorSet[colorIndex];
        element.style.setProperty('color', color, 'important');

        // Check for emoticons within the 'channel-text' element
        const emoticonElements = element.querySelectorAll('.emoticon');
        emoticonElements.forEach(emoticon => {
            emoticon.style.setProperty('width', '3.5rem', 'important');
            emoticon.style.setProperty('height', '3.5rem', 'important');
        });
    });
}

// Function to apply styles to only emoticon elements
function applyEmoticonStyles(elements) {
    elements.forEach(emoticon => {
        emoticon.style.setProperty('width', '3.5rem', 'important');
        emoticon.style.setProperty('height', '3.5rem', 'important');
    });
}

// Initial application of styles to existing 'channel-text' elements and .emoticon elements
const initialChannelTextElements = document.querySelectorAll('.channel-text');
applyStyles(Array.from(initialChannelTextElements));

const initialEmoticonElements = document.querySelectorAll('.emoticon');
applyEmoticonStyles(Array.from(initialEmoticonElements));

// Create a MutationObserver to watch for new elements
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const channelTextElements = node.querySelectorAll('.channel-text');
                    const emoticonElements = node.querySelectorAll('.emoticon');

                    if (node.classList && node.classList.contains('channel-text')) {
                        applyStyles([node]);
                    }
                    if (channelTextElements.length > 0) {
                        applyStyles(Array.from(channelTextElements));
                    }
                    if (emoticonElements.length > 0) {
                        applyEmoticonStyles(Array.from(emoticonElements));
                    }
                }
            });
        }
    });
});

// Configure the observer to watch for changes in the chat container
const chatContainer = document.querySelector('.chat-container'); // Replace with the appropriate selector for the chat container

if (chatContainer) {
    const observerConfig = { childList: true, subtree: true };
    observer.observe(chatContainer, observerConfig);
} else {
    console.error('Chat container element not found. Please check the selector.');
}

// Efficiently run the style application using requestAnimationFrame
function scheduleApplyStyles() {
    requestAnimationFrame(() => {
        applyStyles(Array.from(document.querySelectorAll('.channel-text')).slice(-10));
        const emoticonElements = document.querySelectorAll('.emoticon');
        applyEmoticonStyles(Array.from(emoticonElements));
        scheduleApplyStyles();
    });
}

scheduleApplyStyles();


const link = document.createElement("link");
link.href = chrome.runtime.getURL("styles.css");
link.type = "text/css";
link.rel = "stylesheet";

// Insert the link element at the end of the head
const head = document.getElementsByTagName("head")[0];
head.appendChild(link);

// ====================================================================================================


// Function to update the header color
function updateHeaderColor(headerColor) {
    const header = document.querySelector('#header');
    if (header) {
        header.style.setProperty('background', headerColor, 'important');
    }
}

// Function to update the chat background color
function updateChatColor(chatColor) {
    const chat = document.querySelector('.sc-7ceadb57-0');
    if (chat) {
        chat.style.setProperty('background', chatColor, 'important');
    }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateColors') {
        updateHeaderColor(request.headerColor);
        updateChatColor(request.chatColor);
    }
});

// Load settings from storage and apply styles
chrome.storage.sync.get(['headerColor', 'chatColor'], function (data) {

    const link = document.createElement("link");
    link.href = chrome.runtime.getURL("styles.css");
    link.type = "text/css";
    link.rel = "stylesheet";

    // Insert the link element at the end of the head
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(link);

    console.log('Loaded settings:', data);

    const headerColor = data.headerColor || "#0e0e10"; // Default color if not set
    const chatColor = data.chatColor || "#0d0d12"; // Default color if not set
    updateHeaderColor(headerColor);
    updateChatColor(chatColor);

});
