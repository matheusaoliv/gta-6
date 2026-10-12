/* Hero em WebGL: dissolve "nascer do sol", miragem de calor, aberração cromática,
   parallax de mouse, vazamento de luz e grão — com fallback para a <img>. */
(function () {
  'use strict';

  var VERT = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D uTex;',
    'uniform vec2 uRes;',
    'uniform vec2 uImg;',
    'uniform vec2 uFocus;',
    'uniform vec2 uMouse;',
    'uniform float uTime;',
    'uniform float uReveal;',
    'uniform float uScroll;',

    'float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float noise(vec2 p){',
    '  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }',

    'vec2 cover(vec2 uv){',
    '  float rs = uRes.x / uRes.y; float ri = uImg.x / uImg.y;',
    '  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);',
    '  return uv * s + (1.0 - s) * uFocus;',
    '}',

    'void main(){',
    '  vec2 uv = vUv;',
    '  float zoom = 1.045 + uScroll * 0.16 + (1.0 - uReveal) * 0.12;',
    '  vec2 p = (uv - 0.5) / zoom + 0.5;',
    '  p -= uMouse * 0.014 / zoom;',
    // miragem de calor: mais forte no céu e no horizonte
    '  float shimmerMask = smoothstep(0.25, 0.6, uv.y) * (1.0 - smoothstep(0.85, 1.0, uv.y));',
    '  vec2 w = vec2(fbm(p * vec2(4.0, 14.0) + vec2(0.0, -uTime * 0.45)), fbm(p * vec2(5.0, 9.0) + vec2(uTime * 0.2, 0.0))) - 0.5;',
    '  p += w * 0.0045 * shimmerMask;',
    // aberração cromática
    '  vec2 dir = uv - 0.5;',
    '  float ca = 0.0012 + 0.008 * (1.0 - uReveal) + 0.012 * uScroll + length(uMouse) * 0.0015;',
    '  float r = texture2D(uTex, cover(p + dir * ca)).r;',
    '  float g = texture2D(uTex, cover(p)).g;',
    '  float b = texture2D(uTex, cover(p - dir * ca)).b;',
    '  vec3 col = vec3(r, g, b);',
    // gradação: contraste e saturação levemente elevados
    '  float l = dot(col, vec3(0.299, 0.587, 0.114));',
    '  col = mix(vec3(l), col, 1.1);',
    '  col = (col - 0.5) * 1.04 + 0.5;',
    // vazamento de luz quente
    '  float leak = 1.0 - smoothstep(0.0, 0.95, distance(uv, vec2(0.12 + 0.08 * sin(uTime * 0.21), 1.06)));',
    '  float leak2 = 1.0 - smoothstep(0.0, 0.8, distance(uv, vec2(0.95, 0.0 + 0.05 * cos(uTime * 0.17))));',
    '  col += vec3(1.0, 0.42, 0.55) * leak * 0.16 + vec3(1.0, 0.62, 0.3) * leak2 * 0.08;',
    // vinheta + escurecer no scroll
    '  float vig = 1.0 - smoothstep(0.35, 1.2, length(dir * vec2(1.35, 1.0)));',
    '  col *= mix(0.62, 1.0, vig);',
    '  col *= 1.0 - uScroll * 0.55;',
    // dissolve de entrada (de baixo para cima, com borda incandescente)
    '  if (uReveal < 0.999) {',
    '    float n = fbm(uv * vec2(3.2, 2.4) + 7.0) * 0.62 + (1.0 - uv.y) * 0.38;',
    '    float edge = mix(1.12, -0.25, uReveal);',
    '    float show = smoothstep(edge - 0.06, edge + 0.02, n);',
    '    float burn = smoothstep(edge - 0.16, edge - 0.04, n) * (1.0 - show);',
    '    vec3 base = vec3(0.07, 0.0, 0.12);',
    '    col = mix(base, col, show) + mix(vec3(1.0, 0.31, 0.6), vec3(1.0, 0.77, 0.42), uv.y) * burn * 1.4;',
    '  }',
    // grão de filme
    '  col += (hash(uv * uRes + fract(uTime * 7.0) * 100.0) - 0.5) * 0.045;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('Shader: ' + log);
    }
    return s;
  }

  function HeroGL(canvas, img, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.img = img;
    this.focus = opts.focus || [0.5, 0.7];
    this.state = { reveal: 0, scroll: 0, mx: 0, my: 0, tx: 0, ty: 0 };
    this.running = false;
    this.visible = true;
    this.start = performance.now();
    this._raf = this._raf.bind(this);
    this._resize = this._resize.bind(this);

    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' }) ||
             canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL indisponível');
    this.gl = gl;

    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('Link: ' + gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    this.prog = prog;

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.u = {};
    var names = ['uTex', 'uRes', 'uImg', 'uFocus', 'uMouse', 'uTime', 'uReveal', 'uScroll'];
    for (var i = 0; i < names.length; i++) this.u[names[i]] = gl.getUniformLocation(prog, names[i]);

    this.tex = gl.createTexture();
    this.setImage(img);

    var self = this;
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      self.stop();
      if (opts.onLost) opts.onLost();
    });

    window.addEventListener('resize', this._resize);
    this._resize();
  }

  HeroGL.prototype.setImage = function (img) {
    var gl = this.gl;
    this.img = img;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.imgW = img.naturalWidth || img.width;
    this.imgH = img.naturalHeight || img.height;
  };

  HeroGL.prototype._resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    var h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (!this.running) this.render();
  };

  HeroGL.prototype.setMouse = function (x, y) { this.state.tx = x; this.state.ty = y; };
  HeroGL.prototype.setScroll = function (v) { this.state.scroll = v; if (!this.running) this.render(); };
  HeroGL.prototype.setReveal = function (v) { this.state.reveal = v; if (!this.running) this.render(); };
  HeroGL.prototype.setVisible = function (v) {
    this.visible = v;
    if (v) this.play(); else this.stop();
  };

  HeroGL.prototype.render = function () {
    var gl = this.gl, s = this.state, u = this.u;
    s.mx += (s.tx - s.mx) * 0.06;
    s.my += (s.ty - s.my) * 0.06;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.uniform1i(u.uTex, 0);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uImg, this.imgW, this.imgH);
    gl.uniform2f(u.uFocus, this.focus[0], this.focus[1]);
    gl.uniform2f(u.uMouse, s.mx, s.my);
    gl.uniform1f(u.uTime, (performance.now() - this.start) / 1000);
    gl.uniform1f(u.uReveal, s.reveal);
    gl.uniform1f(u.uScroll, s.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  HeroGL.prototype._raf = function () {
    if (!this.running) return;
    this.render();
    this._id = requestAnimationFrame(this._raf);
  };

  HeroGL.prototype.play = function () {
    if (this.running || !this.visible || document.hidden) return;
    this.running = true;
    this._id = requestAnimationFrame(this._raf);
  };

  HeroGL.prototype.stop = function () {
    this.running = false;
    if (this._id) cancelAnimationFrame(this._id);
  };

  window.HeroGL = HeroGL;
})();
