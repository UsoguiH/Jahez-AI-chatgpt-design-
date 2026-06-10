/* سِراج — tiny WebAudio synth (no assets) */
const SFX = (() => {
  let ctx = null;
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type = 'square', vol = 0.12, slide = 0) {
    try {
      const a = ac(), o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, a.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), a.currentTime + dur);
      g.gain.setValueAtTime(vol, a.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur);
    } catch (e) { /* audio unavailable */ }
  }
  function noise(dur, vol = 0.1) {
    try {
      const a = ac(), len = a.sampleRate * dur, buf = a.createBuffer(1, len, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = a.createBufferSource(), g = a.createGain();
      s.buffer = buf; g.gain.value = vol;
      s.connect(g); g.connect(a.destination); s.start();
    } catch (e) { /* audio unavailable */ }
  }
  return {
    click()   { tone(660, .06, 'square', .07); },
    coin()    { tone(880, .07, 'square', .1); setTimeout(() => tone(1320, .12, 'square', .1), 60); },
    buy()     { tone(523, .08, 'triangle', .12); setTimeout(() => tone(784, .14, 'triangle', .12), 80); },
    deal()    { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .12, 'triangle', .11), i * 90)); },
    fail()    { tone(220, .2, 'sawtooth', .08, -80); },
    angry()   { tone(160, .18, 'sawtooth', .1, -40); },
    hit()     { noise(.08, .12); tone(180, .07, 'square', .08, -60); },
    hurt()    { noise(.14, .15); tone(120, .18, 'sawtooth', .12, -50); },
    pickup()  { tone(740, .06, 'square', .08); setTimeout(() => tone(988, .09, 'square', .08), 50); },
    dodge()   { tone(440, .08, 'sine', .07, 220); },
    door()    { tone(330, .1, 'triangle', .08, -90); },
    boss()    { [110, 110, 98].forEach((f, i) => setTimeout(() => tone(f, .3, 'sawtooth', .12), i * 250)); },
    smoke()   { noise(.5, .06); tone(660, .5, 'sine', .05, -300); },
    death()   { [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, .25, 'triangle', .1), i * 180)); },
    coffee()  { tone(587, .1, 'sine', .09); setTimeout(() => tone(880, .15, 'sine', .08), 100); },
  };
})();
