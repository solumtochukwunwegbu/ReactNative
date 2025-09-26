import React, { useState } from 'react';
import './login.css';

export default function LoginModal({ show, onLoginSuccess }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.identifier) errs.identifier = 'Username or email required';
    if (!form.password) errs.password = 'Password required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }

      const user = await res.json();
      sessionStorage.setItem('user', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      console.error('Login error:', err);
      setErrors({ password: err.message });
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <h2 className="modal-title">Login in to continue</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className={`modal-input ${errors.identifier ? 'input-error' : ''}`}
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="Username or Email"
            />
            {errors.identifier && <span className="error-text">{errors.identifier}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              className={`modal-input ${errors.password ? 'input-error' : ''}`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="modal-button">Login</button>
        </form>
      </div>
    </div>
  );
}
