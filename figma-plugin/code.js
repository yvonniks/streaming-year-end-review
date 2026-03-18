// Netflix Streaming Year-End Review — Figma Plugin v3

const W = 375, H = 812;

// ── Color helpers ─────────────────────────────────────────────────────────────
// All color objects are plain {r,g,b} (0-1). Alpha is always passed separately.

function hex(h) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return m ? {r:parseInt(m[1],16)/255, g:parseInt(m[2],16)/255, b:parseInt(m[3],16)/255} : {r:0,g:0,b:0};
}
// rgb/rgba both return plain {r,g,b} — alpha is kept separate
function c(r,g,b) { return {r:r/255, g:g/255, b:b/255}; }

// Safe solid paint — color must be {r,g,b}, opacity 0-1
function solid(rgb, opacity=1) {
  const {r,g,b} = rgb; // deliberately destructure only r,g,b — no a
  return [{type:"SOLID", color:{r,g,b}, opacity}];
}

// Gradient stop: color must include alpha for RGBA
function stop(pos, r,g,b,a=1) {
  return {position:pos, color:{r:r/255, g:g/255, b:b/255, a}};
}
function stopHex(pos, h, a=1) {
  const {r,g,b} = hex(h);
  return {position:pos, color:{r,g,b,a}};
}

function gradTransform(deg) {
  const a=deg*Math.PI/180, s=Math.sin(a), cc=Math.cos(a);
  return [[s,cc,0.5*(1-s-cc)],[-cc,s,0.5*(1+cc-s)]];
}
function linGrad(deg, stops) {
  return [{type:"GRADIENT_LINEAR", gradientTransform:gradTransform(deg), gradientStops:stops}];
}
function gfill(deg, stops) { // single paint object (for text fills)
  return {type:"GRADIENT_LINEAR", gradientTransform:gradTransform(deg), gradientStops:stops};
}

// ── Font loading ──────────────────────────────────────────────────────────────

const STYLE_CANDIDATES = {
  400:["Regular"],
  500:["Medium"],
  600:["Semi Bold","SemiBold"],
  700:["Bold"],
  800:["Extra Bold","ExtraBold"],
  900:["Black","Heavy"],
};
const resolvedStyle = {};
async function lf(w=400) {
  if (resolvedStyle[w]) return resolvedStyle[w];
  for (const s of (STYLE_CANDIDATES[w]||["Regular"])) {
    try { await figma.loadFontAsync({family:"Inter",style:s}); resolvedStyle[w]=s; return s; }
    catch(_) {}
  }
  resolvedStyle[w] = resolvedStyle[400]||"Regular";
  return resolvedStyle[w];
}

// ── Node factories ────────────────────────────────────────────────────────────

function R(parent,x,y,w,h,fills,{cr=0,op=1,blur=0,name=""}={}) {
  const n=figma.createRectangle();
  n.x=x; n.y=y; n.resize(w,h); n.fills=fills;
  if (cr) n.cornerRadius=cr;
  if (op!==1) n.opacity=op;
  if (blur) n.effects=[{type:"LAYER_BLUR",radius:blur,visible:true}];
  if (name) n.name=name;
  parent.appendChild(n);
  return n;
}

async function T(parent,text,x,y,{w=null,fs=14,fw=400,col=null,opacity=1,grad=null,align="LEFT",lh=null,ls=null,name=""}={}) {
  const style=await lf(fw);
  const t=figma.createText();
  t.x=x; t.y=y;
  t.fontName={family:"Inter",style};
  t.fontSize=fs;
  t.characters=String(text);
  if (w) { t.textAutoResize="HEIGHT"; t.resize(w,50); }
  else   { t.textAutoResize="WIDTH_AND_HEIGHT"; }
  // All fills go through solid() so color is always clean {r,g,b}
  if (grad) {
    t.fills=[grad];
  } else {
    const rgb = col || {r:1,g:1,b:1};
    t.fills = solid(rgb, opacity);
  }
  if (align!=="LEFT") t.textAlignHorizontal=align;
  if (lh) t.lineHeight={value:lh,unit:"PIXELS"};
  if (ls) t.letterSpacing={value:ls,unit:"PIXELS"};
  if (name) t.name=name;
  parent.appendChild(t);
  return t;
}

function glow(frame,cx,cy,size,r,g,b,a=0.2,blur=56) {
  R(frame,cx-size/2,cy-size/2,size,size,solid(c(r,g,b),a),{cr:9999,blur,name:"Glow"});
}

function mkFrame(name,xi) {
  const f=figma.createFrame();
  f.name=name; f.resize(W,H); f.x=xi; f.y=0;
  f.fills=solid(hex("#000000")); f.clipsContent=true;
  return f;
}

