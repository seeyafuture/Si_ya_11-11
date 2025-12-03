/* script.js v1.0.5 - unified healing & prediction engine */

/* ------- Config / state ------- */
let state = {
  ttsVoice: localStorage.getItem('seeya_ttsVoice') || 'Raveena',
  bgMusic: localStorage.getItem('seeya_bgMusic') || 'none',
  voiceSpeed: Number(localStorage.getItem('seeya_voiceSpeed') || 1)
};

/* ------- Utilities ------- */
function saveSetting(key,val){ localStorage.setItem(key,val); state[key]=val; }
function nowISO(){ return new Date().toISOString(); }

/* ------- Affirmations ------- */
const AFFIRMATIONS = [
  "I am worthy of care and peace.",
  "I give myself permission to rest.",
  "I am allowed to feel and to heal.",
  "One small step is progress.",
  "I am learning, and learning is growth.",
  "I deserve kindness, especially from myself."
];
function giveAffirmation(){
  const pick = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];
  const el = document.getElementById('affirmBox');
  if(el) el.innerHTML = `🌼 <b>${pick}</b>`;
  return pick;
}
function pinAffirmation(){ saveSetting('seeya_pinnedAff', JSON.stringify({date:new Date().toDateString(), text: document.getElementById('affirmBox').innerText})); alert('Pinned'); }

/* ------- Emotion detection (heuristic) ------- */
const EMO_KEYWORDS = {
  sad:['sad','cry','hurt','depress','hopeless','grief','tear','alone','lonely'],
  anxious:['anxiety','anxious','panic','worried','worry','scared','fear'],
  angry:['angry','mad','furious','irritate','annoyed','hate','rage'],
  stressed:['stress','overwhelm','burnout','pressure','tired','exhausted'],
  confused:['confused','lost','doubt','unsure','uncertain'],
  positive:['happy','joy','good','grateful','excited','hope']
};
function detectEmotion(text){
  const s=text.toLowerCase();
  let best='mixed', max=0;
  for(const k in EMO_KEYWORDS){
    let count=0;
    EMO_KEYWORDS[k].forEach(w=>{ if(s.includes(w)) count++; });
    if(count>max){ max=count; best=k; }
  }
  return best;
}

/* ------- Root cause & pattern detectors ------- */
function detectRootCause(text){
  const s=text.toLowerCase();
  const out=[];
  if(/work|job|boss|deadline|office/.test(s)) out.push('work / burnout');
  if(/love|breakup|partner|relationship|marriage|gf|bf/.test(s)) out.push('relationship / love');
  if(/family|mother|father|parents|home/.test(s)) out.push('family dynamics');
  if(/money|debt|loan|bills|finance/.test(s)) out.push('financial stress');
  if(/identity|purpose|who am i|meaning/.test(s)) out.push('existential / identity');
  if(out.length===0) out.push('general emotional overload / mixed triggers');
  return out;
}
function detectPatterns(text){
  const s=text.toLowerCase(); const p=[];
  if(/always|never|everyone|nobody/.test(s)) p.push('all-or-nothing thinking');
  if(/what if|worst case|if /.test(s)) p.push('catastrophizing');
  if(/should|must|have to/.test(s)) p.push('perfectionism / rules');
  if(/i am worthless|i am useless|i deserve/.test(s)) p.push('negative core belief');
  if(p.length===0) p.push('no specific thinking pattern detected');
  return p;
}

