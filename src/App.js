import { useState, useRef } from "react";
import sparklingStar from "./sparkling-star.png";
import strangerThings from "./stranger-things.jpg";
import poster from "./poster.jpg";
import hoodie from "./hoodie.jpg";

// ── Shared: Netflix N logo ────────────────────────────────────────────────────
function NetflixN() {
  return (
    <svg width="17" height="30" viewBox="0 0 17 30" fill="none">
      <rect x="0" y="0" width="5.5" height="30" fill="#E50914" />
      <rect x="11.5" y="0" width="5.5" height="30" fill="#E50914" />
      <polygon points="0,0 5.5,0 17,30 11.5,30" fill="#E50914" />
      <rect x="0" y="0" width="1.5" height="30" fill="#7C020D" />
      <rect x="15.5" y="0" width="1.5" height="30" fill="#7C020D" />
    </svg>
  );
}

// ── Shared: X (close) icon ────────────────────────────────────────────────────
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <line x1="1" y1="1" x2="13" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="13" y1="1" x2="1" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Shared: Status bar ────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div
      className="absolute flex items-center justify-between"
      style={{ top: 0, left: 0, width: 375, height: 47, background: "#000", padding: "0 20px" }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="6" width="3" height="6" rx="0.5" />
          <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="11" r="1.2" fill="white" />
          <path d="M4.8 7.8 Q8 5 11.2 7.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M2 5 Q8 0.5 14 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="17.5" height="8" rx="1.5" fill="white" />
          <path d="M22.5 4 L22.5 8 C23.5 7.5 24 6.5 24 6 C24 5.5 23.5 4.5 22.5 4Z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

// ── Shared: Nav bar ───────────────────────────────────────────────────────────
function NavBar({ onClose }) {
  return (
    <div
      className="absolute flex items-center justify-between"
      style={{
        top: 47, left: 0, width: 375, height: 50,
        background: "#000",
        borderBottom: "1px solid rgba(128,128,128,0.2)",
        padding: "0 12px",
      }}
    >
      <NetflixN />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#9CA3AF", textTransform: "uppercase" }}>
        Year End Review
      </span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
        <XIcon />
      </button>
    </div>
  );
}

// ── Shared: Progress bar ──────────────────────────────────────────────────────
function ProgressBar({ activeIndex }) {
  const segmentForScreen = [0, 1, 1, 2, 2, 3, 4];
  const active = segmentForScreen[activeIndex] ?? 0;
  return (
    <div
      className="absolute flex items-center"
      style={{ top: 126, left: 0, width: 375, height: 4, padding: "0 16px", gap: 6 }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= active ? "#fff" : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </div>
  );
}

// ── Shared: Home indicator ────────────────────────────────────────────────────
function HomeBar() {
  return (
    <div
      className="absolute"
      style={{
        bottom: 8, left: "50%", transform: "translateX(-50%)",
        width: 128, height: 4, borderRadius: 9999, background: "#525252",
      }}
    />
  );
}

// ── Shared: Glow blob ─────────────────────────────────────────────────────────
function Glow({ top, left, right, bottom, color, size = 280 }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top, left, right, bottom, width: size, height: size, borderRadius: 9999, background: color, filter: "blur(56px)" }}
    />
  );
}

// ── Shared: Gradient text ─────────────────────────────────────────────────────
function GradText({ gradient, children, style = {} }) {
  return (
    <span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", ...style }}>
      {children}
    </span>
  );
}

