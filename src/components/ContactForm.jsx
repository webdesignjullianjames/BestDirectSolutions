import { useState } from 'react'

export default function ContactForm({ inputStyle: customInputStyle, labelStyle: customLabelStyle, requiredStyle: customRequiredStyle, onApplicationTypeChange, onFreightQuoteChange } = {}) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    helpWith: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'helpWith') {
      if (onApplicationTypeChange) {
        onApplicationTypeChange(value === 'driveWithUs')
      }
      if (onFreightQuoteChange) {
        onFreightQuoteChange(value === 'freight')
      }
    }
  }

  const handleStartOver = () => {
    setSubmitted(false)
    setStep(1)
    setFormData({
      helpWith: '',
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
    if (onApplicationTypeChange) {
      onApplicationTypeChange(false)
    }
    if (onFreightQuoteChange) {
      onFreightQuoteChange(false)
    }
  }

  const isDriverApp = formData.helpWith === 'driveWithUs'
  const isGeneralInquiry = formData.helpWith === 'general'

  const validateStep1 = () => {
    if (!formData.helpWith || !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
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

  const validateStep2 = () => {
    if (isGeneralInquiry) return true
    if (isDriverApp) {
      return formData.cdlClass && formData.dotMedical && formData.startDate &&
             formData.loadExperience.length > 0 && formData.trafficViolations &&
             formData.drivingStatus && formData.drugTestConsent && formData.backgroundCheckConsent
    }
    return formData.pickupFrom && formData.pickupFromState &&
           formData.deliverTo && formData.deliverToState &&
           formData.pickupDate && formData.expectedDeliveryDate &&
           formData.loadWeight && formData.loadDimensions
  }

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
    setSubmitting(true)
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForNetlify({ 'form-name': 'contact', ...formData })
      })
      // Netlify answers 200 on success. Anything else means the submission did
      // not land, and the user must not be shown a thank-you for it.
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`)
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form submission failed:', err)
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

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateStep2()) {
      submitToNetlify()
    } else {
      alert('Please fill in all required fields on this page')
    }
  }

  const defaultInputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: 'rgba(25, 45, 70, 0.4)',
    border: '1px solid #C8A020',
    color: '#E8E8E8',
    borderRadius: '3px',
    fontSize: '14px',
    fontFamily: 'The Seasons, sans-serif',
    transition: 'all 0.2s'
  }

  const defaultLabelStyle = {
    display: 'block',
    fontSize: '12px',
    fontFamily: 'The Seasons, sans-serif',
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
          <p style={{ color: '#22C55E', fontFamily: 'The Seasons, sans-serif', fontWeight: '600', margin: '0 0 16px' }}>
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
              fontFamily: 'The Seasons, sans-serif',
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
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep() }} name="contact" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="contact" />

          {/* Step Indicator */}
          {formData.helpWith && (
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#C8A020', fontFamily: 'The Seasons, sans-serif', fontWeight: '700', margin: 0 }}>
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
              value={formData.helpWith}
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
          {formData.helpWith && (
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
                    <label key={type} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#E8E8E8', fontFamily: 'The Seasons, sans-serif', fontSize: '14px' }}>
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
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#E8E8E8', fontFamily: 'The Seasons, sans-serif', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.drugTestConsent}
                    onChange={() => handleConsentChange('drugTestConsent')}
                    style={{ marginRight: '8px', marginTop: '2px', width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                    required
                  />
                  <span>I consent to a drug test as part of the hiring process<span style={requiredStyle}>*</span></span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: '#E8E8E8', fontFamily: 'The Seasons, sans-serif', fontSize: '13px' }}>
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

          {step === 2 && (
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
          <div style={{ display: 'grid', gridTemplateColumns: formData.helpWith ? '1fr 1fr' : '1fr', gap: '12px', marginTop: '12px' }}>
            {formData.helpWith && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, helpWith: '' }))
                  setStep(1)
                  if (onApplicationTypeChange) {
                    onApplicationTypeChange(false)
                  }
                }}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(200, 160, 32, 0.2)',
                  color: '#C8A020',
                  border: '1px solid #C8A020',
                  borderRadius: '3px',
                  fontSize: '13px',
                  fontFamily: 'The Seasons, sans-serif',
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
              disabled={submitting || !formData.helpWith}
              style={{
                padding: '12px',
                backgroundColor: (submitting || !formData.helpWith) ? '#8A7420' : '#C8A020',
                color: '#0D0F12',
                border: 'none',
                borderRadius: '3px',
                fontSize: '13px',
                fontFamily: 'The Seasons, sans-serif',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: submitting ? 'wait' : (formData.helpWith ? 'pointer' : 'not-allowed'),
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { if (!submitting && formData.helpWith) e.target.style.backgroundColor = '#D4B96A' }}
              onMouseLeave={(e) => { if (!submitting && formData.helpWith) e.target.style.backgroundColor = '#C8A020' }}
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
