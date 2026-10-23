// Display-only wording. Stored records, IDs, summaries and action history stay intact.
export const BUILD = '20261013p7b';
export function playerText(value) {
  return String(value)
    .replace(/^(Milestone: )?C\d{2}-[A-Z]+-\d{2}(?:-[A-Z]\d{2})?\s*·\s*(\S)/,(_,prefix,first)=>(prefix||'')+first.toUpperCase())
    .replace(/\blegacy (?:paths|finales)\b/gi,'career endings')
    .replace(/\blegacy finale\b/gi,'career ending')
    .replace(/\bsummits\b/gi,'endings')
    .replace(/\bsummit\b/gi,'ending')
    .replace('The optional Chapter 4 feasibility Opening appears inside the new design.','You can align teaching and access calendars when you begin the new design.')
    .replace('the visible Chapter 5 Opening','the start of Chapter 5')
    .replace(/Cycle 4\.2 begins/g,'The evidence audit begins')
    .replace('The final decision checks that work; it is not a hidden random roll.','The final decision checks your completed work against the stated criteria.');
}
export function presentPlayerCopy(root) {
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(node.parentElement.closest('script,style,#announcement'))continue;
    const next=playerText(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;
  }
  for(const node of root.querySelectorAll('[aria-label],[title]'))for(const attr of ['aria-label','title']){
    if(node.hasAttribute(attr)){const before=node.getAttribute(attr),after=playerText(before);if(before!==after)node.setAttribute(attr,after);}
  }
}
export function directionGuide() {
  return '<aside class="direction-guide" aria-label="Scholarly directions"><strong>What kind of scholar will you become?</strong><p>A demonstration records completed work toward a scholarly purpose. Discovery develops claims others can test; Public Contribution supports accountable public use; Scholarly Community supports other scholars’ independent work; Institutional Stewardship builds accountable organizations. Your completed work helps prepare different career endings. These purposes are not a ranking, and selecting a direction alone earns no demonstration.</p></aside>';
}
