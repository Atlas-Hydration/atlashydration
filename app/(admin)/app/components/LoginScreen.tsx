'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PASSWORD } from '../lib/api';

interface LoginScreenProps {
  onLogin: () => void;
}

/* ── WebGL starfield / galaxy ── */
function initStarfield(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return null;

  const STAR_COUNT = 1800;
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const speeds = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);
  const twinkle = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = Math.random() * 3;
    sizes[i] = Math.random() * 3 + 0.5;
    speeds[i] = Math.random() * 0.3 + 0.05;
    twinkle[i] = Math.random() * Math.PI * 2;
    // Color variation: white, blue-white, warm white
    const colorType = Math.random();
    if (colorType < 0.4) {
      colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.7) {
      colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.85) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.7;
    } else {
      colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
    }
  }

  const vsrc = `
    attribute vec3 aPos;
    attribute float aSize;
    attribute float aSpeed;
    attribute vec3 aColor;
    attribute float aTwinkle;
    uniform float uTime;
    uniform vec2 uRes;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      float z = mod(aPos.z + uTime * aSpeed, 3.0);
      float depth = 1.0 / (z + 0.5);
      float x = aPos.x * depth;
      float y = aPos.y * depth * (uRes.x / uRes.y);
      gl_Position = vec4(x, y, 0.0, 1.0);
      gl_PointSize = aSize * depth * min(uRes.x, uRes.y) / 800.0;
      vAlpha = (1.0 - z / 3.0) * (0.5 + 0.5 * sin(uTime * 1.5 + aTwinkle));
      vColor = aColor;
    }
  `;
  const fsrc = `
    precision mediump float;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float glow = exp(-d * d * 3.0);
      gl_FragColor = vec4(vColor, vAlpha * glow);
    }
  `;

  function compile(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  function buf(attr: string, data: Float32Array, size: number) {
    const b = gl!.createBuffer();
    gl!.bindBuffer(gl!.ARRAY_BUFFER, b);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
    const loc = gl!.getAttribLocation(prog, attr);
    gl!.enableVertexAttribArray(loc);
    gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
  }

  buf('aPos', positions, 3);
  buf('aSize', sizes, 1);
  buf('aSpeed', speeds, 1);
  buf('aColor', colors, 3);
  buf('aTwinkle', twinkle, 1);

  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uRes = gl.getUniformLocation(prog, 'uRes');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  let raf = 0;
  const start = performance.now();

  function frame() {
    const t = (performance.now() - start) / 1000;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.uniform1f(uTime, t);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.drawArrays(gl!.POINTS, 0, STAR_COUNT);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => cancelAnimationFrame(raf);
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      return initStarfield(canvasRef.current) ?? undefined;
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      sessionStorage.setItem('atlas_app_auth', '1');
      onLogin();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  }, [password, onLogin]);

  return (
    <div className="login-screen login-screen--galaxy">
      <canvas ref={canvasRef} className="login-galaxy-canvas" />

      {/* Nebula glow overlays */}
      <div className="login-nebula login-nebula--1" />
      <div className="login-nebula login-nebula--2" />
      <div className="login-nebula login-nebula--3" />

      <div className="login-card login-card--premium">
        <div className="login-card__glow" />

        <div className="login-card__logo-wrap">
          <img src="/logo.svg" alt="Atlas Hydration" className="login-card__logo-img" />
        </div>

        <div className="login-card__sub">Internal Dashboard</div>

        <form onSubmit={handleSubmit}>
          <div className={`login-field${focused ? ' login-field--focused' : ''}`}>
            <svg className="login-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              ref={inputRef}
              type="password"
              className="login-card__input"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          <button type="submit" className="login-card__btn login-card__btn--glow">
            <span className="login-card__btn-text">Sign In</span>
            <svg className="login-card__btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className={`login-card__error${error ? ' visible' : ''}`}>
            Incorrect password
          </div>
        </form>

        <div className="login-card__footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Secured with end-to-end encryption</span>
        </div>
      </div>
    </div>
  );
}
