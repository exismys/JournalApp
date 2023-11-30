document.addEventListener('DOMContentLoaded', function () {
    const elements = document.getElementsByClassName("box");
    const colors = [
        "#D4A5A5", "#7C8B8B", "#A2B5CD", "#BDB76B", "#CDB7B5", "#B0E0E6", "#CD853F",
        "#FFD700", "#8FBC8F", "#DAA520", "#8B4513", "#556B2F", "#BDB76B", "#B0E0E6",
        "#D2B48C", "#4682B4", "#2F4F4F", "#800000", "#556B2F", "#B8860B", "#808080",
        "#483D8B", "#006400", "#2F4F4F", "#556B2F", "#8B4513", "#556B2F", "#808080",
        "#9370DB", "#CD5C5C", "#778899", "#D2691E", "#20B2AA", "#8B008B", "#2E8B57"
    ];

    for (element of elements) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        element.style.backgroundColor = color;
        const textColor = isBrightColor(color) ? '#333' : '#eee';
        element.style.color = textColor;
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
            window.location.href = `/user/?un=${localStorage.getItem("username")}`;
        });
    });

    // const deleteButtons = document.querySelectorAll('.delete-button');
    // deleteButtons.forEach((button, index) => {
    //     button.addEventListener('click', (event) => {
    //         // Handle the deletion here
    //         deleteJournal(index);
    //     });
    // });
});

// Function to delete a journal entry
// async function deleteJournal(index) {
//     const result = await fetch("/", {
//         method: 'DELETE',
//         headers: {
//             "content-type": "application/json",
//         },
//         body: JSON.stringify({
//             username: localStorage.getItem("username"),
//             journalIndex: index
//         })
//     }).then((res) => res.json());

//     // Handle the result if needed
//     console.log(result);

//     // Optionally, you might want to refresh the page or update the UI
//     window.location.href = `/user/?un=${localStorage.getItem("username")}`;
// }



function isBrightColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
}

async function isAuthorized() {
    const result = await fetch("/isauthorized/", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            token: localStorage.getItem("token")
        })
    }).then(res => res.json());

    if (result.status !== "ok" || result.username !== window.location.search.substring(4)) {
        window.location.href = "/signin/";
    }
}

isAuthorized();
