// Declare global variables
let counter;
let link_list;
let randomURL;

async function countClicks() {
    // Retrieve the counter value from local storage or initialize it to 0
    counter = parseInt(localStorage.getItem('counter')) || 0;

    // Increment the counter each time the page is visited
    counter++;

    // After counter reaches 10, reset it to 1
    if (counter > 10) {
        counter = 1;
    }

    // Save the updated counter value in local storage
    localStorage.setItem('counter', counter);
}

async function setLinkList() {
    // Fetch the counter value
    await countClicks();

    // Use relative path for GitHub Pages
    // This will work both locally and on GitHub Pages
    link_list = 'links/links.txt';
    
    // For debugging, uncomment the line below to see what path is being used
    // console.log('Loading links from:', window.location.origin + '/' + link_list);
}

async function getRandomURL() {
    // Fetch the link list
    await setLinkList();

    try {
        // Add cache-busting parameter to avoid cached empty files
        const cacheBuster = '?v=' + new Date().getTime();
        const response = await fetch(link_list + cacheBuster);

        if (!response.ok) {
            throw new Error(`Failed to load links.txt (Status: ${response.status})`);
        }

        const data = await response.text();
        
        // Split by newlines, filter out empty lines and comments
        const urlsArray = data.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));

        if (urlsArray.length === 0) {
            throw new Error('No valid URLs found in links.txt');
        }

        // Select a random URL
        const randomIndex = Math.floor(Math.random() * urlsArray.length);
        randomURL = urlsArray[randomIndex];

    } catch (error) {
        // Display user-friendly error
        document.getElementById("mainContainer").innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>Unable to load links</h3>
                <p>Please check that links.txt exists and contains URLs.</p>
                <p style="font-size: 12px; color: #666;">${error.message}</p>
                <button onclick="window.location.href='/'">Go Home</button>
            </div>
        `;
        randomURL = null;
    }
}

async function displayRandomURL() {
    // Fetch the random URL
    await getRandomURL();

    if (randomURL) {
        // Small delay to ensure tracking scripts load
        setTimeout(() => {
            window.location.href = randomURL;
        }, 100);
    }
}

// Call the displayRandomURL function
displayRandomURL();