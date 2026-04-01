'use client';

import { useState, useEffect, useRef } from 'react';
import { PASSWORD } from '../lib/api';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem('atlas_app_auth', '1');
      onLogin();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-card__logo">Atlas Platform</div>
        <div className="login-card__sub">Internal dashboard</div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            className="login-card__input"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
          />
          <button type="submit" className="login-card__btn">Sign In</button>
          <div className={`login-card__error${error ? ' visible' : ''}`}>
            Incorrect password
          </div>
        </form>
      </div>
    </div>
  );
}