// ── Shared chrome ─────────────────────────────────────────────────────────────

async function chrome(f,seg) {
  R(f,0,0,W,47,solid(hex("#000")),{name:"StatusBar"});
  await T(f,"9:41",20,14,{fs:15,fw:700});

  R(f,0,47,W,50,solid(hex("#000")),{name:"NavBar"});
  R(f,12,55,5,26,solid(hex("#E50914")),{name:"NLeft"});
  R(f,23,55,5,26,solid(hex("#E50914")),{name:"NRight"});
  await T(f,"YEAR END REVIEW",W/2-55,62,{w:110,fs:10,fw:600,col:c(156,163,175),align:"CENTER",ls:3});
  await T(f,"✕",W-26,62,{fs:12});

  const sw=(W-32-24)/5;
  for(let i=0;i<5;i++) {
    R(f,16+i*(sw+6),126,sw,4, i<=seg?solid({r:1,g:1,b:1}):solid({r:1,g:1,b:1},0.3), {cr:2});
  }

  R(f,(W-128)/2,H-12,128,4,solid(hex("#525252")),{cr:9999,name:"HomeBar"});
}

// ── Screen 0: Welcome ─────────────────────────────────────────────────────────

async function s0(f) {
  R(f,0,133,W,H-133,linGrad(180,[stop(0,0,0,0,0.6),stop(1,14,8,39,0.6)]));
  glow(f,W-40,80,280,229,9,20,0.15);
  glow(f,60,H-60,280,50,35,36,0.4);

  const s800=await lf(800);

  const gy=figma.createText();
  gy.x=44; gy.y=339; gy.textAutoResize="HEIGHT"; gy.resize(278,400);
  gy.fontName={family:"Inter",style:s800}; gy.fontSize=110;
  gy.characters="20\n26"; gy.lineHeight={value:164,unit:"PIXELS"};
  gy.textAlignHorizontal="CENTER";
  gy.fills=[gfill(180,[stop(0,200,146,149,0.2),stop(0.5,229,9,20,0.16),stop(1,77,23,84,0.2)])];
  gy.effects=[{type:"LAYER_BLUR",radius:2,visible:true}];
  gy.name="GhostYear"; f.appendChild(gy);

  const my=figma.createText();
  my.x=44; my.y=344; my.textAutoResize="HEIGHT"; my.resize(278,400);
  my.fontName={family:"Inter",style:s800}; my.fontSize=110;
  my.characters="20\n26"; my.lineHeight={value:164,unit:"PIXELS"};
  my.textAlignHorizontal="CENTER";
  my.fills=[gfill(180,[stop(0,200,146,149,1),stop(0.5,229,9,20,0.8),stop(1,77,23,84,1)])];
  my.name="MainYear"; f.appendChild(my);

  R(f,280,316,83,83,solid(c(205,179,114),0.5),{cr:6,name:"Star1"});
  R(f,44,655,96,96,solid(c(205,179,114),0.5),{cr:6,name:"Star2"});

  await T(f,"Hey Yvonne!",41,202,{w:278,fs:30,fw:800,align:"CENTER",lh:38,
    grad:gfill(180,[stop(0,255,255,255,1),stop(1,160,160,160,1)])});
  await T(f,"Your 2026 Year in Review is here.",41,246,
    {w:278,fs:14,fw:500,col:c(255,255,255),opacity:0.7,align:"CENTER",lh:20});
}

// ── Screen 1: Premium Membership ──────────────────────────────────────────────

async function s1(f) {
  R(f,0,103,W,H-103,linGrad(180,[stop(0,66,26,32,0.8),stop(1,14,8,39,0.9)]));
  R(f,-41,315,457,457,linGrad(135,[stopHex(0,"#2563EB"),stopHex(1,"#143885")]),{cr:9999,blur:80,op:0.35});

  await T(f,"You're getting the best of Netflix",31,172,{w:310,fs:28,fw:800,align:"CENTER",lh:36,
    grad:gfill(180,[stop(0,255,255,255,1),stop(1,160,160,160,1)])});
  await T(f,"Your Premium membership delivers ultimate quality and freedom.",
    31,224,{w:310,fs:14,fw:500,col:hex("#D1D5DB"),align:"CENTER",lh:20});

  const feats=[
    {i:"📺",l:"4K Ultra HD & HDR"},{i:"📱",l:"Streaming on 4 devices"},
    {i:"🔊",l:"Spatial Audio"},{i:"⬇️",l:"Downloads on 6 devices"},
    {i:"🚫",l:"Unlimited Ad-free"},{i:"👥",l:"Add Extra Members"},
  ];
  const cw=(W-36-10)/2;
  for(let i=0;i<6;i++) {
    const cx=18+(i%2)*(cw+10), cy=310+Math.floor(i/2)*110;
    R(f,cx,cy,cw,100,solid({r:1,g:1,b:1},0.05),{cr:16});
    await T(f,feats[i].i,cx+16,cy+16,{fs:24});
    await T(f,feats[i].l,cx+16,cy+52,{w:cw-32,fs:13,fw:700,lh:18});
  }
}

