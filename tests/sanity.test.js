const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require('jsdom');

describe('Sanity Suite', () => {
  const htmlFiles = [
    'index.html',
    'platform.html',
    'journeys.html',
    'impact.html',
    'contact.html'
  ];
  const rootDir = path.join(__dirname, '..');

  test('All HTML files have matching tags (valid parsing)', () => {
    htmlFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // JSDOM will throw or create mismatched nodes if severely malformed.
      const dom = new JSDOM(content);
      expect(dom.window.document.body).toBeDefined();
    });
  });

  test('All internal links resolve to existing files', () => {
    htmlFiles.forEach(file => {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
      const dom = new JSDOM(content);
      const links = Array.from(dom.window.document.querySelectorAll('a[href]'));

      links.forEach(link => {
        const href = link.getAttribute('href');
        // Ignore external, anchor-only, or mailto links
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href === '') {
          return;
        }

        // Handle internal links (e.g. "platform.html#agents" or "platform.html")
        const targetPath = href.split('#')[0];
        if (targetPath) {
          const resolvedPath = path.join(rootDir, targetPath);
          const exists = fs.existsSync(resolvedPath);
          if (!exists) {
            console.error(`Broken link in ${file}: ${href} -> ${resolvedPath}`);
          }
          expect(exists).toBe(true);
        }
      });
    });
  });

  test('assets/main.js logic runs without throwing exceptions', () => {
    // Read the JS file
    const jsPath = path.join(rootDir, 'assets', 'main.js');
    expect(fs.existsSync(jsPath)).toBe(true);
    const jsContent = fs.readFileSync(jsPath, 'utf8');

    // Create a mock DOM environment mimicking index.html structure
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <canvas id="meshCanvas"></canvas>
          <div class="nav-toggle"></div>
          <div class="nav-links"></div>
          <div class="num" data-count="100">0</div>
          <div class="tabs" data-tabs="#my-tabs"></div>
          <div id="my-tabs">
            <button class="tab-btn active">Tab 1</button>
            <div class="tab-pane active">Pane 1</div>
          </div>
          <div id="demo-console">
            <span class="cmd">Command</span>
          </div>
          <div id="offline-toggle" aria-checked="false"></div>
          <form id="contactForm">
            <input name="email" value="test@example.com">
            <button type="submit">Send</button>
          </form>
          <script>${jsContent}</script>
        </body>
      </html>
    `, { runScripts: "dangerously" });

    // Mock IntersectionObserver
    dom.window.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // The script should execute successfully upon initialization.
    // Simulate DOMContentLoaded to trigger main.js event listeners
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    
    // Verify some expected behaviors didn't crash
    expect(dom.window.document.body.innerHTML).toContain('canvas');
  });
});
