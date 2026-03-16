import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // In a real app, this would call an API
    console.log('Registration attempt:', formData);
    // Navigate to login or auto-login
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-blob blob-1" style={{ background: '#ec4899', left: 'auto', right: '-100px', top: '-50px' }}></div>
      <div className="auth-bg-blob blob-2" style={{ background: '#6366f1', bottom: '-50px', left: '-50px', right: 'auto' }}></div>
      
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the CRM platform to manage your workflow</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  type="text"
                  className="form-input form-input-icon"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="company">Company</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Building size={18} />
                </div>
                <input
                  id="company"
                  type="text"
                  className="form-input form-input-icon"
                  placeholder="Acme Inc"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                className="form-input form-input-icon"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                className="form-input form-input-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className="form-input form-input-icon"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-icon">
            Create Account
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
