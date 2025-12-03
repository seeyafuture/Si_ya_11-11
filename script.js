/* -------------------------------------------------------
   SEEYA – Final Healing Engine Script (Full Version)
   ------------------------------------------------------- */

/* ========== GLOBAL SETTINGS ========== */
let userVoice = localStorage.getItem("ttsVoice") || "Raveena";
let bgSound = localStorage.getItem("bgMusic") || "none";
let voiceSpeed = Number(localStorage.getItem("voiceSpeed") || 1);


/* ========== MAIN HEALING FUNCTION ========== */
function analyzeAndHeal() {
    const text = document.getElementById("feelingText").value.trim();
    if (!text) return alert("Write what you're feeling.");

    const tag = document.getElementById("feelingTag").value;
    const intensity = document.getElementById("intensity").value;

    const output = buildSupportiveText(text, intensity, tag);

    document.getElementById("chips").innerHTML = `
        <span class="chip">Feeling: ${output.emotion}</span>
        <span class="chip">Intensity: ${intensity}/10</span>
    `;

    document.getElementById("headline").innerText = output.title;
    document.getElementById("analysis").innerText = output.explanation;
    document.getElementById("plan").innerText = output.steps;
    document.getElementById("spiritual").innerText = output.spiritual;

    document.getElementById("resultBox").style.display = "block";
}




/* =======================================================
   DEEP EMOTION + TRAUMA ROOT ANALYZER
   ======================================================= */
function buildSupportiveText(text, intensity, manualTag) {

    const emotions = {
        sadness: ["sad","cry","hurt","empty","down","broken","lost"],
        anxiety: ["scared","nervous","fear","pressure","panic","can't breathe"],
        anger: ["angry","frustrated","annoyed","hate","irritated"],
        loneliness: ["alone","lonely","no one","isolated"],
        confusion: ["confused","stuck","don't know","doubt","overthinking"],
        guilt: ["guilty","fault","my mistake","blame"],
        hope: ["happy","hopeful","good","excited"]
    };

    let detectedEmotion = manualTag !== "Auto-detect" ? manualTag : "Confused";

    textLower = text.toLowerCase();

    for (let emo in emotions) {
        if (emotions[emo].some(w => textLower.includes(w))) {
            detectedEmotion = emo.charAt(0).toUpperCase() + emo.slice(1);
        }
    }

    /* ---------- EXPLANATION ---------- */
    const explanation = generateExplanation(detectedEmotion, text, intensity);

    /* ---------- PLAN ---------- */
    const steps = generatePlan(detectedEmotion);

    /* ---------- SPIRITUAL ---------- */
    const spiritual = generateSpiritual(detectedEmotion);

    return {
        emotion: detectedEmotion,
        title: titleFor(detectedEmotion),
        explanation,
        steps,
        spiritual
    };
}





/* ========== EMOTION TITLE ========== */
function titleFor(e) {
    switch (e) {
        case "Sadness": case "Sad": return "You're carrying something heavy — let’s understand it gently.";
        case "Anxiety": return "It's okay to pause — let's calm this storm together.";
        case "Anger": return "Your mind is overwhelmed — let's unpack this safely.";
        case "Loneliness": return "You deserve connection — let's soften this feeling.";
        case "Confusion": return "It's okay to not know — let's untangle your thoughts.";
        default: return "Let's work through this together.";
    }
}



/* ========== EXPLANATIONS ========== */
function generateExplanation(e, text, intensity) {
    const base = {
        Sadness:
            "This sadness seems to come from emotional exhaustion and unmet expectations. It doesn't mean you're weak — it means you've been strong alone for too long.",
        Anxiety:
            "Your mind is trying to protect you by imagining worst-case scenarios. It's not your fault — it's a survival response triggered by overstimulation.",
        Anger:
            "Your anger is a sign of boundaries being crossed or feeling unheard. Beneath anger, there is usually hurt.",
        Loneliness:
            "Loneliness here isn't about people missing — it's about emotional belonging missing. You want to be understood deeply.",
        Confusion:
            "Your mind feels pulled in multiple directions. When clarity drops, it’s usually due to emotional overload.",
    };

    let extra =
        text.length > 200
            ? "You’ve expressed a lot — which means you're finally letting things out instead of holding everything inside."
            : "You’re aware of what you’re feeling, and that awareness alone is healing.";

    if (intensity > 7) extra += " The intensity shows this has been piling up unaddressed for a while.";

    return base[e] + " " + extra;
}



