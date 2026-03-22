import React, { useState, useCallback, useEffect } from 'react';
import './Login.css';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginProps {
  onLogin?: (credentials: LoginFormData) => Promise<void>;
}

export function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formData.username || !formData.password) return;

      setIsLoading(true);
      try {
        if (onLogin) {
          await onLogin(formData);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onLogin]
  );

  return (
    <div className="realm">
      {/* Left Side - Bold Visual */}
      <section 
        className="realm__visual"
        style={{
          '--mx': `${mousePos.x}%`,
          '--my': `${mousePos.y}%`,
        } as React.CSSProperties}
      >
        <div className="visual__void" />
        
        {/* Flowing Silk Waves */}
        <div className="silk">
          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="silk__svg">
            <defs>
              <linearGradient id="silk1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff0080" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#7928ca" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#ff0080" stopOpacity="0.4"/>
              </linearGradient>
              <linearGradient id="silk2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#7928ca" stopOpacity="0.3"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="15" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path className="silk__wave silk__wave--1" fill="url(#silk1)" filter="url(#glow)"/>
            <path className="silk__wave silk__wave--2" fill="url(#silk2)"/>
          </svg>
        </div>

        {/* Intense Glow Orbs */}
        <div className="glow-orbs">
          <div className="glow-orb glow-orb--hero" />
          <div className="glow-orb glow-orb--accent" />
          <div className="glow-orb glow-orb--subtle" />
        </div>

        {/* Floating Sparks */}
        <div className="sparks">
          {[...Array(20)].map((_, i) => (
            <span 
              key={i} 
              className="spark"
              style={{
                '--delay': `${Math.random() * 8}s`,
                '--x': `${10 + Math.random() * 80}%`,
                '--y': `${10 + Math.random() * 80}%`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Bold Content */}
        <div className="visual__content">
          <div className="hero-text">
            <span className="hero-text__pre">Welcome to</span>
            <h1 className="hero-text__title">
              <span className="hero-text__line">Time</span>
              <span className="hero-text__line hero-text__line--accent">Sheet</span>
            </h1>
            <div className="hero-text__divider">
              <span className="divider__line" />
              <span className="divider__dot" />
              <span className="divider__line" />
            </div>
            <p className="hero-text__tagline">Own Every Moment</p>
          </div>

          <div className="visual__cta">
            <div className="pulse-ring" />
            <div className="pulse-ring pulse-ring--delay" />
          </div>
        </div>

        {/* Vertical Accent */}
        <div className="visual__accent">
          <span className="accent-text">EST. 2024</span>
        </div>

        {/* Corner Flourish */}
        <div className="flourish flourish--top" />
        <div className="flourish flourish--bottom" />

        {/* Gradient Overlay */}
        <div className="visual__overlay" />
      </section>

      {/* Right Side - Login Form */}
      <section className="realm__form">
        <div className="form__ambient" />
        
        <div className="form__container">
          <header className="form__header">
            <h2 className="form__title">Welcome back</h2>
            <p className="form__subtitle">Enter your credentials to continue</p>
          </header>

          <form className="login" onSubmit={handleSubmit} noValidate>
            <div className={`field ${focusedField === 'username' ? 'field--focused' : ''} ${formData.username ? 'field--filled' : ''}`}>
              <label htmlFor="username" className="field__label">Username</label>
              <div className="field__input-wrap">
                <span className="field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="field__input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  autoComplete="username"
                />
                <div className="field__highlight" />
              </div>
            </div>

            <div className={`field ${focusedField === 'password' ? 'field--focused' : ''} ${formData.password ? 'field--filled' : ''}`}>
              <label htmlFor="password" className="field__label">Password</label>
              <div className="field__input-wrap">
                <span className="field__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="field__input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="field__toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                <div className="field__highlight" />
              </div>
            </div>

            <button
              type="submit"
              className={`submit ${isLoading ? 'submit--loading' : ''}`}
              disabled={isLoading || !formData.username || !formData.password}
            >
              <span className="submit__bg" />
              <span className="submit__glow" />
              <span className="submit__text">
                {isLoading ? (
                  <span className="submit__loader">
                    <span /><span /><span />
                  </span>
                ) : (
                  'Login'
                )}
              </span>
            </button>
          </form>
        </div>

        <div className="form__decor">
          <div className="decor__ring decor__ring--1" />
          <div className="decor__ring decor__ring--2" />
        </div>
      </section>
    </div>
  );
}

export default Login;
