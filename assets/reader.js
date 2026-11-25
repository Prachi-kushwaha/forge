(() => {
 const params=new URLSearchParams(location.search), key=params.get('series')||'sft', series=window.SERIES[key];
 const sidebar=document.getElementById('readerSidebar'), menu=document.getElementById('mobileMenu');
 if(!series){document.getElementById('content').innerHTML='<h1>Series not found</h1>';return;}
 let current=0, completed=new Set(JSON.parse(localStorage.getItem('forge-done-'+key)||'[]'));
 const el=(id)=>document.getElementById(id);
 el('sidebarSeries').innerHTML=`<div class="side-label">${series.category}</div><h2 class="side-title">${series.title}</h2><p class="side-description">${series.description}</p>`;
 function renderList(filter=''){
 const list=el('lessonList');list.innerHTML='';
 series.lessons.forEach((lesson,i)=>{if(!lesson.title.toLowerCase().includes(filter.toLowerCase()))return;
 const a=document.createElement('button');a.className='lesson-item'+(i===current?' active':'')+(completed.has(i)?' done':'');a.innerHTML=`<span class="lesson-number">${String(i+1).padStart(2,'0')}</span><span class="lesson-title">${lesson.title}</span><span class="lesson-check">${completed.has(i)?'✓':''}</span>`;a.addEventListener('click',()=>{current=i;render();sidebar.classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});});list.appendChild(a);});
 }
 function renderTOC(){const content=el('content');const headings=[...content.querySelectorAll('h2,h3')];el('tocLinks').innerHTML=headings.map((h,i)=>{h.id='section-'+i;return `<a href="#${h.id}">${h.textContent}</a>`}).join('');}
 function render(){
 const lesson=series.lessons[current];document.title=lesson.title+' — '+series.title;
 el('crumb').innerHTML=`<a href="series.html">Learning paths</a> / ${series.title} / Lesson ${current+1}`;
 el('content').innerHTML=`<div class="lesson-meta"><span>${series.category}</span><span>${lesson.minutes||8} MIN READ</span></div><h1>${lesson.title}</h1><div class="lesson-actions"><button id="markDone" class="smallbtn">${completed.has(current)?'✓ Completed':'Mark as complete'}</button><button id="copyLink" class="smallbtn">Copy lesson link</button></div><article class="prose">${lesson.content}</article>`;
 el('markDone').addEventListener('click',()=>{if(completed.has(current))completed.delete(current);else completed.add(current);localStorage.setItem('forge-done-'+key,JSON.stringify([...completed]));render();});
 el('copyLink').addEventListener('click',async()=>{const url=new URL(location.href);url.searchParams.set('lesson',current);try{await navigator.clipboard.writeText(url.toString());el('copyLink').textContent='Copied!';}catch{el('copyLink').textContent='Copy unavailable';}});
 renderList(el('lessonSearch').value);renderTOC();updateProgress();
 el('lessonNav').innerHTML=`<button class="navlesson" ${current===0?'disabled':''} id="prev"><span>← Previous lesson</span><strong>${current?series.lessons[current-1].title:'Series overview'}</strong></button><button class="navlesson next" ${current===series.lessons.length-1?'disabled':''} id="next"><span>Next lesson →</span><strong>${current<series.lessons.length-1?series.lessons[current+1].title:'End of series'}</strong></button>`;
 if(current>0)el('prev').addEventListener('click',()=>{current--;render();window.scrollTo({top:0,behavior:'smooth'});});
 if(current<series.lessons.length-1)el('next').addEventListener('click',()=>{current++;render();window.scrollTo({top:0,behavior:'smooth'});});
 }
 function updateProgress(){el('progressText').textContent=`${completed.size} / ${series.lessons.length} completed`;el('progressBar').style.width=(completed.size/series.lessons.length*100)+'%';}
 el('lessonSearch').addEventListener('input',e=>renderList(e.target.value));
 menu.addEventListener('click',()=>sidebar.classList.toggle('open'));
 const start=Number(params.get('lesson'));if(Number.isFinite(start)&&start>=0&&start<series.lessons.length)current=start;
 render();
})();