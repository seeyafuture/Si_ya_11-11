/* script.js - numerology + simple traditional-inspired mapping
   This only uses user name, age and mood to produce an entertainment-style insight.
   It stores input in localStorage and shows a composed result in result.html.
*/

function sanitizeName(n){
  if(!n) return '';
  return n.replace(/[^a-zA-Z]/g,'').toUpperCase();
}

// simple Pythagorean numerology: A=1 ... I=9, J=1 ...
function computeNameNumber(name){
  const map = {};
  // create map A-I:1-9, J-R:1-9, S-Z:1-8 (wrap)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let i=0;i<letters.length;i++){
    map[letters[i]] = ((i)%9)+1; // cycles 1..9
  }
  let sum = 0;
  const s = sanitizeName(name);
  for(let ch of s) sum += (map[ch]||0);
  // reduce to single digit 1..9
  while(sum > 9){
    let temp=0;
    String(sum).split('').forEach(d=> temp += Number(d));
    sum = temp;
  }
  if(sum === 0) sum = 5; // neutral fallback
  return sum;
}

// simple mapping from number -> themed archetype & keywords
const archetypes = {
  1: {name:'Leader (Agni)', theme:'initiative, courage, new starts', focus:'Take bold but mindful steps'},
  2: {name:'Supporter (Shakti)', theme:'cooperation, patience, relationships', focus:'Practice listening and small acts of kindness'},
  3: {name:'Creative (Brahma)', theme:'expression, learning, growth', focus:'Start a small creative project'},
  4: {name:'Builder (Vayu)', theme:'discipline, structure, planning', focus:'Make a simple 7-day plan'},
  5: {name:'Explorer (Indra)', theme:'change, freedom, curiosity', focus:'Try one new thing this week'},
  6: {name:'Nurturer (Prithvi)', theme:'care, balance, home', focus:'Focus on rest and relationships'},
  7: {name:'Seeker (Chandra)', theme:'introspection, wisdom, study', focus:'Spend 10 minutes in quiet reflection'},
  8: {name:'Ambition (Surya)', theme:'power, leadership, reward', focus:'Prioritize 1 important goal'},
  9: {name:'Humanitarian (Dharma)', theme:'completion, giving back, vision', focus:'Do a small act for someone today'}
};

// Map mood -> modifier words
const moodMap = {
  'Happy': {tone:'bright', advice:'keep amplifying gratitude'},
  'Confused': {tone:'uncertain', advice:'slow down, journal for clarity'},
  'Stressed': {tone:'tense', advice:'focus on breathing and short walks'},
  'Excited': {tone:'high-energy', advice:'channel energy into creativity'},
  'Calm': {tone:'steady', advice:'build small daily routines'},
  'Motivated': {tone:'driven', advice:'convert motivation into schedule'}
};

// Small age bracket insights
function ageBracket(age){
  if(!age) return 'adult';
  age = Number(age);
  if(age < 18) return 'youth';
  if(age <= 30) return 'young-adult';
  if(age <= 50) return 'mid-life';
  return 'senior';
}

function composePrediction(name, age, mood){
  const number = computeNameNumber(name);
  const arch = archetypes[number] || archetypes[5];
  const moodInfo = moodMap[mood] || {tone:'neutral',advice:'be mindful'};
  const ageGroup = ageBracket(age);

  // Construct a gentle, culturally-inspired paragraph + suggestions
  let title = `Hello ${name||'friend'} — Insight for today`;
  let summary = `As per a simple name-numerology number (${number}) you align with *${arch.name}* — associated with ${arch.theme}. Right now your mood is ${moodInfo.tone} and you are in the ${ageGroup} stage.`;

  let detail = `Short insight: ${arch.focus}. Since you feel ${mood.toLowerCase()}, ${moodInfo.advice}. For your age group (${age||'N/A'}), focus on ${ageGroup === 'youth' ? 'learning & growth' : ageGroup === 'young-adult' ? 'skill building' : ageGroup === 'mid-life' ? 'stability & contribution' : 'well-being & legacy' }.`;

  // Actionable suggestions (ritual-inspired, non-religious)
  let suggestions = [
    `Daily 7-minute breathing or mindfulness practice`,
    `Spend 20 minutes on a focused task related to your top goal`,
    `If you feel stuck: write 3 small steps you can start today`
  ];

  // Optional small 'remedy' inspired suggestions (colors/mantras as gentle prompts)
  const remedies = [
    `Color to wear today: ${['#ffb86b','#7cf8ff','#ffd1e6','#c8ffb8','#ffd58a'][number%5]}`,
    `Focus word for today: ${arch.name.split(' ')[0]}`
  ];

  return {
    title, summary, detail, suggestions, remedies, archNumber: number, archetype: arch
  };
}

/* --- Storage + navigation helpers --- */
function submitForm(){
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const mood = document.getElementById('mood').value;

  if(!name || !age){
    alert('Please enter at least your name and age.');
    return;
  }
  // store
  localStorage.setItem('sv_name', name);
  localStorage.setItem('sv_age', age);
  localStorage.setItem('sv_mood', mood);
  // go to result
  window.location.href = 'result.html';
}

function clearForm(){
  document.getElementById('name').value = '';
  document.getElementById('age').value = '';
  document.getElementById('mood').selectedIndex = 0;
}

/* On result page load */
function loadResult(){
  const name = localStorage.getItem('sv_name') || '';
  const age = localStorage.getItem('sv_age') || '';
  const mood = localStorage.getItem('sv_mood') || 'Calm';

  const out = composePrediction(name, age, mood);

  const header = document.getElementById('resultHeader');
  const body = document.getElementById('resultBody');
  const advice = document.getElementById('resultAdvice');

  header.innerHTML = `<div class="tag">Archetype: ${out.archetype.name} (No. ${out.archNumber})</div>
                      <h2 style="margin:6px 0">${out.title}</h2>
                      <p style="opacity:0.9">${out.summary}</p>`;

  body.innerHTML = `<div style="margin-top:12px">${out.detail}</div>
                    <div class="recommend">
                      <strong>Suggestions</strong>
                      <ul style="margin-top:8px">
                        ${out.suggestions.map(s=>`<li>${s}</li>`).join('')}
                      </ul>
                    </div>`;

  advice.innerHTML = `<div style="margin-top:10px">
                        <strong>Remedies / prompts</strong>
                        <p>${out.remedies.join(' • ')}</p>
                      </div>`;
}