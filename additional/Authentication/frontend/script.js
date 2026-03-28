async function signup() {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const btn = document.getElementById("signup_button")
    btn.innerText = "Creating Account..."

    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })

    const data = await response.text()
    document.getElementById("message").innerText = data;

    if (data === "Sign up Successful") {
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);
    }

    // alert(data)

}

async function login() {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    const data = await response.json()
    document.getElementById("message").innerText = data

    localStorage.setItem("token", data.token)

    window.location.href = "dashboard.html"

}

async function dashboard() {
    const token = localStorage.getItem("token")
    const response = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }

    })
    const user = await response.json()
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) {
        greeting = "Good Morning";
    }
    else if (hour < 18) {
        greeting = "Good Afternoon";
    }
    else {
        greeting = "Good Evening";

    }

    let seconds = 3600

    setInterval(function () {

        seconds--

        document.getElementById("session").innerText =
            "Session expires in " + seconds + " seconds"

        if (seconds <= 0) {
            alert("Session expired. Please login again.")
            logout()
        }

    }, 1000)

    document.getElementById("dashboard").innerText = greeting + " " + user.name + "👋";
}
function logout() {

    localStorage.removeItem("token")

    window.location.href = "login.html"

}
