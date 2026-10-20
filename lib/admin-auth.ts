import {env} from "cloudflare:workers";
const enc=new TextEncoder();
function hex(buffer:ArrayBuffer){return Array.from(new Uint8Array(buffer)).map(b=>b.toString(16).padStart(2,"0")).join("")}
export async function adminToken(){const secret=env.ADMIN_SESSION_SECRET||"";const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,enc.encode("madmak-admin-v1")))}
export async function isAdmin(request:Request){const supplied=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")||"";return !!supplied&&supplied===await adminToken()}