// ── Screen 0: Welcome ─────────────────────────────────────────────────────────
function Screen0() {
  return (
    <>
      <Glow top={-60} right={-80} color="rgba(229,9,20,0.15)" />
      <Glow bottom={-60} left={-80} color="rgba(50,35,36,0.4)" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ top: 133, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(14,8,39,0.6))" }} />

      {/* Ghost year */}
      <div className="absolute select-none pointer-events-none whitespace-pre text-center"
        style={{ top: 339, left: 44, width: 278, fontSize: 190, fontWeight: 800, lineHeight: "164px",
          background: "linear-gradient(to bottom, rgba(200,146,149,0.2), rgba(229,9,20,0.16), rgba(77,23,84,0.2))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: "blur(2px)" }}>
        {"20\n26"}
      </div>

      {/* Main year */}
      <div className="absolute select-none pointer-events-none whitespace-pre text-center"
        style={{ top: 344, left: 44, width: 278, fontSize: 190, fontWeight: 800, lineHeight: "164px",
          background: "linear-gradient(to bottom, rgba(200,146,149,1), rgba(229,9,20,0.8) 50%, rgba(77,23,84,1))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {"20\n26"}
      </div>

      <img src={sparklingStar} alt="" className="absolute pointer-events-none" style={{ top: 316, left: 280, width: 83, height: 83 }} />
      <img src={sparklingStar} alt="" className="absolute pointer-events-none" style={{ top: 655, left: 44, width: 96, height: 96 }} />

      <div className="absolute" style={{ top: 490, left: 291 }}>
        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" style={{ transform: "rotate(-0.25deg)" }}>
          <path d="M19.5 2 L21.2 17.8 L37 19.5 L21.2 21.2 L19.5 37 L17.8 21.2 L2 19.5 L17.8 17.8 Z" fill="rgba(205,179,114,0.83)" />
        </svg>
      </div>

      <div className="absolute text-center" style={{ top: 202, left: 25, width: 316, padding: "0 16px" }}>
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: "37.5px" }}>
          <GradText gradient="linear-gradient(to bottom, #fff, #a0a0a0)">Hey Yvonne!</GradText>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginTop: 8, lineHeight: "20px" }}>
          Your 2026 Year in Review is here.
        </div>
      </div>
    </>
  );
}

