import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

export default function SimpleMap() {
  // Mobile is resolved in JS, not just CSS, because the state card has to be
  // PORTALLED on mobile rather than merely restyled. Positioning it with
  // position:fixed from inside the map subtree is unreliable: any ancestor with
  // a transform, filter or perspective becomes the containing block for fixed
  // descendants, and the card silently anchors to that element instead of the
  // viewport. Rendering into document.body sidesteps the whole class of bug.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Desktop keeps the card inline exactly as before; only mobile portals out.
  const maybePortal = (el) => (isMobile ? createPortal(el, document.body) : el)

  const mapCanvasRef = useRef(null)
  // Keeps the map in view when a filter pill is tapped, so the territory list
  // updating below the fold does not leave the user staring at unchanged
  // content with no idea anything happened.
  const focusMap = () => {
    if (!isMobile) return
    mapCanvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const [selectedStates, setSelectedStates] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [hoveredState, setHoveredState] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [activeCollapsed] = useState(false)
  const [inactiveCollapsed] = useState(false)

  const activeStates = new Set(['mn', 'sd', 'ne', 'la', 'il', 'oh', 'ky', 'wv', 'ga', 'ms', 'ar', 'mo', 'ks', 'tx', 'tn', 'al'])

  const regionMap = {
    midwest: ['il', 'in', 'ia', 'mi', 'mn', 'mo', 'oh', 'wi', 'ks', 'nd', 'ne', 'sd'],
    midsouth: ['ky', 'tn', 'ar', 'ms', 'al', 'la', 'ok', 'wv'],
    southeast: ['ga', 'nc', 'sc', 'va', 'fl'],
    greatplains: ['tx', 'co', 'nm', 'wy', 'mt']
  }

  // Regional identity colors, validated for all-pairs colorblind separation
  // against the #0a0a0a page surface. The on-map state abbreviations carry the
  // secondary encoding the palette's CVD band requires.
  const regionColors = {
    midwest: '57, 135, 229',      // #3987e5 blue
    midsouth: '213, 81, 129',     // #d55181 rose
    southeast: '0, 131, 0',       // #008300 green
    greatplains: '201, 133, 0',   // #c98500 gold
    west: '0, 179, 164',          // #00b3a4 teal
    northeast: '157, 149, 0'      // #9d9500 olive
  }

  // Color-only groupings. Deliberately NOT added to regionMap so the
  // MW/MS/SE/GP filter controls and filteredVisibleStates stay unchanged.
  //
  // Accessibility tradeoffs, recorded deliberately — this palette runs two hues
  // past the four that validate cleanly on an all-pairs gate:
  //
  //   west (teal)      worst conflict is Mid-South rose, deutan ΔE 6.5.
  //                    Clears the normal-vision floor at ΔE 18.0, so full-color
  //                    readers separate them fine; the two regions also sit on
  //                    opposite coasts. Sits 0.019 over the lightness ceiling,
  //                    so it reads slightly brighter than the rest.
  //
  //   northeast (olive) clears all three of its ADJACENT regions — blue, green
  //                    and rose — at CVD ΔE 8.9 / normal 16.6. But it collides
  //                    hard with Great Plains gold: ΔE 1.9 CVD, 8.1 normal.
  //                    That pair is indistinguishable to every reader, not just
  //                    colorblind ones. Accepted on the grounds that TX/CO/NM/
  //                    WY/MT and New England are never confused for one another
  //                    in context, but it is a real cost — if the map ever needs
  //                    six honestly-distinct regions, Great Plains has to move
  //                    off gold and the whole set gets re-validated.
  const colorOnlyRegions = {
    west: ['wa', 'or', 'id', 'ca', 'nv', 'ut', 'az'],
    northeast: ['ny', 'nj', 'pa', 'md', 'de', 'vt', 'nh', 'me', 'ma', 'ri', 'ct']
  }

  const getStateRegion = (stateName) => {
    const region = Object.entries(regionMap).find(([, states]) => states.includes(stateName))?.[0]
    if (region) return region
    return Object.entries(colorOnlyRegions).find(([, states]) => states.includes(stateName))?.[0]
  }

  // Returns null for states outside the four coverage regions, so callers can
  // fall back to the original neutral fills.
  const regionFill = (stateName, alpha) => {
    const rgb = regionColors[getStateRegion(stateName)]
    return rgb ? `rgba(${rgb}, ${alpha})` : null
  }

  const stateDetails = {
    'tx': { weather: '75-95°F, Dry to Humid', conditions: 'Flat terrain, long stretches', hazards: 'Heat exposure, occasional ice storms in winter' },
    'la': { weather: '70-85°F, High Humidity', conditions: 'Flat, swampy terrain', hazards: 'Fog, heavy rainfall, hurricane season' },
    'il': { weather: '45-85°F, Variable', conditions: 'Flat to rolling', hazards: 'Winter ice, heavy snow, wind' },
    'oh': { weather: '40-80°F, Variable', conditions: 'Rolling terrain', hazards: 'Winter storms, icy bridges, fog' },
    'ga': { weather: '60-85°F, Moderate', conditions: 'Rolling to hilly', hazards: 'Summer heat, occasional ice, reduced visibility' },
    'ky': { weather: '45-80°F, Variable', conditions: 'Hilly to mountainous', hazards: 'Mountain passes, winter weather, dense fog' },
    'mn': { weather: '30-75°F, Cold Winters', conditions: 'Flat terrain', hazards: 'Severe ice/snow, sub-zero temps, white-out conditions' },
    'mo': { weather: '50-85°F, Variable', conditions: 'Rolling terrain', hazards: 'Spring flooding, severe thunderstorms, ice' },
    'ar': { weather: '55-85°F, Variable', conditions: 'Mixed terrain', hazards: 'Heavy rain, flooding, occasional ice' },
    'ms': { weather: '60-85°F, Humid', conditions: 'Flat, swampy', hazards: 'Heavy rain, fog, occasional hurricanes' },
    'wv': { weather: '40-75°F, Variable', conditions: 'Mountainous', hazards: 'Steep grades, winter weather, dense fog' },
    'sd': { weather: '35-80°F, Extreme Variance', conditions: 'Flat to rolling', hazards: 'Severe winters, blizzards, wind, extreme cold' },
    'ne': { weather: '40-85°F, Variable', conditions: 'Flat to rolling', hazards: 'Winter storms, high winds, reduced visibility' },
    'ks': { weather: '45-90°F, Variable', conditions: 'Flat terrain', hazards: 'Severe thunderstorms, hail, ice in winter' },
    'ok': { weather: '50-90°F, Hot summers', conditions: 'Rolling terrain', hazards: 'Severe storms, tornados, dust storms' },
    'ma': { weather: '35-75°F, Cold winters', conditions: 'Mixed terrain', hazards: 'Winter ice, heavy snow, coastal fog' },
    'tn': { weather: '50-85°F, Humid', conditions: 'Hilly terrain', hazards: 'Mountain passes, flooding, winter weather' },
    'al': { weather: '60-85°F, Humid', conditions: 'Mixed terrain', hazards: 'Heavy rain, occasional hurricanes, flooding' },
    'nc': { weather: '55-85°F, Moderate', conditions: 'Coastal to mountain terrain', hazards: 'Hurricanes, mountains, flooding' },
    'fl': { weather: '75-90°F, High humidity', conditions: 'Flat', hazards: 'Heavy rain, hurricanes, fog' },
    'wa': { weather: '45-70°F, Wet', conditions: 'Mountainous to coastal', hazards: 'Rain, mountain passes, occasional snow' },
    'or': { weather: '45-75°F, Variable', conditions: 'Mountainous terrain', hazards: 'Wet conditions, mountain grades, fog' },
    'ca': { weather: '55-85°F, Dry to Moderate', conditions: 'Varied terrain, long distances', hazards: 'Desert heat, mountain passes, heavy traffic' },
    'id': { weather: '30-75°F, Cold winters', conditions: 'Mountainous terrain', hazards: 'Mountain passes, winter weather, avalanche zones' },
    'mt': { weather: '25-70°F, Extreme variance', conditions: 'Mountainous plains', hazards: 'Severe winters, mountain grades, wind' },
    'nd': { weather: '20-75°F, Cold winters', conditions: 'Flat prairie', hazards: 'Severe blizzards, extreme cold, white-out conditions' },
    'nv': { weather: '50-95°F, Dry', conditions: 'Desert terrain, mountain passes', hazards: 'Extreme heat, reduced visibility, sparse services' },
    'ut': { weather: '35-85°F, Dry', conditions: 'Mountainous desert terrain', hazards: 'Mountain passes, canyon roads, weather extremes' },
    'co': { weather: '30-80°F, Variable', conditions: 'High mountain terrain', hazards: 'High altitude passes, thin air, winter storms' },
    'wy': { weather: '25-75°F, Extreme variance', conditions: 'High plains with mountains', hazards: 'Severe wind, snow, mountain passes, isolation' },
    'az': { weather: '70-105°F, Very hot dry', conditions: 'Desert terrain', hazards: 'Extreme heat, dust storms, mirage conditions' },
    'nm': { weather: '50-90°F, Dry', conditions: 'High desert plateau', hazards: 'Sparse services, high altitude, dust storms' },
    'wi': { weather: '30-75°F, Cold winters', conditions: 'Mixed terrain with lakes', hazards: 'Winter ice, heavy snow, fog over water' },
    'mi': { weather: '30-75°F, Cold winters', conditions: 'Mixed with Great Lakes', hazards: 'Winter storms, lake effect snow, water hazards' },
    'ia': { weather: '20-80°F, Variable', conditions: 'Rolling farmland', hazards: 'Winter ice and snow, spring flooding, wind' },
    'in': { weather: '30-80°F, Variable', conditions: 'Rolling terrain', hazards: 'Winter storms, heavy traffic around cities' },
    'va': { weather: '40-80°F, Moderate', conditions: 'Mixed mountainous terrain', hazards: 'Mountain passes, winter weather, traffic' },
    'sc': { weather: '60-85°F, Humid', conditions: 'Coastal plains', hazards: 'Hurricanes, coastal flooding, summer heat' },
    'pa': { weather: '35-80°F, Variable', conditions: 'Appalachian mountains', hazards: 'Mountain grades, winter weather, traffic' },
    'ny': { weather: '30-80°F, Cold winters', conditions: 'Varied terrain', hazards: 'Winter storms, mountain passes, heavy urban traffic' },
    'nj': { weather: '35-80°F, Humid', conditions: 'Coastal plains', hazards: 'Heavy traffic, hurricane season, congestion' },
    'md': { weather: '40-80°F, Moderate', conditions: 'Mixed coastal terrain', hazards: 'Winter weather, hurricane season, traffic' },
    'de': { weather: '40-80°F, Moderate', conditions: 'Coastal plains', hazards: 'Hurricane season, coastal flooding, traffic' },
    'ct': { weather: '35-80°F, Cold winters', conditions: 'New England terrain', hazards: 'Winter ice and snow, heavy traffic, coastal storms' },
    'ri': { weather: '35-80°F, Cold winters', conditions: 'Coastal terrain', hazards: 'Winter weather, hurricane season, traffic' },
    'nh': { weather: '25-75°F, Extreme winters', conditions: 'New England mountains', hazards: 'Severe winter weather, mountain roads, snow' },
    'vt': { weather: '25-75°F, Extreme winters', conditions: 'Green mountain terrain', hazards: 'Severe winters, mountain passes, snow' },
    'me': { weather: '20-75°F, Cold winters', conditions: 'Coastal and forested terrain', hazards: 'Severe winters, isolated roads, coastal storms' }
  }

  const stateNames = {
    'wa': 'Washington', 'id': 'Idaho', 'mt': 'Montana', 'nd': 'North Dakota', 'or': 'Oregon', 'ca': 'California',
    'nv': 'Nevada', 'ut': 'Utah', 'co': 'Colorado', 'az': 'Arizona', 'nm': 'New Mexico', 'wy': 'Wyoming',
    'mn': 'Minnesota', 'wi': 'Wisconsin', 'mi': 'Michigan', 'ia': 'Iowa', 'il': 'Illinois', 'mo': 'Missouri',
    'ar': 'Arkansas', 'la': 'Louisiana', 'ky': 'Kentucky', 'tn': 'Tennessee', 'ms': 'Mississippi', 'al': 'Alabama',
    'ga': 'Georgia', 'fl': 'Florida', 'sc': 'South Carolina', 'nc': 'North Carolina', 'va': 'Virginia', 'wv': 'West Virginia',
    'md': 'Maryland', 'de': 'Delaware', 'nj': 'New Jersey', 'pa': 'Pennsylvania', 'ny': 'New York', 'vt': 'Vermont',
    'nh': 'New Hampshire', 'me': 'Maine', 'ma': 'Massachusetts', 'ri': 'Rhode Island', 'ct': 'Connecticut',
    'ne': 'Nebraska', 'ks': 'Kansas', 'ok': 'Oklahoma', 'tx': 'Texas', 'sd': 'South Dakota',
    'in': 'Indiana', 'oh': 'Ohio'
  }

  const stateRegions = {
    'mn': 'Midwest',
    'sd': 'Midwest · Great Plains',
    'ne': 'Midwest · Great Plains',
    'la': 'Mid-South',
    'il': 'Midwest',
    'oh': 'Midwest',
    'ky': 'Mid-South · Midwest',
    'wv': 'Midwest · Southeast',
    'ga': 'Southeast',
    'ms': 'Mid-South',
    'ar': 'Mid-South · Midwest',
    'mo': 'Midwest · Mid-South',
    'ks': 'Midwest · Great Plains',
    'tx': 'Great Plains · Mid-South',
    'wi': 'Midwest',
    'mi': 'Midwest',
    'ia': 'Midwest',
    'in': 'Midwest',
    'tn': 'Mid-South · Southeast',
    'va': 'Southeast',
    'nc': 'Southeast',
    'sc': 'Southeast',
    'al': 'Southeast · Mid-South',
    'fl': 'Southeast',
    'ok': 'Great Plains · Mid-South',
    'co': 'Great Plains',
    'nm': 'Great Plains',
    'wy': 'Great Plains',
    'mt': 'Great Plains',
    'wa': 'Northwest',
    'or': 'Northwest',
    'ca': 'West',
    'nv': 'West',
    'ut': 'West',
    'az': 'West',
    'id': 'Northwest',
    'nd': 'Great Plains',
    'ma': 'Northeast',
    'vt': 'Northeast',
    'nh': 'Northeast',
    'me': 'Northeast',
    'ny': 'Northeast',
    'pa': 'Northeast',
    'nj': 'Northeast',
    'ct': 'Northeast',
    'ri': 'Northeast',
    'md': 'Northeast',
    'de': 'Northeast'
  }

  const stateStats = {
    'mn': { transit: '2-3 DAYS', loads: '40+', hubs: '3' },
    'sd': { transit: '2-3 DAYS', loads: '35+', hubs: '2' },
    'ne': { transit: '2-4 DAYS', loads: '38+', hubs: '2' },
    'la': { transit: '2-3 DAYS', loads: '45+', hubs: '3' },
    'il': { transit: '1-2 DAYS', loads: '55+', hubs: '4' },
    'oh': { transit: '1-2 DAYS', loads: '50+', hubs: '4' },
    'ky': { transit: '2-3 DAYS', loads: '42+', hubs: '3' },
    'wv': { transit: '2-3 DAYS', loads: '38+', hubs: '2' },
    'ga': { transit: '2-3 DAYS', loads: '48+', hubs: '3' },
    'ms': { transit: '2-3 DAYS', loads: '40+', hubs: '2' },
    'ar': { transit: '2-3 DAYS', loads: '42+', hubs: '3' },
    'mo': { transit: '2-3 DAYS', loads: '50+', hubs: '3' },
    'ks': { transit: '2-3 DAYS', loads: '40+', hubs: '3' },
    'tx': { transit: '2-4 DAYS', loads: '60+', hubs: '5' },
    'wa': { transit: '3-4 DAYS', loads: '30+', hubs: '2' },
    'or': { transit: '3-5 DAYS', loads: '28+', hubs: '2' },
    'ca': { transit: '3-5 DAYS', loads: '50+', hubs: '4' },
    'id': { transit: '3-4 DAYS', loads: '25+', hubs: '1' },
    'mt': { transit: '3-4 DAYS', loads: '22+', hubs: '1' },
    'nd': { transit: '2-3 DAYS', loads: '30+', hubs: '1' },
    'nv': { transit: '4-5 DAYS', loads: '20+', hubs: '1' },
    'ut': { transit: '3-4 DAYS', loads: '24+', hubs: '1' },
    'co': { transit: '3-4 DAYS', loads: '32+', hubs: '2' },
    'wy': { transit: '3-4 DAYS', loads: '20+', hubs: '1' },
    'az': { transit: '4-5 DAYS', loads: '28+', hubs: '2' },
    'nm': { transit: '4-5 DAYS', loads: '22+', hubs: '1' },
    'wi': { transit: '2-3 DAYS', loads: '36+', hubs: '2' },
    'mi': { transit: '2-3 DAYS', loads: '38+', hubs: '2' },
    'ia': { transit: '2-3 DAYS', loads: '35+', hubs: '2' },
    'in': { transit: '1-2 DAYS', loads: '45+', hubs: '3' },
    'tn': { transit: '2-3 DAYS', loads: '40+', hubs: '2' },
    'al': { transit: '2-3 DAYS', loads: '36+', hubs: '2' },
    'nc': { transit: '2-3 DAYS', loads: '38+', hubs: '2' },
    'sc': { transit: '2-3 DAYS', loads: '32+', hubs: '1' },
    'va': { transit: '1-2 DAYS', loads: '42+', hubs: '2' },
    'fl': { transit: '2-3 DAYS', loads: '44+', hubs: '3' },
    'md': { transit: '1-2 DAYS', loads: '40+', hubs: '2' },
    'de': { transit: '1-2 DAYS', loads: '28+', hubs: '1' },
    'pa': { transit: '1-2 DAYS', loads: '45+', hubs: '3' },
    'nj': { transit: '1-2 DAYS', loads: '38+', hubs: '2' },
    'ny': { transit: '1-2 DAYS', loads: '50+', hubs: '3' },
    'ct': { transit: '1-2 DAYS', loads: '32+', hubs: '1' },
    'ri': { transit: '1-2 DAYS', loads: '24+', hubs: '1' },
    'ma': { transit: '1-2 DAYS', loads: '36+', hubs: '2' },
    'nh': { transit: '1-2 DAYS', loads: '26+', hubs: '1' },
    'vt': { transit: '1-2 DAYS', loads: '22+', hubs: '1' },
    'me': { transit: '1-2 DAYS', loads: '20+', hubs: '1' },
    'ok': { transit: '2-3 DAYS', loads: '35+', hubs: '2' },
  }

  const stateRoutes = {
    'mn': 'I-90 · I-35 · I-94',
    'sd': 'I-90 · I-29',
    'ne': 'I-80 · I-35',
    'la': 'I-10 · I-12 · I-20',
    'il': 'I-55 · I-57 · I-90',
    'oh': 'I-71 · I-75 · I-90',
    'ky': 'I-75 · I-64 · I-65',
    'wv': 'I-77 · I-64 · I-81',
    'ga': 'I-75 · I-85 · I-20',
    'ms': 'I-55 · I-59 · I-20',
    'ar': 'I-40 · I-30 · I-49',
    'mo': 'I-70 · I-44 · I-55',
    'ks': 'I-70 · I-35 · I-135',
    'tx': 'I-35 · I-37 · I-20 · I-10',
    'wa': 'I-5 · I-90 · I-405',
    'or': 'I-5 · I-84 · I-82',
    'ca': 'I-5 · I-80 · I-40',
    'id': 'I-84 · I-90',
    'mt': 'I-90 · I-94',
    'nd': 'I-94 · I-29',
    'nv': 'I-80 · I-15',
    'ut': 'I-15 · I-70 · I-80',
    'co': 'I-25 · I-70',
    'wy': 'I-25 · I-80 · I-90',
    'az': 'I-40 · I-10 · I-17',
    'nm': 'I-40 · I-25',
    'wi': 'I-90 · I-94',
    'mi': 'I-75 · I-94 · I-96',
    'ia': 'I-35 · I-80',
    'in': 'I-65 · I-74 · I-94',
    'tn': 'I-40 · I-75 · I-81',
    'al': 'I-59 · I-20 · I-10',
    'nc': 'I-40 · I-85 · I-95',
    'sc': 'I-95 · I-26',
    'va': 'I-64 · I-81 · I-95',
    'fl': 'I-75 · I-95 · I-4',
    'md': 'I-95 · I-70 · I-81',
    'de': 'I-95',
    'pa': 'I-76 · I-80 · I-81',
    'nj': 'I-95 · I-78 · I-287',
    'ny': 'I-87 · I-90 · I-495',
    'ct': 'I-95 · I-84',
    'ri': 'I-95',
    'ma': 'I-90 · I-91 · I-495',
    'nh': 'I-93 · I-91',
    'vt': 'I-91',
    'me': 'I-95',
    'ok': 'I-44 · I-35 · I-40',
  }

  const stateNeighbors = {
    'mn': ['nd', 'sd', 'wi', 'ia', 'mo'],
    'sd': ['mn', 'ne', 'wy', 'mt', 'nd'],
    'ne': ['sd', 'co', 'ks', 'mo', 'ia'],
    'la': ['tx', 'ms', 'ar'],
    'il': ['mo', 'ky', 'in', 'wi', 'ia'],
    'oh': ['ky', 'wv', 'pa', 'mi', 'in'],
    'ky': ['oh', 'wv', 'va', 'tn', 'mo', 'il', 'in'],
    'wv': ['oh', 'ky', 'va', 'pa', 'md'],
    'ga': ['fl', 'al', 'tn', 'nc', 'sc'],
    'ms': ['la', 'ar', 'tn', 'al'],
    'ar': ['mo', 'ok', 'tx', 'la', 'ms', 'tn'],
    'mo': ['ne', 'ks', 'ok', 'ar', 'tn', 'ky', 'il', 'ia'],
    'ks': ['ne', 'mo', 'ok', 'co'],
    'tx': ['ok', 'ar', 'la', 'nm'],
    'wa': ['or', 'id'],
    'or': ['wa', 'id', 'ca', 'nv'],
    'ca': ['or', 'nv', 'az'],
    'id': ['wa', 'or', 'mt', 'wy', 'ut', 'nv'],
    'mt': ['id', 'wy', 'nd', 'sd'],
    'nd': ['mt', 'sd', 'mn'],
    'nv': ['or', 'ca', 'ut', 'az', 'id'],
    'ut': ['id', 'wy', 'co', 'az', 'nv'],
    'co': ['wy', 'ne', 'ks', 'ok', 'nm', 'ut'],
    'wy': ['mt', 'id', 'ut', 'co', 'ne', 'sd'],
    'az': ['ca', 'nv', 'ut', 'co', 'nm'],
    'nm': ['co', 'az', 'tx', 'ok'],
    'wi': ['mn', 'mi', 'ia', 'il'],
    'mi': ['wi', 'in', 'oh'],
    'ia': ['mn', 'ne', 'mo', 'il', 'wi'],
    'in': ['mi', 'oh', 'ky', 'il'],
    'tn': ['ky', 'ar', 'mo', 'ms', 'al', 'ga', 'nc', 'va'],
    'al': ['ms', 'tn', 'ga', 'fl'],
    'nc': ['va', 'tn', 'ga', 'sc'],
    'sc': ['nc', 'ga'],
    'va': ['wv', 'ky', 'tn', 'nc', 'md', 'pa'],
    'fl': ['ga', 'al'],
    'md': ['wv', 'va', 'pa', 'de'],
    'de': ['md', 'pa', 'nj'],
    'pa': ['wv', 'va', 'md', 'de', 'nj', 'ny', 'oh'],
    'nj': ['pa', 'de', 'ny'],
    'ny': ['pa', 'nj', 'ct', 'ma', 'vt'],
    'ct': ['ny', 'ma', 'ri'],
    'ri': ['ct', 'ma'],
    'ma': ['ny', 'ct', 'ri', 'vt', 'nh'],
    'nh': ['vt', 'ma', 'me'],
    'vt': ['ny', 'ma', 'nh', 'me'],
    'me': ['nh', 'vt'],
    'ok': ['ks', 'mo', 'ar', 'tx', 'nm', 'co'],
  }

  const isStateActive = (stateName) => activeStates.has(stateName)

  const shouldShowLabel = (stateName) => {
    return selectedStates.has(stateName) ||
      (selectedCategory === 'active' && isStateActive(stateName)) ||
      (selectedCategory === 'inactive' && !isStateActive(stateName))
  }

  const activeCount = activeStates.size
  const inactiveCount = Object.keys(stateNames).length - activeCount

  const stateLabelPositions = {
    'mn': { x: 920, y: 80, lineX: 650, lineY: 150 },
    'sd': { x: 750, y: 110, lineX: 470, lineY: 190 },
    'ne': { x: 800, y: 220, lineX: 510, lineY: 280 },
    'la': { x: 950, y: 540, lineX: 740, lineY: 520 },
    'il': { x: 950, y: 260, lineX: 775, lineY: 290 },
    'oh': { x: 1050, y: 180, lineX: 915, lineY: 217 },
    'ky': { x: 1050, y: 330, lineX: 890, lineY: 330 },
    'wv': { x: 1050, y: 270, lineX: 915, lineY: 265 },
    'ga': { x: 1000, y: 420, lineX: 870, lineY: 400 },
    'ms': { x: 880, y: 530, lineX: 745, lineY: 510 },
    'ar': { x: 840, y: 390, lineX: 670, lineY: 373 },
    'mo': { x: 800, y: 290, lineX: 630, lineY: 308 },
    'ks': { x: 800, y: 360, lineX: 625, lineY: 351 },
    'tx': { x: 680, y: 480, lineX: 450, lineY: 444 },
    'tn': { x: 1000, y: 375, lineX: 860, lineY: 380 },
    'al': { x: 960, y: 470, lineX: 835, lineY: 462 }
  }

  const handleStateClick = (stateName) => {
    const newSelected = new Set(selectedStates)
    if (newSelected.has(stateName)) {
      newSelected.delete(stateName)
    } else {
      newSelected.add(stateName)
    }
    setSelectedStates(newSelected)
  }

  // Minnesota is excluded from hover highlighting.
  const noHoverStates = new Set(['mn'])

  const handleStateHover = (stateName) => {
    if (noHoverStates.has(stateName)) return
    setHoveredState(stateName)
  }

  const handleStateLeave = () => {
    setHoveredState(null)
  }

  const getStateFill = (stateName) => {
    const isActive = isStateActive(stateName)

    if (selectedCategory === 'active' && isActive) {
      return regionFill(stateName, 0.75) || 'rgba(19, 23, 28, 0.75)'
    }

    if (selectedCategory === 'inactive' && !isActive) {
      return regionFill(stateName, 0.65) || 'rgba(140, 65, 65, 0.65)'
    }

    if (selectedStates.has(stateName)) {
      return isActive
        ? (regionFill(stateName, 0.8) || 'rgba(19, 23, 28, 0.8)')
        : (regionFill(stateName, 0.7) || 'rgba(140, 65, 65, 0.7)')
    }

    if (hoveredState === stateName) {
      return isActive
        ? (regionFill(stateName, 0.6) || 'rgba(19, 23, 28, 0.6)')
        : (regionFill(stateName, 0.5) || 'rgba(140, 65, 65, 0.5)')
    }

    // Resting: quiet regional tint, neutral for states outside the four regions
    return regionFill(stateName, 0.16) || 'rgba(255, 255, 255, 0.08)'
  }

  const getStateStyle = (stateName) => {
    const isActive = isStateActive(stateName)
    const shouldGlow = selectedStates.has(stateName) ||
      hoveredState === stateName ||
      (selectedCategory === 'active' && isActive) ||
      (selectedCategory === 'inactive' && !isActive)

    const glowColor = regionFill(stateName, 0.5) ||
      (isActive ? 'rgba(19, 23, 28, 0.5)' : 'rgba(140, 65, 65, 0.5)')
    const glowColorSecondary = regionFill(stateName, 0.25) ||
      (isActive ? 'rgba(19, 23, 28, 0.25)' : 'rgba(140, 65, 65, 0.25)')

    return {
      cursor: 'pointer',
      filter: shouldGlow ? `drop-shadow(0 0 4px ${glowColor}) drop-shadow(0 0 10px ${glowColorSecondary})` : 'none'
    }
  }

  const visibleStates = Object.keys(stateLabelPositions).filter(state => shouldShowLabel(state))
  const filteredVisibleStates = visibleStates.filter(state => {
    return selectedRegion === 'all' || getStateRegion(state) === selectedRegion
  })

  const selectedSingleState = selectedStates.size === 1 ? Array.from(selectedStates)[0] : null

  // Territory browsing is modal on mobile: picking Active or On Request opens
  // the matching list as a bottom sheet over the map, with the page behind it
  // frozen. Without this the list renders below the fold in normal flow and the
  // user is left free-scrolling a long page hunting for what changed.
  const territoryLocked = isMobile && !!selectedCategory && !selectedSingleState

  // Portalled for the same reason the state card is: a fixed-position sheet
  // rendered inside the map subtree is at the mercy of any ancestor with a
  // transform or filter. document.body has no such ancestors.
  const maybeSheet = (el) => (territoryLocked ? createPortal(el, document.body) : el)

  // Freeze the page behind whichever mobile overlay is open — full-screen card
  // or territory sheet. Restores the previous value rather than clearing it, so
  // it can never strand the page unscrollable.
  useEffect(() => {
    if (!isMobile || (!selectedSingleState && !selectedCategory)) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [isMobile, selectedSingleState, selectedCategory])
  const stateDetail = selectedSingleState ? stateDetails[selectedSingleState] : null

  return (
    <div className="map-shell" style={{ width: '100%', height: 'auto', position: 'relative', backgroundColor: 'transparent' }}>
      <style>{`
        @keyframes slowPulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes cardFadeScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes overlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .webkit-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .state-card-overlay {
          animation: overlayFade 0.4s ease-out forwards;
        }
        /* Close control for the full-screen mobile card. Fixed to the viewport
           rather than the card so it stays reachable while the card scrolls.
           44px is the minimum comfortable touch target. */
        /* ------------------------------------------------------------------
           TERRITORY BOTTOM SHEET (mobile only).

           .is-sheet is applied only when the sidebar has actually been
           portalled to document.body, so none of this can reach the inline
           desktop sidebars. Rules are unconditional rather than wrapped in a
           media query because the class itself is already gated on isMobile.
           ------------------------------------------------------------------ */
        @keyframes sheetRise {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        /* Visual only — pointer-events: none is load-bearing. At 0.6 opacity and
           hit-testable, this swallowed every tap aimed at the map, so states
           could not be selected while the sheet was open. The map has to stay
           live: tapping a state is the whole point of the territory view, and
           doing so dismisses the sheet on its own (selecting a state clears
           territoryLocked) which is the natural way out.

           Dismissal therefore moves to the explicit close button on the sheet
           rather than a tap-anywhere backdrop.

           Also dropped from 0.6 to 0.22 — the map is already near-black, so a
           heavy scrim buried it entirely. */
        .territory-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1400;
          pointer-events: none;
          background: rgba(0, 0, 0, 0.22);
          animation: overlayFade 0.25s ease-out forwards;
        }
        .legend-sidebar.is-sheet,
        .inactive-sidebar.is-sheet {
          position: fixed !important;
          top: auto !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          max-width: none !important;
          /* Caps the sheet so the map stays visible above it — the list is a
             companion to the map, not a replacement for it. */
          max-height: 72vh !important;
          margin: 0 !important;
          padding: 8px 16px 24px !important;
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          z-index: 1500;
          /* Lifted off near-black so the sheet reads as a panel sitting above
             the map rather than a hole in the page. */
          background: #171C23 !important;
          border-top: 1px solid rgba(200, 160, 32, 0.35) !important;
          border-radius: 14px 14px 0 0 !important;
          box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.55);
          animation: sheetRise 0.28s ease-out forwards;
        }
        /* Grab handle — signals the panel is dismissable. */
        .legend-sidebar.is-sheet::before,
        .inactive-sidebar.is-sheet::before {
          content: '';
          display: block;
          width: 40px;
          height: 4px;
          margin: 4px auto 12px;
          border-radius: 2px;
          background: rgba(200, 160, 32, 0.45);
        }
        /* The backdrop is deliberately not hit-testable, so this is the only
           dismissal that does not involve selecting a state. */
        .sheet-close {
          /* Sticky, not absolute: the sheet is its own scroll container, so an
             absolutely positioned control would scroll out of reach on the
             longer territory lists. */
          position: sticky;
          top: 0;
          margin-left: auto;
          margin-bottom: -28px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          line-height: 1;
          padding: 0;
          color: #F5E6B8;
          background: rgba(10, 10, 10, 0.5);
          border: 1px solid rgba(200, 160, 32, 0.4);
          border-radius: 50%;
          cursor: pointer;
          z-index: 2;
        }
        .state-card-close {
          position: fixed;
          top: 14px;
          right: 14px;
          z-index: 2100;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          line-height: 1;
          color: #F5E6B8;
          background: rgba(10, 10, 10, 0.75);
          border: 1px solid rgba(200, 160, 32, 0.5);
          border-radius: 50%;
          cursor: pointer;
          padding: 0;
        }
        .state-card-content {
          animation: cardFadeScale 0.6s ease-out forwards;
        }
        .sidebar-heading {
          background: linear-gradient(180deg, #F2D878 0%, #E4C050 35%, #C8A020 70%, #A8861A 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 0 rgba(60, 44, 8, 0.85))
                  drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
        }
        .sidebar-rule {
          width: 64px;
          height: 2px;
          margin: 0 auto;
          background: linear-gradient(90deg, #F2D878, #C8A020, #A8861A);
        }
        .map-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 90%;
          margin: 4px auto 0 auto;
          padding-top: 12px;
          border-top: 1px solid rgba(200, 160, 32, 0.15);
        }
        .map-filters-label {
          font-family: 'The Seasons', serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8A919A;
          margin-right: 2px;
        }
        .map-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 5px 14px;
          border-radius: 24px;
          font-family: 'The Seasons', serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
          background-color: #13171C;
          border: 1.5px solid #252B33;
          color: #8A919A;
          transition: all 0.2s ease;
        }
        .map-filter-pill:hover {
          border-color: rgba(200, 160, 32, 0.6);
          color: #F5E6B8;
        }
        .map-filter-pill.is-on {
          background-color: rgba(200, 160, 32, 0.12);
          border-color: #C8A020;
          color: #F5E6B8;
        }
        .map-filter-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: box-shadow 0.2s ease;
        }
        @media (max-width: 900px) {
          .map-filters {
            flex-wrap: wrap;
            justify-content: center;
          }
          .map-filters-label {
            display: none;
          }

          /* ----------------------------------------------------------------
             MOBILE LAYOUT.

             On desktop both sidebars are absolutely positioned OUTSIDE the map
             box — right: calc(100% + 30px) puts the states list off the left
             edge, left: calc(100% + 30px) puts the territories list off the
             right. That works inside a wide centred column but on a phone it
             parks both panels beyond the viewport, so the state list and the
             territory list were simply unreachable.

             Below 900px the shell becomes a flex column and the panels are
             returned to normal flow underneath the map. Ordering is explicit
             rather than DOM-order because both sidebars are authored BEFORE
             the svg in the markup — without it they would stack above the map.
             Desktop is untouched: the shell is only display:flex inside this
             query, so the absolute positioning above still governs there.
             ---------------------------------------------------------------- */
          .map-shell {
            display: flex;
            flex-direction: column;
          }
          .map-canvas { order: 1; }
          .legend-sidebar,
          .inactive-sidebar {
            order: 2;
            position: static !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            width: 100% !important;
            max-width: 420px;
            max-height: none !important;
            margin: 0 auto !important;
            padding: 20px 16px 0 !important;
            overflow-y: visible !important;
          }
          .map-filters { order: 3; }

          /* Full-screen state card.

             The desktop card is positioned with fixed negative margins
             (-480px / -700px) that fling it far outside a phone viewport.
             Restyling it to position:fixed was not enough on its own — see the
             portal note in the component — so on mobile it is rendered into
             document.body and takes over the screen entirely.

             Scoped to .is-mobile, which is only applied when the card has
             actually been portalled, so these rules can never collide with the
             inline desktop card. */
          .state-card-overlay.is-mobile {
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            align-items: stretch !important;
            justify-content: stretch !important;
            background-color: rgba(0, 0, 0, 0.92) !important;
            z-index: 2000;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .state-card-overlay.is-mobile .state-card-content {
            width: 100% !important;
            max-width: none !important;
            max-height: none !important;
            min-height: 100%;
            margin: 0 !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .state-card-overlay.is-mobile .state-card-content > div:first-child {
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* State Detail Modal - for both active and inactive states */}
      {selectedSingleState && stateDetail && maybePortal(
        <div
          onClick={() => setSelectedStates(new Set())}
          className={`state-card-overlay${isMobile ? ' is-mobile' : ''}`}
          style={{
            position: 'absolute',
            top: '-40px',
            left: isStateActive(selectedSingleState) ? '0' : 'auto',
            right: isStateActive(selectedSingleState) ? 'auto' : '0',
            bottom: 0,
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: isStateActive(selectedSingleState) ? 'flex-start' : 'flex-end',
            zIndex: 1000,
            paddingTop: '60px',
            paddingBottom: '0',
            paddingLeft: isStateActive(selectedSingleState) ? '0px' : '0',
            paddingRight: isStateActive(selectedSingleState) ? '0' : '280px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
          {/* Explicit exit. The overlay backdrop also closes on tap, but at
              full screen there is no visible backdrop left to tap, so without
              this the card would be a dead end on a phone. */}
          {isMobile && (
            <button
              type="button"
              className="state-card-close"
              aria-label="Close state details"
              onClick={(e) => { e.stopPropagation(); setSelectedStates(new Set()) }}
            >
              &times;
            </button>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            className="state-card-content"
            style={{
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderRadius: '8px',
            padding: '0',
            width: '380px',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            position: 'relative',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(200, 160, 32, 0.2)',
            animation: 'cardGlowPulse 6s ease-in-out infinite',
            marginLeft: isStateActive(selectedSingleState) ? '-480px' : '0',
            marginRight: !isStateActive(selectedSingleState) ? '-700px' : '0'
          }}>
            {/* Hero Image Card */}
            <div style={{
              width: '100%',
              height: '160px',
              backgroundColor: 'rgba(200, 160, 32, 0.1)',
              backgroundImage: `url('/Company Images/state-${selectedSingleState}.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px 8px 0 0',
              position: 'relative'
            }}>
              {/* Company Logo */}
              <img
                src="/Company Images/best-direct-logo.png"
                alt="Best Direct Solutions"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  height: '45px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: '26px',
                  fontFamily: "'The Seasons', serif",
                  color: '#ffffff',
                  margin: '0 0 4px 0'
                }}>
                  {stateNames[selectedSingleState]}
                </h2>
                <div style={{
                  fontSize: '9px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '600',
                  color: '#C8A020',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '6px'
                }}>
                  {stateRegions[selectedSingleState] || 'Service Territory'}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    backgroundColor: isStateActive(selectedSingleState) ? 'rgba(19, 23, 28, 0.8)' : 'rgba(140, 65, 65, 0.8)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    borderRadius: '3px'
                  }}>
                    {isStateActive(selectedSingleState) ? 'Active Service' : 'Coming Soon'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '16px' }}>
              {/* Stats Row */}
              <div style={{
                display: 'flex',
                borderTop: '1px solid rgba(200, 160, 32, 0.2)',
                borderBottom: '1px solid rgba(200, 160, 32, 0.2)',
                backgroundColor: 'rgba(200, 160, 32, 0.06)',
                padding: '10px 0',
                marginBottom: '16px'
              }}>
                {[
                  { label: 'AVG TRANSIT', value: stateStats[selectedSingleState]?.transit || '2-3 DAYS' },
                  { label: 'LOADS / MONTH', value: stateStats[selectedSingleState]?.loads || '40+' },
                  { label: 'HUB CITIES', value: stateStats[selectedSingleState]?.hubs || '3' }
                ].map((stat, idx) => (
                  <div key={idx} style={{
                    flex: 1,
                    textAlign: 'center',
                    borderRight: idx < 2 ? '1px solid rgba(200, 160, 32, 0.15)' : 'none'
                  }}>
                    <div style={{
                      fontSize: '8px',
                      fontFamily: 'The Seasons, serif',
                      fontWeight: '600',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '3px'
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: '15px',
                      fontFamily: 'The Seasons, serif',
                      fontWeight: '800',
                      color: '#C8A020'
                    }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Weather */}
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{
                  fontSize: '11px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '700',
                  color: '#C8A020',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 4px 0'
                }}>
                  Weather
                </h3>
                <p style={{
                  fontSize: '12px',
                  fontFamily: 'The Seasons, serif',
                  color: '#e5e7eb',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {stateDetail.weather}
                </p>
              </div>

              {/* Driving Conditions */}
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{
                  fontSize: '11px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '700',
                  color: '#C8A020',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 4px 0'
                }}>
                  Driving Conditions
                </h3>
                <p style={{
                  fontSize: '12px',
                  fontFamily: 'The Seasons, serif',
                  color: '#e5e7eb',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {stateDetail.conditions}
                </p>
              </div>

              {/* Hazards */}
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{
                  fontSize: '11px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '700',
                  color: '#C8A020',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 4px 0'
                }}>
                  Potential Hazards
                </h3>
                <p style={{
                  fontSize: '12px',
                  fontFamily: 'The Seasons, serif',
                  color: '#e5e7eb',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {stateDetail.hazards}
                </p>
              </div>

              {/* Major Routes */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                  fontSize: '11px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '700',
                  color: '#C8A020',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: '0 0 4px 0'
                }}>
                  Major Routes
                </h3>
                <p style={{
                  fontSize: '12px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '500',
                  color: '#F5F6F7',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {stateRoutes[selectedSingleState] || 'Primary corridors available'}
                </p>
              </div>

              {/* CTA Button */}
              <Link to="/contact" style={{
                display: 'inline-block',
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#C8A020',
                color: '#0A0A0A',
                fontSize: '11px',
                fontFamily: 'The Seasons, serif',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '3px',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dbb800'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#C8A020'}
              >
                REQUEST A QUOTE →
              </Link>

              {/* Neighboring Coverage */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(200, 160, 32, 0.2)' }}>
                <h4 style={{
                  fontSize: '9px',
                  fontFamily: 'The Seasons, serif',
                  fontWeight: '700',
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  margin: '0 0 6px 0'
                }}>
                  Neighboring Coverage
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                  {(stateNeighbors[selectedSingleState] || []).map((neighborState) => {
                    if (!activeStates.has(neighborState)) return null
                    return (
                      <button
                        key={neighborState}
                        onClick={() => handleStateClick(neighborState)}
                        style={{
                          backgroundColor: '#13171C',
                          border: '1px solid #252B33',
                          padding: '5px 10px',
                          fontFamily: 'The Seasons, serif',
                          fontWeight: '600',
                          fontSize: '9px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          color: '#F5E6B8',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.borderColor = '#C8A020'
                          e.target.style.color = '#C8A020'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.borderColor = '#252B33'
                          e.target.style.color = '#F5E6B8'
                        }}
                      >
                        {stateNames[neighborState]}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Three-Tier Header Section */}
      <div style={{
        padding: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '12px'
      }}>


        {/* Subheadline */}
        <p style={{
          fontFamily: "'The Seasons', serif",
          fontWeight: '400',
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          margin: '4px 0 20px 0',
          lineHeight: '1.6',
          overflow: 'visible',
          whiteSpace: 'normal',
          textShadow: '0 0 6px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.15)'
        }}>
          RUNNING THE MIDWEST & MID-SOUTH CORRIDOR.
        </p>

      </div>

      {/* Hint Text - Shows when no state is selected */}
      <div style={{
        textAlign: 'center',
        marginTop: '12px',
        fontSize: '12px',
        fontFamily: "'The Seasons', serif",
        fontWeight: '500',
        color: '#ffffff',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        opacity: selectedSingleState ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        pointerEvents: 'none',
        textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 16px rgba(255, 255, 255, 0.3)',
        animation: selectedSingleState ? 'none' : 'slowPulse 4s ease-in-out infinite'
      }}>
        TAP A STATE TO EXPLORE COVERAGE →
      </div>

      {/* Active Selection Sidebar - Redesigned */}
      {visibleStates.length > 0 && !selectedSingleState && (
        <>
        <style>{`
          .legend-sidebar::-webkit-scrollbar {
            display: none;
          }
          .legend-sidebar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {maybeSheet(
        <div className={`legend-sidebar${territoryLocked ? ' is-sheet' : ''}`} style={{ position: 'absolute', top: '60px', right: 'calc(100% + 30px)', width: '280px', backgroundColor: 'transparent', backdropFilter: 'none', padding: '16px', borderRadius: '8px', maxHeight: '550px', overflowY: 'auto', zIndex: 10, border: 'none' }}>
          {territoryLocked && (
            <button
              type="button"
              className="sheet-close"
              aria-label="Close territory list"
              onClick={() => setSelectedCategory(null)}
            >
              &times;
            </button>
          )}
          {/* Header - Matching Service Territory Style */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h3 className="sidebar-heading" style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              lineHeight: '1'
            }}>
              STATES WE COVER
            </h3>
            <div className="sidebar-rule"></div>
          </div>

          {/* Collapsible Content */}
          {!activeCollapsed && (
            <>
              {/* Hero Banner - Rounded top */}
              <div style={{
                width: '100%',
                height: '140px',
                backgroundColor: 'rgba(200, 160, 32, 0.1)',
                backgroundImage: 'url("/Company Images/territory-background.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px 8px 0 0',
                marginBottom: '0',
                position: 'relative',
                overflow: 'hidden',
                border: 'none'
              }}>
                <img
                  src="/Company Images/best-direct-logo.png"
                  alt="Best Direct Solutions"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    height: '35px',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Region Tabs - Horizontal */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap', marginTop: '12px', justifyContent: 'center' }}>
                {['all', 'midwest', 'midsouth', 'southeast', 'greatplains'].map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    style={{
                      padding: '4px 8px',
                      border: selectedRegion === region ? '1px solid #C8A020' : '1px solid #252B33',
                      backgroundColor: selectedRegion === region ? 'rgba(200, 160, 32, 0.15)' : 'transparent',
                      color: selectedRegion === region ? '#C8A020' : '#888',
                      fontSize: '9px',
                      fontFamily: 'The Seasons, serif',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      borderRadius: '2px'
                    }}
                  >
                    {region === 'all' ? 'All' : region === 'midwest' ? 'MW' : region === 'midsouth' ? 'MS' : region === 'southeast' ? 'SE' : 'GP'}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* State List - Compact Row Style - Only show when expanded */}
          {!activeCollapsed && (
            <>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maxHeight: '400px'
              }}
              className="webkit-scrollbar-hidden"
              >
                {filteredVisibleStates.map(state => (
                  <div
                    key={state}
                    onClick={() => handleStateClick(state)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 6px',
                      backgroundColor: hoveredState === state ? 'rgba(200,160,32,0.06)' : 'rgba(19,23,28,0.6)',
                      border: '1px solid',
                      borderColor: hoveredState === state ? '#C8A020' : '#252B33',
                      borderRadius: '2px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredState(state)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={`/Company Images/state-${state}.jpg`}
                      alt={stateNames[state]}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'cover',
                        borderRadius: '1px',
                        flexShrink: 0
                      }}
                    />
                    {/* State Name */}
                    <span style={{
                      fontFamily: "'The Seasons', serif",
                      fontWeight: '600',
                      fontSize: '11px',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase',
                      color: hoveredState === state ? '#C8A020' : '#F5E6B8',
                      transition: 'all 0.2s',
                      flex: 1
                    }}>
                      {stateNames[state]}
                    </span>
                    {/* Status Dot - Green for active */}
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#22C55E',
                      flexShrink: 0
                    }} />
                  </div>
                ))}
              </div>

              {/* CTA - Minimal */}
              <Link to="/contact" style={{
                display: 'block',
                padding: '10px 12px',
                backgroundColor: 'rgba(200, 160, 32, 0.2)',
                border: '1px solid #C8A020',
                color: '#C8A020',
                fontSize: '10px',
                fontFamily: 'The Seasons, serif',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textDecoration: 'none',
                cursor: 'pointer',
                borderRadius: '3px',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(200, 160, 32, 0.3)'
                e.target.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(200, 160, 32, 0.2)'
                e.target.style.color = '#C8A020'
              }}
              >
                Request Quote
              </Link>
            </>
          )}
        </div>
        )}
        </>
      )}

      {/* Inactive Territories Sidebar - Right Side - Only show when inactive selected */}
      {!selectedSingleState && selectedCategory === 'inactive' && (
        <>
        <style>{`
          .inactive-sidebar::-webkit-scrollbar {
            display: none;
          }
          .inactive-sidebar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {maybeSheet(
        <div className={`inactive-sidebar${territoryLocked ? ' is-sheet' : ''}`} style={{ position: 'absolute', top: '60px', left: 'calc(100% + 30px)', width: '280px', backgroundColor: 'transparent', backdropFilter: 'none', padding: '16px', borderRadius: '8px', maxHeight: '550px', overflowY: 'auto', zIndex: 10, border: 'none' }}>
          {territoryLocked && (
            <button
              type="button"
              className="sheet-close"
              aria-label="Close territory list"
              onClick={() => setSelectedCategory(null)}
            >
              &times;
            </button>
          )}
          {/* Header - Matching Service Territory Style */}
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h3 className="sidebar-heading" style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              margin: '0 0 8px 0',
              lineHeight: '1'
            }}>
              AVAILABLE UPON REQUEST
            </h3>
            <div className="sidebar-rule"></div>
          </div>

          {/* Hero Banner - Inactive */}
          {!inactiveCollapsed && (
            <div style={{
              width: '100%',
              height: '140px',
              backgroundColor: 'rgba(200, 160, 32, 0.1)',
              backgroundImage: 'url("/Company Images/generic-truck-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px 8px 0 0',
              marginBottom: '0',
              position: 'relative',
              overflow: 'hidden',
              border: 'none'
            }}>
              <img
                src="/Company Images/best-direct-logo.png"
                alt="Best Direct Solutions"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  height: '35px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

          {/* Region Tabs - Horizontal */}
          {!inactiveCollapsed && (
            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap', marginTop: '12px', justifyContent: 'center' }}>
              {['all', 'midwest', 'midsouth', 'southeast', 'greatplains'].map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    padding: '4px 8px',
                    border: selectedRegion === region ? '1px solid #C8A020' : '1px solid #252B33',
                    backgroundColor: selectedRegion === region ? 'rgba(200, 160, 32, 0.15)' : 'transparent',
                    color: selectedRegion === region ? '#C8A020' : '#888',
                    fontSize: '9px',
                    fontFamily: 'The Seasons, serif',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    borderRadius: '2px'
                  }}
                >
                  {region === 'all' ? 'All' : region === 'midwest' ? 'MW' : region === 'midsouth' ? 'MS' : region === 'southeast' ? 'SE' : 'GP'}
                </button>
              ))}
            </div>
          )}

          {/* Inactive State List - Compact Row Style - Only show when expanded */}
          {!inactiveCollapsed && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              maxHeight: '400px'
            }}
            className="webkit-scrollbar-hidden"
            >
              {Object.entries(stateNames)
                .filter(([abbrev]) => !activeStates.has(abbrev))
                .filter(([abbrev]) => {
                  if (selectedRegion === 'all') return true
                  const stateRegions = Object.entries(regionMap)
                    .filter(([, states]) => states.includes(abbrev))
                    .map(([region]) => region)
                  return stateRegions.includes(selectedRegion)
                })
                .sort((a, b) => a[1].localeCompare(b[1]))
                .map(([abbrev, name]) => (
                  <div
                    key={abbrev}
                    onClick={() => handleStateClick(abbrev)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 6px',
                      backgroundColor: hoveredState === abbrev ? 'rgba(200,160,32,0.06)' : 'rgba(19,23,28,0.6)',
                      border: '1px solid',
                      borderColor: hoveredState === abbrev ? '#C8A020' : '#252B33',
                      borderRadius: '2px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredState(abbrev)}
                    onMouseLeave={() => setHoveredState(null)}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={`/Company Images/state-${abbrev}.jpg`}
                      alt={name}
                      style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'cover',
                        borderRadius: '1px',
                        flexShrink: 0
                      }}
                    />
                    {/* State Name */}
                    <span style={{
                      fontFamily: "'The Seasons', serif",
                      fontWeight: '600',
                      fontSize: '11px',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase',
                      color: hoveredState === abbrev ? '#C8A020' : '#F5E6B8',
                      transition: 'all 0.2s',
                      flex: 1
                    }}>
                      {name}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
        )}
        </>
      )}

      {/* Tap-off backdrop for the territory sheet. Portalled so it sits under
          the sheet but over everything else, and clearing selectedCategory is
          what dismisses both. */}
      {territoryLocked && createPortal(
        <div
          className="territory-backdrop"
          onClick={() => setSelectedCategory(null)}
        />,
        document.body
      )}

      <div ref={mapCanvasRef} className="map-canvas" style={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 1163 631"
        width="90%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        style={{
          animation: 'whitePulse 3s ease-in-out infinite',
          shapeRendering: 'geometricPrecision',
          maxWidth: '90%',
          border: 'none',
          outline: 'none'
        }}
        shapeRendering="geometricPrecision"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <g id="Frame 1">
          <path id="wa" d="M135.71 86.5C137.39 86.35 139 86.25 140.71 86.5C150 87.88 172.59 96.53 174.7 84.51C176.81 72.49 177.36 59.29 180.38 47.17C183.4 35.05 187.78 16.93 172.71 15.5C157.65 14.06 148.53 10.62 134.78 8.43C121.04 6.23 110.51 3.74 97.7096 0.5H80.7096C82.5796 8.38 82.3496 19.14 82.2996 25.75C82.2596 32.37 74.3496 46.2 71.4896 36.72C68.6296 27.24 72.2396 17.62 60.3796 16.83C48.5296 16.04 48.7696 10.91 38.7096 8.5C36.5896 18.5 42.6296 30.21 41.7096 40.5C40.7896 50.79 40.0496 64.47 52.6396 64.57C65.2296 64.68 57.8596 86.14 69.7096 84.5C81.5596 82.86 90.4696 86.49 101.71 87.5C112.95 88.51 124.03 87.51 135.71 86.5Z" fill={getStateFill('wa')} stroke="#13171C" strokeWidth="0.4" onMouseEnter={() => handleStateHover('wa')} onMouseLeave={handleStateLeave} onClick={() => handleStateClick('wa')} style={getStateStyle('wa')}/>
          <text
            x="110"
            y="48"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            WA
          </text>
          <path id="id" d="M235.71 114.5C227.47 122.24 219.14 112.67 223.78 104.57C228.42 96.48 228.04 88.09 222.46 82.75C216.88 77.41 213.68 71.25 208.96 65.25C204.25 59.24 202.08 47.96 201.71 40.5C201.34 33.04 207.06 20.01 195.93 19.28C184.81 18.55 188.53 31.75 186.64 39.43C184.75 47.1 182.34 56.28 181.11 63.76C179.88 71.23 179.79 82.57 180.71 90.5C181.63 98.42 189.17 104.8 183.96 112.75C178.76 120.71 175.49 124.81 170.97 131.76C166.45 138.7 174.84 148.55 169.7 157.49C164.57 166.44 169.95 174.01 165.49 184.28C161.03 194.55 171.5 199.4 180.69 199.52C189.87 199.65 198.56 202.54 207.69 203.52C216.82 204.51 226.45 205.49 235.69 206.52C244.92 207.56 254.66 208.7 263.71 210.5C272.76 212.31 283.58 212.37 283.78 201.57C283.99 190.78 286.55 183.53 286.71 173.5C286.87 163.48 291.37 155.85 286.71 146.5C280.06 151.66 272.25 147.55 264.71 149.5C257.17 151.45 246.96 149.17 248.71 139.5C239.01 135.77 239.9 122.8 235.71 114.5Z" fill={getStateFill('id')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('id')} style={{ cursor: 'pointer' }}/>
          <text
            x="225"
            y="185"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            ID
          </text>
          <path id="mt" d="M290.71 142.5C297.16 129.74 310.93 136.43 322.71 137.5C334.49 138.57 350.54 139.62 362.64 140.57C374.73 141.52 390.47 142.99 402.04 144.17C413.61 145.35 431.32 148.87 431.71 134.5C432.11 120.13 434.21 106.82 433.71 93.5C433.21 80.18 438.53 64.72 435.68 52.53C432.84 40.33 411.19 47.04 400.71 44.5C390.23 41.96 374.47 42.15 362.71 40.5C350.95 38.85 335.39 38.61 323.38 36.83C311.37 35.05 296.63 33.84 284.78 32.43C272.94 31.02 258.08 27.28 246.72 27.49C235.36 27.7 220.66 18.42 211.41 24.2C202.16 29.99 206.46 48.36 210.78 56.43C215.1 64.49 220.42 74.85 228.63 81.58C236.84 88.3 228.12 102 227.71 112.5C237.15 104.41 242.79 114.6 243.79 123.42C244.79 132.24 253.92 135.6 254.71 144.5C267.62 145.22 279.18 142.65 290.71 142.5Z" fill={getStateFill('mt')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('mt')} style={{ cursor: 'pointer' }}/>
          <text
            x="321"
            y="87"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MT
          </text>
          <path id="me" d="M1101.71 151.5C1104.01 145.68 1105.21 136.47 1111.02 132.81C1116.82 129.14 1125.08 127.99 1126.74 120.53C1128.4 113.07 1134.18 112.46 1141.69 109.48C1149.19 106.49 1152.45 105.55 1159.46 99.25C1166.48 92.95 1156.99 89.8 1153.03 84.18C1149.08 78.56 1143.64 74.69 1142.69 66.52C1141.73 58.36 1139.1 52.65 1137.03 44.18C1134.96 35.7 1126.99 36.22 1120.74 40.52C1114.48 44.83 1108.06 35.73 1105.48 45.27C1102.9 54.81 1098.52 57.24 1098.64 66.43C1098.76 75.61 1097.12 81.71 1093.03 88.82C1088.95 95.94 1085.52 101.23 1088.38 108.83C1091.24 116.43 1090.57 124.91 1092.93 132.28C1095.3 139.64 1095.18 146.66 1101.71 151.5Z" fill={getStateFill('me')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('me')} style={{ cursor: 'pointer' }}/>
          <text
            x="1124"
            y="90"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            ME
          </text>
          <path id="mn" d="M592.71 189.5C599.05 190.45 606.29 189.5 612.71 189.5C623.7 187.86 636.94 191.69 647.7 189.49C658.47 187.29 670.04 190.62 680.68 188.47C691.32 186.32 675.57 174.27 671.41 170.8C667.24 167.34 651.85 162.55 654.73 153.52C657.62 144.5 650.62 132.85 658.96 126.75C667.29 120.65 661.26 109.23 669.46 103.25C677.66 97.28 681.19 92.22 687.63 86.42C694.07 80.61 702.25 78.05 709.71 74.5C702.38 67.58 690.64 73.25 681.71 73.5C672.78 73.74 665.25 66.82 656.79 63.42C648.33 60.02 638.49 62.34 628.93 60.28C619.38 58.22 614.48 52.61 611.71 43.5C607.6 54.77 596.15 52.62 583.71 51.5C571.27 50.38 571.45 66.69 575.72 76.49C579.99 86.29 579.17 99.2 580.72 109.49C582.26 119.78 588.46 128.94 579.71 137.5C587.77 144 586.28 154.25 586.71 163.5C587.14 172.75 582.79 186.73 592.71 189.5Z" fill={getStateFill('mn')} stroke="#13171C" strokeWidth="0.4" onMouseEnter={() => handleStateHover('mn')} onMouseLeave={handleStateLeave} onClick={() => handleStateClick('mn')} style={getStateStyle('mn')}/>
          <text
            x="632"
            y="118"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MN
          </text>
          <path id="nd" d="M569.71 70.5C569.05 66.46 569.58 59.55 567.71 55.5C564.42 50.55 560.26 51.5 554.71 51.5C553.71 51.5 552.71 51.5 551.71 51.5C548.82 52.13 545.27 52.83 541.71 52.5C538.34 52.18 534.34 51.84 530.71 51.5C516.07 50.25 499.61 49.12 484.71 49.5C469.81 49.88 455.58 45.02 441.71 49.5C439.88 60.1 441.13 68.52 439.71 79.5C438.29 90.48 439.88 97.59 437.71 109.5C435.54 121.41 446.84 122.82 456.71 122.5C466.58 122.18 477.98 123.56 487.71 123.5C497.44 123.44 509.46 124.55 518.64 124.57C527.81 124.6 541.39 126.45 549.49 125.72C557.59 124.99 573.58 130.84 577.78 123.57C581.98 116.31 572.43 105.16 574.71 96.5C576.99 87.84 570.17 78.91 569.71 70.5Z" fill={getStateFill('nd')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nd')} style={{ cursor: 'pointer' }}/>
          <text
            x="508"
            y="88"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            ND
          </text>
          <path id="or" d="M47.7096 67.5C36.2696 65.51 38.2196 79.77 35.4896 87.28C32.7596 94.78 30.1396 101.69 28.0396 108.83C25.9296 115.97 23.9296 125.59 20.4796 132.27C17.0296 138.95 11.5496 146.43 10.7196 153.49C9.88957 160.55 8.22957 172.09 17.7096 173.5C27.1896 174.91 35.8496 175.64 44.7096 177.5C53.5596 179.37 62.0596 180.68 70.4796 182.29C78.8996 183.9 86.3796 185.01 95.7096 186.5C105.03 187.99 112.93 188.63 122.64 190.57C132.34 192.51 137.94 193.04 148.71 195.5C159.48 197.96 161.52 184.82 161.71 176.5C161.91 168.18 164.31 157.71 166.4 150.19C168.5 142.68 160.86 134.62 167.41 128.2C173.97 121.79 175.23 117.38 179.94 109.73C184.65 102.08 174.59 95.82 166.71 95.5C158.84 95.17 148.37 92.21 139.71 91.5C131.05 90.79 119.08 92.42 110.71 93.5C102.34 94.57 91.7896 91.37 84.7296 88.48C77.6796 85.58 66.1196 93.38 60.4796 85.73C54.8396 78.08 59.1196 69.48 47.7096 67.5Z" fill={getStateFill('or')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('or')} style={{ cursor: 'pointer' }}/>
          <text
            x="90"
            y="132"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            OR
          </text>
          <path id="nh" d="M1080.71 102.5C1075.25 109.46 1079.77 119.82 1072.96 127.75C1066.16 135.69 1070.93 143.23 1066.71 153.5C1062.49 163.77 1072.79 169.27 1081.49 166.28C1090.19 163.29 1100.23 160.43 1094.81 152.4C1089.4 144.37 1090.11 136.47 1087.69 127.52C1085.26 118.58 1083.55 111.16 1080.71 102.5Z" fill={getStateFill('nh')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nh')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1080"
            y1="86"
            x2="1080"
            y2="103"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1080"
            y="78"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NH
          </text>
          <g id="wi">
            <path d="M744.71 87.5C733.59 97.51 720.02 104.94 706.71 111.5C722.92 123.13 755.81 114.37 757.71 140.5C763.82 135.82 767.37 120.89 778.71 125.5C792.17 113.64 810.62 116.62 826.71 116.5C822.78 114.57 821.62 105.62 815.93 107.72C810.25 109.82 806.06 106.83 804.71 101.5C799 104.62 791.68 103.11 785.79 105.58C779.9 108.04 775.62 112.02 768.71 111.5C761.8 110.98 757.62 108.37 753.4 103.81C749.19 99.24 738.41 107.89 737.11 101.24C735.82 94.6 743.58 93.15 744.71 87.5Z" fill={getStateFill('wi')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('wi')} style={{ cursor: 'pointer' }}/>
            <path d="M690.71 105.5C685.35 109.57 676.2 107.75 670.96 111.75C665.73 115.76 670.83 126.27 662.96 129.75C655.09 133.23 664.21 143.47 660.7 149.49C657.19 155.52 663.6 162.44 669.68 164.53C675.77 166.62 678.36 172.3 684.46 175.75C690.57 179.19 690.84 187 692.38 193.83C693.92 200.65 692.92 207.81 701.03 211.18C709.14 214.55 714.49 212.87 723.71 212.5C732.93 212.13 738.38 210.91 748.71 211.5C759.04 212.09 754.88 203.23 754.05 196.18C753.21 189.13 757.72 181.61 757.78 174.57C757.85 167.54 763.6 160.79 761.71 154.5C762.17 159.11 751.31 164.83 749.72 159.51C748.12 154.19 755.08 150.23 755.71 145.5C750.38 140.92 752.86 131.63 745.94 128.27C739.02 124.92 731.4 126.49 724.93 123.28C718.47 120.06 710.97 121.55 705.79 116.42C700.62 111.29 689.17 115.05 690.71 105.5Z" fill={getStateFill('wi')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('wi')} style={{ cursor: 'pointer' }}/>
          </g>
          <text
            x="710"
            y="165"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            WI
          </text>
          <path id="mi" d="M839.71 137.5C831.55 134.29 815.94 123.65 811.03 131.82C806.13 139.99 804.01 160.98 795.71 147.5C789.46 158.35 781.52 174.59 787.79 187.42C794.05 200.26 793.39 214.92 786.71 227.5C797.76 226.65 812.84 226.36 823.71 226.5C834.58 226.64 846.64 224.77 850.74 215.53C854.83 206.28 863.06 198.15 861.64 188.57C860.21 178.99 855 162.38 847.46 174.25C839.92 186.12 826.93 176.06 835.96 166.75C844.99 157.44 840.5 148.59 839.71 137.5Z" fill={getStateFill('mi')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('mi')} style={{ cursor: 'pointer' }}/>
          <text
            x="825"
            y="205"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MI
          </text>
          <path id="wy" d="M427.71 204.5C427.84 201.18 427.71 197.82 427.71 194.5C427.71 183.31 433.05 165.56 429.03 155.18C425.01 144.8 405.18 151.43 394.71 148.5C384.24 145.57 367.42 148.21 355.72 145.49C344.02 142.78 331.14 144.76 318.71 141.5C306.28 138.24 293.2 139.34 293.71 154.5C294.21 169.66 290.37 177.74 290.04 191.83C289.71 205.92 286.81 216.18 286.49 230.28C286.17 244.37 303.56 240.06 314.69 241.52C325.81 242.99 342.62 243.98 353.71 244.5C364.79 245.03 381.4 248.24 391.04 248.17C400.68 248.1 423.26 255.44 425.71 243.5C428.16 231.56 427.25 216.55 427.71 204.5Z" fill={getStateFill('wy')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('wy')} style={{ cursor: 'pointer' }}/>
          <text
            x="360"
            y="197"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            WY
          </text>
          <path id="ma" d="M1051.71 180.5C1051.04 185.65 1051.46 188.2 1056.71 188.5C1062.81 187.3 1071.68 185.94 1077.64 185.43C1083.59 184.92 1093.62 181.11 1096.79 188.42C1099.95 195.74 1106.81 192.63 1112.71 190.5C1106.03 184.45 1096.96 179.41 1099.4 170.2C1101.85 160.98 1085.05 171.37 1077.71 171.5C1070.37 171.63 1054.12 171.85 1051.71 180.5Z" fill={getStateFill('ma')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ma')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1108"
            y1="183"
            x2="1120"
            y2="179"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1124"
            y="178"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MA
          </text>
          <path id="ca" d="M192.71 407.5C190.73 400.21 187.58 391.51 182.96 385.25C178.33 378.99 172.72 374.4 167.96 368.25C163.19 362.1 157.58 356.56 152.63 350.58C147.68 344.61 143.27 339.34 137.96 333.25C132.65 327.16 128.29 322.1 123.01 316.2C117.74 310.29 113.32 304.23 107.96 298.25C102.6 292.28 98.7196 287.67 92.9596 281.25C87.1896 274.84 83.2996 267.65 85.7096 258.5C88.1196 249.36 87.3996 239.11 89.7796 229.57C92.1696 220.04 92.2096 212.72 94.7096 202.5C97.2196 192.29 88.2396 189.37 78.7096 188.5C69.1796 187.63 60.4396 185.8 50.7196 183.49C40.9996 181.19 33.8796 182.31 23.3796 178.83C12.8796 175.34 10.7296 185.08 10.6896 194.48C10.6396 203.87 2.59957 208.24 0.709575 216.5C-1.18043 224.76 10.4096 232.16 7.70957 241.5C5.00957 250.84 8.58957 261.28 13.9396 268.27C19.2896 275.26 17.6796 283.7 24.9296 289.28C32.1896 294.85 20.6496 308.19 31.4596 312.75C42.2796 317.31 34.2196 326.58 36.7896 334.42C39.3496 342.27 43.8296 347.07 48.7896 354.42C53.7596 361.77 57.0996 368.15 56.7796 378.43C56.4696 388.7 73.2896 384.75 78.4796 389.73C83.6696 394.71 91.2096 398.58 97.9596 402.25C104.72 405.91 107.67 412.83 115.46 416.75C123.26 420.67 122.82 431.96 126.74 438.47C130.67 444.97 145.49 442.91 153.71 443.5C161.93 444.09 175.53 444.98 182.71 440.5C176.65 435.19 180.03 429.23 183.38 424.17C186.73 419.11 184.84 410.04 192.71 408.5V407.5Z" fill={getStateFill('ca')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ca')} style={{ cursor: 'pointer' }}/>
          <text
            x="72"
            y="310"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            CA
          </text>
          <path id="ri" d="M1090.71 189.5C1083.94 188.22 1087.07 197.25 1088.71 200.5C1092.89 199.52 1089.73 192.84 1090.71 189.5Z" fill={getStateFill('ri')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ri')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1094"
            y1="196"
            x2="1120"
            y2="199"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1124"
            y="200"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            RI
          </text>
          <path id="ct" d="M1052.71 213.5C1059.11 213.02 1064.77 203.75 1072.04 205.83C1079.31 207.9 1087.62 196.36 1080.93 191.28C1074.25 186.2 1065.37 193.95 1057.38 193.17C1049.4 192.4 1052.62 208.34 1052.71 213.5Z" fill={getStateFill('ct')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ct')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1086"
            y1="207"
            x2="1120"
            y2="219"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1124"
            y="222"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            CT
          </text>
          <path id="nv" d="M201.71 359.5C204.66 348.1 205.64 336.45 206.71 324.5C207.78 312.55 209.6 300.47 210.71 288.5C211.82 276.54 214.54 264.67 214.72 252.51C214.89 240.35 220.03 229.74 219.71 217.5C219.38 205.26 201 208.37 191.38 205.83C181.76 203.29 166.55 204.15 155.78 201.43C145.02 198.71 133.05 199.13 121.71 195.5C110.37 191.87 98.3996 194.32 98.6896 207.48C98.9696 220.63 93.6396 229.97 92.7096 241.5C91.7796 253.03 87.7196 266.78 94.7896 275.42C101.86 284.05 106.51 289.19 112.96 297.25C119.4 305.31 125.45 310.61 131.96 318.25C138.46 325.89 143.57 333.15 149.96 340.25C156.35 347.35 162.66 354.65 168.61 361.6C174.56 368.55 180.13 376.45 187.71 381.5C184.57 370.88 186.18 350.89 201.71 359.5Z" fill={getStateFill('nv')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nv')} style={{ cursor: 'pointer' }}/>
          <text
            x="154"
            y="287"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NV
          </text>
          <path id="ia" d="M682.71 193.5C678.46 193.88 673.98 193.5 669.71 193.5C660.27 193.5 649.81 193.91 640.71 194.5C631.61 195.09 619.14 193.7 610.71 194.5C602.28 195.3 588.93 191.01 585.71 199.5C582.49 207.99 585.72 217.15 588.78 224.43C591.84 231.7 594.62 238.9 596.72 246.49C598.82 254.09 597.22 265.13 607.71 265.5C618.2 265.87 626.76 264.54 636.71 264.5C646.66 264.46 656.27 264.38 665.71 263.5C675.15 262.62 683.66 266.69 690.41 262.2C697.16 257.7 688.7 244 696.03 241.82C703.37 239.64 712.83 234.55 708.46 226.75C704.09 218.94 699.5 217.17 692.96 212.25C686.42 207.33 691.93 195.37 682.71 193.5Z" fill={getStateFill('ia')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ia')} style={{ cursor: 'pointer' }}/>
          <text
            x="647"
            y="229"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            IA
          </text>
          <path id="pa" d="M1021.71 214.5C1015.32 209.83 1012.69 200.6 1002.93 202.72C993.18 204.85 985.22 205.47 975.71 206.5C966.2 207.53 958.11 210.24 948.71 210.5C939.31 210.76 931.39 215.4 922.41 211.81C913.42 208.21 909.03 215.32 910.38 224.83C911.73 234.34 912.56 243.3 913.32 252.75C914.07 262.2 914.94 270.03 925.71 267.5C936.48 264.97 943.98 266.34 953.7 264.49C963.42 262.65 971.72 262.09 980.71 260.5C989.7 258.91 999.99 260.22 1007.68 256.47C1015.37 252.73 1022.36 252.14 1024.71 243.5C1012.93 237.67 1015.92 223.07 1021.71 214.5Z" fill={getStateFill('pa')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('pa')} style={{ cursor: 'pointer' }}/>
          <text
            x="967"
            y="234"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            PA
          </text>
          <path id="ne" d="M489.71 278.5C494.64 278.5 499.8 278.07 504.71 278.5C536.18 281.29 568.58 280.34 600.71 280.5C593.12 261.05 590.47 239.96 582.71 220.5C575.35 217.86 569.12 209.32 559.72 212.51C550.32 215.7 545.77 208.6 536.71 207.5C527.65 206.4 517.48 206.42 507.71 206.5C497.94 206.58 487.46 206.53 477.71 205.5C467.96 204.47 458.62 206.19 448.71 204.5C438.8 202.81 429.62 207.1 431.71 217.5C433.8 227.9 427.04 238.08 431.41 246.8C435.77 255.53 448.52 250.1 456.71 251.5C464.9 252.9 473.44 255.91 470.71 267.5C467.99 279.09 482.14 278.5 489.71 278.5Z" fill={getStateFill('ne')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ne')} style={{ cursor: 'pointer' }}/>
          <text
            x="514"
            y="243"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NE
          </text>
          <path id="ut" d="M234.71 211.5C218.22 210.53 225.06 231.77 221.49 243.28C217.91 254.79 219.43 269.22 216.64 282.43C213.85 295.64 215.25 306.99 212.04 321.83C208.83 336.67 226.65 338.68 238.71 338.5C250.77 338.32 267.91 342.28 279.04 342.17C290.17 342.06 311.4 350.74 313.71 336.5C316.02 322.26 315.77 309.66 316.71 295.5C317.66 281.34 320.86 269.91 320.71 255.5C320.56 241.1 298.83 247.9 287.96 244.25C277.08 240.61 286.96 216.68 273.93 216.28C260.9 215.88 247.22 212.24 234.71 211.5Z" fill={getStateFill('ut')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ut')} style={{ cursor: 'pointer' }}/>
          <text
            x="265"
            y="285"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            UT
          </text>
          <path id="il" d="M765.71 293.5C765.71 290.17 765.71 286.83 765.71 283.5C765.49 270.84 764.12 254.72 763.71 242.5C763.3 230.29 760.62 215.19 746.71 216.5C732.8 217.81 722.54 216.46 708.71 218.5C720.35 228.25 711.35 244.99 697.71 246.5C703.49 259.2 688 267.37 689.78 279.43C691.57 291.48 705.6 293.68 706.71 305.5C725.87 301.67 709.9 322.43 718.46 327.75C727.03 333.06 734.31 340.97 734.71 351.5C739.35 349.39 744.47 346.92 749.71 349.5C748.74 341.88 759.46 340.16 758.71 332.5C757.96 324.85 761.55 319.99 765.39 314.18C769.23 308.36 765.71 300.42 765.71 293.5Z" fill={getStateFill('il')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('il')} style={{ cursor: 'pointer' }}/>
          <text
            x="727"
            y="283"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            IL
          </text>
          <path id="oh" d="M904.71 217.5C893.49 221.71 877.27 237.46 864.71 233.5C852.15 229.54 824.51 222.62 823.78 240.43C823.05 258.24 828.29 274.32 827.71 291.5C833.26 292.57 836.12 297.46 840.64 299.57C845.16 301.69 852.2 304.43 857.69 303.48C863.17 302.52 866.82 298.59 871.49 304.72C876.15 310.85 880.56 297.09 879.71 294.5C887 288.89 890.43 283 898.96 277.75C907.49 272.5 903.64 259.21 906.71 250.5C909.78 241.79 903.11 226.65 904.71 217.5Z" fill={getStateFill('oh')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('oh')} style={{ cursor: 'pointer' }}/>
          <text
            x="866"
            y="264"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            OH
          </text>
          <path id="nj" d="M1032.71 272.5C1033.02 267.6 1040.26 261.85 1040.4 257.19C1040.55 252.54 1047.53 243.45 1042.63 239.58C1037.72 235.72 1039.12 230.33 1040.63 225.58C1042.14 220.82 1030.18 216.55 1026.96 217.75C1023.74 218.95 1020.83 230.22 1020.71 233.5C1029.48 238.86 1033.56 248.11 1022.96 254.75C1012.35 261.39 1026.62 269.24 1032.71 272.5Z" fill={getStateFill('nj')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nj')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1044"
            y1="246"
            x2="1064"
            y2="246"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1069"
            y="246"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NJ
          </text>
          <path id="in" d="M820.71 303.5C825.36 295.15 821.12 286.49 821.71 277.5C822.3 268.51 819.85 259.37 819.71 250.5C819.57 241.63 820.25 230.66 809.71 231.5C799.17 232.34 792.78 232.35 783.71 233.5C774.64 234.65 766.95 237.35 768.93 247.28C770.92 257.2 768.62 264.9 770.71 274.5C772.8 284.1 769.48 290.81 770.78 300.43C772.08 310.04 771.15 313.72 765.49 322.28C759.82 330.83 775.52 328.61 781.71 327.5C787.9 326.38 795.45 319.08 801.71 323.5C807.72 316.94 810.79 302.9 820.71 303.5Z" fill={getStateFill('in')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('in')} style={{ cursor: 'pointer' }}/>
          <text
            x="795"
            y="278"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            IN
          </text>
          <path id="co" d="M343.71 248.5C326.2 246.81 323.12 257.4 323.71 271.5C324.3 285.59 319.91 298.67 320.7 310.49C321.49 322.32 312.36 340.4 324.04 346.17C335.72 351.94 350.27 345.43 363.04 349.17C375.81 352.91 390.15 348.19 403.71 351.5C417.26 354.81 428.53 349.45 443.04 354.17C457.55 358.89 466.47 345.88 463.71 332.5C460.95 319.12 467.46 304.12 465.51 292.75C463.57 281.37 472.46 263.51 461.73 257.48C451.01 251.45 434.07 257.47 421.78 255.43C409.5 253.39 395.38 252.49 382.71 251.5C370.04 250.51 355.86 249.68 343.71 248.5Z" fill={getStateFill('co')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('co')} style={{ cursor: 'pointer' }}/>
          <text
            x="392"
            y="302"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            CO
          </text>
          <path id="de" d="M1025.71 288.5C1021.51 279.18 1013.61 270.37 1012.71 259.5C1015 267.48 1011.88 292.04 1025.71 288.5Z" fill={getStateFill('de')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('de')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1028"
            y1="274"
            x2="1053"
            y2="272"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1058"
            y="272"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            DE
          </text>
          <path id="md" d="M1018.71 311.5C1018.76 311.85 1019.62 312.25 1019.71 312.5C1019.68 306.78 1030.6 294.01 1020.71 293.5C1010.83 292.99 1011.37 284.63 1009.71 275.5C1008.05 266.37 1005.94 260.73 995.71 264.5C985.48 268.27 979.33 263.6 969.71 267.5C975.51 277.73 995.01 281.2 986.71 295.5C991.15 296.54 995.1 299.14 999.71 299.5C996.71 292.12 989.26 275 999.97 268.76C1010.67 262.52 1004.88 288.49 1007.71 294.5C1016.56 296.39 1017.66 304.2 1018.71 311.5Z" fill={getStateFill('md')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('md')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1021"
            y1="301"
            x2="1053"
            y2="300"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1058"
            y="300"
            textAnchor="start"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MD
          </text>
          <path id="wv" d="M909.71 264.5C907.24 270.31 907.53 281.5 898.79 283.58C890.04 285.65 893.01 298.69 883.71 298.5C882.93 307.69 872.51 315.87 881.46 323.75C890.41 331.62 892.52 335.56 903.71 333.5C914.89 331.44 921.03 326.34 923.94 316.73C926.85 307.12 930.94 296.84 940.71 299.5C941.56 290.79 950.43 290.7 953.41 283.2C956.38 275.69 961.39 270.99 969.71 276.5C966.4 266.04 960.44 273.84 953.71 274.5C946.98 275.16 944.02 280.01 937.93 283.72C931.85 287.43 933.11 268.52 925.38 273.17C917.65 277.82 910.09 270.85 909.71 264.5Z" fill={getStateFill('wv')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('wv')} style={{ cursor: 'pointer' }}/>
          <text
            x="905"
            y="305"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            WV
          </text>
          <path id="mo" d="M623.71 308.5C625.72 317.16 624.71 328.06 624.71 337.5C624.71 339.8 624.49 342.21 624.71 344.5C625 347.57 625.71 351.75 625.71 355.5C625.71 359.07 624.66 364.49 626.71 367.5C640.43 373.54 664.86 367.16 679.71 368.5C694.56 369.84 724.46 358.81 718.71 380.5C730.98 382.36 725.43 370.51 731.96 364.75C738.49 358.99 730.05 354.34 728.64 346.57C727.22 338.81 721.43 335.89 714.79 331.42C708.16 326.94 710.57 316.76 711.71 309.5C700.17 311.04 699.78 298.68 691.46 292.75C683.14 286.82 687.25 273.93 678.71 268.5C674.93 269.71 668.71 268.5 664.71 268.5C656.33 268.5 649.25 270.44 640.71 269.5C632.17 268.56 625.18 270.94 616.71 270.5C608.24 270.06 601.3 271.58 607.79 278.42C614.28 285.25 617.17 284.42 616.65 292.42C616.12 300.42 621.97 301.03 623.71 308.5Z" fill={getStateFill('mo')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('mo')} style={{ cursor: 'pointer' }}/>
          <text
            x="665"
            y="318"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MO
          </text>
          <path id="va" d="M895.71 352.5C899.99 352.09 905.83 351.93 910.71 351.5C918.92 349.39 928.16 351.08 936.49 349.28C944.81 347.48 952.04 348.03 960.64 346.43C969.24 344.83 976.47 344.74 985.64 343.43C994.81 342.11 998.3 341.53 1008.71 339.5C1019.12 337.46 1002.44 334.28 1003.71 326.5C1004.98 318.72 1003.22 309.75 996.94 306.27C990.66 302.79 980.57 302.75 981.72 295.51C982.87 288.27 983.33 283.1 974.71 279.5C971.26 285.95 963.14 277.4 960.02 280.81C956.89 284.21 956.81 292.48 950.79 293.58C944.78 294.69 947.57 306.84 939.78 304.43C932 302.02 935.3 311.84 930.63 315.42C925.96 319 928.91 327.81 923.94 330.73C918.97 333.65 915.62 336.76 908.93 337.72C902.24 338.68 900 343.83 891.41 338.8C882.81 333.78 874.11 348.64 867.71 354.5C877.1 353.31 885.98 352.5 895.71 352.5Z" fill={getStateFill('va')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('va')} style={{ cursor: 'pointer' }}/>
          <text
            x="955"
            y="320"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            VA
          </text>
          <path id="ks" d="M619.71 351.5C620.91 346.11 619.71 339.05 619.71 333.5C619.71 324.96 623.18 311.18 616.46 304.75C609.75 298.32 614.62 289.14 605.93 286.28C597.25 283.41 586.65 284.95 576.71 284.5C566.77 284.05 554.91 285.32 544.71 284.5C534.51 283.68 523.97 286.3 513.71 284.5C503.45 282.7 494.55 285.61 483.71 283.5C472.87 281.38 469.35 288.46 469.71 298.5C470.07 308.54 468.01 320.42 468.71 329.5C469.4 338.57 463.1 350.68 472.71 354.5C482.32 358.33 492.75 353.74 502.64 355.57C512.52 357.41 523.52 356.47 533.71 356.5C543.9 356.53 554 356.53 563.71 357.5C573.42 358.47 585.22 357.28 594.71 357.5C604.2 357.72 614.98 360.09 619.71 351.5Z" fill={getStateFill('ks')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ks')} style={{ cursor: 'pointer' }}/>
          <text
            x="543"
            y="320"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            KS
          </text>
          <path id="ky" d="M882.71 331.5C877.93 329.46 876.59 322.71 873.03 320.18C869.48 317.65 874.03 305.94 866.6 306.61C859.18 307.28 844.45 309.53 836.79 302.42C829.13 295.3 829.74 300 825.96 304.75C822.18 309.5 816.12 307.43 814.63 313.42C813.14 319.42 808.27 319.15 806.46 325.25C804.65 331.36 796.02 324.48 793.63 328.42C791.24 332.36 782.19 332.41 778.73 334.48C775.27 336.54 764.22 330.22 763.03 336.82C761.84 343.42 756.39 342.92 754.71 348.5C753.02 354.07 749.1 356.78 742.71 352.5C740.79 356.81 740.81 360.81 739.71 365.5C757.84 365.62 774.03 358.89 791.71 359.5C809.39 360.11 831.9 357.61 848.7 356.49C865.51 355.37 871.62 340.32 882.71 331.5Z" fill={getStateFill('ky')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ky')} style={{ cursor: 'pointer' }}/>
          <text
            x="810"
            y="340"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            KY
          </text>
          <path id="az" d="M181.71 446.5C186.16 456.13 199.61 457.12 208.63 462.58C217.64 468.04 228.23 470.63 237.63 475.58C247.04 480.52 259.58 485.31 270.49 485.72C281.4 486.13 300.33 492.86 301.78 478.57C303.24 464.29 303.87 452.31 304.71 438.5C305.56 424.7 307.71 413.76 308.38 400.17C309.05 386.58 311.01 374.14 311.71 360.5C312.41 346.86 296.17 347.89 284.71 347.5C273.25 347.11 257.47 344.16 245.71 343.5C233.95 342.84 220.14 338.5 209.71 343.5C208.72 349.02 209.02 357.46 204.96 361.75C200.89 366.03 190.15 359.65 191.71 368.5C193.27 377.35 191.39 380.97 191.71 388.5C192.04 396.03 195.18 397.91 197.93 404.28C200.68 410.65 191.17 412.2 190.49 417.28C189.81 422.36 184.02 428.61 184.74 433.47C185.46 438.34 191.48 445.56 181.71 446.5Z" fill={getStateFill('az')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('az')} style={{ cursor: 'pointer' }}/>
          <text
            x="247"
            y="415"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            AZ
          </text>
          <path id="nc" d="M870.71 378.5C869.28 379.63 868.14 380.55 866.71 381.5C861.43 386.47 847.84 388.67 848.71 397.5C857.96 394.12 868.9 398.16 877.49 392.28C886.07 386.39 895.91 390.28 905.69 387.48C915.46 384.68 919.95 395.83 929.04 393.83C938.13 391.83 947.81 394.22 954.46 399.75C961.11 405.28 965.59 412.23 973.64 413.43C981.68 414.63 984.22 400.53 989.81 396.6C995.4 392.67 1004.61 387.84 1010.71 384.5C1003.01 383.8 1007.62 375.51 1004.71 371.5C1011.07 369.23 1016.55 372.36 1020.45 365.24C1024.36 358.12 1012.6 358.31 1007.71 360.5C998.62 355.51 1012.28 349.37 1017.71 349.5C1012.15 340.08 998.08 347.54 987.71 347.5C977.34 347.46 965.61 351.03 954.93 351.72C944.25 352.41 932.81 355.8 921.71 355.5C910.62 355.21 900.36 356.63 894.41 365.2C888.47 373.77 878.81 372.11 870.71 378.5Z" fill={getStateFill('nc')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nc')} style={{ cursor: 'pointer' }}/>
          <text
            x="935"
            y="374"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NC
          </text>
          <path id="nm" d="M332.71 351.5C319.82 350.25 315.88 356.07 315.71 367.5C315.54 378.93 313.4 387.64 313.64 398.43C313.87 409.21 310.39 418.24 310.71 428.5C311.03 438.76 307.48 449.68 308.7 459.49C309.93 469.31 300.67 479.79 309.02 488.19C317.37 496.6 321.14 478.9 329.03 478.84C336.93 478.77 349.77 482.73 357.01 477.8C364.25 472.88 376.21 474.4 385.69 475.52C395.16 476.65 406.45 476.27 416.71 477.5C426.97 478.73 436.17 477.78 435.71 465.5C435.25 453.22 437 447.04 437.38 436.17C437.76 425.3 436.67 416.42 438.71 405.5C440.75 394.59 437.33 385.41 439.73 373.52C442.14 361.64 436.19 357.55 424.71 357.5C413.23 357.45 403.51 357.16 392.73 356.48C381.96 355.79 372.29 354.65 361.73 354.48C351.17 354.3 342.63 352.46 332.71 351.5Z" fill={getStateFill('nm')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('nm')} style={{ cursor: 'pointer' }}/>
          <text
            x="374"
            y="415"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NM
          </text>
          <path id="tn" d="M863.71 378.5C866.63 376.78 868.77 374.54 871.71 372.5C878.36 366.99 889.35 365.56 893.71 357.5C883.07 358.08 871.64 358.47 861.38 360.17C851.12 361.87 841.13 360.9 830.71 362.5C820.29 364.1 806.66 361.38 796.71 363.5C786.76 365.62 773.25 361.89 764.94 366.73C756.63 371.57 742.35 366.67 735.42 372.21C728.48 377.74 729.85 387.97 724.63 396.42C719.42 404.88 740.11 404.39 748.71 403.5C757.31 402.61 772.13 402.04 781.71 401.5C791.29 400.96 805.34 400.45 814.71 399.5C824.08 398.55 837.72 401.56 843.41 393.2C849.1 384.84 855.51 383.32 863.71 378.5Z" fill={getStateFill('tn')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('tn')} style={{ cursor: 'pointer' }}/>
          <text
            x="806"
            y="382"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            TN
          </text>
          <path id="ok" d="M534.71 428.5C537.97 428.93 541.48 427.92 544.71 428.5C548.19 428.79 550.8 431.71 552.71 434.5C560.2 434.72 568.92 435.54 576.7 435.51C584.48 435.48 593.54 439.23 600.71 434.5C607.88 429.77 619.47 441.18 623.71 437.5C621.54 435.11 624.58 424.69 624.71 422.5C624.51 417.36 623.71 412.78 623.71 407.5C623.71 403.51 623.86 399.49 623.71 395.5C623.4 387.46 623.9 365.91 615.71 362.5C605.6 359.88 591.21 362.5 580.71 362.5C571.26 362.5 561.35 361.14 551.71 361.5C542.07 361.86 531.11 361.72 521.71 361.5C512.31 361.28 501.67 360.89 492.71 360.5C483.76 360.11 471.46 361.42 463.71 359.5C455.96 357.58 442.17 362.08 450.04 367.17C457.91 372.26 468.02 366.21 476.71 368.5C485.4 370.79 495.99 366.95 504.01 371.2C512.04 375.44 508.04 389.78 508.71 396.5C509.38 403.22 503.57 418.63 513.02 420.19C522.46 421.76 525.98 427.34 534.71 428.5Z" fill={getStateFill('ok')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ok')} style={{ cursor: 'pointer' }}/>
          <text
            x="565"
            y="400"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            OK
          </text>
          <path id="tx" d="M441.71 444.5C441.71 450.41 442.26 456.62 441.71 462.5C443.88 482.39 426.01 484.86 410.73 482.48C395.46 480.09 378.87 480.63 362.71 479.5C367.11 489.45 373.29 495.5 382.63 502.58C391.97 509.66 398.01 515.06 400.72 527.49C403.42 539.92 411.34 541.24 422.49 548.72C433.63 556.21 438.53 541.85 446.49 535.28C454.44 528.71 471.21 534.36 478.48 540.73C485.75 547.1 492.68 556.54 495.94 566.27C499.2 576 509.98 581.29 514.94 590.27C519.9 599.25 519.18 613.21 528.46 619.75C537.75 626.28 550.03 625.79 559.71 630.5H565.71C563.62 619.77 558.52 606.3 562.94 595.73C567.36 585.16 573.26 579.37 581.63 572.42C590 565.47 600.59 565.6 608.46 558.25C616.34 550.9 621.58 543.87 632.63 540.42C643.69 536.98 643.19 520.48 644.71 510.5C646.23 500.53 636.24 489.1 634.71 479.5C633.42 471.37 635.72 462.68 634.71 454.5C633.82 443.73 623.32 446.67 615.94 441.27C608.56 435.88 597.17 442.12 589.38 442.17C581.59 442.22 572.11 440.63 564.4 440.81C556.7 440.98 549.06 438.24 543.71 432.5C535.49 435.94 527.51 431.12 520.93 427.28C514.36 423.44 504.76 425.57 502.71 415.5C501.82 411.13 502.41 404.96 502.71 400.5C503.03 395.77 503.71 391.45 503.71 386.5C503.71 383.47 504.57 379.03 502.71 376.5C499.19 373.09 489.7 373.6 484.71 373.5C480.66 373.42 476.03 372.82 472.71 372.5C464.35 372.5 445.92 368.62 444.71 379.5C443.5 390.38 443.78 401.47 443.71 412.5C443.64 423.53 441.71 433.54 441.71 444.5Z" fill={getStateFill('tx')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('tx')} style={{ cursor: 'pointer' }}/>
          <text
            x="530"
            y="505"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '28px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            TX
          </text>
          <path id="ar" d="M664.71 373.5C662.47 373.71 660.24 374.4 657.71 374.5C650.61 374.77 634.08 371.89 628.81 376.6C623.54 381.31 629.1 396.05 629.71 402.5C630.76 413.71 627.28 426.54 629.71 437.5C631.96 443.62 638.47 443.47 639.39 450.82C640.31 458.17 651.96 455.05 657.71 455.5C663.46 455.95 674.4 455.52 679.71 454.5C685.02 453.48 696.21 457.07 697.38 450.17C698.55 443.27 697.61 436.36 700.94 430.73C704.27 425.1 708.21 422.45 709.74 416.52C711.26 410.6 715.22 406.46 717.38 401.17C719.54 395.89 721.97 390.66 721.71 385.5C710.71 388.1 713.07 378.5 715.71 372.5C698.57 373 681.63 371.91 664.71 373.5Z" fill={getStateFill('ar')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ar')} style={{ cursor: 'pointer' }}/>
          <text
            x="672"
            y="415"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            AR
          </text>
          <path id="sc" d="M964.79 414.42C957.27 410.99 954.16 402.59 945.78 399.43C937.41 396.27 923.66 402.19 917.41 394.8C911.16 387.41 896.02 393.86 887.73 393.52C879.45 393.19 866.42 402.99 874.48 407.73C882.54 412.47 884.68 420.51 891.96 425.25C899.24 429.99 903.52 437.34 909.61 442.6C915.69 447.86 917.5 457.71 921.71 464.5C929.63 456.4 937.54 449.16 946.61 442.4C955.69 435.65 959.07 422.7 965.71 414.5L964.79 414.42Z" fill={getStateFill('sc')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('sc')} style={{ cursor: 'pointer' }}/>
          <text
            x="920"
            y="424"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            SC
          </text>
          <path id="ga" d="M864.71 401.5C851.87 401.42 840.26 402.08 827.71 403.5C815.16 404.92 825.18 419.68 825.73 429.48C826.29 439.27 831.66 447.99 834.74 458.48C837.81 468.96 835.66 478.03 836.71 490.5C837.76 502.97 849.01 505.2 861.71 503.5C874.41 501.8 886.52 504.04 898.71 504.5C897.59 494.2 914.06 498.25 913.38 489.17C912.7 480.09 921.3 474.31 918.02 467.19C914.73 460.08 911.47 453.66 907.48 447.73C903.48 441.81 896.52 438.32 892.96 432.25C889.39 426.19 879.86 424.93 877.63 417.58C875.41 410.22 862.2 411.71 864.71 401.5Z" fill={getStateFill('ga')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ga')} style={{ cursor: 'pointer' }}/>
          <text
            x="868"
            y="455"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            GA
          </text>
          <path id="al" d="M764.71 515.5C769.55 505.51 777.65 520.39 780.93 517.72C784.22 515.05 773.49 501.06 782.71 500.5C791.93 499.94 800.98 499.2 808.71 498.5C816.44 497.8 828 500.11 830.78 493.57C833.57 487.03 828.84 477.36 831.78 470.58C834.71 463.8 827.7 457.5 826.49 450.72C825.28 443.94 822.57 435.28 820.69 428.52C818.8 421.77 819.31 412.97 815 407.21C810.7 401.44 797.83 406.5 790.71 405.5C783.59 404.5 773.65 407.4 766.71 408.5C763.83 443.61 760.41 480.13 764.71 515.5Z" fill={getStateFill('al')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('al')} style={{ cursor: 'pointer' }}/>
          <text
            x="797"
            y="460"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '18px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            AL
          </text>
          <path id="ms" d="M738.71 520.5C746.19 518.08 761.64 519.67 759.69 508.52C757.73 497.38 758.11 487.48 757.71 476.5C757.31 465.52 759.66 455.6 759.38 445.17C759.1 434.74 764.37 423.02 760.68 412.53C757 402.03 741.29 412.19 731.71 409.5C722.13 406.81 715.53 415.04 712.46 423.25C709.39 431.47 700.37 436.3 701.93 446.28C703.49 456.26 705.24 466.74 705.69 476.48C706.13 486.21 694.94 490 695.49 499.28C696.04 508.56 711.96 504.21 721.71 503.5C731.46 502.79 735.62 511.22 737.71 520.5H738.71Z" fill={getStateFill('ms')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ms')} style={{ cursor: 'pointer' }}/>
          <text
            x="730"
            y="462"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '18px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            MS
          </text>
          <path id="la" d="M732.71 522.5C731.09 513.23 728.26 507.47 718.71 508.5C709.16 509.53 701.92 511.01 693.74 508.47C685.55 505.93 690.39 495.43 693.79 489.58C697.19 483.73 701.5 478.68 700.49 469.72C699.47 460.77 692.81 458.67 683.71 459.5C674.61 460.33 666.24 459.62 657.71 460.5C649.18 461.38 639.75 459.38 639.71 469.5C639.67 479.62 641.03 484.15 644.41 491.81C647.78 499.46 651.31 505.2 649.64 513.43C647.96 521.65 647.16 528.39 645.71 536.5C657.96 532.08 669.78 545.91 680.46 538.25C691.15 530.59 696.87 543.75 705.64 548.57C714.4 553.39 727.86 542.68 736.71 545.5C733.51 541.36 735.04 535.85 739.71 533.5C733.8 531.4 723.16 535.46 718.04 529.17C712.92 522.88 728.27 514.99 732.71 522.5Z" fill={getStateFill('la')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('la')} style={{ cursor: 'pointer' }}/>
          <text
            x="668"
            y="495"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            LA
          </text>
          <path id="fl" d="M891.71 508.5C878.98 506.22 863.68 508.5 850.71 508.5C839.11 508.46 831.12 500.23 818.71 502.5C806.3 504.77 795.81 503.04 783.71 505.5C784.41 509.27 787.25 512.4 786.71 516.5C796.04 514.36 811.37 513.96 819.46 518.75C827.56 523.54 835.25 534.48 843.96 526.75C852.67 519.03 861.67 517.12 869.01 525.2C876.35 533.27 881.19 535.45 889.46 542.75C897.72 550.06 889.52 561.01 890.71 569.5C905.57 564.58 892.81 580.43 898.94 587.27C905.07 594.11 910.63 601.66 914.79 609.42C918.94 617.19 931.16 619.47 931.71 630.5H938.71C951.43 622.49 954.23 596.77 946.02 583.2C937.8 569.62 937.11 551.44 926.63 539.58C916.16 527.71 919.47 505.43 903.71 501.5C905.77 514.04 899.65 512.34 891.71 508.5Z" fill={getStateFill('fl')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('fl')} style={{ cursor: 'pointer' }}/>
          <text
            x="920"
            y="580"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '18px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            FL
          </text>
          <path id="vt" d="M1061.71 164.5C1061.33 160.42 1060.47 151.52 1062.71 148.5C1062.71 148 1062.71 147.5 1062.71 147.5C1063.56 142.33 1066.03 132.31 1066.79 127.58C1067.55 122.85 1077.88 116.69 1071.45 111.76C1065.03 106.83 1059.98 114.83 1052.72 113.51C1045.45 112.18 1040.18 117.5 1042.93 124.28C1045.68 131.06 1042.82 138.45 1045.38 144.83C1047.95 151.21 1052.34 154.86 1050.72 162.49C1049.09 170.13 1062.24 172.27 1061.71 164.5Z" fill={getStateFill('vt')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('vt')} style={{ cursor: 'pointer' }}/>
          <line
            x1="1042"
            y1="89"
            x2="1056"
            y2="110"
            stroke="#F5E6B8"
            strokeWidth="0.8"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <text
            x="1032"
            y="83"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            VT
          </text>
          <path id="ny" d="M1020.71 208.5C1029.43 210.44 1031.67 215.05 1040.64 217.57C1049.6 220.09 1047.37 207.13 1046.71 199.5C1046.06 191.87 1047.04 178.66 1046.77 170.58C1046.51 162.5 1045.53 157.34 1041.63 149.58C1037.74 141.81 1039.36 135.41 1038.03 126.18C1036.7 116.95 1029.92 116.03 1021.72 118.51C1013.52 120.99 1006.83 121.17 1001.46 127.25C996.1 133.33 993.6 137.29 989.42 143.21C985.24 149.12 992.79 158.94 985.46 164.25C978.13 169.56 975.32 173.06 966.71 173.5C958.1 173.94 947.09 172.46 939.79 175.58C932.49 178.7 940 188.73 935.63 193.42C931.25 198.11 920.03 206.33 928.71 207.5C937.39 208.67 943.73 204.72 953.71 204.5C963.69 204.28 967.23 201.93 979.49 201.28C991.74 200.63 1016.58 189.62 1020.71 208.5Z" fill={getStateFill('ny')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('ny')} style={{ cursor: 'pointer' }}/>
          <text
            x="1015"
            y="160"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            NY
          </text>
          <path id="sd" d="M441.71 199.5C444.61 199.89 447.78 199.44 450.71 199.5C461.72 200.97 474.52 200.24 485.69 200.52C496.85 200.81 507.61 203.19 518.71 202.5C529.81 201.81 541.02 202.48 550.02 207.19C559.01 211.9 570.34 203.46 578.71 211.5C581.4 202.57 579.58 194.74 581.71 185.5C583.84 176.26 579.79 163.82 581.71 154.5C583.63 145.18 569.86 141.47 576.71 132.5C562.67 130.56 547.19 130.23 532.71 130.5C518.23 130.77 502.98 127.48 488.71 128.5C474.44 129.52 457.34 124.99 443.71 127.5C430.09 130.02 436.27 153.43 434.71 164.5C433.15 175.57 427.93 195.93 441.71 199.5Z" fill={getStateFill('sd')} stroke="#13171C" strokeWidth="0.4" onClick={() => handleStateClick('sd')} style={getStateStyle('sd')}/>
          <text
            x="506"
            y="168"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#F5E6B8"
            style={{
              fontFamily: "'The Seasons', serif",
              fontWeight: '600',
              fontSize: '20px',
              letterSpacing: '2px',
              pointerEvents: 'none'
            }}
          >
            SD
          </text>
        {/* STATE ICON COORDINATES - DO NOT DELETE
          TX: x="500" y="475" width="60" height="60"
          AR: x="445" y="395" width="36" height="36"
        */}
        </g>
      </svg>
      </div>

      {/* Map layer filters — sit below the map, aligned to its left edge */}
      <div className="map-filters">
        <span className="map-filters-label">Territories</span>

        <div
          className={`map-filter-pill${selectedCategory === 'active' ? ' is-on' : ''}`}
          onClick={() => { setSelectedCategory(selectedCategory === 'active' ? null : 'active'); focusMap() }}
        >
          <span
            className="map-filter-dot"
            style={{
              backgroundColor: '#22c55e',
              boxShadow: selectedCategory === 'active' ? '0 0 8px rgba(34, 197, 94, 0.8)' : 'none'
            }}
          ></span>
          ACTIVE ({activeCount})
        </div>

        <div
          className={`map-filter-pill${selectedCategory === 'inactive' ? ' is-on' : ''}`}
          onClick={() => { setSelectedCategory(selectedCategory === 'inactive' ? null : 'inactive'); focusMap() }}
        >
          <span
            className="map-filter-dot"
            style={{
              backgroundColor: '#ef4444',
              boxShadow: selectedCategory === 'inactive' ? '0 0 8px rgba(239, 68, 68, 0.8)' : 'none'
            }}
          ></span>
          ON REQUEST ({inactiveCount})
        </div>
      </div>
    </div>
  )
}
