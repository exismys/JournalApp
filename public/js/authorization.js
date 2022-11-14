const isAuthorized = async function () {
    const result = await fetch("/isauthorized/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("token"),
        }),
    }).then((res) => res.json());

    console.log(result)

    if (result.status == "ok") {
        window.location.href = `/user/?un=${result.username}`;
    } else {
        window.location.href = "/signin/";
    }
}

isAuthorized();