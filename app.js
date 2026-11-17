/* Ghost TV - personal media hub. No channel feeds are bundled. */
const $ = s => document.querySelector(s);
const state = {channels:[], media:[], favourites:[], current:null, hls:null, page:'home', streamMode:'auto'};

// Curated starter catalogue: real titles and official/free-to-watch destinations.
// Availability can vary by country and rights; links open the provider's own player/page.
const FREE_CHANNELS = [
  {id:'free-dw',name:'DW English',group:'International News',streamUrl:'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',source:'DW live HLS stream'},
  {id:'free-aljazeera',name:'Al Jazeera English',group:'International News',streamUrl:'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',source:'Al Jazeera live HLS stream'},
  {id:'free-cgtn',name:'CGTN English',group:'International News',streamUrl:'https://news.cgtn.com/resource/live/english/cgtn-news.m3u8',source:'CGTN official live stream'},
  {id:'free-nbcnews',name:'NBC News NOW',group:'US News',streamUrl:'https://dai2.xumo.com/amagi_hls_data_xumo1212A-xumo-nbcnewsnow/CDN/master.m3u8',source:'NBC News NOW free streaming distribution'},
  {id:'free-france24-page',name:'France 24 English',group:'International News',webUrl:'https://www.france24.com/en/live',source:'Official broadcaster player page'},
  {id:'free-skynews',name:'Sky News',group:'International News',webUrl:'https://news.sky.com/watch-live',source:'Official broadcaster player page'},
  {id:'free-nhk',name:'NHK World-Japan',group:'International News',webUrl:'https://www3.nhk.or.jp/nhkworld/en/live/',source:'Official broadcaster player page'},
  {id:'free-nasa',name:'NASA+',group:'Science & Space',webUrl:'https://plus.nasa.gov/',source:'Official NASA streaming page'},
  {id:'free-enca',name:'eNCA',group:'African News',webUrl:'https://www.enca.com/live',source:'Official broadcaster player page'},
  {id:'free-plex',name:'Plex Free Live TV',group:'Entertainment',webUrl:'https://watch.plex.tv/live-tv',source:'Plex official free ad-supported TV; regional lineup varies'}
];

const LOCAL_CHANNELS = [
  {id:'kids-cv-zone',name:'CV Kids Zone · Zambia',group:'Kids & Cartoons · Free',embedUrl:'https://centralvoicetv.com/pages/live-channel.php?slug=cvkids',webUrl:'https://centralvoicetv.com/pages/live-channel.php?slug=cvkids',source:'Central Voice TV official 24/7 free kids channel; CH 103'},
  {id:'kids-pluto-us',name:'Pluto TV Kids · US',group:'Kids & Cartoons · Free (region-limited)',webUrl:'https://pluto.tv/us/watch/live-tv/category/kids-us/',source:'Free ad-supported US kids lineup; availability may be restricted outside the US'},
  {id:'kids-plex',name:'Plex Kids & Family',group:'Kids & Cartoons · Free',webUrl:'https://www.plex.tv/watch-free-tv/',source:'Free ad-supported live TV; kids channel availability varies by region'},
  {id:'kids-cartoon-network',name:'Cartoon Network',group:'Kids · Subscription channel',webUrl:'https://www.dstv.com/en-zm/explore/dstv-channels/',source:'DStv Zambia channel 301; subscription required; no verified free live feed'},
  {id:'kids-cartoonito',name:'Cartoonito',group:'Kids · Subscription channel',webUrl:'https://www.dstv.com/en-zm/explore/dstv-channels/',source:'DStv Zambia kids channel; subscription required'},

  {id:'zm-diamond',name:'Diamond TV Zambia',group:'Zambia · News & Entertainment',webUrl:'https://diamondtvzambia.com/',source:'Official Diamond Media website'},
  {id:'zm-znbc1',name:'ZNBC TV 1 · Official Live',group:'Zambia · Public Broadcasting',embedUrl:'https://www.youtube.com/embed/live_stream?channel=UCfj02nDD3GPtYauRKimZL3Q',webUrl:'https://www.youtube.com/@ZNBC/live',source:'ZNBC official YouTube channel; live playback only while a broadcast is active'},
  {id:'zm-znbc2',name:'ZNBC TV 2',group:'Zambia · Public Broadcasting',webUrl:'https://www.znbc.co.zm/',source:'ZNBC official website'},
  {id:'zm-parliament',name:'Parliament TV Zambia',group:'Zambia · Parliament',webUrl:'https://www.parliament.gov.zm/',source:'National Assembly official website'},
  {id:'zm-zanis',name:'ZANIS TV',group:'Zambia · News & Current Affairs',webUrl:'https://www.zanis.gov.zm/',source:'Zambia News and Information Services'},
  {id:'zm-prime',name:'Prime TV Zambia',group:'Zambia · News & Entertainment',webUrl:'https://primetvzambia.live/',source:'Prime TV website; live broadcast currently announced as coming soon'},
  {id:'zm-muvi',name:'Muvi TV',group:'Zambia · Entertainment',webUrl:'https://www.muvitv.com/',source:'Muvi TV official website'},
  {id:'zm-kbn',name:'KBN TV',group:'Zambia · News & Current Affairs',webUrl:'https://www.iba.org.zm/content-service-providers/',source:'IBA broadcaster directory; official live link not confirmed'},
  {id:'zm-power',name:'Power TV',group:'Zambia · Entertainment',webUrl:'https://www.powerfmzambia.com/',source:'Power FM/TV official web presence; live TV link not confirmed'}
];

