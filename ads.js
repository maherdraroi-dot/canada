// ─── ADS CONFIGURATION ──────────────────────────────────────────────────────
// Is file mein apne saare ads store karein
// Aap isme changes kar sakte hain bina server.js ko touch kiye

const AD_TOP = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; border-bottom:1px solid #eee;">
  <script>
    atOptions = {
      'key' : '72b6f3ac3fc2f43722e5f2196ef85add',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  <\/script>
  <script src="https://www.highperformanceformat.com/72b6f3ac3fc2f43722e5f2196ef85add/invoke.js"><\/script>
</div>
`;

const AD_MIDDLE = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; margin:20px 0; border:1px solid #eee; border-radius:8px;">
  <script>
    atOptions = {
      'key' : '72b6f3ac3fc2f43722e5f2196ef85add',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  <\/script>
  <script src="https://www.highperformanceformat.com/72b6f3ac3fc2f43722e5f2196ef85add/invoke.js"><\/script>
</div>
`;

const AD_BOTTOM = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; border-top:1px solid #eee; margin-top:20px;">
  <script>
    atOptions = {
      'key' : '72b6f3ac3fc2f43722e5f2196ef85add',
      'format' : 'iframe',
      'height' : 90,
      'width' : 728,
      'params' : {}
    };
  <\/script>
  <script src="https://www.highperformanceformat.com/72b6f3ac3fc2f43722e5f2196ef85add/invoke.js"><\/script>
</div>
`;

// ─── EXPORT ADS ──────────────────────────────────────────────────────────────
module.exports = {
  AD_TOP,
  AD_MIDDLE,
  AD_BOTTOM
};
