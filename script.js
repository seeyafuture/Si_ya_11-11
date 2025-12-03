function saveName() {
    let name = document.getElementById("username").value;

    if (name.trim() === "") {
        alert("Please enter your name!");
        return;
    }

    localStorage.setItem("username", name);
    window.location.href = "result.html";
}

document.addEventListener("DOMContentLoaded", () => {
    let name = localStorage.getItem("username");
    if (name) {
        document.getElementById("result").innerText =
            name + ", today is going to be a very positive and magical day for you ✨";
    }
});