/* ------- Compose supportive report ------- */
function buildSupportiveText(text,intensity,manualTag){
  const emotion = manualTag && manualTag!=='Auto-detect' ? manualTag.toLowerCase() : detectEmotion(text);
  const causes = detectRootCause(text);
  const patterns = detectPatterns(text);
  const headMap = {
    sad:'I hear sadness — that weight is real.',
    anxious:'Your mind is racing — let’s calm it.',
    angry:'Your anger is loud — let’s find the hurt beneath.',
    stressed:'You seem overwhelmed — small steps help.',
    confused:'Your thoughts are tangled — let’s sort them gently.',
    positive:'You feel good — protect this feeling.',
    mixed:'Your feelings are mixed — hold them with kindness.'
  };
  const head = headMap[emotion] || headMap['mixed'];
  const analysis = `Detected: ${emotion}. Intensity: ${intensity}/10.\nRoot causes: ${causes.join(', ')}.\nPatterns: ${patterns.join(', ')}.\n\n` +
    `You are showing awareness — that itself is healing. The following steps are practical, small and tested to help ground a racing mind.`;
  const plan = [];
  plan.push('STEP 1 — Ground for 2–5 minutes: feet on floor, 5 slow breaths.');
  if(emotion==='sad' || emotion==='mixed') plan.push('STEP 2 — Comfort: drink water, put hand on chest, write one sentence that expresses the feeling.');
  if(emotion==='stressed' || emotion==='anxious') plan.push('STEP 2 — Prioritize: write 3 tiny tasks (5 minutes each). Do one now.');
  if(emotion==='angry') plan.push('STEP 2 — Pause: step away 2 min, splash water, count breaths.');
  plan.push('STEP 3 — Reflect (5–10 min): journal: "What I need most now is..."');
  plan.push('STEP 4 — Small ritual (optional): mantra, short prayer, lighting a lamp.');
  plan.push('STEP 5 — Seek help if intensity persists >24 hours or thoughts of self-harm appear.');
  const spiritual = {
    sad:'Chant softly: "Om Shanti" 11 times or offer thanks to a simple ritual you find calming.',
    anxious:'Practice slow abdominal breathing and repeat "Shanti" softly.',
    angry:'Sheetali pranayama (cooling breath) helps regulate heat and anger.',
    lonely:'Listen to a bhajan or sing a comforting phrase; connect with one person.',
    confused:'Write pros/cons for one small immediate decision; ground by touching earth.',
    positive:'Share gratitude aloud or do a small kindness.'
  }[emotion] || 'Take a 2-minute silent pause and notice the breath.';
  return { emotion, head, analysis, plan, spiritual, causes, patterns };
}

