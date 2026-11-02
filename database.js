let session = null;
try { session = JSON.parse(sessionStorage.getItem('liham-session')); } catch {}
function rememberSession(value) {
  session = value;
  try { value ? sessionStorage.setItem('liham-session', JSON.stringify(value)) : sessionStorage.removeItem('liham-session'); } catch {}
}
async function request(path, method='GET', data, token, prefer) {
  const headers = {apikey: LIHAM_CONFIG.key, 'Content-Type':'application/json'};
  if(token) headers.Authorization = 'Bearer ' + token;
  if(prefer) headers.Prefer = prefer;
  const response = await fetch(LIHAM_CONFIG.url + path, {method, headers, body:data === undefined ? undefined : JSON.stringify(data)});
  const raw = await response.text();
  let result;
  try { result = raw ? JSON.parse(raw) : null; } catch { throw Error('Unexpected database response. Try again.'); }
  if(!response.ok) throw Error(result?.msg || result?.message || result?.error_description || result?.error || 'Request failed.');
  return result;
}
let refreshing;
async function accessToken() {
  if (!session) return undefined;
  if (session.expires_at * 1000 > Date.now() + 60000) return session.access_token;
  if (!refreshing) refreshing = request('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:session.refresh_token})
    .then(s=>{rememberSession(s);return s.access_token;})
    .catch(e=>{rememberSession(null);throw Error('Your session expired. Please sign in again.');})
    .finally(()=>{refreshing=null;});
  return refreshing;
}
async function database(path,method='GET',data,prefer) {
  return request('/rest/v1/'+path,method,data,await accessToken(),prefer);
}
async function ownerStatus() {
  if(!session) return false;
  const rows = await database('liham_owners?select=user_id');
  return rows.some(row=>row.user_id === session.user.id);
}
function checkedPoem(p) {
  if(!p || typeof p.title !== 'string' || !p.title.trim() || p.title.length>120 || typeof p.body !== 'string' || !p.body.trim() || p.body.length>30000 || !['Tagalog','English'].includes(p.language)) throw Error('Check the title, language, and poem text.');
  return {id:p.id || crypto.randomUUID(),title:p.title.trim(),body:p.body,language:p.language,topic:String(p.topic || 'Poetry').slice(0,40)};
}
async function api(path,method='GET',data) {
  if(path==='login') {
    const s=await request('/auth/v1/token?grant_type=password','POST',data);
    rememberSession(s);
    try { if(!await ownerStatus()) throw Error('This account is not the website owner. Run 02-owner.sql with your user ID.'); }
    catch(e) {rememberSession(null);throw e;}
    return {};
  }
  if(path==='logout') {
    const token=session?.access_token;
    rememberSession(null);
    if(token) try {await request('/auth/v1/logout','POST',undefined,token);} catch {}
    return {};
  }
  if(path==='state') {
    const [poems,settings,owner]=await Promise.all([
      database('liham_poems?select=*&order=created_at.desc'),
      database('liham_settings?id=eq.1&select=copy'), ownerStatus()
    ]);
    return {poems,copy:settings[0]?.copy || {},owner};
  }
  if(!await ownerStatus()) throw Error('Please sign in as the owner.');
  if(path==='poems' && method==='POST') return database('liham_poems','POST',checkedPoem(data),'resolution=merge-duplicates');
  if(path==='poems' && method==='DELETE') return database('liham_poems?id=eq.'+encodeURIComponent(data.id),'DELETE');
  if(path==='copy') return database('liham_settings','POST',{id:1,copy:data.copy},'resolution=merge-duplicates');
  if(path==='import') {
    if(!Array.isArray(data.poems) || data.poems.length>1000) throw Error('Choose a valid poem backup with at most 1,000 poems.');
    const poems=data.poems.map(checkedPoem);
    if(new Set(poems.map(p=>p.id)).size !== poems.length) throw Error('Backup contains duplicate poem IDs.');
    return database('rpc/liham_import','POST',{new_poems:poems,new_copy:data.copy || null});
  }
  throw Error('Unknown action.');
}
