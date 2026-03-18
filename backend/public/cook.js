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