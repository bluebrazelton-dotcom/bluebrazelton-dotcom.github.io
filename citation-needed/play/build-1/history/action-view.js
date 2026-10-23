const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Reserve the longest labels/notes before the first press, at the actual text size.
// Hidden sizing copies never enter the accessible name or imply completed work.
const stableText=(current,variants,tag='span')=>`<span class="stable-text"><${tag}>${esc(current)}</${tag}>${variants.map(text=>`<${tag} class="text-measure" aria-hidden="true">${esc(text)}</${tag}>`).join('')}</span>`;
export function workAction({title,next,detail,workspace,task,energyBudget,units=1}){
 const largestCost=`2 sections · ${task.cost} Energy scheduled (${energyBudget} available) · exhausted work lowers quality`;
 const nextVariants=task.beats.map((_,i)=>task.beats.slice(i,i+units).join(' '));
 return `<button class="choice primary work-action" data-action="work" aria-describedby="work-action-detail">${stableText(title,[...workspace.action,workspace.finish],'strong')}</button><div id="work-action-detail" class="work-action-detail">${stableText(next,nextVariants)}${stableText(detail,[largestCost])}</div>`;
}
