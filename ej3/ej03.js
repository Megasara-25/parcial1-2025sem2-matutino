
const DIGIT_TO_SEGMENTS = {
  0: ['a','b','c','d','e','f'],
  1: ['b','c'],
  2: ['a','b','g','e','d'],
  3: ['a','b','g','c','d'],
  4: ['f','g','b','c'],
  5: ['a','f','g','c','d'],
  6: ['a','f','e','d','c','g'],
  7: ['a','b','c'],
  8: ['a','b','c','d','e','f','g'],
  9: ['a','b','c','d','f','g']
};
function setDigit(n){
  document.querySelectorAll('.segment').forEach(el => el.classList.remove('on'));
  const segs = DIGIT_TO_SEGMENTS[n] || [];
  for (const s of segs) {
    const el = document.getElementById('seg-' + s);
    if (el) el.classList.add('on');
  }
}

export function showRandomDigit() {
  const n = Math.floor(Math.random() * 10); // 0..9
  setDigit(n);
  console.log('Mostrando dígito:', n);
}

window.showRandomDigit = showRandomDigit;
document.addEventListener('DOMContentLoaded', () => setDigit(8));
