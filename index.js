document.addEventListener("DOMContentLoaded", () => {
    // Toggle Menu for Small Screens
    const hamburger = document.querySelector(".hamburger");
    const menu = document.getElementById("menu");

    // Add both touch and click event handling using pointerup
    hamburger.addEventListener("pointerup", () => {
        menu.classList.toggle("active");
    });

    // Optional: Close the menu if clicking outside
    document.addEventListener("pointerup", (event) => {
        if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
            menu.classList.remove("active");
        }
    });
});
