document.getElementById('year').textContent = new Date().getFullYear();
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }
});
const publications = window.PUBLICATIONS || [];
const list = document.getElementById('publication-list');
const search = document.getElementById('pub-search');
const type = document.getElementById('pub-type');
const year = document.getElementById('pub-year');
const dialog = document.getElementById('citation-dialog');
const citationText = document.getElementById('citation-text');
let selectedPublication = null;
let selectedFormat = 'bibtex';
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function initials(given) { return given.split(/\s+/).map(p => p[0] + '.').join(' '); }
function joinAuthors(names, conjunction) {
  return names.length < 2 ? names[0] : names.slice(0,-1).join(', ') + ', ' + conjunction + ' ' + names.at(-1);
}
function cite(p, format) {
  const link = p.doi ? 'https://doi.org/' + p.doi : p.url;
  const sourceType = p.entryType || (p.type === 'Preprint' ? 'misc' : 'article');
  if (format === 'bibtex') {
    const tex = value => String(value).replace(/&/g, '\\&').replace(/%/g, '\\%').replace(/#/g, '\\#').replace(/_/g, '\\_');
    const fields = {title:'{' + tex(p.title) + '}', author:p.authors.map(a => tex(a[1]+', '+a[0])).join(' and '), year:p.year};
    if (sourceType === 'article') Object.assign(fields, {journal:tex(p.venue),volume:p.volume,number:p.number,pages:p.pages?.replace('–','--') || p.article});
    else if(sourceType === 'inproceedings') Object.assign(fields,{booktitle:tex(p.venue),pages:p.pages?.replace('–','--')});
    else if(sourceType === 'book') fields.publisher=tex(p.venue);
    else if(sourceType === 'mastersthesis' || sourceType === 'phdthesis') fields.school=tex(p.venue);
    else if(sourceType === 'techreport') fields.institution=tex('Universidade do Vale do Rio dos Sinos');
    if(p.type === 'Preprint') Object.assign(fields, {eprint:p.eprint || p.url.split('/').at(-1),archivePrefix:'arXiv',primaryClass:p.primaryClass});
    const notes = [p.type === 'TCC' ? 'Trabalho de conclusão de curso' : '',p.type === 'Preprint' ? 'Preprint' : '',p.venueRaw || '',p.statusNote || ''].filter(Boolean);
    if(notes.length) fields.note=tex(notes.join('. '));
    Object.assign(fields,{doi:p.doi,url:p.url});
    return '@'+sourceType+'{'+p.id+',\n'+Object.entries(fields).filter(([,v])=>v).map(([k,v])=>'  '+k+' = {'+v+'}').join(',\n')+'\n}';
  }
  if (format === 'apa') {
    const names=p.authors.map(a=>a[1]+', '+initials(a[0]));
    const authors=names.length>20 ? names.slice(0,19).join(', ')+', … '+names.at(-1) : joinAuthors(names,'&');
    let details;
    if(p.type === 'Preprint') details='[Preprint]. arXiv.';
    else if(p.type === 'Dissertação') details='[Dissertação de mestrado, '+p.venue+'].';
    else if(p.type === 'TCC') details='[Trabalho de conclusão de curso, '+p.venue+'].';
    else if(p.type === 'Livro') details=p.venue+'.';
    else if(p.type === 'Relatório técnico') details='[Relatório técnico]. '+(p.venueRaw || p.venue)+'.';
    else if(p.type === 'Material suplementar') details='[Material suplementar]. '+p.venue+'.';
    else if(p.type === 'Conferência') details='In '+p.venue+(p.pages?' (pp. '+p.pages+')':'')+'.';
    else details=p.venue+(p.volume?', '+p.volume+(p.number?'('+p.number+')':''):'')+(p.article?', Article '+p.article:p.pages?', '+p.pages:'')+'.';
    return authors+' ('+p.year+'). '+p.title.replace(/\.$/,'')+'. '+details+' '+(p.statusNote?'['+p.statusNote+']. ':'')+link;
  }
  const authors=joinAuthors(p.authors.map((a,i)=>i===0?a[1]+', '+a[0]:a[0]+' '+a[1]),'and');
  let details;
  if(p.type === 'Preprint') details='arXiv preprint, '+p.year+'.';
  else if(p.type === 'Dissertação') details='Dissertação de mestrado, '+p.venue+', '+p.year+'.';
  else if(p.type === 'TCC') details='Trabalho de conclusão de curso, '+p.venue+', '+p.year+'.';
  else if(p.type === 'Livro') return authors+'. '+p.title+'. '+p.venue+', '+p.year+'. '+link+'.';
  else if(p.type === 'Relatório técnico' || p.type === 'Material suplementar') details=p.venueRaw || p.venue; 
  else if(p.type === 'Conferência') details='In '+p.venue+(p.pages?', '+p.pages:'')+'. '+p.year+'.';
  else details=p.venue+(p.volume?' '+p.volume:'')+(p.number?', no. '+p.number:'')+' ('+p.year+')'+(p.article||p.pages?': '+(p.article||p.pages):'')+'.';
  return authors+'. “'+p.title.replace(/\.$/,'')+'.” '+details+' '+(p.statusNote?'['+p.statusNote+']. ':'')+link+'.';
}
function downloadText(content,name) {
  const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
let publicationPage = 1;
const pageSize = 20;
function renderPublications() {
  const query=search.value.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
  const filtered=publications.filter(p=> (!type.value||p.type===type.value)&&(!year.value||p.year===Number(year.value))&&[p.title,p.venue,p.venueRaw,p.topic,...p.authors.flat()].join(' ').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(query));
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize));publicationPage=Math.min(publicationPage,pages);
  document.getElementById('pub-count').textContent=filtered.length+' de '+publications.length+' publicações no catálogo';
  document.getElementById('pub-page').textContent='Página '+publicationPage+' de '+pages;
  document.getElementById('pub-prev').disabled=publicationPage===1;document.getElementById('pub-next').disabled=publicationPage===pages;
  list.innerHTML=filtered.slice((publicationPage-1)*pageSize,publicationPage*pageSize).map(p=>{
    const links=p.links || [];
    const availableLinks = links.length ? links.map(l=>`<a class="pub-action" href="${escapeHTML(l.url)}" target="_blank" rel="noopener">${escapeHTML(l.label === 'PDF' && !/\.pdf(?:$|\?)|\/pdf\//i.test(l.url) ? 'Acessar artigo' : l.label)} ${l.label === 'PDF' && /\.pdf(?:$|\?)|\/pdf\//i.test(l.url) ? '↓' : '↗'}</a>`).join('') : (p.pdf ? `<a class="pub-action" href="${escapeHTML(p.pdf)}" target="_blank" rel="noopener">PDF ↓</a>` : `<a class="pub-action" href="${escapeHTML(p.url)}" target="_blank" rel="noopener">Acessar publicação ↗</a>`);
    return `<article class="publication-card"><div class="publication-year">${p.year}</div><div><div class="pub-labels"><span class="pub-label ${p.type==='Preprint'?'preprint':''}">${escapeHTML(p.type)}</span>${p.topic !== p.type ? `<span class="pub-label">${escapeHTML(p.topic)}</span>` : ''}</div><h3>${escapeHTML(p.title)}</h3><p class="publication-authors">${escapeHTML((p.authorDisplay || p.authors.map(a=>a.join(' '))).join(' · '))}</p><p class="publication-venue">${escapeHTML(p.venueRaw || p.venue + (p.volume?' · '+p.volume:'')+(p.number?'('+p.number+')':'')+(p.article?' · '+p.article:'')+(p.pages?' · '+p.pages:''))}</p>${p.summary?`<p class="publication-summary">${escapeHTML(p.summary)}</p>`:''}<div class="pub-actions">${availableLinks}${p.doi?`<a class="pub-action" href="https://doi.org/${escapeHTML(p.doi)}" target="_blank" rel="noopener">DOI ↗</a>`:''}<button class="pub-action cite" data-cite="${escapeHTML(p.id)}">Citar · BibTeX / APA / Chicago</button></div></div></article>`;
  }).join('')||'<p class="empty-state">Nenhuma publicação encontrada. Tente outro título, autor ou ano.</p>';
}
for(const y of [...new Set(publications.map(p=>p.year))].sort((a,b)=>b-a)){const option=document.createElement('option');option.value=y;option.textContent=y;year.append(option);}
for(const t of [...new Set(publications.map(p=>p.type))].sort()){const option=document.createElement('option');option.value=t;option.textContent=t;type.append(option);}
function resetPublications(){publicationPage=1;renderPublications();}
search.addEventListener('input',resetPublications);type.addEventListener('change',resetPublications);year.addEventListener('change',resetPublications);
for(const [id,delta] of [['pub-prev',-1],['pub-next',1]])document.getElementById(id).addEventListener('click',()=>{publicationPage+=delta;renderPublications();document.getElementById('publicacoes').scrollIntoView({behavior:'smooth'});});
function updateCitation(){citationText.value=cite(selectedPublication,selectedFormat);document.querySelectorAll('[data-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.format===selectedFormat)));document.getElementById('citation-status').textContent='';}
list.addEventListener('click',event=>{const button=event.target.closest('[data-cite]');if(!button)return;selectedPublication=publications.find(p=>p.id===button.dataset.cite);selectedFormat='bibtex';document.getElementById('citation-title').textContent=selectedPublication.title;updateCitation();dialog.showModal();});
document.getElementById('close-citation').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});
document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>{selectedFormat=b.dataset.format;updateCitation();}));
document.getElementById('copy-citation').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(citationText.value);document.getElementById('citation-status').textContent='Referência copiada.';}catch{citationText.focus();citationText.select();document.getElementById('citation-status').textContent='Selecionei a referência. Use Ctrl+C ou ⌘C para copiar.';}});
document.getElementById('download-citation').addEventListener('click',()=>downloadText(cite(selectedPublication,'bibtex'),selectedPublication.id+'.bib'));
document.getElementById('export-bib').addEventListener('click',()=>downloadText(publications.map(p=>cite(p,'bibtex')).join('\n\n'),'kleinner-farias-publicacoes.bib'));
renderPublications();
