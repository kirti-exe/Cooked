// get elements from html
const roastBtn = document.getElementById("roastBtn");
const loadingText = document.getElementById("loading");
const roastOutput = document.getElementById("roastOutput");

// when button is clicked
roastBtn.addEventListener("click", () => {

    // clear previous roast
    roastOutput.textContent = "";

    // show loading text
    loadingText.classList.remove("hidden");

    // disable button to prevent spam clicks
    roastBtn.disabled = true;

    // fake delay to simulate analysis
    setTimeout(() => {
        const fakeRoast = `
    You really wake up everyday and choose THIS music?

    Your Spotify thinks you're either:
    - emotionally unavailable
    - stuck in 2017
    - or healing from something you refuse to talk about
    
    Respectfully , your playlist needs therapy.
        `;

        // hide loading text
        loadingText.classList.add("hidden");

        // show roast
        roastOutput.textContent = fakeRoast;

        // enable button again
        roastBtn.disabled = false;
    }, 2000);
});