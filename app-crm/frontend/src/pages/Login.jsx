import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Login attempt:', { email, password });
    // Navigate to a dashboard or home page after login
    // navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-blob blob-1"></div>
      <div className="auth-bg-blob blob-2"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your CRM dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex-end margin-bottom-md">
            <a href="#" className="auth-link" style={{ fontSize: '0.875rem' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary btn-icon">
            Sign In
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
