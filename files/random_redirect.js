// Declare global variables
let counter;
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
    console.log('Counter:', counter); // For debugging
}

async function getRandomURL() {
    try {
        // Add cache-busting parameter
        const cacheBuster = '?v=' + new Date().getTime();
        const response = await fetch('../links/links.txt' + cacheBuster);

        if (!response.ok) {
            throw new Error(`Failed to load links.txt (Status: ${response.status})`);
        }

        const data = await response.text();
        console.log('Raw data:', data); // For debugging
        
        // Split by newlines and filter out empty lines
        const urlsArray = data.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));

        console.log('URLs found:', urlsArray); // For debugging

        if (urlsArray.length === 0) {
            throw new Error('No valid URLs found in links.txt');
        }

        // Select a random URL
        const randomIndex = Math.floor(Math.random() * urlsArray.length);
        randomURL = urlsArray[randomIndex];
        console.log('Selected URL:', randomURL); // For debugging

    } catch (error) {
        console.error('Error:', error);
        document.getElementById("mainContainer").innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>Unable to load links</h3>
                <p>Error: ${error.message}</p>
                <button onclick="window.location.href='/'">Go Home</button>
            </div>
        `;
        randomURL = null;
    }
}

async function displayRandomURL() {
    // First update the counter
    await countClicks();
    
    // Then get a random URL
    await getRandomURL();

    if (randomURL) {
        // Update the page to show redirecting message
        document.getElementById("mainContainer").innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Redirecting you to:</h2>
                <p style="color: #666; word-break: break-all;">${randomURL}</p>
                <p>Please wait...</p>
            </div>
        `;
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = randomURL;
        }, 1500);
    }
}

// Call the function when the page loads
displayRandomURL();