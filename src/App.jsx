import { useEffect } from "react";
import initIntro from "./intro.js";

export default function App() {
  useEffect(() => {
    initIntro();
  }, []);

  return (
    <>
      <nav aria-label="Top">
        <a className="brand" href="#top">gowtham</a>
        <div className="links">
          <a href="https://x.com/gowtham_chou" rel="me noopener" target="_blank">x</a>
          <a href="https://github.com/gowthamchoudhary" rel="me noopener" target="_blank">github</a>
        </div>
      </nav>

      <main id="top">

        {/* ===== HERO ===== */}
        <section id="hero">
          <div className="aura" id="a-glow" aria-hidden="true"></div>
          <div className="eyes-wrap" id="eyesWrap">
            {/* ============ EYES — exact geometry, do not redesign ============ */}
            <svg id="eyes" viewBox="0 0 640 200" role="img" aria-label="Two glowing angular eyes in the dark">
              <defs>
                <linearGradient id="eyeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2f8cff" />
                  <stop offset=".55" stopColor="#cfeaff" />
                  <stop offset="1" stopColor="#ffffff" />
                </linearGradient>
                <filter id="eyebloom" x="-40%" y="-120%" width="180%" height="340%">
                  <feGaussianBlur stdDeviation="9" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="eyebloom-m" x="-40%" y="-120%" width="180%" height="340%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g id="pupils">
                <path className="eye" id="eyeL" filter="url(#eyebloom)" fill="url(#eyeg)"
                  d="M70 70 L270 100 Q276 128 250 132 L100 126 Q62 112 70 70Z" />
                <path className="eye r" id="eyeR" filter="url(#eyebloom)" fill="url(#eyeg)"
                  d="M570 70 L370 100 Q364 128 390 132 L540 126 Q578 112 570 70Z" />
              </g>
            </svg>
            {/* ============ end eyes geometry ============ */}
            <h1 className="sr-only">Gowtham — solo builder in Bengaluru. I make things in the dark and ship them into the light.</h1>
          </div>
          <div className="name-badge">
            <span className="name">Gowtham</span>
            <p className="hero-line">Solo builder. I make things in the dark and ship them into the light.</p>
            <div className="hero-urls">
              <a href="https://x.com/gowtham_chou" rel="me noopener" target="_blank">x/gowtham_chou</a>
              <a href="https://github.com/gowthamchoudhary" rel="me noopener" target="_blank">github/gowthamchoudhary</a>
            </div>
          </div>
        </section>

        {/* ===== THIS IS ME ===== */}
        <section className="wrap sec" aria-labelledby="s-me">
          <h2 className="sec-label" id="s-me">this is me</h2>
          <div className="sec-body">
            <p className="lead">I build alone, I enter hackathons because a deadline is the best excuse to finish something real, and I keep my work public because I’d rather be seen learning than pretend I already know it.</p>
            <ul className="raw">
              <li>raw line 1 in my own words</li>
              <li>raw line 2 in my own words</li>
              <li>raw line 3 in my own words</li>
              <li>raw line 4 in my own words</li>
            </ul>
          </div>
        </section>

        {/* ===== WHAT I WANT TO DO ===== */}
        <section className="wrap sec" aria-labelledby="s-want">
          <h2 className="sec-label" id="s-want">what i want to do</h2>
          <div className="sec-body">
            <p className="body-p">what I want to do goes here in my own words.</p>
          </div>
        </section>

        {/* ===== WHAT I'M DOING ===== */}
        <section className="wrap sec" aria-labelledby="s-now">
          <h2 className="sec-label" id="s-now">what i’m doing</h2>
          <div className="sec-body">
            <p className="body-p">what I'm doing this week goes here in my own words.</p>
          </div>
        </section>

        {/* ===== HACKATHONS ===== */}
        <section className="wrap sec" aria-labelledby="s-hack">
          <h2 className="sec-label" id="s-hack">hackathons</h2>
          <div className="sec-body">
            <ul className="grid2">
              <li className="item"><h3>Hackathon 1 Name</h3><span className="meta">2025 · 2nd</span><p>What I built goes here.</p></li>
              <li className="item"><h3>Hackathon 2 Name</h3><span className="meta">2025 · finalist</span><p>What I built goes here.</p></li>
              <li className="item"><h3>Hackathon 3 Name</h3><span className="meta">2026 · built</span><p>What I built goes here.</p></li>
              <li className="item"><h3>Hackathon 4 Name</h3><span className="meta">2026 · shipped</span><p>What I built goes here.</p></li>
            </ul>
          </div>
        </section>

        {/* ===== BOUNTIES ===== */}
        <section className="wrap sec" aria-labelledby="s-bty">
          <h2 className="sec-label" id="s-bty">bounties</h2>
          <div className="sec-body">
            <ul className="grid3">
              <li className="item"><h3>Bounty 1 Here</h3><span className="meta">Platform · 2026</span><p>What I fixed or built here.</p></li>
              <li className="item"><h3>Bounty 2 Here</h3><span className="meta">Platform · 2026</span><p>What I fixed or built here.</p></li>
              <li className="item"><h3>Bounty 3 Here</h3><span className="meta">Platform · 2026</span><p>What I fixed or built here.</p></li>
            </ul>
          </div>
        </section>

        {/* ===== FIND ME ===== */}
        <section className="wrap sec" aria-labelledby="s-find">
          <h2 className="sec-label" id="s-find">find me</h2>
          <div className="sec-body">
            <a className="who" href="https://x.com/gowtham_chou" target="_blank" rel="noopener">
              <b>x / twitter</b><span className="sub">@gowtham_chou</span>
              <span className="arr" aria-hidden="true">→</span>
            </a>
            <a className="who" href="https://github.com/gowthamchoudhary" target="_blank" rel="noopener">
              <b>github</b><span className="sub">github.com/gowthamchoudhary</span>
              <span className="arr" aria-hidden="true">→</span>
            </a>
            <a className="who" href="https://linkedin.com/in/gowthamchoudhary" target="_blank" rel="noopener">
              <b>linkedin</b><span className="sub">linkedin.com/in/gowthamchoudhary</span>
              <span className="arr" aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* ===== CONTRIBUTION CHART ===== */}
        <section className="wrap sec chart-main" aria-labelledby="s-chart">
          <h2 className="sec-label" id="s-chart">github contributions</h2>
          <div className="sec-body">
            <h3>1,441 contributions this past year</h3>
            <div className="themes" role="group" aria-label="Chart theme">
              <button type="button" className="pill" data-ct-btn="reactor" aria-pressed="true">reactor</button>
              <button type="button" className="pill" data-ct-btn="suit" aria-pressed="false">suit</button>
              <button type="button" className="pill" data-ct-btn="web" aria-pressed="false">web</button>
            </div>
            <div className="chart-scroll">
              <div id="chart" data-ct="reactor" role="img" aria-label="Contribution grid for the past year, 53 weeks by 7 days, Sunday to Saturday"></div>
            </div>
            <p className="chart-note"><span className="sq" aria-hidden="true"></span>A snapshot from October 2026. The live graph is on my <a href="https://github.com/gowthamchoudhary" target="_blank" rel="noopener">GitHub</a>.</p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer aria-label="Footer">
          <span className="foot-line">see you in the dark</span>
          <div className="foot-links">
            <a href="https://x.com/gowtham_chou" target="_blank" rel="noopener">x</a>
            <a href="https://github.com/gowthamchoudhary" target="_blank" rel="noopener">github</a>
          </div>
          <div className="web web-l" id="webL" aria-hidden="true"></div>
          <div className="web web-r" id="webR" aria-hidden="true"></div>
        </footer>
      </main>

      {/* opening overlay: wire + orb + flash */}
      <div id="intro" aria-hidden="true">
        <canvas id="wire"></canvas>
        <div className="capsule" id="capsule">
          <span className="orb"><span className="spin"></span><span className="blue"></span><span className="spec"></span></span>
          <span className="cap-text" id="capText">fixing it</span>
        </div>
      </div>
    </>
  );
}