const FREE_MOVIES = [
  {id:'pd-hisgirlfriday',title:'His Girl Friday',type:'movies',genre:'Comedy',year:'1940',description:'Classic fast-paced newsroom comedy. Public-domain catalogue listing.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'},
  {id:'pd-thegeneral',title:'The General',type:'movies',genre:'Adventure / Comedy',year:'1926',description:'Silent-era action comedy starring Buster Keaton.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'},
  {id:'pd-metropolis',title:'Metropolis',type:'movies',genre:'Sci-Fi',year:'1927',description:'Landmark science-fiction silent film.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'},
  {id:'pd-detour',title:'Detour',type:'movies',genre:'Crime / Film Noir',year:'1945',description:'Classic film-noir road thriller.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'},
  {id:'pd-flyingdeuces',title:'The Flying Deuces',type:'movies',genre:'Comedy',year:'1939',description:'Laurel and Hardy comedy adventure.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'},
  {id:'pd-meetjohndoe',title:'Meet John Doe',type:'movies',genre:'Drama',year:'1941',description:'Classic American drama directed by Frank Capra.',sourceUrl:'https://archivewatch.org/',sourceLabel:'Archive Watch · public-domain cinema'}
];
const FREE_SERIES = [
  {id:'tv-beverly',title:'The Beverly Hillbillies',type:'series',genre:'Comedy',description:'Classic sitcom episodes listed in a free classic-TV collection.',sourceUrl:'https://starlitetv.com/free/',sourceLabel:'Starlite TV · classic TV episodes'},
  {id:'tv-bonanza',title:'Bonanza',type:'series',genre:'Western',description:'Classic western episodes from the Cartwright family ranch.',sourceUrl:'https://starlitetv.com/free/',sourceLabel:'Starlite TV · classic TV episodes'},
  {id:'tv-dragnet',title:'Dragnet',type:'series',genre:'Crime / Drama',description:'Classic police procedural episodes.',sourceUrl:'https://starlitetv.com/free/',sourceLabel:'Starlite TV · classic TV episodes'},
  {id:'tv-colonelbleep',title:'Colonel Bleep',type:'series',genre:'Animation / Sci-Fi',description:'Early colour science-fiction cartoon series.',sourceUrl:'https://starlitetv.com/free/',sourceLabel:'Starlite TV · classic TV episodes'},
  {id:'tv-loneranger',title:'The Lone Ranger',type:'series',genre:'Western',description:'Classic television western episodes.',sourceUrl:'https://pasttimetv.com/pages/watch-free',sourceLabel:'PastTimeTV · classic TV library'}
];

