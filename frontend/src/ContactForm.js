import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: custom => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1 }
  })
}

// Styled Components (same as your original for brevity)
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
`

const FormSection = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
`

const InfoSection = styled(motion.div)`
  background: linear-gradient(135deg, #4568DC 0%, #B06AB3 100%);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    pointer-events: none;
  }

  @media (max-width: 968px) {
    display: none;
  }
`

const Title = styled(motion.h2)`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`

const Subtitle = styled(motion.p)`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 3rem;
`

const InfoTitle = styled(motion.h2)`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`

const InfoText = styled(motion.p)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const FeatureItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.1rem;

  &::before {
    content: '✓';
    margin-right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
  }
`

const InputGroup = styled(motion.div)`
  position: relative;
  margin-bottom: 2rem;
`

const FloatingLabel = styled.label`
  position: absolute;
  left: 1rem;
  top: ${props => props.focused || props.hasValue ? '-0.7rem' : '1rem'};
  font-size: ${props => props.focused || props.hasValue ? '0.8rem' : '1rem'};
  color: ${props => props.focused ? '#4568DC' : props.error ? '#e74c3c' : '#64748b'};
  background: ${props => props.focused || props.hasValue ? 'white' : 'transparent'};
  padding: 0 0.5rem;
  transition: all 0.2s ease;
  pointer-events: none;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.error ? '#e74c3c' : props.focused ? '#4568DC' : '#e0e0e0'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  outline: none;

  &:focus {
    border-color: #4568DC;
    box-shadow: 0 0 0 4px rgba(69, 104, 220, 0.1);
  }
`

const TextArea = styled(Input).attrs({ as: 'textarea' })`
  min-height: 150px;
  resize: vertical;
`

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4568DC 0%, #B06AB3 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;
  margin-top: 1rem;

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
`

const ErrorText = styled(motion.span)`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`

const Message = styled(motion.div)`
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 12px;
  text-align: center;
  background: ${props => props.error ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.error ? '#ef4444' : '#16a34a'};
  font-weight: 500;
`

const SocialLinks = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 0.8rem;
  justify-content: center;
`

const SocialLink = styled(motion.a)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  width: 70px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`

const SocialIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;

  svg {
    width: 18px;
    height: 18px;
  }
`

const SocialLabel = styled.span`
  font-size: 0.75rem;
  opacity: 0.9;
  text-align: center;
`

const features = [
    "Got a question? Just fill the form and we’ll get back to you shortly.",
    "Let’s talk! We’re always ready to help — drop your message.",
    "Want to work with us or ask something? Connect through this form!",
    "Don’t be shy — say hi! We’re just one message away."
  ];
  

  const socialLinks = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      label: 'Email',
      href: 'mailto:vishalrajmehra95@gmail.com'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234C5.662 21.302 5 19.153 5 19.153c-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604C6.108 17.493 3.306 16.464 3.306 10.867c0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 5.597-2.807 6.626-5.479 6.923.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      label: 'GitHub',
      href: 'https://github.com/vishalraj9102'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      label: 'LeetCode',
      href: 'https://leetcode.com/u/Vishal_raj9525/'
    }
  ];
  

// Reusable input field component
const AnimatedInputField = ({
  name, label, value, error, onChange, onFocus, onBlur, focused
}) => (
  <InputGroup
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    custom={name === "name" ? 4 : name === "email" ? 5 : 6}
  >
    <FloatingLabel focused={focused} hasValue={value.length > 0} error={error}>
      {label}
    </FloatingLabel>
    {name === 'message' ? (
      <TextArea name={name} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} error={error} focused={focused} />
    ) : (
      <Input name={name} type={name === "email" ? "email" : "text"} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} error={error} focused={focused} />
    )}
    <AnimatePresence>
      {error && (
        <ErrorText initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {error}
        </ErrorText>
      )}
    </AnimatePresence>
  </InputGroup>
)

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setMsg('')
    try {
      const res = await axios.post('http://localhost:5000/contact', form)
      setMsg(res.data.message)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setMsg('Something went wrong! Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFocus = (field) => () => setFocusedField(field)
  const handleBlur = () => setFocusedField(null)

  return (
    <PageContainer>
      <FormContainer initial="hidden" animate="visible">
        <FormSection>
          <Title variants={fadeInUp} custom={1}>Get in Touch</Title>
          <Subtitle variants={fadeInUp} custom={2}>We'd love to hear from you. Send us a message!</Subtitle>

          <form onSubmit={handleSubmit}>
            <AnimatedInputField
              name="name"
              label="Your Name"
              value={form.name}
              error={errors.name}
              onChange={handleChange}
              onFocus={handleFocus('name')}
              onBlur={handleBlur}
              focused={focusedField === 'name'}
            />
            <AnimatedInputField
              name="email"
              label="Your Email"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
              onFocus={handleFocus('email')}
              onBlur={handleBlur}
              focused={focusedField === 'email'}
            />
            <AnimatedInputField
              name="message"
              label="Your Message"
              value={form.message}
              error={errors.message}
              onChange={handleChange}
              onFocus={handleFocus('message')}
              onBlur={handleBlur}
              focused={focusedField === 'message'}
            />

            <Button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>

            <AnimatePresence>
              {msg && (
                <Message
                  error={msg.toLowerCase().includes('wrong')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {msg}
                </Message>
              )}
            </AnimatePresence>
          </form>
        </FormSection>

        <InfoSection variants={fadeInUp} custom={3}>
          <div>
            <InfoTitle>Why Choose Us?</InfoTitle>
            <InfoText>
            We make it easy for you to reach out. Just fill the form, and we’ll connect with you. Fast, friendly, and helpful — always!
            </InfoText>
            <FeatureList>
              {features.map((feature, i) => (
                <FeatureItem key={feature} variants={fadeInUp} custom={i + 1}>
                  {feature}
                </FeatureItem>
              ))}
            </FeatureList>
          </div>

          <SocialLinks>
            {socialLinks.map((link, i) => (
              <SocialLink 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                custom={i + 7}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <SocialIcon>{link.icon}</SocialIcon>
                <SocialLabel>{link.label}</SocialLabel>
              </SocialLink>
            ))}
          </SocialLinks>
        </InfoSection>
      </FormContainer>
    </PageContainer>
  )
}

export default ContactForm