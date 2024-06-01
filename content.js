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

// Function to apply colors to the last 10 'channel-text' elements based on their text content
function applyColors() {
    const channelTextElements = document.querySelectorAll('.channel-text');
    const lastTenElements = Array.from(channelTextElements).slice(-10);

    lastTenElements.forEach(element => {
        const text = element.textContent.trim();
        const colorIndex = Math.abs(hashCode(text)) % colorSet.length;
        const color = colorSet[colorIndex];
        element.setAttribute('color', '');
        element.style.setProperty('color', color, 'important');

        // Check for emoticons within the 'channel-text' element
        const emoticonElements = element.querySelectorAll('.emoticon');
        emoticonElements.forEach(emoticon => {
            emoticon.style.setProperty('width', '3.5rem', 'important');
            emoticon.style.setProperty('height', '3.5rem', 'important');
        });
    });
}

// Apply colors to existing 'channel-text' elements
applyColors();

// Create a MutationObserver to watch for new 'channel-text' elements
const observer = new MutationObserver(mutations => {
    let newElements = [];

    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            const addedNodes = mutation.addedNodes;
            addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('channel-text')) {
                    newElements.push(node);
                }
            });
        }
    });

    if (newElements.length > 0) {
        const lastTenElements = newElements.slice(-10);

        lastTenElements.forEach(element => {
            const text = element.textContent.trim();
            const colorIndex = Math.abs(hashCode(text)) % colorSet.length;
            const color = colorSet[colorIndex];
            element.setAttribute('color', '');
            element.style.setProperty('color', color, 'important');
        });
    }
});

// Configure the observer to watch for changes in the chat container
const chatContainer = document.querySelector('.chat-container'); // Replace with the appropriate selector for the chat container

if (chatContainer) {
    const observerConfig = { childList: true, subtree: true };
    observer.observe(chatContainer, observerConfig);
} else {
    console.error('Chat container element not found. Please check the selector.');
}

// Run the color application every second
setInterval(applyColors, 500);
