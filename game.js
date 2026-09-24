const missions=[
 {place:'School Entrance',icon:'🎒',npc:'👦',speaker:'Ayaan',q:'Ayaan drops his pencils. What should Hoorain do?',choices:[['Help pick them up and ask if he is okay',1,1,'Great! A representative notices when someone needs help.'],['Walk past because class is starting',0,0,'Being on time matters, but helping quickly is a kind choice.'],['Tell someone else to help',0,0,'A leader can set the example too.']]},
 {place:'Year 3 Bronze Classroom',icon:'📚',npc:'👧',speaker:'Sara',q:'Sara says the reading corner needs more exciting books. What should Hoorain do first?',choices:[['Listen and write the idea down',1,1,'Excellent listening! Good representatives collect classmates’ ideas.'],['Promise every book will arrive tomorrow',0,0,'Representatives should not promise something they cannot guarantee.'],['Say her own idea is better',0,0,'A representative should make space for everyone’s voice.']]},
 {place:'Classroom Star Hunt',icon:'⭐',npc:'👩‍🏫',speaker:'Ms. Maple',q:'Quick challenge! Collect all 5 Leadership Stars hidden around the classroom.',type:'stars'},
 {place:'Playground',icon:'🌳',npc:'🧒',speaker:'New Student',q:'A new student is standing alone at break. What could Hoorain do?',choices:[['Invite them to join and introduce them to others',0,2,'Kindness bonus! Helping someone feel included makes school better.'],['Ignore them and keep playing',0,0,'Try to notice classmates who may need a friendly welcome.'],['Tell them to find their own friends',0,0,'A small welcome can make a big difference.']]},
 {place:'Lost & Found',icon:'🔎',npc:'👧',speaker:'Aisha',q:'Aisha cannot find her yellow notebook. Can you spot it among the school things?',type:'find'},
 {place:'Class Ideas Board',icon:'💡',npc:'👧',speaker:'Year 3 Bronze',q:'The class has several ideas. How should Hoorain choose what to take to Student Council?',choices:[['Ask the class and represent common priorities',2,0,'Leadership bonus! Representation means carrying the class’s voice.'],['Only choose her personal favourite',0,0,'Her view matters, but she represents the whole class.'],['Choose her best friend’s idea',0,0,'A representative should consider everyone fairly.']]},
 {place:'Student Council Meeting',icon:'🏫',npc:'👩‍🏫',speaker:'Council Teacher',q:'“What would Year 3 Bronze like us to consider?” How should Hoorain answer?',choices:[['Clearly explain the class idea and why it would help',2,0,'Fantastic! Clear reasons make an idea easier to consider.'],['Say “I forgot” without checking her notes',0,0,'Preparing notes helps a representative speak confidently.'],['Demand everyone agrees immediately',0,0,'Student Council works best through respectful discussion.']]},
 {place:'Back in Year 3 Bronze',icon:'⭐',npc:'👧',speaker:'Classmate',q:'After the meeting, what should Hoorain do?',choices:[['Tell the class what happened and the next steps',1,1,'Exactly! A good representative reports back to the class.'],['Keep everything secret',0,0,'Classmates should know how their ideas were represented.'],['Say every idea was approved even if it was not',0,0,'Being accurate and trustworthy is important.']]}
];
let i=0,stars=0,kindness=0,sound=true;
const $=id=>document.getElementById(id);
function tone(freq=620){if(!sound)return;try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;g.gain.value=.04;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.12)}catch(e){}}
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active')}
function award(text){const a=$('achievement');a.textContent=text;a.classList.remove('show');void a.offsetWidth;a.classList.add('show')}
function updateScore(){ $('stars').textContent=stars; $('kindness').textContent=kindness; }
function render(){
 const m=missions[i]; $('place').textContent=m.place;$('placeIcon').textContent=m.icon;$('npc').textContent=m.npc;$('speaker').textContent=m.speaker;$('question').textContent=m.q;$('feedback').textContent='';$('nextBtn').classList.add('hidden');$('progressFill').style.width=(i/missions.length*100)+'%';$('missionNo').textContent=i+1;$('missionTotal').textContent=missions.length;
 const c=$('choices'),ch=$('challenge'); c.innerHTML='';ch.innerHTML='';ch.classList.add('hidden');
 if(m.type==='stars') return starChallenge(ch);
 if(m.type==='find') return findChallenge(ch);
 m.choices.forEach((x,n)=>{const b=document.createElement('button');b.className='choice';b.textContent=x[0];b.addEventListener('click',()=>choose(n,b));c.appendChild(b)});
}
function choose(n,b){const x=missions[i].choices[n];document.querySelectorAll('.choice').forEach(z=>z.disabled=true);stars+=x[1];kindness+=x[2];updateScore();$('feedback').textContent=x[3];if(x[1]+x[2]>0){b.classList.add('good');award(x[2]>0?'❤️ Kindness earned!':'⭐ Leadership earned!');}tone();$('nextBtn').classList.remove('hidden')}
function starChallenge(ch){
 ch.classList.remove('hidden');ch.innerHTML='<p class="challenge-title">Tap all 5 stars!</p><div class="collect-zone" id="collectZone"></div><p class="mini-status" id="miniStatus">0 / 5 collected</p>';
 const zone=$('collectZone'),pos=[[8,18],[30,62],[51,25],[70,67],[86,18]];let got=0;
 pos.forEach((p,n)=>{const b=document.createElement('button');b.className='collect-star';b.textContent='⭐';b.style.left=p[0]+'%';b.style.top=p[1]+'%';b.setAttribute('aria-label','Collect star '+(n+1));b.addEventListener('click',()=>{if(b.disabled)return;b.disabled=true;got++;stars++;updateScore();$('miniStatus').textContent=got+' / 5 collected';tone(760);if(got===5){$('feedback').textContent='Amazing! You found every Leadership Star.';award('🌟 Star Hunt Complete!');$('nextBtn').classList.remove('hidden')}});zone.appendChild(b)});
}
function findChallenge(ch){
 ch.classList.remove('hidden');ch.innerHTML='<p class="challenge-title">Which item is Aisha’s yellow notebook?</p><div class="object-grid" id="objectGrid"></div><p class="mini-status" id="miniStatus">Look carefully!</p>';
 const items=[['🎒','Backpack'],['📘','Blue book'],['📒','Yellow notebook'],['✏️','Pencil'],['🧃','Juice'],['⚽','Ball']];
 items.forEach(([ico,name])=>{const b=document.createElement('button');b.className='object-btn';b.textContent=ico;b.setAttribute('aria-label',name);b.addEventListener('click',()=>{if(name==='Yellow notebook'){b.classList.add('found');b.disabled=true;kindness+=2;stars+=1;updateScore();$('miniStatus').textContent='Found it! Return it to Aisha.';$('feedback').textContent='Hoorain helped Aisha find her notebook.';award('❤️ Helpful Friend!');tone(800);document.querySelectorAll('.object-btn').forEach(x=>x.disabled=true);$('nextBtn').classList.remove('hidden')}else{$('miniStatus').textContent='Not that one — try again!';tone(300)}});$('objectGrid').appendChild(b)});
}
$('startBtn').addEventListener('click',()=>{i=stars=kindness=0;updateScore();show('play');render()});
$('nextBtn').addEventListener('click',()=>{i++;if(i>=missions.length){$('finalStars').textContent=stars;$('finalKindness').textContent=kindness;$('progressFill').style.width='100%';show('finish');tone(880)}else render()});
$('replayBtn').addEventListener('click',()=>show('start'));
$('soundBtn').addEventListener('click',()=>{sound=!sound;$('soundBtn').textContent=sound?'🔊':'🔇'});