/* ------- TTS (fallback to free endpoint + WebSpeech) ------- */
function speakText(text){
  // try free StreamElements tts first (no-key); else fallback to Web Speech API
  const audioEl = document.getElementById('ttsAudio') || document.getElementById('ttsAudio_home');
  try {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${encodeURIComponent(state.ttsVoice)}&text=${encodeURIComponent(text)}`;
    if(audioEl){ audioEl.src = url; audioEl.play().catch(()=> speakWeb(text)); }
    else speakWeb(text);
  } catch(e){
    speakWeb(text);
  }
}
function speakWeb(text){
  if(!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  if(voices && voices.length){
    const v = voices.find(v=>/en|english|hi/.test(v.lang)) || voices[0];
    if(v) u.voice = v;
  }
  u.rate = state.voiceSpeed || 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
function playShortComfort(){
  const msg = "You are safe in this moment. Take a deep breath. You are not alone.";
  speakText(msg);
  playBackground();
}

/* ------- Background audio ------- */
function playBackground(){
  const bg = document.getElementById('bgAudio') || document.getElementById('bgAudio_home');
  const map = {
    none:'',
    rain:'https://cdn.pixabay.com/download/audio/2023/03/31/audio_99f4c69c16.mp3?filename=rain-ambient.mp3',
    flute:'https://cdn.pixabay.com/download/audio/2022/10/22/audio_29b0c5e339.mp3?filename=indian-flute.mp3',
    ocean:'https://cdn.pixabay.com/download/audio/2021/09/08/audio_4256d3e5f2.mp3?filename=ocean-waves.mp3'
  };
  if(!bg) return;
  bg.src = map[state.bgMusic] || '';
  if(state.bgMusic!=='none'){ bg.volume = 0.45; bg.play().catch(()=>{}); } else { try{ bg.pause(); }catch(e){} }
}

/* ------- Save TTS settings ------- */
function saveTTSSettings(){
  const v = document.getElementById('ttsVoice') ? document.getElementById('ttsVoice').value : state.ttsVoice;
  const bg = document.getElementById('bgMusic') ? document.getElementById('bgMusic').value : state.bgMusic;
  const speed = document.getElementById('voiceSpeed') ? document.getElementById('voiceSpeed').value : state.voiceSpeed;
  state.ttsVoice = v; state.bgMusic = bg; state.voiceSpeed = Number(speed);
  localStorage.setItem('seeya_ttsVoice', state.ttsVoice);
  localStorage.setItem('seeya_bgMusic', state.bgMusic);
  localStorage.setItem('seeya_voiceSpeed', state.voiceSpeed);
  alert('Voice settings saved locally');
  playBackground();
}

/* ------- Render functions for page wrappers (index) ------- */
function analyzeAndHeal_home_wrapper(){
  // kept for compatibility (index uses analyzeAndHeal_home)
  return;
}

/* ------- Home quick wrappers used in index.html --- */
function analyzeAndHeal_home(){ /* implemented inline in index, wrappers call buildSupportiveText */ }

/* ------- Save mood / journal / mood chart ------- */
function saveMoodPoint(){
  const logs = JSON.parse(localStorage.getItem('seeya_mood')||'[]');
  logs.push({time:new Date().toISOString()});
  localStorage.setItem('seeya_mood', JSON.stringify(logs));
  alert('Saved mood point');
}
function saveJournal(){
  const text = document.getElementById('feelingText') ? document.getElementById('feelingText').value : (document.getElementById('feelingText_home') ? document.getElementById('feelingText_home').value : '');
  if(!text) return alert('Write something');
  const arr = JSON.parse(localStorage.getItem('seeya_journal')||'[]');
  arr.push({time:new Date().toISOString(), text});
  localStorage.setItem('seeya_journal', JSON.stringify(arr));
  alert('Journal saved locally');
}
function renderMoodChart(){
  const canvas = document.getElementById('moodChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = 140;
  ctx.clearRect(0,0,w,h);
  const logs = JSON.parse(localStorage.getItem('seeya_mood')||'[]');
  if(!logs.length){ ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillText('No mood points yet',10,20); return; }
  const last = logs.slice(-10);
  ctx.beginPath();
  for(let i=0;i<last.length;i++){ const x = (i+1)*(w/(last.length+1)); const y = h - ( (i+1)/(last.length+1) * (h-20) ); ctx.lineTo(x,y); }
  ctx.strokeStyle='rgba(6,150,170,0.9)'; ctx.lineWidth=2; ctx.stroke();
}

/* ------- Export (simple text file) ------- */
function exportTextReport(){
  const text = document.getElementById('feelingText') ? document.getElementById('feelingText').value : '';
  const blob = new Blob([text], {type:'text/plain'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'SeeYa_Report.txt'; a.click();
}

/* ------- On load restore small things ------- */
window.addEventListener('load', function(){
  // show pinned affirmation if exists
  const pinned = JSON.parse(localStorage.getItem('seeya_pinnedAff')||'null');
  if(pinned && pinned.date === new Date().toDateString()){ if(document.getElementById('affirmBox')) document.getElementById('affirmBox').innerText=pinned.text; }
  else giveAffirmation();
  // restore tts settings
  const tv = localStorage.getItem('seeya_ttsVoice'); if(tv) state.ttsVoice = tv;
  const bm = localStorage.getItem('seeya_bgMusic'); if(bm) state.bgMusic = bm;
  const vs = localStorage.getItem('seeya_voiceSpeed'); if(vs) state.voiceSpeed = Number(vs);
  renderMoodChart();
});
