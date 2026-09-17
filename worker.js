/**
 * QRStandee API - Cloudflare Workers
 * Backend-ready: D1 stores dynamic QR records. The frontend can run 100% local
 * until API_BASE is configured.
 *
 * Routes:
 * GET    /api/health
 * GET    /api/qr
 * GET    /api/qr/:slug
 * POST   /api/qr
 * PUT    /api/qr/:id
 * DELETE /api/qr/:id
 * POST   /api/qr/:slug/scan
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (request.method === "OPTIONS") return new Response(null,{headers:cors});
    try {
      let response;
      const parts=url.pathname.split("/").filter(Boolean);
      if (url.pathname==="/api/health") {
        response=Response.json({ok:true,service:"qrstandee-api",time:new Date().toISOString()});
      } else if (parts[0]==="api" && parts[1]==="qr" && parts.length===2) {
        if(request.method==="GET"){
          const rows=await env.DB.prepare("SELECT * FROM qr_codes ORDER BY updated_at DESC LIMIT 500").all();
          response=Response.json({data:rows.results});
        } else if(request.method==="POST"){
          const b=await request.json();
          const id=b.id||crypto.randomUUID();
          const now=new Date().toISOString();
          await env.DB.prepare(`INSERT INTO qr_codes
            (id,slug,name,tag,category,phone,website,address,extra,destination,qr_type,primary_action,size,orientation,qr_color,accent,cta,logo,created_at,updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(slug) DO UPDATE SET name=excluded.name,tag=excluded.tag,category=excluded.category,
            phone=excluded.phone,website=excluded.website,address=excluded.address,extra=excluded.extra,
            destination=excluded.destination,qr_type=excluded.qr_type,primary_action=excluded.primary_action,
            size=excluded.size,orientation=excluded.orientation,qr_color=excluded.qr_color,accent=excluded.accent,
            cta=excluded.cta,logo=excluded.logo,updated_at=excluded.updated_at`)
          .bind(id,b.slug||"my-business",b.name||"",b.tag||"",b.category||"",b.phone||"",b.website||"",b.address||"",
            b.extra||"",b.destination||"",b.qrType||"",b.primaryAction||"",b.size||"a4",b.orientation||"portrait",
            b.qrColor||"#111827",b.accent||"#2563eb",b.cta||"SCAN",b.logo||"",b.createdAt||now,now).run();
          response=Response.json({ok:true,id,slug:b.slug});
        } else response=new Response("Method Not Allowed",{status:405});
      } else if(parts[0]==="api"&&parts[1]==="qr"&&parts.length===3){
        const key=decodeURIComponent(parts[2]);
        if(request.method==="GET"){
          const row=await env.DB.prepare("SELECT * FROM qr_codes WHERE id=? OR slug=? LIMIT 1").bind(key,key).first();
          if(!row) response=Response.json({error:"Not found"},{status:404}); else response=Response.json({data:row});
        } else if(request.method==="PUT"){
          const b=await request.json();
          await env.DB.prepare(`UPDATE qr_codes SET name=?,tag=?,category=?,phone=?,website=?,address=?,extra=?,
            destination=?,qr_type=?,primary_action=?,size=?,orientation=?,qr_color=?,accent=?,cta=?,logo=?,updated_at=? WHERE id=?`)
          .bind(b.name||"",b.tag||"",b.category||"",b.phone||"",b.website||"",b.address||"",b.extra||"",b.destination||"",
            b.qrType||"",b.primaryAction||"",b.size||"a4",b.orientation||"portrait",b.qrColor||"#111827",b.accent||"#2563eb",
            b.cta||"SCAN",b.logo||"",new Date().toISOString(),key).run();
          response=Response.json({ok:true});
        } else if(request.method==="DELETE"){
          await env.DB.prepare("DELETE FROM qr_codes WHERE id=?").bind(key).run();
          response=Response.json({ok:true});
        } else response=new Response("Method Not Allowed",{status:405});
      } else if(parts[0]==="api"&&parts[1]==="qr"&&parts.length===4&&parts[3]==="scan"&&request.method==="POST"){
        const slug=decodeURIComponent(parts[2]);
        await env.DB.prepare("UPDATE qr_codes SET scans=scans+1,last_scan_at=? WHERE slug=?")
          .bind(new Date().toISOString(),slug).run();
        response=Response.json({ok:true});
      } else if(parts.length===1 && parts[0]){
        // Dynamic redirect: /my-business
        const slug=decodeURIComponent(parts[0]);
        const row=await env.DB.prepare("SELECT destination FROM qr_codes WHERE slug=? LIMIT 1").bind(slug).first();
        if(row?.destination && /^https?:\/\//i.test(row.destination)){
          await env.DB.prepare("UPDATE qr_codes SET scans=scans+1,last_scan_at=? WHERE slug=?")
            .bind(new Date().toISOString(),slug).run();
          return Response.redirect(row.destination,302);
        }
        response=Response.json({error:"QR not found"},{status:404});
      } else response=Response.json({error:"Not found"},{status:404});
      Object.entries(cors).forEach(([k,v])=>response.headers.set(k,v));
      return response;
    } catch(e){
      const r=Response.json({error:"Internal server error"},{status:500});
      Object.entries(cors).forEach(([k,v])=>r.headers.set(k,v));
      return r;
    }
  }
};