// ── Screen 1: Premium Membership ──────────────────────────────────────────────
function Screen1() {
  const features = [
    { icon: "📺", label: "4K Ultra HD & HDR" },
    { icon: "📱", label: "Streaming on 4 devices" },
    { icon: "🔊", label: "Spatial Audio" },
    { icon: "⬇️", label: "Downloads on 6 devices" },
    { icon: "🚫", label: "Unlimited Ad-free" },
    { icon: "👥", label: "Add Extra Members" },
  ];
  return (
    <>
      <Glow top={-60} right={-80} color="rgba(229,9,20,0.12)" />
      <div className="absolute pointer-events-none" style={{ top: 315, left: -41, width: 457, height: 457, borderRadius: 9999, background: "linear-gradient(135deg, #2563EB, #143885)", filter: "blur(80px)", opacity: 0.35 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ top: 103, background: "linear-gradient(to bottom, rgba(66,26,32,0.8), rgba(14,8,39,0.9))" }} />

      <div className="absolute text-center" style={{ top: 172, left: 31, width: 310 }}>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: "36px" }}>
          <GradText gradient="linear-gradient(to bottom, #fff, #a0a0a0)">You're getting the best of Netflix</GradText>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#D1D5DB", marginTop: 12, lineHeight: "20px" }}>
          Your Premium membership delivers ultimate quality and freedom.
        </div>
      </div>

      <div className="absolute" style={{ top: 310, left: 18, right: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "20px 16px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: "18px" }}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Screen 2: Content Value ───────────────────────────────────────────────────
function Screen2() {
  const rows = [
    { icon: "🎬", label: "Blockbuster Hits", sub: "Licensed content", value: "$210" },
    { icon: "📺", label: "Original Series", sub: "Exclusives you love", value: "$185" },
    { icon: "📋", label: "Documentaries", sub: "Award winners", value: "$145" },
  ];
  return (
    <>
      {/* Poster grid — purple-tinted */}
      <div className="absolute inset-0" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, opacity: 0.35 }}>
        {Array(12).fill(null).map((_, i) => (
          <div key={i} style={{ backgroundImage: `url(${poster})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 5 }} />
        ))}
      </div>
      {/* Purple overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(45,10,80,0.88), rgba(10,0,30,0.96))" }} />

      {/* Content text — transparent, no box */}
      <div className="absolute text-center" style={{ top: 155, left: 20, right: 20 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: "36px" }}>
          You accessed{" "}
          <span style={{ color: "#E50914" }}>$540</span>
          {" "}worth of content
        </div>
        <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(200,190,210,0.85)", lineHeight: "19px", marginTop: 10 }}>
          You've unlocked licensed and exclusive entertainment with your membership for only $24.99/month.
        </div>
      </div>

      {/* Popcorn — between content and rows */}
      <div className="absolute text-center" style={{ top: 300, left: 0, right: 0, fontSize: 52 }}>🍿</div>

      {/* Glassmorphism rows */}
      <div className="absolute" style={{ top: 375, left: 16, right: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{r.label}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{r.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#E50914" }}>{r.value}</div>
              <div style={{ fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>Value</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Screen 3: Ad-Free Hours ───────────────────────────────────────────────────
function Screen3() {
  return (
    <>
      <div className="absolute pointer-events-none" style={{ top: 252, left: 59, width: 256, height: 256, borderRadius: 9999, background: "rgba(229,9,20,0.25)", filter: "blur(40px)" }} />

      <div className="absolute text-center" style={{ top: 160, left: 20, right: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: "40px" }}>The Ad-Free Freedom</div>
      </div>

      {/* Ring with filled dark-red circle + stopwatch icon */}
      <div className="absolute" style={{ top: 245, left: "50%", transform: "translateX(-50%)", width: 238, height: 238 }}>
        <svg width="238" height="238" viewBox="0 0 238 238">
          {/* Filled dark background circle */}
          <circle cx="119" cy="119" r="107" fill="rgba(80,0,10,0.85)" />
          {/* Gray track */}
          <circle cx="119" cy="119" r="105" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          {/* Red progress arc ~70% */}
          <circle cx="119" cy="119" r="105" fill="none" stroke="#E50914" strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 105 * 0.7} ${2 * Math.PI * 105 * 0.3}`}
            strokeLinecap="round" transform="rotate(-90 119 119)" />
          {/* Outer glow ring */}
          <circle cx="119" cy="119" r="115" fill="none" stroke="rgba(229,9,20,0.31)" strokeWidth="4" />
          {/* Stopwatch icon */}
          <circle cx="119" cy="80" r="16" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
          <line x1="119" y1="64" x2="119" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="113" y1="60" x2="119" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="125" y1="60" x2="119" y2="58" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="119" y1="80" x2="119" y2="72" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
          <line x1="119" y1="80" x2="124" y2="77" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 30 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>70</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#A3A3A3", marginTop: 6 }}>Hours Saved</div>
        </div>
      </div>

      <div className="absolute text-center" style={{ top: 538, left: 40, right: 40 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: "30px" }}>
          You skipped <span style={{ color: "#E50914" }}>430</span> ads this year.
        </div>
        <div style={{ fontSize: 15, fontWeight: 400, color: "#A3A3A3", marginTop: 12, lineHeight: "22px" }}>
          That's 3 full days of pure, uninterrupted entertainment you gained back.
        </div>
      </div>
    </>
  );
}

// ── Screen 4: Top Genres ──────────────────────────────────────────────────────
function Screen4() {
  const genres = [
    { label: "Documentaries", gradient: "linear-gradient(90deg, #446244, #161A3E)" },
    { label: "Action & Adventure", gradient: "linear-gradient(90deg, #161A3E, #EA2A33)" },
    { label: "Comedies", gradient: "linear-gradient(90deg, #2563EB, #161A3E)" },
    { label: "Reality TV", gradient: "linear-gradient(90deg, #541895, #212544)" },
    { label: "Romance", gradient: "linear-gradient(90deg, #7B3336, #721385)" },
  ];
  return (
    <>
      <Glow top={100} left={-102} color="rgba(229,9,20,0.2)" size={456} />
      <Glow top={-230} left={52} color="rgba(22,26,62,0.3)" size={456} />

      <div className="absolute" style={{ top: 169, left: 52, right: 52 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>Your top interests</div>
        <div style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>Genres you've watched most.</div>
      </div>

      <div className="absolute" style={{ top: 255, left: 19, right: 19, display: "flex", flexDirection: "column", gap: 10 }}>
        {genres.map((g, i) => (
          <div key={i} style={{ background: g.gradient, borderRadius: 16, height: 80, display: "flex", alignItems: "center", padding: "0 24px" }}>
            <span style={{ fontSize: 20, fontWeight: 500, color: "#fff" }}>{g.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Screen 5: Watching Together ───────────────────────────────────────────────
function Screen5() {
  return (
    <>
      <Glow top={-60} left={-136} color="rgba(229,9,20,0.2)" size={524} />
      <Glow top={220} left={-2} color="rgba(22,26,62,0.47)" size={458} />

      <div className="absolute text-center" style={{ top: 155, left: 20, right: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: "40px" }}>Watching together</div>
        <div style={{ fontSize: 15, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginTop: 14, lineHeight: "22px" }}>
          You watched Stranger Things 6 times. You're in the top 1% of Hawkins fans!
        </div>
      </div>

      <div className="absolute" style={{ top: 295, left: 26, right: 26, bottom: 60, borderRadius: 16, overflow: "hidden" }}>
        <img src={strangerThings} alt="Stranger Things" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* HAWKINS IS CALLING overlay */}
        <div className="absolute" style={{ top: 0, left: 0, right: 0, padding: "14px 16px", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: 4, textTransform: "uppercase" }}>
            Hawkins is calling
          </div>
        </div>
      </div>
    </>
  );
}

// ── Screen 6: Shop / CTA ──────────────────────────────────────────────────────
function Screen6() {
  return (
    <>
      <Glow top={261} left={-35} color="rgba(229,9,20,0.2)" size={139} />
      <Glow top={359} left={103} color="rgba(229,9,20,0.3)" size={167} />
      <Glow top={446} left={270} color="rgba(37,99,235,0.1)" size={139} />

      <div className="absolute text-center" style={{ top: 165, left: 20, right: 20 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>Wear your fandom</div>
        <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.8)", marginTop: 12, lineHeight: "20px" }}>
          You spent 42 hours in the Upside Down this year. Shop the gear!
        </div>
      </div>

      <div className="absolute" style={{ top: 280, left: 76, width: 223, height: 223, borderRadius: 12, overflow: "hidden" }}>
        <img src={hoodie} alt="Stranger Things Hoodie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 12, right: -10, background: "linear-gradient(90deg, #E50914, #21073E)", borderRadius: 9999, padding: "6px 14px", fontSize: 9, fontWeight: 700, color: "#fff" }}>
          Limited Drop
        </div>
      </div>

      <div className="absolute text-center" style={{ top: 516, left: 20, right: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Official Hawkins High Collection</div>
        <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>Hoodie – Gray</div>
      </div>

      <div className="absolute" style={{ top: 598, left: 41, right: 41 }}>
        <button style={{ width: "100%", height: 49, borderRadius: 9999, background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>Visit Netflix Shop</span>
          {/* External link icon */}
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M8 1h4v4" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 1L6 7" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="absolute flex justify-between" style={{ top: 672, left: 40, right: 40 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h10v12l-5-3-5 3V2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Save</span>
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="13" cy="3" r="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
            <circle cx="13" cy="13" r="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
            <circle cx="3" cy="8" r="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
            <path d="M11 4L5 7M11 12L5 9" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
          </svg>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Share</span>
        </button>
      </div>
    </>
  );
}

// ── Prototype shell ───────────────────────────────────────────────────────────
const SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState(1);
  const [showRestart, setShowRestart] = useState(false);
  const touchStartX = useRef(null);

  const goTo = (next) => {
    if (animating || next < 0 || next >= SCREENS.length) return;
    setDir(next > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setCurrent(next); setAnimating(false); }, 280);
  };

  const handleClose = () => {
    if (current === SCREENS.length - 1) setShowRestart(true);
  };

  const handleRestart = () => {
    setShowRestart(false);
    setCurrent(0);
  };

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const handleTap = (e) => {
    if (showRestart) return;
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    goTo(current + (x > 187 ? 1 : -1));
  };

  const ScreenComponent = SCREENS[current];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#111" }}>
      <div
        style={{
          position: "relative", width: 375, height: 812,
          background: "#000", overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
          borderRadius: 44,
          boxShadow: "0 0 0 10px #222, 0 30px 80px rgba(0,0,0,0.8)",
          cursor: "pointer",
        }}
        onClick={handleTap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Screen content — animates on transition */}
        <div
          style={{
            position: "absolute", inset: 0,
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${dir * 30}px)` : "translateX(0)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
          }}
        >
          <ScreenComponent />
        </div>

        {/* Chrome — always static, renders on top */}
        <StatusBar />
        <NavBar onClose={handleClose} />
        <ProgressBar activeIndex={current} />
        <HomeBar />

        {/* Restart overlay — shown when X is tapped on the last screen */}
        {showRestart && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "#000", zIndex: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <NetflixN />
            <div style={{ marginTop: 32, fontSize: 22, fontWeight: 800, color: "#fff", textAlign: "center", lineHeight: "30px" }}>
              Thanks for watching<br />your Year in Review
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
              Want to go again?
            </div>
            <button
              onClick={handleRestart}
              style={{
                marginTop: 40, height: 49, padding: "0 40px",
                borderRadius: 9999, background: "#E50914",
                border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700, color: "#fff",
              }}
            >
              ↩ Restart Prototype
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
