const encoder = new TextEncoder();
export const hex = b => Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('');
export async function sha256(value) { return hex(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value)); }
export async function hmac(secret, value) {
 const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name:'HMAC', hash:'SHA-256'}, false, ['sign']);
 return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}
export function equal(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let d=0; for(let i=0;i<a.length;i++) d |= a.charCodeAt(i)^b.charCodeAt(i); return d===0; }
export function nonce() { return hex(crypto.getRandomValues(new Uint8Array(32))); }
export async function verifyWebhook(raw, header, secret, now=Math.floor(Date.now()/1000)) {
 if (!secret?.startsWith('whsec_')) throw new Error('Webhook not configured');
 const entries=(header||'').split(',').map(p=>p.trim().split('='));
 const times=entries.filter(([k])=>k==='t');
 if(times.length!==1 || !/^\d+$/.test(times[0][1])) throw new Error('Invalid signature');
 const ts=Number(times[0][1]);
 if(Math.abs(now-ts)>300) throw new Error('Expired signature');
 const expected=await hmac(secret, `${ts}.${raw}`);
 if(!entries.some(([k,v])=>k==='v1' && equal(v,expected))) throw new Error('Invalid signature');
 const event=JSON.parse(raw);
 if(event.livemode!==false || typeof event.id!=='string' || !event.id.startsWith('evt_')) throw new Error('Only sandbox events accepted');
 return event;
}
