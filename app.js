/**
 * NovaCalc - Modern Scientific Calculator Engine
 * Features:
 * - Dynamic Expression Evaluation with live preview
 * - Scientific Functions (Trig DEG/RAD, Log, Sqrt, Exponent, Factorial, etc.)
 * - Memory Registers (MC, MR, M+, M-, MS)
 * - Web Audio API Synthetic Haptic Clicks
 * - History Tape with LocalStorage Persistence
 * - Multi-Theme Glassmorphism Switcher
 * - Physical Keyboard Synchronization with UI feedback
 */

class SoundController {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick(type = 'normal') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      if (type === 'equals') {
        // High, pleasant chime for calculation complete
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'clear') {
        // Soft drop click
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'operator') {
        // Crisp mid tone
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        // Soft subtle tactile mechanical click
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.03);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      }
    } catch {
      // Audio autoplay restrictions gracefully handled
    }
  }
}

class NovaCalculator {
  constructor() {
    this.expression = '';
    this.currentInput = '0';
    this.result = null;
    this.isEvaluated = false;
    this.angleMode = 'DEG'; // 'DEG' or 'RAD'
    this.memoryValue = 0;
    this.history = [];
    this.sound = new SoundController();

    this.initDOM();
    this.loadState();
    this.bindEvents();
    this.updateDisplay();
  }

  initDOM() {
    this.dom = {
      appContainer: document.querySelector('.app-container'),
      mainDisplay: document.getElementById('mainDisplay'),
      expressionDisplay: document.getElementById('expressionDisplay'),
      livePreviewDisplay: document.getElementById('livePreviewDisplay'),
      btnDegRad: document.getElementById('btnDegRad'),
      memoryIndicator: document.getElementById('memoryIndicator'),
      scientificPanel: document.getElementById('scientificPanel'),
      btnToggleSci: document.getElementById('btnToggleSci'),
      btnToggleSound: document.getElementById('btnToggleSound'),
      soundOnIcon: document.querySelector('.sound-on'),
      soundOffIcon: document.querySelector('.sound-off'),
      btnThemeMenu: document.getElementById('btnThemeMenu'),
      themeMenu: document.getElementById('themeMenu'),
      themeOptions: document.querySelectorAll('.theme-option'),
      btnToggleHistory: document.getElementById('btnToggleHistory'),
      historyDrawer: document.getElementById('historyDrawer'),
      btnCloseHistory: document.getElementById('btnCloseHistory'),
      btnClearHistory: document.getElementById('btnClearHistory'),
      historyList: document.getElementById('historyList'),
      historyCounter: document.getElementById('historyCounter'),
      btnCopyResult: document.getElementById('btnCopyResult'),
      toast: document.getElementById('toast'),
      currentModeBadge: document.getElementById('currentModeBadge'),
    };
  }

  loadState() {
    // Theme
    const savedTheme = localStorage.getItem('novacalc_theme') || 'midnight';
    this.setTheme(savedTheme);

    // Sound
    const savedSound = localStorage.getItem('novacalc_sound');
    if (savedSound !== null) {
      this.sound.enabled = savedSound === 'true';
      this.updateSoundIcon();
    }

    // Angle Mode
    const savedAngle = localStorage.getItem('novacalc_angle') || 'DEG';
    this.angleMode = savedAngle;
    this.dom.btnDegRad.textContent = this.angleMode;

    // History
    try {
      const savedHistory = localStorage.getItem('novacalc_history');
      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        this.renderHistory();
      }
    } catch (e) {
      this.history = [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('novacalc_history', JSON.stringify(this.history));
    } catch (e) {}
    this.renderHistory();
  }

  bindEvents() {
    // Keypad Click Event Delegation
    document.querySelector('.keypad-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      this.handleButtonAction(btn);
    });

