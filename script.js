const affirmations = [
    "I am safe, I am strong, I am healing.",
    "The universe is guiding me gently.",
    "I release what doesn’t belong to me.",
    "I am becoming the best version of myself.",
    "My energy is calm, grounded and peaceful."
];

function newAffirmation() {
    const box = document.getElementById("affirmText");
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    box.innerText = random;
}
