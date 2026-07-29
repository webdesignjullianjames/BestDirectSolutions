import { useState, useEffect, useRef } from 'react'

// The reCAPTCHA v2 site key, injected at build time from the Netlify env var of
// the same name. Public by design — it ships in the page for every visitor, so
// there is nothing to hide by keeping it in an env var; that is only so the key
// lives in one place alongside Netlify's SITE_RECAPTCHA_KEY / _SECRET rather
// than hardcoded. When it is absent (local dev, or a misconfigured deploy) the
// whole challenge is skipped and the form submits as it did before — the code
// below treats an empty key as "no reCAPTCHA on this build".
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

// `helpWith` is owned by the page, not by this component. The page swaps its
// hero image to match the chosen category and can preselect one from outside
// the form (the "Apply Now" banner, the ?type=freight deep link), so a single
// copy of that value upstream beats mirroring it and syncing the two.
export default function ContactForm({ inputStyle: customInputStyle, labelStyle: customLabelStyle, requiredStyle: customRequiredStyle, helpWith, onHelpWithChange } = {}) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    zipCode: '',
    pickupFrom: '',
    pickupFromState: '',
    deliverTo: '',
    deliverToState: '',
    pickupDate: '',
    expectedDeliveryDate: '',
    loadWeight: '',
    loadDimensions: '',
    message: '',
    yearsExperience: '',
    companiesDriven: '',
    driverNumber: '',
    cdlClass: '',
    dotMedical: '',
    startDate: '',
    loadExperience: [],
    trafficViolations: '',
    drivingStatus: '',
    drugTestConsent: false,
    backgroundCheckConsent: false
  })

  // Netlify's honeypot: a field no human ever sees, so anything that arrives
  // with it filled came from a bot and the submission is dropped server-side.
  // Kept out of formData so it never reaches the reset/validation logic.
  const [botField, setBotField] = useState('')

  // reCAPTCHA. The container is the empty div the widget is drawn into; the
  // widget ref holds the id grecaptcha.render returns, which getResponse and
  // reset are keyed to. Both are refs, not state — they hold handles to an
  // external system and must not trigger React re-renders.
  const recaptchaContainerRef = useRef(null)
  const recaptchaWidgetRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'helpWith') {
      onHelpWithChange(value)
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStartOver = () => {
    setSubmitted(false)
    setStep(1)
    setBotField('')
    onHelpWithChange('')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      city: '',
      state: '',
      zipCode: '',
      pickupFrom: '',
      pickupFromState: '',
      deliverTo: '',
      deliverToState: '',
      pickupDate: '',
      expectedDeliveryDate: '',
      loadWeight: '',
      loadDimensions: '',
      message: '',
      yearsExperience: '',
      companiesDriven: '',
      driverNumber: '',
      cdlClass: '',
      dotMedical: '',
      startDate: '',
      loadExperience: [],
      trafficViolations: '',
      drivingStatus: '',
      drugTestConsent: false,
      backgroundCheckConsent: false
    })
  }

  const isDriverApp = helpWith === 'driveWithUs'
  const isGeneralInquiry = helpWith === 'general'

  // The step that actually submits: general inquiries send from step 1, quotes
  // and driver applications from step 2. This is the only view where the
  // challenge belongs — drawing it earlier would ask people to prove they are
  // human before they have finished typing, and the token would have expired by
  // the time they reached the button.
  const isFinalStep = !!helpWith && (isGeneralInquiry ? step === 1 : step === 2)

  // Draw the reCAPTCHA widget once the final step is on screen. The API script
  // is loaded from index.html but may not have arrived yet, so this polls for
  // window.grecaptcha and renders as soon as it is ready. The childElementCount
  // guard keeps it from rendering twice into the same node — React's dev-mode
  // double-invoke, or a re-render, would otherwise trip grecaptcha's "already
  // rendered in this element" error.
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY || !isFinalStep) return

    let cancelled = false
    let pollTimer

    const render = () => {
      if (cancelled) return
      const el = recaptchaContainerRef.current
      const grecaptcha = window.grecaptcha
      if (el && grecaptcha?.render && el.childElementCount === 0) {
        recaptchaWidgetRef.current = grecaptcha.render(el, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: 'dark'
        })
        return
      }
      pollTimer = setTimeout(render, 200)
    }

    render()
    return () => {
      cancelled = true
      clearTimeout(pollTimer)
    }
  }, [isFinalStep])

  const validateStep1 = () => {
    if (!helpWith || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return false
    }

    if (!validateEmail(formData.email) || !validatePhone(formData.phone)) {
      return false
    }

    if (isDriverApp) {
      return formData.yearsExperience && formData.companiesDriven && formData.driverNumber
    } else if (isGeneralInquiry) {
      return formData.message
    } else {
      return formData.company && formData.city && formData.state && formData.zipCode
    }
  }

  // Returns the labels of every step-2 requirement still unmet, in the order
  // they appear on screen.
  //
  // The browser already enforces the step-2 controls that carry `required`, so
  // most of these can never actually be missing by the time this runs. Load &
  // Equipment Experience is the exception: `required` on a checkbox demands
  // that specific box, not one of a set, so a group cannot be expressed with
  // the attribute at all. An applicant who ticks none of the six clears native
  // validation, fails here, and used to be told only "please fill in all
  // required fields" — naming nothing, while every field they could see looked
  // complete. Reporting the actual labels is the difference between a form
  // that looks broken and one that tells you what it wants.
  const missingStep2Fields = () => {
    if (isGeneralInquiry) return []
    const requirements = isDriverApp
      ? [
          ['CDL Class', formData.cdlClass],
          ['DOT Medical Certificate Status', formData.dotMedical],
          ['Available Start Date', formData.startDate],
          ['Load & Equipment Experience', formData.loadExperience.length > 0],
          ['Traffic Violations (Past 5 Years)', formData.trafficViolations],
          ['Current Driving Status', formData.drivingStatus],
          ['Drug Test Consent', formData.drugTestConsent],
          ['Background Check Consent', formData.backgroundCheckConsent]
        ]
      : [
          ['Pickup From (City)', formData.pickupFrom],
          ['Pickup State', formData.pickupFromState],
          ['Deliver To (City)', formData.deliverTo],
          ['Delivery State', formData.deliverToState],
          ['Pickup Date', formData.pickupDate],
          ['Expected Delivery Date', formData.expectedDeliveryDate],
          ['Load Weight (lbs)', formData.loadWeight],
          ['Load Dimensions (L x W x H)', formData.loadDimensions]
        ]
    return requirements.filter(([, value]) => !value).map(([label]) => label)
  }

  const validateStep2 = () => missingStep2Fields().length === 0

  const handleCheckboxChange = (fieldName, value) => {
    setFormData(prev => {
      const updated = [...prev[fieldName]]
      if (updated.includes(value)) {
        return { ...prev, [fieldName]: updated.filter(v => v !== value) }
      } else {
        return { ...prev, [fieldName]: [...updated, value] }
      }
    })
  }

  const handleConsentChange = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))
  }

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPhoneError = () => {
    if (!formData.phone) return ''
    if (!validatePhone(formData.phone)) return 'Phone must be 10 digits'
    return ''
  }

  const getEmailError = () => {
    if (!formData.email) return ''
    if (!validateEmail(formData.email)) return 'Please enter a valid email address'
    return ''
  }

  // Netlify Forms accepts a urlencoded POST to any path on the site, provided
  // the body carries form-name matching a form Netlify detected at deploy time.
  // Detection happens by parsing static HTML, which it cannot do for a React
  // form — that is what public/_forms/contact.html exists to satisfy. Every key
  // sent here must also appear in that stub or Netlify discards it silently.
  const encodeForNetlify = (data) =>
    Object.keys(data)
      .map((key) => {
        const raw = data[key]
        const value = Array.isArray(raw)
          ? raw.join(', ')
          : typeof raw === 'boolean'
            ? (raw ? 'Yes' : 'No')
            : (raw ?? '')
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')

  const submitToNetlify = async () => {
    setSubmitError('')

    // Read the reCAPTCHA token before anything else. Gating here, client-side,
    // means an unchecked box never even POSTs — the visitor gets an immediate,
    // specific prompt instead of a round-trip that comes back a generic error.
    // Skipped entirely when no site key is configured, so unprotected builds
    // (local dev) submit exactly as before.
    let recaptchaToken = ''
    if (RECAPTCHA_SITE_KEY) {
      recaptchaToken = window.grecaptcha?.getResponse(recaptchaWidgetRef.current) || ''
      if (!recaptchaToken) {
        setSubmitError('Please complete the "I’m not a robot" check above before sending.')
        return
      }
    }

    setSubmitting(true)
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // helpWith is a prop rather than part of formData, so it has to be
        // merged in here — without it every submission would arrive with no
        // indication of whether it was a quote, an application or a question.
        // g-recaptcha-response is what Netlify validates against the secret; a
        // missing or bad token is rejected with a non-2xx, which is caught
        // below. It is not stored, so it is absent from the _forms stub.
        body: encodeForNetlify({
          'form-name': 'contact',
          'bot-field': botField,
          'g-recaptcha-response': recaptchaToken,
          helpWith,
          ...formData
        })
      })
      // With the form registered, Netlify handles this POST itself and answers
      // non-2xx when it rejects one — a failed reCAPTCHA comes back 422, a bad
      // request 400. Those are the signals worth trusting. (A bare 200 is still
      // NOT proof of success on this site: if form detection is ever switched
      // off in the dashboard, the POST falls through to the SPA catch-all and
      // returns 200 with no submission recorded. That case is invisible from
      // here by design — confirm receipt in Netlify's Active forms list, never
      // from the browser alone.)
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`)
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submission failed:', err)
      // Let the visitor try again with a fresh challenge — a spent or expired
      // token cannot be reused, so without this a retry would fail the gate.
      if (RECAPTCHA_SITE_KEY) window.grecaptcha?.reset(recaptchaWidgetRef.current)
      setSubmitError(
        'Something went wrong sending your message. Please try again, or email info@bestsolutions4you.com directly.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      if (isGeneralInquiry) {
        submitToNetlify()
      } else {
        setStep(2)
      }
    } else {
      alert('Please fill in all required fields on this page')
    }
  }

  // "Back" means two different things depending on where you are. On step 2 it
  // returns to step 1 with the category and every answered field intact. Only
  // on step 1 — where there is no earlier step — does it clear the category and
  // hand the visitor back to the selector.
  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      return
    }
    // Clearing the category also clears the page's hero image, now that both
    // read from the same value. The old version reset only the driver flag,
    // leaving a freight quote's banner stranded above an empty form.
    onHelpWithChange('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const missing = missingStep2Fields()
    if (missing.length === 0) {
      submitToNetlify()
      return
    }
    // Shown in the form's own error area rather than a browser alert: an alert
    // is dismissed before the applicant can look at the fields it names, and
    // on mobile it covers them entirely.
    setSubmitError(
      missing.length === 1
        ? `Please complete "${missing[0]}" before sending.`
        : `Please complete these before sending: ${missing.join(', ')}.`
    )
  }

  const defaultInputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(25, 45, 70, 0.4)',
    border: '1px solid #C8A020',
    color: '#E8E8E8',
    borderRadius: '3px',
    fontSize: '14px',
    fontFamily: "'The Seasons', serif",
    transition: 'all 0.2s'
  }

  const defaultLabelStyle = {
    display: 'block',
    fontSize: '12px',
    fontFamily: "'The Seasons', serif",
    fontWeight: '700',
    color: '#C8A020',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  const defaultRequiredStyle = {
    color: '#FF6B6B',
    marginLeft: '4px'
  }

  const inputStyle = customInputStyle || defaultInputStyle
  const labelStyle = customLabelStyle || defaultLabelStyle
  const requiredStyle = customRequiredStyle || defaultRequiredStyle

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#C8A020'
    e.target.style.boxShadow = '0 0 0 2px rgba(200, 160, 32, 0.1)'
  }

  const handleInputBlur = (e) => {
    e.target.style.borderColor = inputStyle.border?.includes('rgba') ? 'rgba(200, 160, 32, 0.2)' : '#C8A020'
    e.target.style.boxShadow = 'none'
  }

  return (
    <>
      {submitted ? (
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22C55E',
          borderRadius: '6px',
          padding: '24px 16px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#22C55E', fontFamily: "'The Seasons', serif", fontWeight: '600', margin: '0 0 16px' }}>
            Thank you for your message! We'll be in touch soon.
          </p>
          <button
            type="button"
            onClick={handleStartOver}
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              color: '#22C55E',
              border: '1px solid #22C55E',
              borderRadius: '3px',
              fontSize: '12px',
              fontFamily: "'The Seasons', serif",
              fontWeight: '700',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'}
          >
            Start Over
          </button>
        </div>
      ) : (
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep() }} name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="contact" />

          {/* Hidden from sight and from the tab order, and labelled so screen
              readers skip it too. Only a bot filling every field it finds will
              ever put anything here. */}
          <p style={{ display: 'none' }} aria-hidden="true">
            <label>
              Do not fill this out
              <input
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </label>
          </p>

          {/* Step Indicator */}
          {helpWith && (
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#C8A020', fontFamily: "'The Seasons', serif", fontWeight: '700', margin: 0 }}>
                {isGeneralInquiry ? 'General Inquiry' : `Step ${step} of ${isDriverApp ? 2 : 2}`}
              </p>
            </div>
          )}

          {step === 1 && (
            <>
              {/* How can we help you? - Dropdown */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              How can we help you?
              <span style={requiredStyle}>*</span>
            </label>
            <select
              name="helpWith"
              value={helpWith}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Please Select</option>
              <option value="freight">Freight Quote</option>
              <option value="driveWithUs">Drive with Us</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          {/* Everything below the selector is gated on it.

              Which fields are even relevant depends on the answer — a driver
              application, a freight quote and a general inquiry share almost
              nothing but name and email. Rendering all of them up front made
              the resting page a long scroll of questions most visitors would
              never answer. The form now asks one question, then builds itself
              around the reply. */}
          {helpWith && (
          <>
          {/* First Name & Last Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Name
              <span style={requiredStyle}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>First</div>
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
                <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Last</div>
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Email
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  style={{
                    ...inputStyle,
                    borderColor: getEmailError() ? '#FF6B6B' : inputStyle.borderColor
                  }}
                  required
                />
                {getEmailError() && (
                  <div style={{ fontSize: '11px', color: '#FF6B6B', marginTop: '4px' }}>
                    {getEmailError()}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>
                  Phone
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(XXX) XXX-XXXX"
                  style={{
                    ...inputStyle,
                    borderColor: getPhoneError() ? '#FF6B6B' : inputStyle.borderColor
                  }}
                  required
                />
                {getPhoneError() && (
                  <div style={{ fontSize: '11px', color: '#FF6B6B', marginTop: '4px' }}>
                    {getPhoneError()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isGeneralInquiry && (
            <>
              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  How Can We Help You?
                  <span style={requiredStyle}>*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Please tell us how we can assist you..."
                  style={{
                    ...inputStyle,
                    resize: 'none'
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                ></textarea>
              </div>
            </>
          )}

          {isDriverApp && step === 1 && (
            <>
              {/* Years of Experience */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Years of Experience
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="yearsExperience"
                  placeholder="e.g., 5"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Companies Driven For */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Companies Driven For / Independent
                  <span style={requiredStyle}>*</span>
                </label>
                <textarea
                  name="companiesDriven"
                  placeholder="List companies or write 'Independent'"
                  value={formData.companiesDriven}
                  onChange={handleChange}
                  rows="3"
                  style={{
                    ...inputStyle,
                    resize: 'none'
                  }}
                  required
                ></textarea>
              </div>

              {/* Driver Number */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Driver's License Number
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="driverNumber"
                  value={formData.driverNumber}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </>
          )}

          {isDriverApp && step === 2 && (
            <>
              {/* CDL Class */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  CDL Class
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="cdlClass"
                  value={formData.cdlClass}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select CDL Class</option>
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                  <option value="C">Class C</option>
                </select>
              </div>

              {/* DOT Medical Certificate Status */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  DOT Medical Certificate Status
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="dotMedical"
                  value={formData.dotMedical}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="valid">Valid</option>
                  <option value="expired">Expired</option>
                  <option value="notObtained">Not Obtained</option>
                </select>
              </div>

              {/* Start Date */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Available Start Date
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Load Experience */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Load & Equipment Experience
                  <span style={requiredStyle}>*</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['Flatbed', 'Dry Van', 'Reefer', 'Tanker', 'Heavy Haul', 'Oversized Load'].map((type) => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#E8E8E8', fontFamily: "'The Seasons', serif", fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        checked={formData.loadExperience.includes(type)}
                        onChange={() => handleCheckboxChange('loadExperience', type)}
                        style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Traffic Violations */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Traffic Violations (Past 5 Years)
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="trafficViolations"
                  value={formData.trafficViolations}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="1-2">1-2 Violations</option>
                  <option value="3+">3 or More Violations</option>
                </select>
              </div>

              {/* Current Driving Status */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  Current Driving Status
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="drivingStatus"
                  value={formData.drivingStatus}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="actively">Actively Looking</option>
                  <option value="employed">Currently Employed</option>
                  <option value="recentlyLeft">Recently Left Position</option>
                </select>
              </div>

              {/* Consents */}
              <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#E8E8E8', fontFamily: "'The Seasons', serif", fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.drugTestConsent}
                    onChange={() => handleConsentChange('drugTestConsent')}
                    style={{ marginRight: '8px', marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                    required
                  />
                  <span>I consent to a drug test as part of the hiring process<span style={requiredStyle}>*</span></span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#E8E8E8', fontFamily: "'The Seasons', serif", fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.backgroundCheckConsent}
                    onChange={() => handleConsentChange('backgroundCheckConsent')}
                    style={{ marginRight: '8px', marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                    required
                  />
                  <span>I consent to a background check<span style={requiredStyle}>*</span></span>
                </label>
              </div>
            </>
          )}

          {!isDriverApp && !isGeneralInquiry && (
            <>
              {/* Company */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              Company
              <span style={requiredStyle}>*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          {/* City, State, Zip */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  City
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  State
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  <option value="AL">AL</option>
                  <option value="AR">AR</option>
                  <option value="CO">CO</option>
                  <option value="GA">GA</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MO">MO</option>
                  <option value="MS">MS</option>
                  <option value="NC">NC</option>
                  <option value="NE">NE</option>
                  <option value="NM">NM</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TX">TX</option>
                  <option value="VA">VA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  Zip Code
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>
            </>
          )}
          </>
          )}
            </>
          )}

          {/* Freight-only. This block was previously gated on step alone, so a
              driver application on step 2 rendered the freight fields too —
              empty, and carrying the HTML `required` attribute. The browser
              runs native constraint validation before onSubmit fires, so it
              refused to submit and handleSubmit never ran: no POST, no alert,
              no error, just a tooltip on a field the applicant never filled in
              because it was never meant to be on their form. Every driver
              application was silently unsendable. */}
          {!isDriverApp && step === 2 && (
            <>
              {/* Pickup Location */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Pickup From (City)
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="pickupFrom"
                  value={formData.pickupFrom}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  State
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="pickupFromState"
                  value={formData.pickupFromState}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  <option value="AL">AL</option>
                  <option value="AR">AR</option>
                  <option value="CO">CO</option>
                  <option value="GA">GA</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MO">MO</option>
                  <option value="MS">MS</option>
                  <option value="NC">NC</option>
                  <option value="NE">NE</option>
                  <option value="NM">NM</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TX">TX</option>
                  <option value="VA">VA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Deliver To (City)
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="deliverTo"
                  value={formData.deliverTo}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  State
                  <span style={requiredStyle}>*</span>
                </label>
                <select
                  name="deliverToState"
                  value={formData.deliverToState}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                >
                  <option value="">Select</option>
                  <option value="AL">AL</option>
                  <option value="AR">AR</option>
                  <option value="CO">CO</option>
                  <option value="GA">GA</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MO">MO</option>
                  <option value="MS">MS</option>
                  <option value="NC">NC</option>
                  <option value="NE">NE</option>
                  <option value="NM">NM</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TX">TX</option>
                  <option value="VA">VA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Pickup Date
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Expected Delivery Date
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Load Details */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  Load Weight (lbs)
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="loadWeight"
                  value={formData.loadWeight}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Load Dimensions (L x W x H)
                  <span style={requiredStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="loadDimensions"
                  value={formData.loadDimensions}
                  onChange={handleChange}
                  placeholder="e.g., 40 x 20 x 8 ft"
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              style={{
                ...inputStyle,
                resize: 'none'
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            ></textarea>
          </div>
            </>
          )}

          {/* Button Container */}
          {/* reCAPTCHA. Only on the final step, and only when a site key is
              configured — an unprotected build renders nothing here and the
              submit gate above is skipped to match. The empty div is the mount
              point the widget effect draws into. */}
          {RECAPTCHA_SITE_KEY && isFinalStep && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <div ref={recaptchaContainerRef} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: helpWith ? '1fr 1fr' : '1fr', gap: '12px', marginTop: '12px' }}>
            {helpWith && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(200, 160, 32, 0.2)',
                  color: '#C8A020',
                  border: '1px solid #C8A020',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: "'The Seasons', serif",
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(200, 160, 32, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(200, 160, 32, 0.2)'}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              // Also disabled before a category is chosen: with only the
              // selector on screen, "please fill in all required fields" would
              // be a confusing thing to be told.
              disabled={submitting || !helpWith}
              style={{
                padding: '12px',
                backgroundColor: (submitting || !helpWith) ? '#8A7420' : '#C8A020',
                color: '#0D0F12',
                border: 'none',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: "'The Seasons', serif",
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: submitting ? 'wait' : (helpWith ? 'pointer' : 'not-allowed'),
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (!submitting && helpWith) e.target.style.backgroundColor = '#D4B96A' }}
              onMouseLeave={(e) => { if (!submitting && helpWith) e.target.style.backgroundColor = '#C8A020' }}
            >
              {submitting
                ? 'Sending...'
                : isGeneralInquiry ? 'Submit' : isDriverApp ? (step === 1 ? 'Next' : 'Submit Application') : (step === 1 ? 'Next' : 'Send Message')}
            </button>
          </div>

          {/* A failed send must be visible. Previously the form showed a
              thank-you unconditionally, so a dropped submission looked
              identical to a successful one. */}
          {submitError && (
            <p role="alert" style={{
              margin: '14px 0 0 0',
              padding: '10px 12px',
              borderRadius: '3px',
              border: '1px solid rgba(220, 90, 90, 0.5)',
              backgroundColor: 'rgba(220, 90, 90, 0.12)',
              color: '#F0C9C9',
              fontFamily: "'The Seasons', serif",
              fontSize: '12.5px',
              lineHeight: '1.5'
            }}>
              {submitError}
            </p>
          )}
        </form>
      )}
    </>
  )
}