const STREAM_PROFILES = {
  auto: {maxHeight: Infinity, label:'Auto'},
  data: {maxHeight:480, label:'Data saver'},
  balanced: {maxHeight:720, label:'Balanced'},
  high: {maxHeight:1080, label:'High quality'}
};
const DB_NAME='ghost-tv-db', STORE='videos';
let db;
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>{db=r.result;resolve(db)};r.onerror=()=>reject(r.error)})}
function dbPut(value){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).put(value);t.oncomplete=resolve;t.onerror=()=>reject(t.error)})}
function dbGet(id){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbAll(){return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbClear(){return new Promise((resolve,reject)=>{const t=db.transaction(STORE,'readwrite');t.objectStore(STORE).clear();t.oncomplete=resolve;t.onerror=()=>reject(t.error)})}
function save(){localStorage.setItem('ghost-tv-state',JSON.stringify({channels:state.channels,media:state.media.map(({url,...m})=>m),favourites:state.favourites,streamMode:state.streamMode}))}
function load(){try{const x=JSON.parse(localStorage.getItem('ghost-tv-state')||'{}');state.channels=x.channels||[];state.media=x.media||[];state.favourites=x.favourites||[];state.streamMode=x.streamMode||'data'}catch(e){console.warn(e)}
  const starterChannels=[...FREE_CHANNELS,...LOCAL_CHANNELS];
  const starterById=new Map(starterChannels.map(c=>[c.id,c]));
  state.channels=state.channels.map(c=>{const fresh=starterById.get(c.id);return fresh?{...fresh,...c,streamUrl:fresh.streamUrl||c.streamUrl,embedUrl:fresh.embedUrl||c.embedUrl,webUrl:fresh.webUrl||c.webUrl}:c;});
  const knownChannels=new Set(state.channels.map(c=>c.id));state.channels.push(...starterChannels.filter(c=>!knownChannels.has(c.id)));
  const knownMedia=new Set(state.media.map(m=>m.id));state.media.push(...FREE_MOVIES.filter(m=>!knownMedia.has(m.id)),...FREE_SERIES.filter(m=>!knownMedia.has(m.id)));
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function navigate(page){state.page=page;document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.classList.contains('nav-link')&&b.dataset.page===page));$('#crumb').textContent=page.replace('-',' ').toUpperCase();if(page==='live')renderChannels();if(page==='movies'||page==='series')renderMedia(page);if(page==='favourites')renderFavourites();if(page==='home')renderHome();window.scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b){e.preventDefault();navigate(b.dataset.page)}});
function parseM3U(text){const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/);let out=[],meta=null;for(const raw of lines){const line=raw.trim();if(line.startsWith('#EXTINF:')){const attrs={};for(const m of line.matchAll(/([\w-]+)="([^"]*)"/g))attrs[m[1].toLowerCase()]=m[2];const name=line.slice(line.lastIndexOf(',')+1).trim()||attrs['tvg-name']||'Unnamed channel';meta={name,group:attrs['group-title']||'Other',logo:attrs['tvg-logo']||'',id:'ch-'+crypto.randomUUID()}}else if(line&&!line.startsWith('#')&&meta){out.push({...meta,url:line});meta=null}}return out}
function addPlaylist(text){const parsed=parseM3U(text);if(!parsed.length){toast('No valid channel entries found');return}const seen=new Set(state.channels.map(c=>c.url));const fresh=parsed.filter(c=>!seen.has(c.url));state.channels.push(...fresh);save();renderAll();toast(`Added ${fresh.length} channels`);navigate('live')}
$('#playlistFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;addPlaylist(await f.text());e.target.value=''});
$('#loadUrl').onclick=async()=>{const url=$('#playlistUrl').value.trim();if(!url)return toast('Enter a playlist URL');try{const r=await fetch(url);if(!r.ok)throw Error('HTTP '+r.status);addPlaylist(await r.text())}catch(e){toast('Could not load URL. The host may block browser access (CORS). Try importing the M3U file instead.')}};
function renderChannels(){const q=$('#channelSearch').value.toLowerCase(),group=$('#groupFilter').value;const groups=[...new Set(state.channels.map(c=>c.group))].sort();$('#groupFilter').innerHTML='<option value="">All groups</option>'+groups.map(g=>`<option ${g===group?'selected':''}>${escapeHTML(g)}</option>`).join('');const items=state.channels.filter(c=>(!group||c.group===group)&&c.name.toLowerCase().includes(q));$('#channelList').innerHTML=items.length?items.map(c=>`<div class="channel-row ${state.current?.id===c.id?'selected':''}" ${(c.streamUrl||c.embedUrl||c.url)?`data-channel="${c.id}"`:`data-channel-link="${c.id}"`}><div class="channel-logo">${c.logo?`<img src="${escapeHTML(c.logo)}" onerror="this.remove()">`:'▶'}</div><div><b>${escapeHTML(c.name)}</b><small>${escapeHTML(c.group)} · ${(c.streamUrl||c.embedUrl||c.url)?'In-app player':'Official website only'}</small></div><span class="channel-open">${(c.streamUrl||c.embedUrl||c.url)?'▶':'↗'}</span></div>`).join(''):'<div class="empty-state">No matching channels found.</div>'}
$('#channelSearch').oninput=renderChannels;$('#groupFilter').onchange=renderChannels;
$('#channelList').addEventListener('click',e=>{const row=e.target.closest('[data-channel],[data-channel-link]');if(!row)return;const id=row.dataset.channel||row.dataset.channelLink;const c=state.channels.find(x=>x.id===id);if(!c)return;if(c.streamUrl||c.embedUrl||c.url){play(c,'channel');return;}if(c.webUrl){window.open(c.webUrl,'_blank','noopener');toast('This broadcaster currently provides a website player, not an embedded stream.');}});
async function play(item,type){
  const video=$('#video'), frame=$('#liveEmbed');
  if(state.hls){state.hls.destroy();state.hls=null}
  frame.src='';frame.classList.add('hidden');video.classList.remove('hidden');video.pause();video.removeAttribute('src');video.load();
  if(item.embedUrl){
    video.classList.add('hidden');frame.classList.remove('hidden');
    frame.src=item.embedUrl+(item.embedUrl.includes('?')?'&':'?')+'autoplay=1&mute=0&playsinline=1';
  }else{
    const source=item.blobId?null:(item.url||item.streamUrl);
    if(item.blobId){
      const rec=await dbGet(item.blobId);
      if(!rec){toast('Video file is missing. Please add it again.');return}
      if(video.dataset.objectUrl)URL.revokeObjectURL(video.dataset.objectUrl);
      video.dataset.objectUrl=URL.createObjectURL(rec.blob);video.src=video.dataset.objectUrl;
    }else if(source){
      if(/\.m3u8($|\?)/i.test(source)&&window.Hls&&Hls.isSupported()){
        state.hls=new Hls({startLevel:-1,capLevelToPlayerSize:true,maxBufferLength:18,maxMaxBufferLength:30,backBufferLength:12,abrEwmaDefaultEstimate:450000});
        state.hls.loadSource(source);state.hls.attachMedia(video);
        const applyCap=()=>{if(!state.hls)return;const profile=STREAM_PROFILES[state.streamMode]||STREAM_PROFILES.auto;let cap=-1;state.hls.levels.forEach((level,index)=>{if(level.height&&level.height<=profile.maxHeight)cap=index});state.hls.autoLevelCapping=cap;};
        state.hls.on(Hls.Events.MANIFEST_PARSED,applyCap);state.hls.on(Hls.Events.LEVELS_UPDATED,applyCap);
        state.hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)toast('This stream is unavailable right now. Try another channel.');});
      }else if(video.canPlayType('application/vnd.apple.mpegurl'))video.src=source;
      else video.src=source;
    }else return;
  }
  $('#playerPlaceholder').classList.add('hidden');
  $('#nowTitle').textContent=item.name||item.title;
  $('#nowGroup').textContent=item.group||type;
  state.current={...item,type};
  $('#favCurrent').textContent=state.favourites.some(f=>f.id===item.id)?'★':'☆';
  if(type==='channel')renderChannels();
  if(!item.embedUrl)video.play().catch(()=>toast('Press Play in the video player to start'));
}
$('#favCurrent').onclick=()=>{if(!state.current)return;toggleFavourite(state.current);$('#favCurrent').textContent=state.favourites.some(f=>f.id===state.current.id)?'★':'☆'};
function toggleFavourite(item){const i=state.favourites.findIndex(f=>f.id===item.id);if(i>=0)state.favourites.splice(i,1);else state.favourites.push({id:item.id,type:item.type|| (item.url?'channel':'media'),name:item.name||item.title});save();renderAll();toast(i>=0?'Removed from favourites':'Added to favourites')}
function card(m){const external=!!m.sourceUrl;return `<article class="media-card" ${external?`data-source-media="${m.id}"`:`data-play-media="${m.id}"`}><div class="poster ${external?'curated-poster':''}"><span class="poster-placeholder">${escapeHTML((m.title||'?').slice(0,1).toUpperCase())}</span><span class="poster-ribbon">${external?'FREE CLASSIC':'MY LIBRARY'}</span></div><div class="media-info"><b>${escapeHTML(m.title)}</b><small>${escapeHTML(m.genre|| (m.type==='series'?'Series':'Movie'))}${m.year?' · '+m.year:''}</small><small class="source-label">${external?'Open free catalogue ↗':'Play from device'}</small></div></article>`}
function renderMedia(type){const list=state.media.filter(m=>m.type===type);const q=$('#'+type+'Search').value.toLowerCase();const sort=$('#'+type+'Sort').value;let filtered=list.filter(m=>m.title.toLowerCase().includes(q));if(sort==='az')filtered.sort((a,b)=>a.title.localeCompare(b.title));else filtered.sort((a,b)=>b.added-a.added);$('#'+type+'Grid').innerHTML=filtered.length?filtered.map(card).join(''):'<div class="empty-state">Your library is empty. Add your own video files to get started.</div>'}
$('#movieSearch').oninput=()=>renderMedia('movies');$('#seriesSearch').oninput=()=>renderMedia('series');$('#movieSort').onchange=()=>renderMedia('movies');$('#seriesSort').onchange=()=>renderMedia('series');
async function openMedia(id){const m=state.media.find(x=>x.id===id);if(m)await play(m,m.type)}
document.addEventListener('click',e=>{const s=e.target.closest('[data-source-media]');if(s){const m=state.media.find(x=>x.id===s.dataset.sourceMedia);if(m?.sourceUrl){window.open(m.sourceUrl,'_blank','noopener');toast('Opening the free catalogue source');}return;}const c=e.target.closest('[data-play-media]');if(c)openMedia(c.dataset.playMedia)});
function renderFavourites(){const items=state.favourites.map(f=>{const m=state.media.find(x=>x.id===f.id);const c=state.channels.find(x=>x.id===f.id);return m||c}).filter(Boolean);$('#favouriteGrid').innerHTML=items.length?items.map(m=>(m.streamUrl||m.embedUrl||m.url)?`<article class="media-card" data-play-channel="${m.id}"><div class="poster"><span class="poster-placeholder">▶</span></div><div class="media-info"><b>${escapeHTML(m.name)}</b><small>${escapeHTML(m.group)} · In-app player</small></div></article>`:m.webUrl?`<article class="media-card" data-source-channel="${m.id}"><div class="poster"><span class="poster-placeholder">▶</span></div><div class="media-info"><b>${escapeHTML(m.name)}</b><small>${escapeHTML(m.group)} · Official stream ↗</small></div></article>`:m.url?`<article class="media-card" data-play-channel="${m.id}"><div class="poster"><span class="poster-placeholder">▶</span></div><div class="media-info"><b>${escapeHTML(m.name)}</b><small>Live channel</small></div></article>`:card(m)).join(''):'<div class="empty-state">No favourites yet. Save a channel or media item using the ☆ button.</div>'}
document.addEventListener('click',e=>{const s=e.target.closest('[data-source-channel]');if(s){const item=state.channels.find(x=>x.id===s.dataset.sourceChannel);if(item?.webUrl)window.open(item.webUrl,'_blank','noopener');return;}const c=e.target.closest('[data-play-channel]');if(c){const item=state.channels.find(x=>x.id===c.dataset.playChannel);if(item){navigate('live');play(item,'channel')}}});
function renderHome(){const movies=state.media.filter(m=>m.type==='movies'),series=state.media.filter(m=>m.type==='series');$('#countChannels').textContent=state.channels.length;$('#countMovies').textContent=movies.length;$('#countSeries').textContent=series.length;$('#countFavourites').textContent=state.favourites.length;const recent=[...state.media].sort((a,b)=>b.added-a.added).slice(0,5);$('#recentGrid').innerHTML=recent.length?recent.map(card).join(''):'<div class="empty-state">Nothing here yet — add your first movie, episode or playlist.</div>'}
function renderAll(){renderHome();if(state.page==='live')renderChannels();if(state.page==='movies'||state.page==='series')renderMedia(state.page);if(state.page==='favourites')renderFavourites()}
let modalType='movies';
function openModal(type){modalType=type;$('#modalTitle').textContent=type==='movies'?'Add a movie':'Add a series episode';$('#seriesFields').classList.toggle('hidden',type!=='series');$('#mediaTitle').value='';$('#mediaDescription').value='';$('#mediaPoster').value='';$('#mediaFile').value='';$('#modal').classList.add('open')}
$('#addMovieBtn').onclick=()=>openModal('movies');$('#addSeriesBtn').onclick=()=>openModal('series');$('#closeModal').onclick=()=>$('#modal').classList.remove('open');$('#modal').onclick=e=>{if(e.target.id==='modal')$('#modal').classList.remove('open')};
$('#saveMedia').onclick=async()=>{const title=$('#mediaTitle').value.trim(),file=$('#mediaFile').files[0];if(!title||!file)return toast('Enter a title and choose a video file');const id='m-'+crypto.randomUUID(),blobId='v-'+id;try{await dbPut({id:blobId,blob:file.blob||file,name:file.name});state.media.push({id,title,type:modalType,description:$('#mediaDescription').value.trim(),poster:$('#mediaPoster').value.trim(),blobId,season:$('#mediaSeason').value,episode:$('#mediaEpisode').value,added:Date.now()});save();$('#modal').classList.remove('open');renderAll();toast('Saved to your library')}catch(e){toast('Could not save this file. Check available browser storage.')}};
function addBatch(files,type){[...files].forEach(async file=>{const id='m-'+crypto.randomUUID(),blobId='v-'+id;try{await dbPut({id:blobId,blob:file,name:file.name});state.media.push({id,title:file.name.replace(/\.[^.]+$/,''),type,description:'',poster:'',blobId,season:1,episode:1,added:Date.now()});save();renderAll()}catch(e){toast('Storage limit reached; some files were not added')}});toast('Importing selected files…')}
$('#chooseMovies').onclick=()=>$('#hiddenMovies').click();$('#chooseEpisodes').onclick=()=>$('#hiddenEpisodes').click();$('#hiddenMovies').onchange=e=>addBatch(e.target.files,'movies');$('#hiddenEpisodes').onchange=e=>addBatch(e.target.files,'series');$('#hiddenMovies').value='';$('#hiddenEpisodes').value='';
$('#exportData').onclick=()=>{const blob=new Blob([JSON.stringify({channels:state.channels,media:state.media,favourites:state.favourites},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ghost-tv-backup.json';a.click();URL.revokeObjectURL(a.href);toast('Backup exported')};
$('#clearHistory').onclick=()=>{localStorage.removeItem('ghost-tv-history');toast('Watch history cleared')};
$('#resetApp').onclick=async()=>{if(!confirm('Delete all Ghost TV playlists, library items and locally stored videos?'))return;state.channels=[...FREE_CHANNELS,...LOCAL_CHANNELS];state.media=[...FREE_MOVIES,...FREE_SERIES];state.favourites=[];save();await dbClear();if(state.hls)state.hls.destroy();$('#video').pause();$('#video').removeAttribute('src');$('#playerPlaceholder').classList.remove('hidden');renderAll();toast('App data cleared')};
$('#globalSearch').oninput=e=>{const q=e.target.value.toLowerCase();if(!q)return;const found=state.media.find(m=>m.title.toLowerCase().includes(q));if(found){navigate(found.type);$('#'+found.type+'Search').value=q;renderMedia(found.type)}else{const ch=state.channels.find(c=>c.name.toLowerCase().includes(q));if(ch){navigate('live');$('#channelSearch').value=q;renderChannels()}}};
$('#streamMode').onchange=e=>{state.streamMode=e.target.value;save();if(state.current?.url)play(state.current,state.current.type||'channel');toast('Streaming preference updated')};
async function init(){load();$('#streamMode').value=state.streamMode;try{await openDB();const stored=await dbAll();const ids=new Set(stored.map(x=>x.id));const before=state.media.length;state.media=state.media.filter(m=>m.sourceUrl||ids.has(m.blobId));if(state.media.length!==before)save()}catch(e){toast('Local media storage is unavailable in this browser mode')}renderAll();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});}
init();
