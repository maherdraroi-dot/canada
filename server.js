const express = require('express');
const compression = require('compression');
const { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, canadaLocations, industries } = require('./jobData');

// ─── IMPORT ADS FROM SEPARATE FILE ─────────────────────────────────────────
const { AD_TOP, AD_MIDDLE, AD_BOTTOM } = require('./ads');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('public'));

// ── Helpers ──────────────────────────────────────────────────────────────────
const JOBS_PER_PAGE = 20;

function renderHTML({ title, meta, bodyContent, schema }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="google-site-verification" content="f_swjSKQxA8Dye1qCFyBXzBnhlnmJ2vPjFOPiLsvIvo" />
<title>${title}</title>
<meta name="description" content="${meta}"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${meta}"/>
<meta name="robots" content="index, follow"/>
${schema ? `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}<\/script>` : ''}
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#222;line-height:1.6}
a{color:inherit;text-decoration:none}
/* NAV */
nav{background:#d62828;color:#fff;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100}
nav .brand{font-size:1.25rem;font-weight:700;color:#fff}
nav .brand span{color:#ffd700}
nav .nav-links{display:flex;gap:1.5rem;font-size:0.85rem}
nav .nav-links a{color:rgba(255,255,255,0.8);transition:color .2s}
nav .nav-links a:hover{color:#ffd700}
/* HERO */
.hero{background:linear-gradient(135deg,#d62828 0%,#a01c1c 50%,#6b1212 100%);color:#fff;padding:3rem 1.5rem;text-align:center}
.hero h1{font-size:clamp(1.6rem,4vw,2.8rem);font-weight:800;margin-bottom:.75rem}
.hero h1 .accent{color:#ffd700}
.hero p{font-size:1rem;opacity:.85;margin-bottom:1.5rem;max-width:600px;margin-left:auto;margin-right:auto}
.stat-bar{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.5rem}
.stat{text-align:center}.stat strong{display:block;font-size:1.5rem;color:#ffd700}
.stat span{font-size:.8rem;opacity:.75}
/* SEARCH */
.search-bar{background:#fff;padding:1.25rem 1.5rem;border-bottom:1px solid #e0e0e0;display:flex;gap:.75rem;flex-wrap:wrap;max-width:960px;margin:0 auto}
.search-bar input,.search-bar select{flex:1;min-width:160px;padding:.6rem .9rem;border:1.5px solid #d0d0d0;border-radius:8px;font-size:.9rem;outline:none}
.search-bar input:focus,.search-bar select:focus{border-color:#d62828}
.search-bar button{padding:.6rem 1.4rem;background:#ffd700;color:#1a1a2e;border:none;border-radius:8px;cursor:pointer;font-weight:700;font-size:.9rem}
/* FILTERS */
.filter-row{background:#fff;border-bottom:1px solid #ebebeb;padding:.6rem 1.5rem;display:flex;gap:.5rem;flex-wrap:wrap;max-width:960px;margin:0 auto}
.filter-chip{padding:.35rem .85rem;border:1.5px solid #d0d0d0;border-radius:20px;font-size:.78rem;cursor:pointer;background:#fff;transition:all .2s;white-space:nowrap}
.filter-chip.active,.filter-chip:hover{background:#d62828;color:#fff;border-color:#d62828}
/* LAYOUT */
.container{max-width:960px;margin:0 auto;padding:1.5rem}
.page-grid{display:grid;grid-template-columns:1fr;gap:1rem}
/* JOB CARD */
.job-card{background:#fff;border-radius:12px;padding:1.25rem 1.5rem;border:1.5px solid #e8e8e8;transition:border-color .2s,transform .15s;display:flex;flex-direction:column;gap:.75rem}
.job-card:hover{border-color:#d62828;transform:translateY(-2px)}
.card-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;flex-wrap:wrap}
.card-title{font-size:1.05rem;font-weight:700;color:#1a1a2e;margin-bottom:.2rem}
.card-company{font-size:.88rem;color:#555}
.card-badges{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center}
.badge{padding:.28rem .7rem;border-radius:20px;font-size:.73rem;font-weight:600;white-space:nowrap}
.badge-remote{background:#e8f5e9;color:#2e7d32}
.badge-office{background:#e3f2fd;color:#1565c0}
.badge-type{background:#f3e5f5;color:#6a1b9a}
.badge-exp{background:#fff3e0;color:#e65100}
.card-meta{display:flex;gap:1rem;flex-wrap:wrap;font-size:.82rem;color:#666}
.card-meta span{display:flex;align-items:center;gap:.3rem}
.card-desc{font-size:.85rem;color:#555;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
.card-salary{font-weight:700;color:#1a1a2e;font-size:.9rem}
.btn-apply{padding:.55rem 1.3rem;background:#d62828;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:.85rem;cursor:pointer;transition:background .2s}
.btn-apply:hover{background:#a01c1c}
/* JOB DETAIL */
.job-detail{background:#fff;border-radius:12px;padding:2rem;border:1.5px solid #e8e8e8}
.job-detail h1{font-size:1.6rem;font-weight:800;color:#1a1a2e;margin-bottom:.5rem}
.detail-meta{display:flex;gap:.75rem;flex-wrap:wrap;margin:1rem 0;padding:1rem 0;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0}
.detail-chip{padding:.4rem 1rem;border-radius:8px;font-size:.82rem;font-weight:600;background:#f5f5f5;color:#333}
.detail-chip.highlight{background:#fff8e1;color:#f57f17}
.detail-body{font-size:.9rem;color:#444;line-height:1.8;white-space:pre-line;margin:1.5rem 0}
.apply-section{background:#f9f9f9;border-radius:12px;padding:1.5rem;text-align:center;border:1.5px dashed #e0e0e0}
.apply-section h3{margin-bottom:.5rem;color:#1a1a2e}
.apply-section p{font-size:.85rem;color:#666;margin-bottom:1rem}
.btn-apply-big{padding:.85rem 2.5rem;background:#d62828;color:#fff;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;transition:background .2s}
.btn-apply-big:hover{background:#a01c1c}
/* PAGINATION */
.pagination{display:flex;justify-content:center;gap:.4rem;margin:2rem 0;flex-wrap:wrap}
.pagination a,.pagination span{padding:.5rem .9rem;border-radius:8px;border:1.5px solid #e0e0e0;font-size:.85rem;background:#fff}
.pagination a:hover{border-color:#d62828;color:#d62828}
.pagination .current{background:#d62828;color:#fff;border-color:#d62828}
/* BREADCRUMB */
.breadcrumb{font-size:.82rem;color:#888;margin-bottom:1rem}
.breadcrumb a{color:#d62828}
/* SITEMAP NOTE */
.info-box{background:#fff;border-radius:12px;padding:1.25rem 1.5rem;border-left:4px solid #d62828;margin-bottom:1rem;font-size:.88rem}
/* FOOTER */
footer{background:#1a1a2e;color:rgba(255,255,255,0.7);text-align:center;padding:1.5rem;font-size:.82rem;margin-top:3rem}
footer a{color:#ffd700}
/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:999;align-items:center;justify-content:center}
.modal-overlay.open{display:flex}
.modal{background:#fff;border-radius:16px;padding:2rem;max-width:480px;width:90%;position:relative}
.modal h2{font-size:1.2rem;font-weight:700;margin-bottom:1rem;color:#1a1a2e}
.modal input{width:100%;padding:.7rem;border:1.5px solid #ddd;border-radius:8px;font-size:.9rem;margin-bottom:.85rem;outline:none}
.modal input:focus{border-color:#d62828}
.modal .btn-submit{width:100%;padding:.75rem;background:#d62828;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.95rem}
.modal .btn-submit:hover{background:#a01c1c}
.modal .close-btn{position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.4rem;cursor:pointer;color:#888}
.success-msg{display:none;text-align:center;padding:1rem;color:#2e7d32;font-weight:600}
@media(max-width:600px){.search-bar{flex-direction:column}.stat-bar{gap:1rem}}
</style>
</head>
<body>
${AD_TOP}
<nav>
  <a class="brand" href="/"><span>CA</span>NOVA<span>.ca</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/jobs">Browse Jobs</a>
    <a href="/jobs?type=remote">Remote</a>
    <a href="/sitemap">Sitemap</a>
  </div>
</nav>
${bodyContent}
${AD_BOTTOM}
<footer>
  &copy; 2025 CANOVA.ca — <strong>100,000 Jobs</strong> across Canada |
  <a href="/jobs">Browse All</a> · <a href="/jobs?type=remote">Remote Jobs</a> · <a href="/sitemap">Sitemap</a>
</footer>
<script>
function openApply(title){
  window.location.href='https://ruwmqs-uq.myshopify.com/pages/apply';
}
</script>
</body>
</html>`;
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const featuredIds = [1, 50001, 2, 50002, 3, 50003, 10000, 60000];
  const featuredJobs = featuredIds.map(id => getJobData(id));

  const cards = featuredJobs.map(job => `
<a href="/jobs/${job.id}" style="display:block">
<div class="job-card">
  <div class="card-header">
    <div>
      <div class="card-title">${job.title}</div>
      <div class="card-company">${job.company}</div>
    </div>
    <div class="card-badges">
      <span class="badge ${job.isRemote ? 'badge-remote' : 'badge-office'}">${job.isRemote ? '🌐 Remote' : '🏢 On-site'}</span>
      <span class="badge badge-type">${job.jobType}</span>
    </div>
  </div>
  <div class="card-meta">
    <span>📍 ${job.location}</span>
    <span>🏭 ${job.industry}</span>
    <span>📅 ${job.postedDate}</span>
  </div>
  <div class="card-desc">${job.description.substring(0, 180)}...</div>
  <div class="card-footer">
    <span class="card-salary">${job.salary}</span>
    <button class="btn-apply" onclick="event.preventDefault();openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">Apply Now</button>
  </div>
</div>
</a>`).join('');

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CANOVA.ca",
    "url": "https://rightwing-production.up.railway.app",
    "description": "Canada's largest job portal with 100,000 job listings — remote and on-site across all provinces",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rightwing-production.up.railway.app/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const body = `
<div class="hero">
  <h1>Find Your Dream Job in <span class="accent">Canada</span></h1>
  <p>100,000 verified job listings — remote & on-site — across all 13 provinces & territories</p>
  <form action="/jobs" method="get" style="display:flex;gap:.75rem;max-width:580px;margin:0 auto;flex-wrap:wrap">
    <input name="q" type="text" placeholder="Job title, skill, or company..." style="flex:2;min-width:200px;padding:.7rem 1rem;border-radius:8px;border:none;font-size:.95rem"/>
    <select name="location" style="flex:1;min-width:140px;padding:.7rem;border-radius:8px;border:none;font-size:.85rem">
      <option value="">All Provinces</option>
      <option value="remote">Remote Only</option>
      <option value="ontario">Ontario</option>
      <option value="britishcolumbia">British Columbia</option>
      <option value="alberta">Alberta</option>
    </select>
    <button type="submit" style="padding:.7rem 1.5rem;background:#ffd700;color:#1a1a2e;border:none;border-radius:8px;font-weight:700;cursor:pointer">Search →</button>
  </form>
  <div class="stat-bar">
    <div class="stat"><strong>100,000</strong><span>Total Jobs</span></div>
    <div class="stat"><strong>50,000</strong><span>Remote Jobs</span></div>
    <div class="stat"><strong>50,000</strong><span>On-site Jobs</span></div>
    <div class="stat"><strong>13</strong><span>Provinces/Territories</span></div>
    <div class="stat"><strong>100+</strong><span>Companies</span></div>
  </div>
</div>
<div class="container">
  ${AD_MIDDLE}
  <div class="info-box">
    🇨🇦 Canada's most comprehensive job board — browse <strong>50,000 remote jobs</strong> and <strong>50,000 on-site jobs</strong> across all industries.
  </div>
  <h2 style="margin-bottom:1rem;font-size:1.2rem">Featured Jobs</h2>
  <div class="page-grid">${cards}</div>
  <div style="text-align:center;margin-top:2rem">
    <a href="/jobs" style="display:inline-block;padding:.85rem 2.5rem;background:#1a1a2e;color:#fff;border-radius:10px;font-weight:700">Browse All 100,000 Jobs →</a>
  </div>
</div>`;

  res.send(renderHTML({
    title: 'CANOVA.ca — 100,000 Jobs in Canada | Remote & On-site',
    meta: 'Find your next job in Canada. 100,000 verified listings — 50,000 remote and 50,000 on-site jobs across all 13 provinces and territories.',
    bodyContent: body,
    schema: websiteSchema
  }));
});

// ─── JOB LISTING PAGE ──────────────────────────────────────────────────────────
app.get('/jobs', (req, res) => {
  // ... (rest of your code remains same)
});

// ─── INDIVIDUAL JOB PAGE ───────────────────────────────────────────────────────
app.get('/jobs/:id', (req, res) => {
  // ... (rest of your code remains same)
});

// ─── SITEMAP INDEX ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  // ... (rest of your code remains same)
});

// ─── SITEMAP HTML PAGE ─────────────────────────────────────────────────────────
app.get('/sitemap', (req, res) => {
  // ... (rest of your code remains same)
});

// ─── ROBOTS.TXT ────────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  // ... (rest of your code remains same)
});

// ─── API ─────────────────────────────────────────────────────────────────────
app.get('/api/jobs/:id', (req, res) => {
  // ... (rest of your code remains same)
});

app.get('/api/jobs', (req, res) => {
  // ... (rest of your code remains same)
});

app.listen(PORT, () => {
  console.log(`🇨🇦 CANOVA.ca running on port ${PORT}`);
  console.log(`📋 ${TOTAL_JOBS.toLocaleString()} job pages ready`);
  console.log(`🏢 ${companies.length} companies hiring in Canada`);
  console.log(`📍 ${canadaLocations.length} locations across Canada`);
});