    // Scientific Grid Delegation
    document.querySelector('.sci-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      this.handleButtonAction(btn);
    });

    // Memory Toolbar Delegation
    document.querySelector('.memory-bar').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const memAction = btn.dataset.mem;
      this.handleMemory(memAction);
      this.sound.playClick('operator');
    });

    // Mode Toggle (Scientific)
    this.dom.btnToggleSci.addEventListener('click', () => {
      const isOpen = !this.dom.scientificPanel.classList.contains('hidden');
      if (isOpen) {
        this.dom.scientificPanel.classList.add('hidden');
        this.dom.appContainer.classList.remove('sci-mode-active');
        this.dom.btnToggleSci.classList.remove('active');
        this.dom.currentModeBadge.textContent = 'Standart';
      } else {
        this.dom.scientificPanel.classList.remove('hidden');
        this.dom.appContainer.classList.add('sci-mode-active');
        this.dom.btnToggleSci.classList.add('active');
        this.dom.currentModeBadge.textContent = 'Bilimsel';
      }
      this.sound.playClick('operator');
    });

    // Sound Toggle
    this.dom.btnToggleSound.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      localStorage.setItem('novacalc_sound', this.sound.enabled);
      this.updateSoundIcon();
      if (this.sound.enabled) this.sound.playClick('normal');
    });

    // Theme Selector
    this.dom.btnThemeMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dom.themeMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!this.dom.themeMenu.contains(e.target) && e.target !== this.dom.btnThemeMenu) {
        this.dom.themeMenu.classList.add('hidden');
      }
    });

    this.dom.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.dataset.themeVal;
        this.setTheme(theme);
        this.dom.themeMenu.classList.add('hidden');
        this.sound.playClick('normal');
      });
    });

    // DEG / RAD Toggle
    this.dom.btnDegRad.addEventListener('click', () => {
      this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
      this.dom.btnDegRad.textContent = this.angleMode;
      localStorage.setItem('novacalc_angle', this.angleMode);
      this.sound.playClick('normal');
      this.updateLivePreview();
    });

    // History Toggle & Drawer
    this.dom.btnToggleHistory.addEventListener('click', () => {
      this.dom.historyDrawer.classList.remove('hidden');
      this.sound.playClick('normal');
    });

    this.dom.btnCloseHistory.addEventListener('click', () => {
      this.dom.historyDrawer.classList.add('hidden');
      this.sound.playClick('normal');
    });

    this.dom.btnClearHistory.addEventListener('click', () => {
      this.history = [];
      this.saveHistory();
      this.sound.playClick('clear');
      this.showToast('İşlem geçmişi temizlendi');
    });

    // Copy Result
    this.dom.btnCopyResult.addEventListener('click', () => {
      const val = this.currentInput || '0';
      navigator.clipboard.writeText(val).then(() => {
        this.showToast(`Kopyalandı: ${val}`);
        this.sound.playClick('normal');
      }).catch(() => {
        this.showToast('Panoya kopyalanamadı');
      });
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('novacalc_theme', themeName);
    this.dom.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.themeVal === themeName);
    });
  }

  updateSoundIcon() {
    if (this.sound.enabled) {
      this.dom.soundOnIcon.classList.remove('hidden');
      this.dom.soundOffIcon.classList.add('hidden');
    } else {
      this.dom.soundOnIcon.classList.add('hidden');
      this.dom.soundOffIcon.classList.remove('hidden');
    }
  }

  handleButtonAction(btn) {
    const action = btn.dataset.action;
    const val = btn.dataset.val;
    const fn = btn.dataset.fn;

    // Visual button press animation
    btn.classList.add('pressed-visual');
    setTimeout(() => btn.classList.remove('pressed-visual'), 120);

    switch (action) {
      case 'digit':
        this.inputDigit(val);
        this.sound.playClick('normal');
        break;
      case 'decimal':
        this.inputDecimal();
        this.sound.playClick('normal');
        break;
      case 'operator':
        this.inputOperator(val);
        this.sound.playClick('operator');
        break;
      case 'insert':
        this.insertToken(val);
        this.sound.playClick('normal');
        break;
      case 'sci':
        this.handleSciFunction(fn);
        this.sound.playClick('operator');
        break;
      case 'negate':
        this.toggleSign();
        this.sound.playClick('normal');
        break;
      case 'clear-all':
        this.clearAll();
        this.sound.playClick('clear');
        break;
      case 'backspace':
        this.backspace();
        this.sound.playClick('normal');
        break;
      case 'equals':
        this.evaluateEquals();
        this.sound.playClick('equals');
        break;
    }

    this.updateDisplay();
  }

  inputDigit(digit) {
    if (this.isEvaluated) {
      this.currentInput = digit;
      this.expression = '';
      this.isEvaluated = false;
    } else {
      if (this.currentInput === '0' || this.currentInput === '') {
        this.currentInput = digit;
      } else {
        this.currentInput += digit;
      }
    }
    this.updateLivePreview();
  }

  inputDecimal() {
    if (this.isEvaluated) {
      this.currentInput = '0,';
      this.expression = '';
      this.isEvaluated = false;
    } else {
      if (!this.currentInput.includes(',')) {
        this.currentInput = (this.currentInput || '0') + ',';
      }
    }
    this.updateLivePreview();
  }

  inputOperator(op) {
    if (this.isEvaluated) {
      this.expression = this.currentInput + ' ' + op + ' ';
      this.currentInput = '';
      this.isEvaluated = false;
    } else {
      if (this.currentInput !== '') {
        this.expression += this.currentInput + ' ' + op + ' ';
        this.currentInput = '';
      } else if (this.expression !== '') {
        // Replace last operator
        this.expression = this.expression.trimEnd().replace(/[\+\−\×\÷\%\^]+$/, op) + ' ';
      }
    }
    this.updateLivePreview();
  }

  insertToken(token) {
    if (this.isEvaluated) {
      this.currentInput = token;
      this.expression = '';
      this.isEvaluated = false;
    } else {
      if (token === '(' || token === ')') {
        if (this.currentInput !== '' && this.currentInput !== '0') {
          this.expression += this.currentInput + ' ' + token + ' ';
          this.currentInput = '';
        } else {
          this.expression += token + ' ';
        }
      } else {
        // constants like π or e
        this.currentInput = token;
      }
    }
    this.updateLivePreview();
  }

  toggleSign() {
    if (this.currentInput === '0' || this.currentInput === '') return;
    if (this.currentInput.startsWith('-')) {
      this.currentInput = this.currentInput.slice(1);
    } else {
      this.currentInput = '-' + this.currentInput;
    }
    this.updateLivePreview();
  }

  backspace() {
    if (this.isEvaluated) {
      this.clearAll();
      return;
    }
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else if (this.currentInput.length === 1 && this.currentInput !== '0') {
      this.currentInput = '0';
    } else if (this.expression.length > 0) {
      this.expression = this.expression.trimEnd();
      const lastSpace = this.expression.lastIndexOf(' ');
      if (lastSpace !== -1) {
        this.expression = this.expression.substring(0, lastSpace + 1);
      } else {
        this.expression = '';
      }
    }
    this.updateLivePreview();
  }

  clearAll() {
    this.expression = '';
    this.currentInput = '0';
    this.isEvaluated = false;
    this.dom.livePreviewDisplay.textContent = '';
  }

  handleSciFunction(fn) {
    const num = this.parseCurrentNumber();
    if (isNaN(num)) return;

    let res = null;
    let label = '';

    switch (fn) {
      case 'sin':
        res = this.angleMode === 'DEG' ? Math.sin((num * Math.PI) / 180) : Math.sin(num);
        label = `sin(${this.currentInput})`;
        break;
      case 'cos':
        res = this.angleMode === 'DEG' ? Math.cos((num * Math.PI) / 180) : Math.cos(num);
        label = `cos(${this.currentInput})`;
        break;
      case 'tan':
        if (this.angleMode === 'DEG' && Math.abs(num % 180) === 90) {
          this.currentInput = 'Tanımsız';
          this.isEvaluated = true;
          return;
        }
        res = this.angleMode === 'DEG' ? Math.tan((num * Math.PI) / 180) : Math.tan(num);
        label = `tan(${this.currentInput})`;
        break;
      case 'log':
        if (num <= 0) { this.currentInput = 'Tanımsız'; this.isEvaluated = true; return; }
        res = Math.log10(num);
        label = `log(${this.currentInput})`;
        break;
      case 'ln':
        if (num <= 0) { this.currentInput = 'Tanımsız'; this.isEvaluated = true; return; }
        res = Math.log(num);
        label = `ln(${this.currentInput})`;
        break;
      case 'sqrt':
        if (num < 0) { this.currentInput = 'Geçersiz Giriş'; this.isEvaluated = true; return; }
        res = Math.sqrt(num);
        label = `√(${this.currentInput})`;
        break;
      case 'pow2':
        res = Math.pow(num, 2);
        label = `(${this.currentInput})²`;
        break;
      case 'inv':
        if (num === 0) { this.currentInput = '0\'a bölünemez'; this.isEvaluated = true; return; }
        res = 1 / num;
        label = `1/(${this.currentInput})`;
        break;
      case 'abs':
        res = Math.abs(num);
        label = `|${this.currentInput}|`;
        break;
      case 'fact':
        if (num < 0 || !Number.isInteger(num)) {
          this.currentInput = 'Geçersiz Giriş';
          this.isEvaluated = true;
          return;
        }
        if (num > 170) {
          res = Infinity;
        } else {
          let f = 1;
          for (let i = 2; i <= num; i++) f *= i;
          res = f;
        }
        label = `${num}!`;
        break;
    }

    if (res !== null) {
      const formatted = this.formatNumber(res);
      this.addToHistory(label, formatted);
      this.currentInput = formatted;
      this.isEvaluated = true;
    }
  }

  handleMemory(action) {
    const current = this.parseCurrentNumber();
    switch (action) {
      case 'mc':
        this.memoryValue = 0;
        this.showToast('Hafıza sıfırlandı');
        break;
      case 'mr':
        this.currentInput = this.formatNumber(this.memoryValue);
        this.showToast(`Hafızadan çağrıldı: ${this.currentInput}`);
        break;
      case 'm+':
        this.memoryValue += current;
        this.showToast(`Hafızaya eklendi (${this.formatNumber(this.memoryValue)})`);
        break;
      case 'm-':
        this.memoryValue -= current;
        this.showToast(`Hafızadan çıkarıldı (${this.formatNumber(this.memoryValue)})`);
        break;
      case 'ms':
        this.memoryValue = current;
        this.showToast(`Hafızaya kaydedildi: ${this.formatNumber(this.memoryValue)}`);
        break;
    }

    if (this.memoryValue !== 0) {
      this.dom.memoryIndicator.classList.remove('hidden');
    } else {
      this.dom.memoryIndicator.classList.add('hidden');
    }
  }

  parseCurrentNumber() {
    if (this.currentInput === 'π') return Math.PI;
    if (this.currentInput === 'e') return Math.E;
    return parseFloat(this.currentInput.replace(',', '.'));
  }

  buildComputableExpression(fullExp) {
    let str = fullExp
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e/g, `(${Math.E})`)
      .replace(/,/g, '.')
      .replace(/\^/g, '**');

    // Handle percentage like "50 + 10%" -> "50 + (50 * 0.10)" or "10%" -> "* 0.01"
    str = str.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    return str;
  }

  safeEvaluate(rawExp) {
    try {
      const computable = this.buildComputableExpression(rawExp);
      // Validate string to prevent unsafe execution
      if (!/^[0-9+\-*/().\s*MathPIE]+$/.test(computable.replace(/Math\.PI|Math\.E/g, ''))) {
        return null;
      }
      // Evaluate using Function constructor in strict mode
      const result = new Function(`'use strict'; return (${computable});`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }

  evaluateEquals() {
    const fullExp = (this.expression + (this.currentInput || '')).trim();
    if (!fullExp) return;

    const result = this.safeEvaluate(fullExp);
    if (result !== null) {
      const formatted = this.formatNumber(result);
      this.addToHistory(fullExp, formatted);
      this.expression = fullExp + ' =';
      this.currentInput = formatted;
      this.isEvaluated = true;
      this.dom.livePreviewDisplay.textContent = '';
    } else {
      this.currentInput = 'Hata';
      this.isEvaluated = true;
    }
  }

  updateLivePreview() {
    const fullExp = (this.expression + (this.currentInput || '')).trim();
    if (!fullExp || this.isEvaluated) {
      this.dom.livePreviewDisplay.textContent = '';
      return;
    }
    const result = this.safeEvaluate(fullExp);
    if (result !== null) {
      this.dom.livePreviewDisplay.textContent = `= ${this.formatNumber(result)}`;
    } else {
      this.dom.livePreviewDisplay.textContent = '';
    }
  }

  formatNumber(val) {
    if (typeof val !== 'number') return val;
    // Fix floating point issues
    const rounded = Number(Math.round(val + 'e+10') + 'e-10');
    let str = rounded.toString();
    return str.replace('.', ',');
  }

  updateDisplay() {
    this.dom.expressionDisplay.textContent = this.expression;
    this.dom.mainDisplay.textContent = this.currentInput || '0';

    // Auto-fit font size for long numbers
    const len = this.dom.mainDisplay.textContent.length;
    if (len > 14) {
      this.dom.mainDisplay.style.fontSize = '1.4rem';
    } else if (len > 10) {
      this.dom.mainDisplay.style.fontSize = '1.8rem';
    } else {
      this.dom.mainDisplay.style.fontSize = '2.35rem';
    }
  }

  addToHistory(expression, result) {
    this.history.unshift({
      id: Date.now(),
      exp: expression,
      res: result,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (this.history.length > 30) this.history.pop();
    this.saveHistory();
  }

  renderHistory() {
    const list = this.dom.historyList;
    const badge = this.dom.historyCounter;

    if (this.history.length === 0) {
      list.innerHTML = `
        <div class="history-empty">
          <div class="empty-icon">🕒</div>
          <p>Henüz hesaplama yapılmadı</p>
          <span class="empty-hint">Yaptığınız işlemler burada saklanır ve tıklayarak geri çağrılabilir.</span>
        </div>
      `;
      badge.classList.add('hidden');
      return;
    }

    badge.classList.remove('hidden');
    badge.textContent = this.history.length;

    list.innerHTML = this.history.map(item => `
      <div class="history-item" data-res="${item.res}" data-exp="${item.exp}">
        <span class="history-item-exp">${item.exp} =</span>
        <span class="history-item-res">${item.res}</span>
      </div>
    `).join('');

    list.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', () => {
        const res = el.dataset.res;
        this.currentInput = res;
        this.expression = '';
        this.isEvaluated = true;
        this.updateDisplay();
        this.dom.historyDrawer.classList.add('hidden');
        this.showToast(`İşlem yüklendi: ${res}`);
        this.sound.playClick('normal');
      });
    });
  }

  showToast(message) {
    const toast = this.dom.toast;
    toast.textContent = message;
    toast.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2200);
  }

  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key;

    if (/[0-9]/.test(key)) {
      e.preventDefault();
      this.inputDigit(key);
      this.sound.playClick('normal');
      this.simulateKeyVisual(`button[data-val="${key}"]`);
    } else if (key === ',' || key === '.') {
      e.preventDefault();
      this.inputDecimal();
      this.sound.playClick('normal');
      this.simulateKeyVisual('button[data-action="decimal"]');
    } else if (key === '+') {
      e.preventDefault();
      this.inputOperator('+');
      this.sound.playClick('operator');
      this.simulateKeyVisual('button[data-val="+"]');
    } else if (key === '-') {
      e.preventDefault();
      this.inputOperator('−');
      this.sound.playClick('operator');
      this.simulateKeyVisual('button[data-val="-"]');
    } else if (key === '*') {
      e.preventDefault();
      this.inputOperator('×');
      this.sound.playClick('operator');
      this.simulateKeyVisual('button[data-val="×"]');
    } else if (key === '/') {
      e.preventDefault();
      this.inputOperator('÷');
      this.sound.playClick('operator');
      this.simulateKeyVisual('button[data-val="÷"]');
    } else if (key === '%') {
      e.preventDefault();
      this.inputOperator('%');
      this.sound.playClick('operator');
      this.simulateKeyVisual('button[data-val="%"]');
    } else if (key === '^') {
      e.preventDefault();
      this.inputOperator('^');
      this.sound.playClick('operator');
    } else if (key === '(' || key === ')') {
      e.preventDefault();
      this.insertToken(key);
      this.sound.playClick('normal');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.evaluateEquals();
      this.sound.playClick('equals');
      this.simulateKeyVisual('#keyEquals');
    } else if (key === 'Backspace') {
      e.preventDefault();
      this.backspace();
      this.sound.playClick('normal');
      this.simulateKeyVisual('#keyBackspace');
    } else if (key === 'Escape') {
      e.preventDefault();
      this.clearAll();
      this.sound.playClick('clear');
      this.simulateKeyVisual('#keyAllClear');
    }

    this.updateDisplay();
  }

  simulateKeyVisual(selector) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.classList.add('pressed-visual');
      setTimeout(() => btn.classList.remove('pressed-visual'), 120);
    }
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new NovaCalculator();
});
