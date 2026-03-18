const roastBtn = document.getElementById("roastBtn");
const loadingText = document.getElementById("loading");
const roastOutput = document.getElementById("roastOutput");

// check if spotify already redirected back with data
const params = new URLSearchParams(window.location.search);
const artists = params.get("artists");
const tracks = params.get("tracks");

if(artists && tracks){
    // Auto trigger roast with spotify data
    loadingText.classList.remove("hidden");
    roastBtn.disabled = true;

    fetch('/roast?artists=${encodeURIContent(artists)}&tracks=${encodeURIComponent(tracks)}')
        .then(res => res.json())
        .then(data => {
            roastOutput.textContent = data.roast;
            loadingText.classList.add("hidden");
            roastBtn.disabled = false;
        })
        .catch(() => {
            roastOutput.textContent = "Something went wrong ~womp womp womp~";
            loadingText.classList.add("hidden");
            roastBtn.disabled = false;
        });
}

roastBtn.addEventListener("click", async () => {

    roastOutput.textContent = "";
    loadingText.classList.remove("hidden");
    roastBtn.disabled = true;

    try{
        const response = await fetch("/roast");
        const data = await response.json();

        roastOutput.textContent = data.roast;
    }catch(error){
        roastOutput.textContent = "Something went wrong ~womp womp womp~"
    }

    loadingText.classList.add("hidden");
    roastBtn.disabled = false;
});