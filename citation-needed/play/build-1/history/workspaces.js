// Authored presentation only. These materials never grant progress or permissions.
const material=(label,title,note)=>({label,title,note});
export const WORKSPACES = [
 {surface:'archive',label:'The school archive table',tool:'Photographs · yearbook · pencil',folio:'Caption notebook',
  action:['Annotate the next source','Annotate the next two sources'],finish:'Finish the source notes',
  materials:[material('Photograph','The original caption','Keep the caption beside the image; leave unconfirmed names open.'),material('Yearbook','A date to check','Match the school club to the dated yearbook page.')],
  question:'What can this photograph actually tell us?'},
 {surface:'catalog',label:'The archive reading room',tool:'Finding aid · street map · index cards',folio:'Source register',
  action:['Index the next source','Index the next two sources'],finish:'Return the source register',
  materials:[material('Finding aid','Where the record lives','Record the collection and shelf mark before closing the box.'),material('Street map','Names change over time','Compare the date of the map with the directory entry.')],
  question:'Could another reader find the same record?'},
 {surface:'interview',label:'The listening table',tool:'Listening copy · transcript · use agreement',folio:'Listening and comparison notes',
  action:['Annotate the next passage','Annotate the next two passages'],finish:'Return the annotated comparison',
  materials:[material('Oral account','Marisol’s recollection','Keep the speaker, timestamp, and agreed use beside the passage.'),material('Printed account','The newspaper’s version','A publication date and a different meaning of “last shift.”')],
  question:'Where do the two accounts agree—and where do they part?'},
 {surface:'exhibit',label:'The exhibit workbench',tool:'Mount board · label proofs · large-print copy',folio:'Exhibit layout notes',
  action:['Develop the next label','Develop the next two labels'],finish:'Return the exhibit materials',
  materials:[material('Object & source','The dated photograph','Keep its source reference and date check with the object.'),material('Visitor route','A readable interpretation','Short labels, clear reading order, and large-print companion text.')],
  question:'What will a visitor understand standing here?'},
 {surface:'seminar',label:'The research planning table',tool:'Question cards · source plan · chapter outline',folio:'Prospectus working notes',
  action:['Develop the next part of the plan','Develop the next two parts'],finish:'Submit the research plan',
  materials:[material('Question','An argument worth testing','Separate what you hope to learn from what you can already support.'),material('Evidence','A feasible source base','Place available collections beside the claims they can bear.')],
  question:'Which evidence can answer this question?'},
 {surface:'manuscript',label:'The dissertation desk',tool:'Chapter pages · citations · margin notes',folio:'Dissertation working pages',
  action:['Draft the next section','Draft the next two sections'],finish:'Submit the revised argument',
  materials:[material('Argument','The historical explanation','Link the claim to dated planning records and the neighborhood press.'),material('Margin notes','The contrary case','Keep the strongest challenge beside the argument it tests.')],
  question:'Does the claim survive its strongest counterexample?'},
 {surface:'dossier',label:'The appointment dossier',tool:'Application folder · teaching sample · workload sheet',folio:'Appointment working papers',
  action:['Assemble the next dossier section','Assemble the next two sections'],finish:'Return the appointment papers',
  materials:[material('Portfolio','Research and teaching','Finished contributions beside a feasible teaching exercise.'),material('Workload','The terms of the job','Pay, teaching responsibilities, and protected research days.')],
  question:'What work does this appointment actually make possible?'},
 {surface:'book',label:'The book editor’s table',tool:'Page proofs · reader reports · revision letter',folio:'Book revision pages',
  action:['Revise the next passage','Revise the next two passages'],finish:'Return the revised manuscript',
  materials:[material('Reader’s page','The story of Northbank','Introduce the place and historical question before the specialist debate.'),material('Notes & credit','The evidence behind it','Citations, contributor credit, and any separately cleared companion material.')],
  question:'Can a reader follow the argument without having seen your boxes?'},
 {surface:'dossier',label:'The committee review table',tool:'Contribution folders · teaching evidence · credit statements',folio:'Tenure dossier notes',
  action:['Document the next contribution','Document the next two contributions'],finish:'Return the documented case',
  materials:[material('Contribution record','Scholarship and teaching','Separate the book, course evidence, and collaborative work.'),material('Credit statement','Who did what','Name individual responsibilities without counting the same work twice.')],
  question:'What does this record demonstrate, and whose work is it?'},
 {surface:'project',label:'The project planning table',tool:'Project briefs · budget sheets · maintenance calendar',folio:'Project planning notes',
  action:['Develop the next commitment','Develop the next two commitments'],finish:'Return the funded project plan',
  materials:[material('Scope','One durable contribution','Choose the edition, exhibition, or archive that the award can sustain.'),material('Maintenance','The work after opening','Give each continuing task funded time and an accountable owner.')],
  question:'What should remain useful after the launch?'},
 {surface:'book',label:'The release review table',tool:'Review copy · source notes · correction sheet',folio:'Release review notes',
  action:['Prepare the next release section','Prepare the next two sections'],finish:'Return the reviewed release',
  materials:[material('Review copy','The complete historical account','Keep disagreement and uncertainty visible in the public version.'),material('Corrections','A way to answer back','Make the source limits and correction route easy to find.')],
  question:'Can the work travel without losing its context?'},
 {surface:'handoff',label:'The successor’s worktable',tool:'Handoff folder · access records · responsibility register',folio:'Handoff register',
  action:['Prepare the next handoff item','Prepare the next two handoff items'],finish:'Return the handoff materials',
  materials:[material('Project record','What passes to the next team','Source records, individual use terms, and contributor credit.'),material('Responsibility','Who answers next week','Funded roles, accepted decision rights, and the correction route.')],
  question:'Can the next team use this without your inbox?'}
];
const LEGACY_WORKSPACES = {
 edition:{surface:'book',label:'The documentary edition table',tool:'Annotated pages · source index · editorial notes',folio:'Edition working pages',
  materials:[material('Documentary text','The sources on the page','Keep a reproduced document distinct from the historian’s interpretation.'),material('Editorial apparatus','Notes another editor can use','Source references, cross-references, and the correction ledger.')]},
 exhibition:{surface:'exhibit',label:'The traveling exhibit workbench',tool:'Panel proofs · installation plan · visitor guide',folio:'Exhibition working notes',
  materials:[material('Exhibit panels','Northbank in context','Keep the neighborhood’s particular history visible when the panels travel.'),material('Host’s packet','A new room, a new audience','Accessible guides, local comparison prompts, and installation notes.')]},
 archive:{surface:'catalog',label:'The community archive table',tool:'Accession folders · access guide · board charter',folio:'Archive working register',
  materials:[material('Item records','Each item has its own terms','Keep the source, use agreement, and correction history together.'),material('Stewardship','The people responsible','A designated board, funded staff, and a route for access questions.')]}
};
export function workspaceFor(state){
 const base=WORKSPACES[state.chapter-1];
 if(state.chapter<10||!state.legacy)return base;
 const selected={...base,...LEGACY_WORKSPACES[state.legacy]};
 if(state.chapter===12)return {...selected,surface:'handoff',label:state.legacy==='edition'?'The incoming editor’s table':state.legacy==='exhibition'?'The exhibition handoff table':'The archive stewardship table',folio:state.legacy==='edition'?'Editorial handoff register':state.legacy==='exhibition'?'Exhibition handoff register':'Archive handoff register'};
 return selected;
}
