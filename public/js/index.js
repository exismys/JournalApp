const elements = document.getElementsByClassName("box");
const colors = ["#97cfa6", "#8bb6c9", "#8f8bc9", "#b167b5", "#ba6689", "#b88876", "#a6b876"]


for (element of elements) {
    const color = colors[Math.floor(Math.random() * 7)];
    console.log(color);
    element.style.backgroundColor = color;
}

document.getElementById("signout").addEventListener("click", (event) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/signin/";
});

document.getElementById("add-icon").addEventListener("click", (event) => {
    console.log("clicked");
    const form = document.getElementById("form-add")
    form.style.display = "block";
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const result = await fetch("/", {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                journalheading: document.getElementById("journalheading").value,
                journalbody: document.getElementById("journalbody").value
            })
        }).then((res) => res.json());
        form.style.display = "none";
        window.location.href = "/";
    })
})