// ── Screen 2: Content Value ────────────────────────────────────────────────────

async function s2(f) {
  for(let i=0;i<12;i++) {
    R(f,(i%3)*(W/3)+2,Math.floor(i/3)*(H/4)+2,W/3-4,H/4-4,solid(c(80,20,20),0.6),{cr:5,op:0.4});
  }
  R(f,0,0,W,H,linGrad(180,[stop(0,33,7,62,0.92),stop(1,0,0,0,0.95)]));
  R(f,13,155,W-26,225,linGrad(135,[stopHex(0,"#EA2A33"),stopHex(1,"#C0101A")]),{cr:14});

  await T(f,"You accessed\n$540 worth of content",33,183,
    {w:W-66,fs:28,fw:800,align:"CENTER",lh:36});
  await T(f,"You've unlocked licensed and exclusive entertainment with your membership for only $24.99/month.",
    33,264,{w:W-66,fs:14,col:c(194,193,193),opacity:0.9,align:"CENTER",lh:20});

  const rows=[
    {l:"Blockbuster Hits",s:"Licensed content",v:"$210"},
    {l:"Original Series",s:"Exclusives you love",v:"$185"},
    {l:"Documentaries",s:"Award winners",v:"$145"},
  ];
  for(let i=0;i<3;i++) {
    const y=420+i*60;
    R(f,16,y,W-32,50,solid({r:1,g:1,b:1},0.08),{cr:14});
    await T(f,rows[i].l,36,y+10,{fs:14,fw:600});
    await T(f,rows[i].s,36,y+28,{fs:12,col:{r:1,g:1,b:1},opacity:0.6});
    await T(f,rows[i].v,W-60,y+16,{fs:14,fw:700,col:hex("#E50914")});
  }
}

// ── Screen 3: Ad-Free Hours ────────────────────────────────────────────────────

async function s3(f) {
  glow(f,W/2,370,256,229,9,20,0.2,40);
  await T(f,"The Ad-Free Freedom",20,160,{w:W-40,fs:32,fw:800,align:"CENTER",lh:40});

  const rs=238, rx=(W-rs)/2, ry=245;

  const track=figma.createEllipse();
  track.x=rx; track.y=ry; track.resize(rs,rs);
  track.fills=[]; track.strokeWeight=8;
  track.strokes=solid(c(255,255,255),0.1);
  track.name="RingTrack"; f.appendChild(track);

  // Arc approximated as a full red ellipse on top of the gray track
  // (arcData hangs in many Figma plugin versions)
  const arc=figma.createEllipse();
  arc.x=rx; arc.y=ry; arc.resize(rs,rs);
  arc.fills=[]; arc.strokeWeight=8;
  arc.strokes=solid(hex("#E50914"));
  arc.name="ProgressArc"; f.appendChild(arc);

  const outer=figma.createEllipse();
  outer.x=rx-10; outer.y=ry-10; outer.resize(rs+20,rs+20);
  outer.fills=[]; outer.strokeWeight=4;
  outer.strokes=solid(hex("#E50914"),0.31);
  outer.name="OuterRing"; f.appendChild(outer);

  await T(f,"70",rx+rs/2-24,ry+rs/2-38,{fs:48,fw:900,w:48,align:"CENTER"});
  await T(f,"Hours Saved",rx+rs/2-40,ry+rs/2+16,{fs:14,fw:700,col:c(163,163,163),w:80,align:"CENTER"});
  await T(f,"You skipped 430 ads this year.",40,538,{w:W-80,fs:22,fw:700,align:"CENTER",lh:30});
  await T(f,"That's 3 full days of pure, uninterrupted entertainment you gained back.",
    40,580,{w:W-80,fs:15,col:c(163,163,163),align:"CENTER",lh:22});
}

// ── Screen 4: Top Genres ───────────────────────────────────────────────────────

async function s4(f) {
  glow(f,126,328,456,229,9,20,0.2,80);
  await T(f,"Your top interests",52,169,{w:W-104,fs:30,fw:700});
  await T(f,"Genres you've watched most.",52,209,{w:W-104,fs:15,col:{r:1,g:1,b:1},opacity:0.6});

  const genres=[
    {l:"Documentaries",    f:"#446244",t:"#161A3E"},
    {l:"Action & Adventure",f:"#161A3E",t:"#EA2A33"},
    {l:"Comedies",         f:"#2563EB",t:"#161A3E"},
    {l:"Reality TV",       f:"#541895",t:"#212544"},
    {l:"Romance",          f:"#7B3336",t:"#721385"},
  ];
  for(let i=0;i<genres.length;i++) {
    R(f,19,255+i*90,W-38,80,linGrad(90,[stopHex(0,genres[i].f),stopHex(1,genres[i].t)]),{cr:16});
    await T(f,genres[i].l,43,255+i*90+28,{fs:20,fw:500});
  }
}

