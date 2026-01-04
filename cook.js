// get elements from html
const roastBtn = document.getElementById("roastBtn");
const loadingText = document.getElementById("loading");
const roastOutput = document.getElementById("roastOutput");


roastBtn.addEventListener("click", async () => {

    roastOutput.textContent = "";
    loadingText.classList.remove("hidden");
    roastBtn.disabled = true;

    try{
        const response = await fetch("http://localhost:3000/roast");
        const data = await response.json();

        roastOutput.textContent = data.roast;
    }catch(error){
        roastOutput.textContent = "Something went wrong ~womp womp womp~"
    }

    loadingText.classList.add("hidden");
    roastBtn.disabled = false;
});

 /* this is actually the first of making this js file ill be just commenting it out 
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
    }, 2000); */

});
