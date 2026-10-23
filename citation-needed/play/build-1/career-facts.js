export const ROUTES = Object.freeze({
  discovery:{name:'Field-Defining Scholar',commitment:'Discovery',owner:'C12-CST-01',actor:'Dr. Leila Mensah and the independent methods forum',carrier:'Correctable Routes Framework'},
  public:{name:'Public Scholar',commitment:'Public Contribution',owner:'C12-CST-02',actor:'Elise Chen and the Harbor public-service partners',carrier:'Harbor Route Guide and return register'},
  institution:{name:'Institution Builder',commitment:'Institutional Stewardship',owner:'C12-CST-03',actor:'National Academy Council, represented staff and successor board',carrier:'Funded access-and-review mandate'},
  community:{name:'Generational Mentor',commitment:'Scholarly Community',owner:'C12-CST-04',actor:'Amina Clarke and Jonah Reyes, each directing an independent line',carrier:'Two independently governed research and teaching lines'}
});
export const focusText = s => ({legibility:{question:'When does a published route become a route someone can actually find?',object:'publication dates and entry instructions',boundary:'A listed opportunity is not proof that a person could find it.'},usability:{question:'When is an available option actually usable?',object:'schedules, fees and workable attendance windows',boundary:'An open place is not proof that its timetable and costs are workable.'},carryover:{question:'What can someone carry forward when a route changes?',object:'closure notices, redirection records and retained preparation',boundary:'A disappearance from one route is not proof of failure or of voluntary departure.'}}[s.research?.focus] || {question:'What makes a public route usable?',object:'public route descriptions',boundary:'Descriptions alone do not explain individual outcomes.'});
export const chapterState = s => s.career.chapters[s.career.chapter];
export const chosen = (s,n,key) => s.career.chapters[n]?.choices[key];
export const fact = (s,key) => s.career.facts[key];
export function remember(s,owner,text){const c=s.career;if(!c.notes.some(x=>x.owner===owner&&x.text===text))c.notes.push({owner,text});if(!s.record.includes(text))s.record.push(text);}
export function put(s,key,owner,value){s.career.facts[key]={owner,...value};}
export function demonstrate(s,owner,commitment,act){if(!s.career.receipts.some(r=>r.owner===owner)){s.career.receipts.push({owner,commitment,act,chapter:s.career.chapter,demonstrated:true});remember(s,owner,`${commitment} · ${act}`);}}
export function recognize(s,key,owner,title){if(!fact(s,key)){put(s,key,owner,{title});s.standing++;remember(s,owner,title);}}
export function source(s,owner,upstream,claim,terms,extra={}){s.career.profiles[owner]={owner,upstream,claim,terms,...extra};s.career.currentProfile=owner;}
export function rows(...values){return values.filter(Boolean);}
export function option(key,label,detail,next,effect=()=>{},available=true){return {key,label,detail,next,effect,available};}
export function scene(owner,title,description,lines,next,effect=()=>{},label='Continue'){return {kind:'scene',owner,title,description,lines,next,effect,label};}
export function choice(owner,title,description,lines,options){return {kind:'choice',owner,title,description,lines,options};}
export function work(owner,title,description,task,next,drafts,effect=()=>{}){return {kind:'work',owner,title,description,task,next,drafts,effect};}
export function earnedCounts(s){const counts=Object.fromEntries(Object.values(ROUTES).map(r=>[r.commitment,0]));for(const r of s.career.receipts)if(r.demonstrated)counts[r.commitment]=(counts[r.commitment]||0)+1;return counts;}
export function secondaryFor(s,route){const counts=earnedCounts(s),primary=ROUTES[route].commitment;return Object.keys(counts).filter(k=>k!==primary&&counts[k]>0).sort((a,b)=>counts[b]-counts[a]||a.localeCompare(b))[0]||null;}
export function eligibleSummits(s){
 const c=s.career,counts=earnedCounts(s),w=c.witnesses;
 return Object.fromEntries(Object.entries(ROUTES).map(([key,r])=>{
  const witness=w[key],ready=Boolean(fact(s,'eminence')&&witness&&counts[r.commitment]>0&&(key!=='institution'||fact(s,'academyPackage')?.status==='accepted'));
  return [key,{ready,reason:ready?`${witness.actor}; ${witness.floor}`:key==='institution'?'Requires both enacted safeguards, an accepted Council/staff package and Academy membership.':key==='public'?'Requires an actual partner pilot and two completed finding-and-limit returns.':key==='community'?'Requires two willing, separately credited and resourced independent lines.':'Requires a bounded contribution, completed Discovery follow-through and an independent critic.'}];
 }));
}
