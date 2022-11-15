document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = await fetch("/signin/", {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        })
    }).then((res) => res.json());

    if (result.status == 'ok') {
        localStorage.setItem('token', result.token);

        const res = await fetch("/isauthorized/", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
            }),
        }).then(res => res.json());
        if (res.status == "ok") {
            localStorage.setItem("username", res.username);
            window.location.href = `/user/?un=${res.username}`;
        } else {
            alert(res.error);
        }
    } else {
        alert(result.error);
    }
});