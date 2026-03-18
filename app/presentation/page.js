export const metadata = { title: 'MPJ Ads Launch Summary - March 2026' }

export default function Presentation() {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { height: 100%; overflow-x: hidden; margin: 0; padding: 0; }
          html { scroll-snap-type: y mandatory; scroll-behavior: smooth; }
          * { box-sizing: border-box; }
          .slide {
            width: 100vw; height: 100vh; height: 100dvh;
            overflow: hidden; scroll-snap-align: start;
            display: flex; flex-direction: column; position: relative;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          }
          :root {
            --charcoal: #1a1a2e; --gold: #c9a84c; --gold-light: #f5ecd7;
            --bone: #faf8f4; --slate: #64748b; --green: #22c55e; --blue: #3b82f6;
          }
          .slide-title {
            background: var(--charcoal); color: white;
            justify-content: center; align-items: center; text-align: center; padding: 2rem;
          }
          .slide-title h1 {
            font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.02em; margin: 0;
            background: linear-gradient(135deg, var(--gold), #e8d5a0);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .slide-title .subtitle { font-size: clamp(0.9rem, 2vw, 1.2rem); color: #94a3b8; margin-top: 1rem; }
          .slide-title .date { font-size: 0.85rem; color: var(--gold); margin-top: 2rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
          .slide-venue { background: var(--bone); padding: clamp(1.5rem, 3vw, 2.5rem); }
          .venue-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
          .venue-name { font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800; color: var(--charcoal); margin: 0; }
          .venue-badge { background: var(--gold); color: white; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
          .ad-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; flex: 1; overflow: hidden; }
          .ad-card { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; flex-direction: column; }
          .ad-card img { width: 100%; height: clamp(100px, 20vh, 220px); object-fit: cover; }
          .ad-card-body { padding: 0.6rem 0.85rem; }
          .ad-card-title { font-size: 0.8rem; font-weight: 700; color: var(--charcoal); margin: 0 0 0.2rem; }
          .ad-card-type { font-size: 0.6rem; font-weight: 600; color: var(--slate); text-transform: uppercase; letter-spacing: 0.05em; }
          .ad-card-cta { font-size: 0.6rem; color: var(--green); font-weight: 600; margin-top: 0.15rem; }
          .ad-card-url { font-size: 0.55rem; color: var(--blue); margin-top: 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .slide-audience { background: white; padding: clamp(1.5rem, 3vw, 2.5rem); }
          .audience-header { font-size: clamp(1.2rem, 3vw, 1.6rem); font-weight: 800; color: var(--charcoal); margin: 0 0 1.25rem; }
          .audience-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; flex: 1; overflow: hidden; }
          .audience-card { background: var(--bone); border-radius: 14px; padding: 1rem; border-left: 4px solid var(--gold); }
          .audience-card h3 { font-size: 0.85rem; font-weight: 700; color: var(--charcoal); margin: 0 0 0.6rem; }
          .audience-row { display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.35rem; }
          .audience-label { font-size: 0.6rem; font-weight: 700; color: var(--slate); text-transform: uppercase; letter-spacing: 0.05em; min-width: 65px; flex-shrink: 0; }
          .audience-value { font-size: 0.7rem; color: var(--charcoal); line-height: 1.4; }
          .tag { display: inline-block; background: white; border: 1px solid #e2e8f0; border-radius: 5px; padding: 0.1rem 0.4rem; font-size: 0.6rem; color: var(--charcoal); margin: 0.1rem; }
          .slide-status { background: var(--charcoal); color: white; padding: clamp(2rem, 4vw, 3.5rem); justify-content: center; }
          .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.6rem; margin-top: 1.25rem; }
          .status-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); border-radius: 10px; padding: 0.65rem 1rem; }
          .status-name { font-size: 0.8rem; font-weight: 600; }
          .status-badge { font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.03em; }
          .status-active { background: #22c55e33; color: #4ade80; }
          .nav { position: fixed; bottom: 1.2rem; right: 1.2rem; display: flex; gap: 0.4rem; z-index: 100; }
          .nav button { width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--charcoal); color: white; font-size: 0.9rem; cursor: pointer; opacity: 0.6; transition: opacity 0.2s; }
          .nav button:hover { opacity: 1; }
          .slide-num { position: absolute; bottom: 0.8rem; left: 1.2rem; font-size: 0.6rem; color: var(--slate); opacity: 0.4; }
        `}} />
      </head>
      <body>

        {/* SLIDE 1: TITLE */}
        <section className="slide slide-title">
          <h1>MPJ Ads Launch Summary</h1>
          <div className="subtitle">8 New Ad Creatives Across 4 Brands</div>
          <div className="date">March 18, 2026</div>
          <div className="slide-num">1 / 7</div>
        </section>

        {/* SLIDE 2: CUCINA */}
        <section className="slide slide-venue">
          <div className="venue-header">
            <h2 className="venue-name">Cucina Dubai</h2>
            <span className="venue-badge">3 Ads</span>
          </div>
          <div className="ad-grid">
            <div className="ad-card">
              <img src="/presentation/cucina-easter.jpg" alt="Easter Brunch" />
              <div className="ad-card-body">
                <p className="ad-card-title">Cucina Easter Brunch</p>
                <p className="ad-card-type">Carousel &middot; 4 Cards</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">sevenrooms.com/cucina-easter-brunch</p>
              </div>
            </div>
            <div className="ad-card">
              <img src="/presentation/cucina-kids.jpg" alt="Kids Dine Free" />
              <div className="ad-card-body">
                <p className="ad-card-title">Kids Below 12 Dine Free</p>
                <p className="ad-card-type">Carousel &middot; 4 Cards</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">cucinadubai.com/offers</p>
              </div>
            </div>
            <div className="ad-card">
              <img src="/presentation/cucina-pasta.jpg" alt="Pasta Menu" />
              <div className="ad-card-body">
                <p className="ad-card-title">Unlimited Pasta Menu</p>
                <p className="ad-card-type">Carousel &middot; 4 Cards</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">cucinadubai.com/offers</p>
              </div>
            </div>
          </div>
          <div className="slide-num">2 / 7</div>
        </section>

        {/* SLIDE 3: MYAMI */}
        <section className="slide slide-venue">
          <div className="venue-header">
            <h2 className="venue-name">MYAMI</h2>
            <span className="venue-badge">2 Ads</span>
          </div>
          <div className="ad-grid">
            <div className="ad-card">
              <img src="/presentation/myami-matches.png" alt="Live Matches" />
              <div className="ad-card-body">
                <p className="ad-card-title">Live Matches, Beer Buckets &amp; Happy Hour</p>
                <p className="ad-card-type">Carousel &middot; 4 Cards</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">sevenrooms.com/myami-bal-harbour</p>
              </div>
            </div>
            <div className="ad-card">
              <div style={{height: 'clamp(100px, 20vh, 220px)', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '2rem'}}>&#9654;</div>
              <div className="ad-card-body">
                <p className="ad-card-title">Pets Dine for Free</p>
                <p className="ad-card-type">Video / Reel</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">sevenrooms.com/myami-bal-harbour</p>
              </div>
            </div>
          </div>
          <div className="slide-num">3 / 7</div>
        </section>

        {/* SLIDE 4: SMOKI MOTO */}
        <section className="slide slide-venue">
          <div className="venue-header">
            <h2 className="venue-name">Smoki Moto</h2>
            <span className="venue-badge">1 Ad</span>
          </div>
          <div className="ad-grid">
            <div className="ad-card" style={{maxWidth: '350px'}}>
              <img src="/presentation/smoki-eid.jpg" alt="Eid Offer" />
              <div className="ad-card-body">
                <p className="ad-card-title">Smoki Moto Eid Offer &mdash; Wagyu Wednesdays</p>
                <p className="ad-card-type">Single Image</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">sevn.ly/x5zxh1l3</p>
              </div>
            </div>
          </div>
          <div className="slide-num">4 / 7</div>
        </section>

        {/* SLIDE 5: BAL HARBOUR */}
        <section className="slide slide-venue">
          <div className="venue-header">
            <h2 className="venue-name">Bal Harbour Beach</h2>
            <span className="venue-badge">2 Ads</span>
          </div>
          <div className="ad-grid">
            <div className="ad-card">
              <img src="/presentation/balharbour-daypass.jpg" alt="Day Pass" />
              <div className="ad-card-body">
                <p className="ad-card-title">Pool &amp; Beach Day Pass</p>
                <p className="ad-card-type">Carousel &middot; 5 Cards</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">linktr.ee/BALHARBOURBEACHDUBAI</p>
              </div>
            </div>
            <div className="ad-card">
              <div style={{height: 'clamp(100px, 20vh, 220px)', background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '2rem'}}>&#9654;</div>
              <div className="ad-card-body">
                <p className="ad-card-title">Pool &amp; Beach Day Pass &mdash; Reel</p>
                <p className="ad-card-type">Video / Reel</p>
                <p className="ad-card-cta">Book Now</p>
                <p className="ad-card-url">linktr.ee/BALHARBOURBEACHDUBAI</p>
              </div>
            </div>
          </div>
          <div className="slide-num">5 / 7</div>
        </section>

        {/* SLIDE 6: AUDIENCE */}
        <section className="slide slide-audience">
          <h2 className="audience-header">Audience Targeting</h2>
          <div className="audience-grid">
            <div className="audience-card">
              <h3>Cucina Dubai</h3>
              <div className="audience-row"><span className="audience-label">Age</span><span className="audience-value">18 &ndash; 65</span></div>
              <div className="audience-row"><span className="audience-label">Location</span><span className="audience-value">UAE</span></div>
              <div className="audience-row"><span className="audience-label">Interests</span>
                <span className="audience-value">
                  <span className="tag">Italy</span><span className="tag">Italian Cuisine</span><span className="tag">Pasta</span><span className="tag">Pizza</span><span className="tag">Gelato</span><span className="tag">Wine</span><span className="tag">Brunch</span><span className="tag">Restaurants</span><span className="tag">Foodie</span><span className="tag">Dining Out</span><span className="tag">Cocktail</span><span className="tag">Coffee</span><span className="tag">Culinary Art</span><span className="tag">Prosecco</span><span className="tag">Pork</span><span className="tag">Lunch</span><span className="tag">Alcoholic Beverages</span><span className="tag">Leisure</span><span className="tag">Palm Jumeirah</span><span className="tag">European Cultures</span><span className="tag">Liqueur</span>
                </span>
              </div>
            </div>
            <div className="audience-card">
              <h3>MYAMI</h3>
              <div className="audience-row"><span className="audience-label">Age</span><span className="audience-value">18 &ndash; 65</span></div>
              <div className="audience-row"><span className="audience-label">Location</span><span className="audience-value">Dubai, UAE</span></div>
              <div className="audience-row"><span className="audience-label">Interests</span>
                <span className="audience-value">
                  <span className="tag">Cocktail</span><span className="tag">Outdoor Recreation</span><span className="tag">Beer</span><span className="tag">Soccer</span><span className="tag">Bars</span><span className="tag">Dining Out</span><span className="tag">Parenting</span><span className="tag">Dogs</span><span className="tag">Nightlife</span><span className="tag">Beaches</span><span className="tag">Happy Hour</span><span className="tag">Foodie</span><span className="tag">Brunch</span>
                </span>
              </div>
            </div>
            <div className="audience-card">
              <h3>Smoki Moto</h3>
              <div className="audience-row"><span className="audience-label">Age</span><span className="audience-value">24 &ndash; 65</span></div>
              <div className="audience-row"><span className="audience-label">Location</span><span className="audience-value">Dubai, UAE</span></div>
              <div className="audience-row"><span className="audience-label">Interests</span>
                <span className="audience-value">
                  <span className="tag">Luxury</span><span className="tag">Steak</span><span className="tag">Steakhouse</span><span className="tag">Korean BBQ</span><span className="tag">Korean Cuisine</span><span className="tag">K-pop</span><span className="tag">Korean Drama</span><span className="tag">Korean Pop Idol</span><span className="tag">Sony Music K-pop</span><span className="tag">Bars</span><span className="tag">Nightclubs</span><span className="tag">Nightlife</span><span className="tag">Dining Out</span><span className="tag">Cocktail Party</span><span className="tag">Alcoholic Beverages</span><span className="tag">Leisure</span><span className="tag">Luxury Lifestyle</span>
                </span>
              </div>
            </div>
            <div className="audience-card">
              <h3>Bal Harbour Beach</h3>
              <div className="audience-row"><span className="audience-label">Age</span><span className="audience-value">21 &ndash; 65</span></div>
              <div className="audience-row"><span className="audience-label">Location</span><span className="audience-value">Dubai, UAE</span></div>
              <div className="audience-row"><span className="audience-label">Interests</span>
                <span className="audience-value">
                  <span className="tag">Outdoor Recreation</span><span className="tag">Bars</span><span className="tag">Swimming</span><span className="tag">Swimming Pool</span><span className="tag">Parenting</span><span className="tag">Health &amp; Wellness</span><span className="tag">Physical Fitness</span><span className="tag">Tourism in Dubai</span><span className="tag">Nightlife</span><span className="tag">Beaches</span><span className="tag">Restaurants</span><span className="tag">Brunch</span><span className="tag">Paddleboarding</span>
                </span>
              </div>
            </div>
          </div>
          <div className="slide-num">6 / 7</div>
        </section>

        {/* SLIDE 7: STATUS */}
        <section className="slide slide-status">
          <h2 style={{fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, margin: 0}}>Launch Status</h2>
          <p style={{color: '#94a3b8', margin: '0.4rem 0 0', fontSize: '0.85rem'}}>All 8 ads are active and live across Meta placements</p>
          <div className="status-grid">
            {[
              'Cucina Easter Brunch',
              'Cucina Kids Dine Free',
              'Cucina Unlimited Pasta',
              'MYAMI Live Matches',
              'Smoki Moto Eid Offer',
              'Bal Harbour Day Pass',
              'Bal Harbour Day Pass Reel',
              'Pets Dine for Free Reel',
            ].map(name => (
              <div key={name} className="status-row">
                <span className="status-name">{name}</span>
                <span className="status-badge status-active">Active</span>
              </div>
            ))}
          </div>
          <p style={{color: 'var(--gold)', marginTop: '1.5rem', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center'}}>Managed by MPJ Digital &middot; March 2026</p>
          <div className="slide-num" style={{color: 'rgba(255,255,255,0.3)'}}>7 / 7</div>
        </section>

        <nav className="nav">
          <button onClick="scroll({top:window.scrollY-window.innerHeight,behavior:'smooth'})">&uarr;</button>
          <button onClick="scroll({top:window.scrollY+window.innerHeight,behavior:'smooth'})">&darr;</button>
        </nav>

      </body>
    </html>
  )
}
