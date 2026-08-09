import { Link } from 'react-router-dom'

// Broken glyphs in The Seasons are handled globally by the unicode-range split in
// index.css. This only gives figures the branded Rajdhani treatment.
function renderText(text) {
  return text.split(/(\d+(?:[+%])?)/).map((part, i) =>
    /^\d/.test(part)
      ? <span key={i} style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{part}</span>
      : part
  )
}

export default function Team() {
  // Each slot below states something the others do not.
  //
  // The hero caption over each portrait is now the only place a role is named.
  // Before it existed, every founder announced his four times over — once in the
  // caption, again in a title line under his name, again in the opening clause
  // of his bio, and again in a credential pill. The pills in particular were
  // titles wearing a credential's clothes.
  //
  // So: caption carries the role, the bio carries what the man actually does,
  // and the pills carry qualifications a title cannot convey. No `title` field
  // any more — it had nothing left to say that the caption above it had not.
  const founders = [
    {
      name: 'Julian James',
      // Completes the role line on the card: "CO-FOUNDER & CEO".
      office: 'CEO',
      quote: '"Leadership is forged in service and driven by unwavering commitment."',
      bio: 'Julian brings military precision and accountability to every load, every route, and every client relationship.',
      image: '/Company Images/webp/founder-julian.webp',
      // Framing for the avatar circle. avatarZoom is a background-size: at
      // 100% the portrait's full width fits the circle, which frames him head
      // to knees — far wider than the head-and-shoulders crop wanted here.
      // Percentages above 100 close in.
      avatarPosition: 'center 20%',
      avatarZoom: '215%',
      credentials: [
        { label: 'U.S. MARINE VETERAN', style: 'filled' }
      ],
      highlights: ['10+ Years Logistics', '100% On-Time Delivery', 'Fleet Expansion', 'Driver Training']
    },
    {
      name: 'Bruce Burgess',
      office: 'COO',
      quote: '"Professionalism isn\'t just a standard; it\'s our uncompromising promise."',
      bio: 'Bruce ensures every shipment meets the company\'s uncompromising standards for safety, timing, and professionalism.',
      image: '/Company Images/webp/founder-bruce.webp',
      // Shallower than Julian's and a touch less zoom — the hat needs headroom
      // his crown does not.
      avatarPosition: 'center 24%',
      avatarZoom: '200%',
      // Promoted out of the highlights list below, so Bruce keeps a credential
      // pill to balance Julian's without either of his old title pills.
      credentials: [
        { label: 'CERTIFIED LOGISTICS', style: 'filled' }
      ],
      highlights: ['10+ Years Logistics', '100% On-Time Delivery', 'Safety Expert', 'Driver Training']
    }
  ]

  // Figures already claimed elsewhere on the site — verify before launch.
  const stats = [
    { value: '15+', label: 'Years Logistics' },
    { value: '100%', label: 'On-Time Delivery' },
    { value: '3', label: 'Trailer Types' },
    { value: '24/7', label: 'Support' }
  ]

  // Icons are single-colour black SVGs, applied as CSS masks rather than <img>
  // so they inherit the band's ink colour instead of being stuck at #000.
  const values = [
    {
      title: 'Safety First',
      description: 'Every driver, every delivery, every mile is executed with the highest safety standards.',
      icon: '/Company Images/webp/page-icons/safety-first.webp',
      // Line art: fills the box, and still takes a touch more ink than the solid
      // SVG marks so its thin strokes read at the same weight. The gap is much
      // smaller than it was at low alpha — both are near-opaque now.
      iconScale: '100%',
      iconInk: 1
    },
    {
      title: 'Professional Excellence',
      description: 'Our team is trained, certified, and committed to delivering exceptional service.',
      icon: '/Company Images/webp/page-icons/professional-excellence.webp',
      // Same line-art treatment as the shield. Scaled to 92% rather than 100%
      // because the medal's ribbon makes the artwork taller than it is wide —
      // at full scale its medallion would read smaller than its neighbours.
      iconScale: '92%',
      iconInk: 1
    },
    {
      title: 'Customer Focus',
      description: 'Our clients\' success is our top priority.',
      icon: '/Company Images/webp/page-icons/customer-focus.webp',
      // Line art, so it takes the full ink like the shield and the medal. Unlike
      // those two the source is 330x360 rather than square, and mask-size sets
      // width with height auto — at 100% it would render 56x61 and clip against
      // the fixed 56px box. 88% puts the taller axis at ~54px, just inside.
      iconScale: '88%',
      iconInk: 1
    },
    {
      title: 'Continuous Growth',
      description: 'We are always expanding our capabilities.',
      icon: '/Company Images/webp/page-icons/continuous-growth.webp',
      // Line art, so full ink like the rest. Scaled past 100% — unusual here —
      // because the truck occupies only the middle half of its 330x360 canvas
      // (90px of empty space above and below). At 88% it would render a ~38px
      // truck and read far smaller than its neighbours. 110% brings it to ~48px
      // wide, matching Customer Focus; the overflow clips 5.6px into 16.8px of
      // vertical padding and 2.8px into 6.9px horizontal, so no ink is lost.
      iconScale: '110%',
      iconInk: 1
    }
  ]

  return (
    <div style={{
      background: '#0D0F12',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility'
    }}>
      <style>{`
        .metallic-gold {
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.75));
        }
        /* ------------------------------------------------------------------
           HEADER EXTRAS — mirrored from the About page header treatment
           (eyebrow kicker → title → subline → gold rule), themed here to the
           founders. These sit inside .leader-hero-title, which is visually
           hidden on desktop (the portrait captions carry the header there),
           so this dresses the otherwise-bare MOBILE header.
           ------------------------------------------------------------------ */
        @keyframes eyebrowGlow {
          0%, 100% { text-shadow: 0 0 6px rgba(200, 160, 32, 0.15); }
          50% { text-shadow: 0 0 10px rgba(200, 160, 32, 0.3); }
        }
        /* Spaced gold label flanked by two fading hairlines, with a slow glow —
           identical construction to the About eyebrow. */
        .eyebrow-premium {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          animation: eyebrowGlow 4s ease-in-out infinite;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #C8A020;
        }
        .eyebrow-premium::before,
        .eyebrow-premium::after {
          content: '';
          width: 28px;
          height: 1px;
          flex-shrink: 0;
        }
        .eyebrow-premium::before {
          background: linear-gradient(90deg, transparent, #C8A020);
        }
        .eyebrow-premium::after {
          background: linear-gradient(90deg, #C8A020, transparent);
        }
        /* Leadership-specific sub-headline under the title. */
        .leader-subhead {
          font-family: 'The Seasons', serif;
          font-size: 13px;
          color: #8A919A;
          margin: 0;
          max-width: 32ch;
        }
        /* Single gold rule closing the header, as on the About page. */
        .leader-hero-rule {
          width: 48px;
          height: 3px;
          background: #C8A020;
          margin: 0 auto;
        }
        .leader-hero {
          position: relative;
          height: 380px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .leader-hero-half {
          position: relative;
          overflow: hidden;
        }
        .leader-hero-half img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .leader-hero-half::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(13, 15, 18, 0.45);
        }
        /* Two layers per half, listed topmost first.

           The lower layer is the vignette. It used to run 0.75 -> 0.35 straight
           across, which put roughly 0.55 of flat black over each founder's face
           — they were the darkest-covered part of their own portrait. It now
           falls away quickly to about 0.37 by the time it reaches them and
           holds the heavy value only at the outer edge, so the faces carry the
           band and the frame still closes. Its black is warmed toward the
           brand's gold (16,13,7 rather than 13,15,18); at these alphas that
           reads as warmth in the shadows, not as a colour cast.

           The upper layer fades the base of each photograph into the caption
           strip below, so the portraits and their titles read as one plate
           instead of two stacked bands with a hard seam between them. */
        .leader-hero-half.left::after {
          background:
            linear-gradient(180deg, transparent 58%, rgba(13,15,18,0.92) 100%),
            linear-gradient(90deg, rgba(16,13,7,0.80) 0%, rgba(16,13,7,0.38) 45%, rgba(13,15,18,0.30) 100%);
        }
        .leader-hero-half.right::after {
          background:
            linear-gradient(180deg, transparent 58%, rgba(13,15,18,0.92) 100%),
            linear-gradient(90deg, rgba(13,15,18,0.30) 0%, rgba(16,13,7,0.38) 55%, rgba(16,13,7,0.80) 100%);
        }
        .leader-hero-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          transform: translateX(-50%);
          background: linear-gradient(180deg,
            transparent,
            rgba(200, 160, 32, 0.55) 20%,
            rgba(200, 160, 32, 0.55) 80%,
            transparent);
          z-index: 4;
        }
        .leader-hero-title {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          padding: 0 24px;
        }
        .leader-hero-title h1 {
          font-family: 'The Seasons', serif;
          font-weight: 800;
          font-size: 46px;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-align: center;
          margin: 0;
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.85))
                  drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
        }

        /* ------------------------------------------------------------------
           PER-FOUNDER ROLE LABELS — DESKTOP ONLY.

           Replaces the single centred "LEADERSHIP FORGED IN SERVICE" banner
           with a caption under each portrait, so each title belongs to the
           face above it instead of to the pair.

           Everything here is inside min-width: 769px and nothing below that
           width is touched. Under 769px the portraits are display:none
           already, there is nothing for a caption to caption, and the original
           banner stays exactly as it was on every phone and small tablet.
           ------------------------------------------------------------------ */
        .leader-hero-role { display: none; }

        /* Was an inline 56px 24px; moved here because an inline style outranks
           a stylesheet rule and the desktop block below needs to override it.

           It has to be declared BEFORE that block, not after. A media query
           adds no specificity, so two single-class rules are decided purely on
           source order — written afterwards, this shorthand would silently
           reinstate the padding the desktop rule had just cleared. */
        .founder-profiles {
          padding: 56px 24px;
        }

        @media (min-width: 769px) {
          /* A second row for the captions. The portraits keep their original
             380px; the caption band sizes to its own content and carries the
             page's background colour, so it reads as the dark strip between
             the photographs and the profiles rather than as part of either. */
          .leader-hero {
            height: auto;
            /* Portrait row height tracks the viewport WIDTH, not a fixed pixel
               value.

               It was a flat 380px while the two halves widen with the window,
               so the box the portrait had to cover kept getting wider without
               getting taller. object-fit: cover answers that by scaling the
               1200x1500 photo until it spans the width and letting the
               overflow fall off the top and bottom — which meant the founders
               were framed differently on every screen size. Measured on the
               live site: 24% of the photograph visible at a 2560px viewport,
               19% at 3200px. A laptop and a 4K monitor showed two different
               crops of the same man.

               Tying the height to vw holds the box's aspect ratio constant, so
               the visible fraction is constant too. It works out to 1.6 x 24vw
               / vw = 38.4% of the portrait at any width in the clamp's range —
               close to how the page looked on a ~1600px window, which is the
               framing that was wanted.

               The bounds are guards, not the intent: below ~1170px and above
               ~3250px the clamp pins the height and the crop drifts again, but
               that range covers essentially every desktop window. The ceiling
               is deliberately generous — at 640px it was already clipping a
               3200px screen back to a 32% crop, reintroducing on ultrawide the
               exact inconsistency this is meant to remove. */
            --hero-portrait-h: clamp(280px, 24vw, 780px);
            /* The caption row is a fixed 56px rather than auto, because the
               profiles section below gives back exactly 56px of its own top
               padding to compensate. Fixed on both sides means the profiles
               land on the same pixel they did before the captions existed;
               an auto row would drift with the font metrics. */
            grid-template-rows: var(--hero-portrait-h) 56px;
          }
          /* The gold divider was top:0/bottom:0 on a fixed-height hero. Now
             that the hero also contains the caption row, it has to be pinned
             to the portraits or it would run down between the two captions.
             Reads the same custom property so it cannot drift out of step with
             the row it is measuring. */
          .leader-hero-seam {
            bottom: auto;
            height: var(--hero-portrait-h);
          }
          .leader-hero-role {
            /* Centred in its own half, directly under the portrait above it.
               Flex rather than padding so the band stays exactly the 56px the
               grid row allocates, whatever the font does. */
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0D0F12;
            padding: 0 24px;
            /* The same gold hairline at the same alpha as the stat band's
               borders further down the page, so the collage is framed in the
               language the page already speaks rather than a new one. Inside
               the 56px track because preflight sets border-box, so it costs no
               height and the profiles stay on their line. */
            border-top: 1px solid rgba(200, 160, 32, 0.18);
          }
          .leader-hero-role > span {
            /* inline-block, not flex. The underline below is a block-level
               ::after that has to sit under the text, and inline-block keeps
               the words themselves as ordinary inline content — so the spaces
               around the ampersand survive, which they did not when this was a
               flex container dropping whitespace-only runs. */
            display: inline-block;
            text-align: center;
            /* Bebas Neue: condensed, uppercase, drawn heavy. No font-weight
               declared, because the family ships exactly one — asking for 700
               would not load a bold, it would let the browser smear this into a
               fake one. Impact is the fallback for the same reason: it is the
               only condensed display face reliably on both Windows and macOS,
               so a failed webfont degrades to the right shape rather than to
               Arial. */
            font-family: 'Bebas Neue', Impact, 'Haettenschweiler', sans-serif;
            font-size: 36px;
            /* Condensed display faces carry loose default leading. Pinning it
               to 1 is what lets the text, the gap and the bar fit the 56px
               band without pushing the profiles back down the page. */
            line-height: 1;
            letter-spacing: 2px;
            text-transform: uppercase;
            white-space: nowrap;
            color: #C9A227;
            /* Subtle and soft, as specified — depth, not drama. A single
               offset shadow; the glow stack is gone, it fought the gold. */
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
          }

          /* The accent bar. Width is a percentage of the text rather than a
             fixed pixel value, so it stays proportionate to whichever title
             sits above it instead of being tuned to one of them. */
          .leader-hero-role > span::after {
            content: '';
            display: block;
            width: 46%;
            /* Sub-pixel on purpose. 1px is already the thinnest a solid line
               can be drawn, so going finer means going below a device pixel:
               on a high-DPI screen this is a true hairline, and on a 1x screen
               the browser antialiases it to a lighter 1px line — which reads
               thinner either way. Alpha is the next lever if it needs to
               recede further still. */
            height: 0.5px;
            margin: 10px auto 0;
            background: #C9A227;
          }

          /* Most of the 56px the caption row took, handed back — but not all of
             it. At zero the accent bar under each title finished about 4px
             above the photo frames below, which read as the two touching.

             32px is the clearance. It costs the profiles 32px of the line they
             used to sit on; the gap has to come from somewhere, and taking it
             out of the portraits above would have meant shrinking the collage
             instead. */
          .founder-profiles {
            padding-top: 32px;
          }

          /* The banner is the page's only h1. Hidden from sight rather than
             from the document, so the page keeps a top-level heading for
             search engines and screen readers. clip-path rather than
             display:none for exactly that reason. */
          .leader-hero-title {
            inset: auto;
            top: 0;
            left: 0;
            width: 1px;
            height: 1px;
            padding: 0;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
          }
        }
        /* Background zone: spans founder profiles → stat band → values band →
           CTA. Image and scrim are separate layers so the image can be graded
           independently — a flat overlay at high alpha crushes the photo's
           contrast range and reads muddy. */
        .leadership-bg {
          position: relative;
          background: #0D0F12;
          isolation: isolate;
        }
        /* Image layer. Explicit z-index puts it under ::before despite the
           normal paint order. Graded to recover the sunset's warmth through
           the scrim. */
        .leadership-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: url('/Company Images/webp/leadership-background.webp');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          filter: contrast(1.18) saturate(1.3) brightness(1.06);
        }
        /* Scrim plus both edge fades in one gradient: solid #0D0F12 at the top
           and bottom edges so there is no seam against the hero or footer,
           easing to a flat 0.62 wash across the middle. */
        .leadership-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            180deg,
            #0D0F12 0,
            rgba(13, 15, 18, 0.62) 90px,
            rgba(13, 15, 18, 0.62) calc(100% - 90px),
            #0D0F12 100%
          );
        }
        .leadership-bg > * {
          position: relative;
          z-index: 2;
        }
        /* Fixed attachment is unreliable on mobile browsers — fall back to
           normal scroll below 768px. */
        @media (max-width: 768px) {
          .leadership-bg::after {
            background-attachment: scroll;
          }
        }
        .cred-pill {
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 9px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          display: inline-block;
        }
        .cred-pill.filled {
          background: #C8A020;
          border: 1px solid #C8A020;
          color: #0D0F12;
        }
        .cred-pill.outlined {
          background: transparent;
          border: 1px solid #C8A020;
          color: #C8A020;
        }
        /* Name, quote and bio were inline styles on the elements themselves.
           They are declared here instead because an inline style outranks any
           rule in this sheet, and the desktop block at the foot of it has to
           be able to resize them. Every value below is exactly what was
           inline, so no width under 801px renders differently. */
        .founder-name {
          font-family: 'The Seasons', serif;
          font-weight: 800;
          font-size: 24px;
          margin: 0 0 2px 0;
        }
        .founder-quote {
          font-family: 'The Seasons', serif;
          font-style: italic;
          font-size: 13px;
          color: #FFFFFF;
          line-height: 1.5;
          margin: 0 0 10px 0;
        }
        .founder-bio {
          font-family: 'The Seasons', serif;
          font-size: 12.5px;
          color: #C8CDD3;
          line-height: 1.6;
          margin: 0 0 12px 0;
        }
        .founder-highlights {
          list-style: none;
          margin: 12px 0 0 0;
          padding: 0;
        }
        .founder-highlights li {
          font-family: 'The Seasons', serif;
          font-weight: 600;
          font-size: 12px;
          /* Same ink as the bio directly above, so the two read as one block of
             copy rather than as a paragraph followed by a separate gold list.
             Deliberately the bio's #C8CDD3 rather than a pure #FFFFFF, which
             would sit brighter than the text it is meant to match. The bullets
             below stay gold — they are accents, not content. */
          color: #C8CDD3;
          line-height: 1.9;
          padding-left: 14px;
          position: relative;
        }
        .founder-highlights li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #C8A020;
        }
        .join-team-btn {
          font-family: 'The Seasons', serif;
          font-weight: 800;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0D0F12;
          background: linear-gradient(180deg, #E4C050, #C8A020);
          padding: 14px 40px;
          border-radius: 2px;
          display: inline-block;
          text-decoration: none;
          box-shadow: 0 0 24px rgba(200, 160, 32, 0.5);
          transition: box-shadow 0.2s ease;
        }
        .join-team-btn:hover {
          box-shadow: 0 0 36px rgba(200, 160, 32, 0.75);
        }
        .founders-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .founders-grid > .founder-row:first-child {
          padding-right: 44px;
          border-right: 1px solid rgba(200, 160, 32, 0.18);
        }
        /* Bruce's portrait moves to the outer edge of his card, putting it
           under the "COO & CO-FOUNDER" caption on the right half of the hero
           the same way Julian's sits under his on the left. The two cards
           become a mirrored pair rather than two copies of one layout.

           min-width: 801px because below that the grid is a single column with
           one founder shown at a time via the tabs — there is no outer edge to
           mirror toward, and no hero portrait overhead to line up with. The
           copy stays left-aligned; only the photo and text swap sides. */
        @media (min-width: 801px) {
          .founders-grid > .founder-row:last-child {
            flex-direction: row-reverse;
          }
        }
        .stat-band {
          border-top: 1px solid rgba(200, 160, 32, 0.18);
          border-bottom: 1px solid rgba(200, 160, 32, 0.18);
          background: rgba(200, 160, 32, 0.035);
          padding: 26px 24px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .stat-item {
          text-align: center;
          border-right: 1px solid rgba(200, 160, 32, 0.18);
        }
        .stat-item:last-child {
          border-right: none;
        }
        /* The unicode-range split in index.css keeps digits and symbols off the
           broken Seasons glyphs, so this stays clean. Solid fill rather than the
           metallic gradient, which muddies figures at this size.

           White rather than gold: the figures are the one thing on this band
           worth reading first, and against a page where nearly every accent is
           already #C8A020 they were competing with the decoration rather than
           standing out from it. */
        .stat-value {
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: 0.5px;
          color: #FFFFFF;
          font-variant-numeric: tabular-nums;
          font-feature-settings: 'tnum' 1;
          -webkit-font-smoothing: antialiased;
        }
        /* Muted white rather than the old blue-grey, so the value and its
           label read as one white pair instead of two different inks. */
        .stat-label {
          font-family: 'The Seasons', serif;
          font-weight: 600;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.52);
          margin-top: 6px;
          -webkit-font-smoothing: antialiased;
        }
        .values-grid {
          display: grid;
          grid-template-columns: minmax(120px, 140px) repeat(4, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }
        /* The heading is the grid's first cell, not a block above it, so it costs
           the band no height at all — it occupies the column beside the icons
           instead of a row above them.

           It previously sat above the grid on a margin-bottom: -43px, which pulled
           the icons up onto the heading's line so the outer two flanked it. That
           framing only worked while the icons were faint tone-on-tone marks; at
           full ink it read as a collision. Moving the heading into the grid keeps
           the band's original height without needing the icons to stay faint.

           Stacked one word per line and centred, so OUR sits centred over SHARED
           over VALUES. The column width does the line-breaking rather than markup:
           at ~120px of content it is wider than SHARED (~107px) but narrower than
           OUR SHARED (~169px), so the three words always break the same way. That
           was previously a coin flip — the old 190px column left ~170px of content
           against a ~169px phrase, so the wrap depended on exact font metrics.
           Vertically centred against the taller value columns, and taking the same
           hairline right border as .value-item so it reads as part of the row
           rather than a floating label. */
        .values-heading {
          align-self: center;
          text-align: center;
          line-height: 1.15;
          padding-right: 20px;
          border-right: 1px solid rgba(13, 15, 18, 0.15);
        }
        /* Hairline dividers between values, matching the .stat-item idiom used
           in the band above — structure rather than decoration. */
        .value-item {
          text-align: center;
          padding: 0 20px;
          border-right: 1px solid rgba(13, 15, 18, 0.15);
        }
        .value-item:last-child {
          border-right: none;
        }
        /* No frame — the icon sits straight on the gold, in the same near-black
           ink as the heading and titles so the band stays a two-colour system.
           At full strength this reads as a solid mark rather than the debossed
           stamp it used to be; the 1px white drop-shadow is kept because it still
           crisps the lower edge against the gold. To go back to the recessed
           look, drop --icon-ink to ~0.24 (0.5 for the line art). */
        /* Fixed 56px box for every icon so the titles stay on one line across
           all four columns; apparent size is tuned per-icon via --icon-scale
           instead of by resizing the box. --icon-ink lets line-art marks carry
           a heavier fill than solid glyphs — thin strokes cover far less area,
           so they need more alpha to read at the same perceived weight. */
        .value-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 10px;
          background-color: rgba(13, 15, 18, var(--icon-ink, 0.9));
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: var(--icon-scale, 75%);
          mask-size: var(--icon-scale, 75%);
          filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.38));
          transition: background-color 0.3s ease;
        }
        .value-item:hover .value-icon {
          background-color: rgba(13, 15, 18, calc(var(--icon-ink, 0.9) + 0.1));
        }
        .value-rule {
          width: 20px;
          height: 1px;
          margin: 9px auto 10px;
          background: rgba(13, 15, 18, 0.3);
          transition: width 0.3s ease;
        }
        .value-item:hover .value-rule {
          width: 32px;
        }
        @media (max-width: 800px) {
          .founders-grid {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          /* Value items are children 2-5 because the heading is child 1, so the
             right-hand column of the two-up grid is the ODD children, not even. */
          .value-item:nth-child(odd) {
            border-right: none;
          }
          /* Below this width there is no room for a side column, so the heading
             spans the full row and goes back to sitting above the icons. The band
             is taller here regardless — the grid has stacked into two rows. */
          .values-heading {
            grid-column: 1 / -1;
            text-align: center;
            padding-right: 0;
            border-right: none;
            margin-bottom: 2px !important;
          }
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 20px;
          }
          .stat-item:nth-child(2) {
            border-right: none;
          }
          .leader-hero-title h1 {
            font-size: 32px;
          }
        }
        @media (max-width: 500px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
          .value-item {
            border-right: none;
          }
        }

        /* ------------------------------------------------------------------
           MOBILE LEADERSHIP LAYOUT

           Deliberately last in the stylesheet. The max-width: 800px block
           above also sets .leader-hero-title h1 and hides .founder-row, and
           media queries carry no extra specificity — whichever rule is
           written later wins. Placed any earlier, those rules would override
           these.

           Everything below is scoped to 768px and under. Above that the page
           renders exactly as it always has: title overlaid on side-by-side
           portraits, founders switched by tab.
           ------------------------------------------------------------------ */
        @media (max-width: 768px) {
          /* The two large portraits come out entirely. Half a phone's width
             is a ~195x380 box — portrait — and object-fit: cover crops
             whichever axis overflows, so they filled the height and cropped
             the sides, showing each founder head to knee instead of the
             head-and-shoulders band the desktop box produces. The founders
             appear again in their own modules further down the page, so
             nothing is lost by dropping them here.

             What remains is the title alone, sitting under the header. */
          .leader-hero-half,
          .leader-hero-seam {
            display: none;
          }
          .leader-hero {
            height: auto;
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            background: #0D0F12;
            border-bottom: 1px solid rgba(200, 160, 32, 0.15);
          }
          /* Column stack — eyebrow, title, subline, rule — on an even gap so
             the four read as one centred header block. */
          .leader-hero-title {
            position: static;
            inset: auto;
            flex-direction: column;
            gap: 12px;
            padding: 32px 16px 30px;
          }
          .leader-hero-title h1 {
            font-size: 26px;
            line-height: 1.3;
            letter-spacing: 1.5px;
          }
          /* The old bright-bar + faint-line pair is retired in favour of the
             About-style eyebrow above and single gold rule below. */
          .leader-hero-title h1::after,
          .leader-hero-title::after {
            display: none;
          }

        }

        @media (max-width: 480px) {
          .leader-hero-title {
            padding: 28px 16px 26px;
          }
          .leader-hero-title h1 {
            font-size: 21px;
            letter-spacing: 1px;
          }
        }

        /* ==================================================================
           LEADERSHIP LAYOUT — stacked founder cards.

           One layout at every width now. It began as a desktop-only block
           while phones kept the tab switcher and the content gate; those are
           gone, so the rules below are the page's base and the only thing the
           narrow block at the foot of this file does is scale them down.

           Deliberately still last in the sheet. Several max-width blocks above
           set the same properties, and media queries carry no extra
           specificity — written any earlier, those would win.
           ================================================================== */

        /* Hero handling is the one thing that stays width-specific. Above
           801px the split portraits come off entirely: what they carried, a
           face and a role at the top of the page, is now the avatar pair and
           the role line inside each card, and the title stack behind them is
           clipped at that width anyway. On phones the hero is already just
           that title stack — no portraits to remove — so it stays, and the
           page keeps its header. */
        @media (min-width: 801px) {
          .leader-hero {
            display: none;
          }

          /* With the hero gone the trucking photograph stops being a band
             underneath it and becomes the whole page's background. Its scrim
             opened on solid #0D0F12 for the first 90px to seam against the
             portraits above; with nothing above, that band would just crop the
             photograph off at the top. Opens near the mid wash instead.

             Not applied below 801px, where the hero is still there to seam
             against and the original opening is correct. */
          .leadership-bg::before {
            background: linear-gradient(
              180deg,
              rgba(13, 15, 18, 0.70) 0,
              rgba(13, 15, 18, 0.62) 160px,
              rgba(13, 15, 18, 0.62) calc(100% - 90px),
              #0D0F12 100%
            );
          }
        }

        /* The pair of circles the page opens on. */
        .founder-avatars {
          display: flex;
          justify-content: center;
          gap: 42px;
          padding: 52px 24px 34px;
        }
        /* background-size and background-position come from the data, per
           founder — Bruce's hat has to stay inside the circle where Julian has
           no headwear to clear. */
        .founder-avatar {
          display: block;
          flex-shrink: 0;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background-repeat: no-repeat;
          border: 1px solid rgba(200, 160, 32, 0.30);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);
        }

        /* One card per row. The mirrored two-up pair is gone, so the divider
           that separated the columns goes with it. */
        .founders-grid {
          grid-template-columns: 1fr;
          gap: 26px;
          max-width: 980px;
        }
        .founders-grid > .founder-row:first-child {
          padding-right: 0;
          border-right: none;
        }

        /* Each founder is a centred plate. The portrait that used to sit
           inside the card is gone — the circles above carry the faces. */
        .founder-row {
          display: block;
          text-align: center;
          /* Wide side padding is what makes the pill work: at this height the
             999px radius clamps to a ~160px corner, and without the inset the
             first and last lines of copy would run into the curve. */
          padding: 34px 96px 38px;
          border: 1px solid rgba(200, 160, 32, 0.22);
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.55);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        /* Same lift the trailer cards on the Why Choose Us page use — gold
           border, 20px gold bloom, over 0.3s. Borrowed by value rather than by
           shared class: those cards drive it from onMouseEnter handlers in
           FreightSolutions, so there is no rule to reuse. Harmless on touch,
           where it simply never fires. */
        .founder-row:hover {
          border-color: #C8A020;
          box-shadow: 0 0 20px rgba(200, 160, 32, 0.3);
        }
        @media (prefers-reduced-motion: reduce) {
          .founder-row { transition: none; }
        }

        /* Sized off the name rather than picked in isolation: the role runs a
           little over 40% of the name, which is what makes it read as a title
           rather than as a caption. */
        .founder-role {
          display: block;
          font-family: 'The Seasons', serif;
          font-weight: 700;
          font-size: 20px;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: #C8A020;
          margin: 0 0 2px 0;
        }
        /* White, not metallic gold. The name is the one thing on the plate
           that is neither gold nor grey, which is what lets the gold role
           above it and the gold quote below it both register — three golds
           stacked would flatten into one another. Overriding .metallic-gold
           means unpicking all three of its parts: the gradient, the
           transparent fill it clips through, and the dark emboss under it. */
        .founder-name {
          background: none;
          -webkit-text-fill-color: #FFFFFF;
          color: #FFFFFF;
          filter: none;
          font-size: 48px;
          line-height: 1.05;
          margin: 0 0 6px 0;
        }
        .founder-quote {
          font-size: 17px;
          color: #E4C050;
          margin: 0 0 10px 0;
          text-wrap: balance;
        }
        /* Measure-capped — across the full card width the bio would run well
           past 100 characters a line instead of breaking into two.

           text-wrap: balance evens the line lengths instead of filling each
           one and letting the remainder fall through. Centred copy makes a
           short last line very visible: Julian's bio is a word longer than
           Bruce's, which was enough to strand "relationship." alone on a
           third line while Bruce's broke into three even ones. Balancing puts
           both on the same footing at any width.

           Unsupported browsers just wrap normally, which is what they did
           before, so there is nothing to fall back to. */
        .founder-bio {
          font-size: 15px;
          color: #FFFFFF;
          line-height: 1.5;
          max-width: 660px;
          margin: 0 auto 14px;
          text-wrap: balance;
        }
        .founder-creds {
          justify-content: center;
        }
        .cred-pill {
          font-size: 11.5px;
          letter-spacing: 1.5px;
          padding: 5px 14px;
        }
        /* inline-block so the list centres as a block while its lines stay
           left-aligned against their bullets. */
        .founder-highlights {
          display: inline-block;
          text-align: left;
          margin-top: 12px;
        }
        /* White text, gold dots — the bullets keep the accent, the words do
           not. */
        .founder-highlights li {
          font-size: 15px;
          color: #FFFFFF;
          line-height: 1.55;
        }

        /* ------------------------------------------------------------------
           NARROW WIDTHS — the same layout, scaled.

           Nothing here changes the structure; it only resizes what the block
           above establishes. The ratios that make the card read correctly are
           kept (the role stays a little over 40% of the name), so this is the
           one design at phone scale rather than a second design.
           ------------------------------------------------------------------ */
        @media (max-width: 800px) {
          .founder-avatars {
            gap: 24px;
            padding: 34px 20px 26px;
          }
          /* Two of these plus the gap is 284px, which still clears a 360px
             screen with room either side. */
          .founder-avatar {
            width: 130px;
            height: 130px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
          }
          .founders-grid {
            gap: 20px;
          }
          /* The pill cannot survive here. At this height a 999px radius clamps
             to roughly half the card's WIDTH, turning the ends into deep
             semicircles that swallow vertical space and squeeze the copy into
             a narrow middle band. A large corner keeps the family resemblance
             without the distortion, and the side padding drops back to normal
             because there is no curve left to clear. */
          .founder-row {
            padding: 24px 20px 26px;
            border-radius: 28px;
          }
          .founder-role {
            font-size: 15px;
            letter-spacing: 2px;
          }
          .founder-name {
            font-size: 32px;
          }
          .founder-quote {
            font-size: 15px;
          }
          .founder-bio {
            font-size: 14px;
          }
          .cred-pill {
            font-size: 10.5px;
            padding: 4px 12px;
          }
          .founder-highlights li {
            font-size: 14px;
          }
        }
      `}</style>

      {/* SPLIT-PORTRAIT HERO */}
      <section className="leader-hero">
        <div className="leader-hero-half left">
          {/* The two hero portraits stay eager — they are the page's LCP.

              object-position lifts each man in the band. Higher percentages
              move the subject UP, trading headroom for presence; the values
              differ by four points because Bruce's hat adds height his portrait
              has to keep clear of the top edge. Both were checked against the
              real 1280x614 desktop box before being set — at 26%/28% Julian's
              crown starts meeting the edge. */}
          <img
            src="/Company Images/webp/founder-julian.webp"
            alt="Julian James"
            width="1200"
            height="1500"
            decoding="async"
            style={{ objectPosition: 'center 22%' }}
          />
        </div>
        <div className="leader-hero-half right">
          <img
            src="/Company Images/webp/founder-bruce.webp"
            alt="Bruce Burgess"
            width="1200"
            height="1500"
            decoding="async"
            style={{ objectPosition: 'center 24%' }}
          />
        </div>
        {/* Direct children of the hero grid, not of the halves, so they land in
            their own row beneath the portraits rather than on top of them. */}
        {/* Inner span carries the metallic. The outer one is the 56px band and
            does the centring; a gradient clipped to text maps to the element's
            own box, so on the full-height band the letters would sample only
            the flat middle of the ramp and read as solid grey. The inline span
            hugs the text, so the ramp lands across the glyphs. */}
        <span className="leader-hero-role"><span>CO-FOUNDER &amp; CEO</span></span>
        <span className="leader-hero-role"><span>CO-FOUNDER &amp; COO</span></span>
        <div className="leader-hero-seam"></div>
        <div className="leader-hero-title">
          {/* About-style header stack, themed to the founders. Visible on
              phones; clipped (sr-only) on desktop, where the portraits and
              their role captions carry the header instead. */}
          <p className="eyebrow-premium">MEET THE FOUNDERS</p>
          <h1>LEADERSHIP FORGED IN SERVICE</h1>
          <p className="leader-subhead">Veteran-led. Standard-bearing. Answerable for every mile.</p>
          <div className="leader-hero-rule"></div>
        </div>
      </section>

      <div className="leadership-bg">
      {/* FOUNDER AVATARS — desktop only, and inside the background zone rather
          than above it on purpose: the trucking photograph is the page's main
          background now, so it has to run behind these too.

          Decorative. The split hero that used to name these faces is hidden at
          this width, but each card states its founder's name directly below,
          so announcing them here would only repeat it. */}
      <div className="founder-avatars" aria-hidden="true">
        {founders.map((founder, idx) => (
          /* Painted as a background rather than an <img>. The zoom wants a
             crop tighter than object-fit: cover gives, and the obvious way to
             get there — scaling the image inside a rounded, overflow-hidden
             wrapper — renders the circle empty in Chrome, which rasterises the
             clip before the transform. background-size sizes the photograph
             directly and has no such problem. */
          <span
            key={idx}
            className="founder-avatar"
            style={{
              backgroundImage: `url("${founder.image}")`,
              backgroundSize: founder.avatarZoom,
              backgroundPosition: founder.avatarPosition
            }}
          />
        ))}
      </div>

      {/* FOUNDER PROFILES */}
      <section className="founder-profiles">
        <div className="founders-grid">
          {founders.map((founder, idx) => (
            <div
              key={idx}
              id={`founder-${idx}`}
              className="founder-row"
            >
              {/* Split into head and tail so the mobile layout can lift the
                  name + quote above the portrait while everything else stays
                  below it. On desktop .founder-copy is an ordinary block, so
                  head-then-tail renders exactly as the old single column did. */}
              <div className="founder-copy">
                <div className="founder-head">
                  {/* Role. Was two elements — this one and a second beside the
                      credential pill for phones — back when the two widths had
                      different layouts. They share one now, so the phone copy
                      is gone and this runs everywhere. */}
                  <span className="founder-role">
                    CO-FOUNDER &amp; {founder.office}
                  </span>

                  {/* Name */}
                  <h2 className="metallic-gold founder-name">
                    {renderText(founder.name)}
                  </h2>

                  {/* Quote — the founder's introduction. On phones this head
                      block is lifted above the portrait. */}
                  <p className="founder-quote">
                    {renderText(founder.quote)}
                  </p>
                </div>

                {/* DOM order below is the DESKTOP order — bio, then badges,
                    then highlights — left exactly as it was. On phones the tail
                    becomes a flex column and the badges are ordered first (see
                    .founder-tail rules in the 500px block), so mobile reads
                    badge → description → highlights without disturbing desktop. */}
                <div className="founder-tail">
                  {/* Bio — the description */}
                  <p className="founder-bio">
                    {renderText(founder.bio)}
                  </p>

                  {/* Credential Pills */}
                  <div className="founder-creds" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {founder.credentials.map((cred, credIdx) => (
                      <span key={credIdx} className={`cred-pill ${cred.style}`}>
                        {renderText(cred.label)}
                      </span>
                    ))}
                  </div>

                  {/* Gold Bullet Highlights */}
                  <ul className="founder-highlights">
                    {founder.highlights.map((item, itemIdx) => (
                      <li key={itemIdx}>{renderText(item)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* STAT BAND */}
      <section className="stat-band">
        <div className="stat-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{renderText(stat.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR SHARED VALUES — GOLD BAND */}
      {/* Narrow value range across the band — the original #C8A020 → #A8861A
          spread reads as a web gradient at this size and can band on 8-bit
          displays. This holds closer to a single tone with a whisper of sheen. */}
      <section style={{
        background: 'linear-gradient(180deg, #C6A022 0%, #C09A1F 55%, #B7911B 100%)',
        padding: '22px 24px 34px'
      }}>
        <div className="values-grid">
          {/* First grid cell rather than a block above the grid — see the
              .values-heading note in the style block for why. */}
          <h2 style={{
            fontFamily: "'The Seasons', serif",
            fontWeight: '800',
            fontSize: '28px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
            color: '#0D0F12'
          }} className="values-heading">
            OUR SHARED <span style={{ color: '#FFFFFF' }}>VALUES</span>
          </h2>

          {values.map((value, idx) => (
            <div key={idx} className="value-item">
              <div
                className="value-icon"
                style={{
                  WebkitMaskImage: `url('${value.icon}')`,
                  maskImage: `url('${value.icon}')`,
                  ...(value.iconScale && { '--icon-scale': value.iconScale }),
                  ...(value.iconInk && { '--icon-ink': value.iconInk })
                }}
              />
              <h3 style={{
                fontFamily: "'The Seasons', serif",
                fontWeight: '700',
                fontSize: '16px',
                letterSpacing: '0.6px',
                color: '#0D0F12',
                margin: 0
              }}>
                {renderText(value.title)}
              </h3>
              <div className="value-rule" />
              <p style={{
                fontFamily: "'The Seasons', serif",
                fontSize: '11.5px',
                color: '#FFFFFF',
                lineHeight: '1.5',
                margin: 0
              }}>
                {renderText(value.description)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN OUR TEAM CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: '-25px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 5
      }}>
        <Link to="/contact" className="join-team-btn">
          JOIN OUR TEAM
        </Link>
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontSize: '12.5px',
          color: '#8A919A',
          margin: '18px 0 0 0'
        }}>
          {renderText('Drivers who share our standards — we want to meet you.')}
        </p>
        <Link
          to="/about#mission-section"
          style={{
            fontFamily: "'The Seasons', serif",
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#C8A020',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '10px'
          }}
        >
          {renderText('Read our mission →')}
        </Link>
      </div>
      </div>
    </div>
  )
}