/* ========== STEP-BY-STEP PLAN ========== */
function generatePlan(e) {
    const plans = {
        Sadness: `
1. Sit somewhere quiet and take 3 slow breaths.
2. Place your hand on your chest — acknowledge “I’m hurting.”
3. Write 2 lines about what you wish someone understood.
4. Drink a glass of water — physical grounding helps.
5. If possible, step outside for 2 minutes of fresh air.
        `,
        Anxiety: `
1. Inhale 4 seconds, hold 2, exhale 6 — repeat 4 times.
2. Identify: “What can I control right now?”
3. Separate fear vs reality — write one line each.
4. Relax your shoulders — anxiety hides in the body.
5. Touch something cold — brings your mind back to the present.
        `,
        Loneliness: `
1. Accept the feeling — it’s valid.
2. Ask yourself: “What connection am I truly craving?”
3. Message one safe person — even a simple hi.
4. Shift environment — open a window or move rooms.
5. Do something that reconnects you to yourself.
        `,
        Anger: `
1. Pause — don’t act.
2. Identify what wound anger is protecting.
3. Write 1 sentence: “What hurt me in this?”
4. Wash your face or hands with cool water.
5. Revisit the situation when calmer.
        `,
        Confusion: `
1. Slow down — clarity cannot appear in noise.
2. Identify your top fear.
3. Write the smallest next step you can take.
4. Don’t decide big things while overloaded.
5. Let the mind settle — answers follow.
        `
    };

    return plans[e] || "Breathe. You’re doing better than you think.";
}



/* ========== SPIRITUAL GUIDANCE (INDIAN) ========== */
function generateSpiritual(e) {
    const guide = {
        Sadness: "Chant 'Om Shanti' 11 times softly. It stabilizes the emotional body.",
        Anxiety: "Place your right hand on your stomach and breathe — activates the solar plexus chakra.",
        Anger: "Try 1 minute of 'Sheetali Pranayama' — instantly cools the mind.",
        Loneliness: "Light a small diya or candle — symbolizes inner presence.",
        Confusion: "Touch the earth/ground for 5 seconds — grounding clears mental fog."
    };
    return guide[e] || "Sit silently for 30 seconds — let the mind settle.";
}



/* =======================================================
   VOICE HEALING SYSTEM
   ======================================================= */
function playShortComfort() {
    const msg =
        "You’re safe right now. Breathe with me. I’m here with you. Nothing is wrong with you — you’re just overwhelmed, and that’s okay.";

    speakText(msg);
    playBackground();
}

function speakText(text) {
    const audio = document.getElementById("ttsAudio");
    audio.src = `https://api.streamelements.com/kappa/v2/speech?voice=${userVoice}&text=${encodeURIComponent(text)}&speed=${voiceSpeed}`;
    audio.play();
}

function playBackground() {
    const bg = document.getElementById("bgAudio");

    const sounds = {
        none: "",
        rain: "https://cdn.pixabay.com/download/audio/2023/03/31/audio_99f4c69c16.mp3?filename=rain-ambient.mp3",
        flute: "https://cdn.pixabay.com/download/audio/2022/10/22/audio_29b0c5e339.mp3?filename=indian-flute.mp3",
        ocean: "https://cdn.pixabay.com/download/audio/2021/09/08/audio_4256d3e5f2.mp3?filename=ocean-waves.mp3"
    };

    bg.src = sounds[bgSound];
    if (bgSound !== "none") bg.play();
}



function saveTTSSettings() {
    userVoice = document.getElementById("ttsVoice").value;
    bgSound = document.getElementById("bgMusic").value;
    voiceSpeed = document.getElementById("voiceSpeed").value;

    localStorage.setItem("ttsVoice", userVoice);
    localStorage.setItem("bgMusic", bgSound);
    localStorage.setItem("voiceSpeed", voiceSpeed);

    alert("Voice settings saved.");
}



/* =======================================================
   JOURNALING + MOOD TRACKING + PDF EXPORT
   ======================================================= */

function saveMoodPoint() {
    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]");
    logs.push({
        emotion: document.getElementById("headline").innerText,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("moodLogs", JSON.stringify(logs));
    alert("Mood saved.");
}

function saveJournal() {
    const text = document.getElementById("feelingText").value;
    const logs = JSON.parse(localStorage.getItem("journal") || "[]");

    logs.push({
        entry: text,
        time: new Date().toLocaleString()
    });

    localStorage.setItem("journal", JSON.stringify(logs));
    alert("Journal saved.");
}


function exportPDF() {
    const content = `
SeeYa Healing Report
----------------------

Feeling:
${document.getElementById("feelingText").value}

Emotion Detected:
${document.getElementById("headline").innerText}

Explanation:
${document.getElementById("analysis").innerText}

Steps:
${document.getElementById("plan").innerText}

Spiritual Guidance:
${document.getElementById("spiritual").innerText}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "SeeYa_Healing_Report.txt";
    link.click();
} 