// ── Screen 5: Watching Together ────────────────────────────────────────────────

async function s5(f) {
  glow(f,126,202,524,229,9,20,0.2,80);
  glow(f,227,449,458,22,26,62,0.47,80);
  await T(f,"Watching together",20,155,{w:W-40,fs:32,fw:700,align:"CENTER",lh:40});
  await T(f,"You watched Stranger Things 6 times. You're in the top 1% of Hawkins fans!",
    20,209,{w:W-40,fs:15,col:{r:1,g:1,b:1},opacity:0.6,align:"CENTER",lh:22});
  R(f,26,295,W-52,H-355,linGrad(180,[stop(0,180,20,20,0.5),stop(1,10,5,20,0.9)]),{cr:16,name:"STImg"});
  await T(f,"STRANGER THINGS",W/2-75,H/2+40,{w:150,fs:12,fw:800,col:{r:1,g:1,b:1},opacity:0.5,align:"CENTER",ls:3});
}

// ── Screen 6: Shop / CTA ──────────────────────────────────────────────────────

async function s6(f) {
  glow(f,4,330,139,229,9,20,0.2,30);
  glow(f,187,442,167,229,9,20,0.3,30);
  glow(f,339,515,139,37,99,235,0.1,30);

  await T(f,"Wear your fandom",20,165,{w:W-40,fs:32,fw:800,align:"CENTER"});
  await T(f,"You spent 42 hours in the Upside Down this year. Shop the gear!",
    20,209,{w:W-40,fs:14,col:{r:1,g:1,b:1},opacity:0.8,align:"CENTER",lh:20});

  R(f,76,280,223,223,linGrad(135,[stop(0,100,20,20,0.7),stop(1,30,10,50,0.9)]),{cr:12,name:"HoodieImg"});
  await T(f,"🧥  Stranger Things Hoodie",76+16,280+88,{w:190,fs:12,fw:600,col:{r:1,g:1,b:1},opacity:0.6,align:"CENTER"});

  R(f,220,474,100,22,linGrad(90,[stopHex(0,"#E50914"),stopHex(1,"#21073E")]),{cr:9999,name:"Badge"});
  await T(f,"Limited Drop",228,478,{fs:9,fw:700});

  await T(f,"Official Hawkins High Collection",20,520,
    {w:W-40,fs:12,fw:500,col:{r:1,g:1,b:1},opacity:0.9,align:"CENTER"});

  R(f,41,565,W-82,49,solid({r:1,g:1,b:1}),{cr:9999,name:"ShopBtn"});
  await T(f,"Visit Netflix Shop  →",41+(W-82)/2-70,581,
    {w:140,fs:14,fw:700,col:{r:0,g:0,b:0},align:"CENTER"});

  await T(f,"🔖  Save",40,640,{fs:12,col:{r:1,g:1,b:1},opacity:0.7});
  await T(f,"↗  Share",W-90,640,{fs:12,col:{r:1,g:1,b:1},opacity:0.7});
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  try {
    for (const w of [400,500,600,700,800,900]) await lf(w);

    const screens=[
      {name:"00 – Welcome",          seg:0, build:s0},
      {name:"01 – Premium",          seg:1, build:s1},
      {name:"02 – Content Value",    seg:1, build:s2},
      {name:"03 – Ad-Free Hours",    seg:2, build:s3},
      {name:"04 – Top Genres",       seg:3, build:s4},
      {name:"05 – Watching Together",seg:3, build:s5},
      {name:"06 – Shop / CTA",       seg:4, build:s6},
    ];

    const frames=[];
    for (let i=0;i<screens.length;i++) {
      const sc=screens[i];
      figma.notify(`Building ${i+1}/7…`,{timeout:2000});
      const f=mkFrame(sc.name,i*(W+80));
      await sc.build(f);
      await chrome(f,sc.seg);
      figma.currentPage.appendChild(f);
      frames.push(f);
    }

    figma.viewport.scrollAndZoomIntoView(frames);
    figma.notify("✅ 7 screens created!",{timeout:4000});
  } catch(e) {
    figma.notify("❌ "+(e&&e.message?e.message:String(e)),{timeout:8000});
    console.error(e);
  } finally {
    figma.closePlugin();
  }
})();
