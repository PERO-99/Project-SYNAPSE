const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Regex to find all spans with class flag that contain an emoji
let replaced = html.replace(/<span class="flag">(.*?)<\/span>/g, (match, p1) => {
  // A flag emoji consists of two Regional Indicator Symbol characters.
  // We can convert these to the two-letter country code.
  if (p1.length >= 4) { // flag emojis are usually 4 bytes (2 surrogate pairs)
    const c1 = p1.codePointAt(0);
    // Find the second codepoint. Surrogate pairs mean the second codepoint is at index 2.
    // Let's iterate codepoints properly.
    let codepoints = [];
    for (let cp of p1) {
      codepoints.push(cp.codePointAt(0));
    }
    if (codepoints.length >= 2) {
      const cc1 = codepoints[0];
      const cc2 = codepoints[1];
      // Regional indicators are U+1F1E6 (A) to U+1F1FF (Z)
      if (cc1 >= 0x1F1E6 && cc1 <= 0x1F1FF && cc2 >= 0x1F1E6 && cc2 <= 0x1F1FF) {
        const cc = String.fromCharCode(cc1 - 0x1F1E6 + 97) + String.fromCharCode(cc2 - 0x1F1E6 + 97);
        return `<img src="https://flagcdn.com/w40/${cc}.png" alt="" width="24" style="border-radius:2px; vertical-align:middle; margin-right:4px;">`;
      }
    }
  }
  return match;
});

fs.writeFileSync('index.html', replaced);
console.log('Done!');
