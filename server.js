const express = require('express');
const compression = require('compression');
const { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, canadaLocations, industries } = require('./jobData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── AD CONFIGURATION ──────────────────────────────────────────────────────────
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
  <\\/script>
  <script src="https://www.highperformanceformat.com/72b6f3ac3fc2f43722e5f2196ef85add/invoke.js"><\\/script>
</div>
`;

const AD_MIDDLE = `
<div style="text-align:center; width:100%; padding:10px 0; background:#fff; margin:20px 0; border:1px solid #eee; border-radius:8px;">
  <script>
    atOptions = {
      'key' : 'd1b072857c7132ec474a48b3413701e2',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };
  <\\/script>
  <script src="https://www.highperformanceformat.com/d1b072857c7132ec474a48b3413701e2/invoke.js"><\\/script>
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
  <\\/script>
  <script src="https://www.highperformanceformat.com/72b6f3ac3fc2f43722e5f2196ef85add/invoke.js"><\\/script>
</div>
`;

// ── Helpers ──────────────────────────────────────────────────────────────────
const JOBS_PER_PAGE = 20;

// ─── RENDER HTML FUNCTION ──────────────────────────────────────────────────
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
  window.location.href='/apply';
}
</script>
</body>
</html>`;
}

// ─── APPLICATION FORM ROUTE ──────────────────────────────────────────────────
app.get('/apply', (req, res) => {
  res.send(renderApplicationForm());
});

app.post('/apply', (req, res) => {
  const formData = req.body;
  console.log('Application submitted:', formData);
  res.send(renderApplicationSuccess(formData));
});

function renderApplicationForm() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Job Application | CANOVA.ca</title>
  <meta name="robots" content="index, follow"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;color:#222;line-height:1.6}
    .app-wrapper{max-width:820px;margin:40px auto;padding:30px;background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.08)}
    .app-header{text-align:center;margin-bottom:30px}
    .app-header h1{font-size:1.8rem;color:#d62828;font-weight:800}
    .app-header p{color:#666}
    .progress-wrapper{margin-bottom:35px;position:relative}
    .progress-bar{position:absolute;top:22px;left:0;height:4px;background:#d62828;width:0%;transition:.4s ease;border-radius:4px}
    .steps{display:flex;justify-content:space-between}
    .step{width:42px;height:42px;background:#e5e7eb;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;position:relative;z-index:2;transition:all 0.3s;color:#666}
    .step.active{background:#d62828;color:#fff;box-shadow:0 0 20px rgba(214,40,40,0.25)}
    .step.completed{background:#28a745;color:#fff}
    .form-step{display:none;animation:fadeIn 0.4s ease}
    .form-step.active{display:block}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .form-step h2{font-size:1.3rem;color:#1a1a2e;margin-bottom:8px}
    .form-step .subtitle{color:#888;font-size:0.9rem;margin-bottom:20px}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;font-weight:600;font-size:0.85rem;margin-bottom:4px;color:#333}
    .form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 14px;border:1.5px solid #d1d5db;border-radius:8px;font-size:0.95rem;transition:border 0.3s;font-family:inherit}
    .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#d62828;outline:none;box-shadow:0 0 0 3px rgba(214,40,40,0.1)}
    .form-group textarea{min-height:100px;resize:vertical}
    .form-group .hint{font-size:0.8rem;color:#888;margin-top:3px}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .btn-group{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}
    .btn{padding:12px 30px;border:none;border-radius:8px;font-weight:700;font-size:0.95rem;cursor:pointer;transition:all 0.3s}
    .btn-prev{background:#e5e7eb;color:#333}
    .btn-prev:hover{background:#d1d5db}
    .btn-next{background:#d62828;color:#fff}
    .btn-next:hover{background:#b01c1c;transform:translateY(-2px)}
    .btn-submit{background:#28a745;color:#fff;display:none}
    .btn-submit:hover{background:#1e7e34;transform:translateY(-2px)}
    .checkbox-group{display:flex;gap:10px;align-items:flex-start;margin-top:10px}
    .checkbox-group input{width:auto;margin-top:3px}
    .checkbox-group label{font-weight:400;font-size:0.9rem}
    @media(max-width:600px){.app-wrapper{padding:20px;margin:20px 10px}.form-row{grid-template-columns:1fr}.step{width:36px;height:36px;font-size:0.75rem}.btn{padding:10px 20px;font-size:0.85rem}}
  </style>
</head>
<body>
${AD_TOP}
<div class="app-wrapper">
  <div class="app-header">
    <h1>📋 Job Application</h1>
    <p>Complete your application in 5 easy steps</p>
  </div>

  <div class="progress-wrapper">
    <div class="progress-bar" id="progressBar"></div>
    <div class="steps" id="stepIndicators">
      <div class="step active" data-step="0">1</div>
      <div class="step" data-step="1">2</div>
      <div class="step" data-step="2">3</div>
      <div class="step" data-step="3">4</div>
      <div class="step" data-step="4">5</div>
    </div>
  </div>

  <form id="applicationForm" action="/apply" method="POST">
    <!-- STEP 1: Personal Information -->
    <div class="form-step active" data-step="0">
      <h2>👤 Personal Information</h2>
      <p class="subtitle">Tell us about yourself</p>
      <div class="form-row">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" name="fullName" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label>Email Address *</label>
          <input type="email" name="email" placeholder="john@example.com" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Phone Number *</label>
          <input type="tel" name="phone" placeholder="+1 234 567 890" required>
        </div>
        <div class="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dob">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" name="city" placeholder="Toronto">
        </div>
        <div class="form-group">
          <label>Province</label>
          <select name="province">
            <option value="">Select Province</option>
            <option value="ON">Ontario</option>
            <option value="BC">British Columbia</option>
            <option value="AB">Alberta</option>
            <option value="QC">Quebec</option>
            <option value="MB">Manitoba</option>
            <option value="SK">Saskatchewan</option>
            <option value="NS">Nova Scotia</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="PE">Prince Edward Island</option>
            <option value="NT">Northwest Territories</option>
            <option value="YT">Yukon</option>
            <option value="NU">Nunavut</option>
          </select>
        </div>
      </div>
    </div>

    <!-- STEP 2: Professional Information -->
    <div class="form-step" data-step="1">
      <h2>💼 Professional Information</h2>
      <p class="subtitle">Tell us about your professional background</p>
      <div class="form-row">
        <div class="form-group">
          <label>Current Job Title</label>
          <input type="text" name="currentTitle" placeholder="Software Engineer">
        </div>
        <div class="form-group">
          <label>Current Company</label>
          <input type="text" name="currentCompany" placeholder="Tech Corp">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Years of Experience *</label>
          <input type="number" name="experience" placeholder="5" min="0" required>
        </div>
        <div class="form-group">
          <label>Current Salary (CAD)</label>
          <input type="text" name="currentSalary" placeholder="65,000">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Expected Salary (CAD) *</label>
          <input type="text" name="expectedSalary" placeholder="80,000" required>
        </div>
        <div class="form-group">
          <label>Availability</label>
          <select name="availability">
            <option value="immediate">Immediate</option>
            <option value="2weeks">2 Weeks Notice</option>
            <option value="1month">1 Month Notice</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Key Skills (comma separated)</label>
        <input type="text" name="skills" placeholder="JavaScript, React, Node.js, AWS">
      </div>
    </div>

    <!-- STEP 3: Education Details -->
    <div class="form-step" data-step="2">
      <h2>🎓 Education Details</h2>
      <p class="subtitle">Share your educational background</p>
      <div class="form-row">
        <div class="form-group">
          <label>Highest Qualification *</label>
          <select name="qualification" required>
            <option value="">Select Qualification</option>
            <option value="highschool">High School</option>
            <option value="diploma">Diploma</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>University / College *</label>
          <input type="text" name="university" placeholder="University of Toronto" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Field of Study</label>
          <input type="text" name="fieldOfStudy" placeholder="Computer Science">
        </div>
        <div class="form-group">
          <label>Passing Year</label>
          <input type="number" name="passingYear" placeholder="2020" min="1990" max="2026">
        </div>
      </div>
      <div class="form-group">
        <label>Additional Certifications</label>
        <input type="text" name="certifications" placeholder="AWS Certified, PMP, etc.">
      </div>
    </div>

    <!-- STEP 4: Resume & Links -->
    <div class="form-step" data-step="3">
      <h2>📎 Resume & Links</h2>
      <p class="subtitle">Share your resume and professional links</p>
      <div class="form-group">
        <label>Upload Resume (PDF, DOC, DOCX) *</label>
        <input type="file" name="resume" accept=".pdf,.doc,.docx" required>
        <div class="hint">Max file size: 5MB</div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>LinkedIn Profile</label>
          <input type="url" name="linkedin" placeholder="https://linkedin.com/in/yourprofile">
        </div>
        <div class="form-group">
          <label>Portfolio Website</label>
          <input type="url" name="portfolio" placeholder="https://yourportfolio.com">
        </div>
      </div>
      <div class="form-group">
        <label>Cover Letter</label>
        <textarea name="coverLetter" placeholder="Write a brief cover letter explaining why you are the right fit for this role..."></textarea>
      </div>
      <div class="form-group">
        <label>How did you hear about us?</label>
        <select name="source">
          <option value="">Select</option>
          <option value="linkedin">LinkedIn</option>
          <option value="google">Google Search</option>
          <option value="indeed">Indeed</option>
          <option value="referral">Employee Referral</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- STEP 5: Review & Submit -->
    <div class="form-step" data-step="4">
      <h2>✅ Review & Submit</h2>
      <p class="subtitle">Please review all information before submitting</p>
      <div id="reviewContainer" style="background:#f8f9fa;padding:16px;border-radius:8px;margin-bottom:16px;font-size:0.9rem;">
        <p style="color:#666;text-align:center;">Review your details below</p>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="confirmCheck" required>
        <label for="confirmCheck">I confirm that all information provided is accurate and complete to the best of my knowledge.</label>
      </div>
      <div class="checkbox-group">
        <input type="checkbox" id="termsCheck" required>
        <label for="termsCheck">I agree to the <a href="/terms" style="color:#d62828;">Terms & Conditions</a> and <a href="/privacy-policy" style="color:#d62828;">Privacy Policy</a>.</label>
      </div>
    </div>

    <div class="btn-group">
      <button type="button" class="btn btn-prev" id="prevBtn" style="display:none;">← Previous</button>
      <button type="button" class="btn btn-next" id="nextBtn">Next →</button>
      <button type="submit" class="btn btn-submit" id="submitBtn">📤 Submit Application</button>
    </div>
  </form>
</div>
${AD_BOTTOM}
<script>
document.addEventListener('DOMContentLoaded', function() {
  let currentStep = 0;
  const totalSteps = 5;
  const formSteps = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressBar = document.getElementById('progressBar');
  const form = document.getElementById('applicationForm');

  function updateForm() {
    formSteps.forEach((step, i) => {
      step.classList.toggle('active', i === currentStep);
    });

    indicators.forEach((ind, i) => {
      ind.classList.remove('active', 'completed');
      if (i === currentStep) ind.classList.add('active');
      else if (i < currentStep) ind.classList.add('completed');
    });

    const progress = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = progress + '%';

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = currentStep === totalSteps - 1 ? 'inline-block' : 'none';

    if (currentStep === totalSteps - 1) {
      updateReview();
    }

    document.querySelector('.app-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateReview() {
    const container = document.getElementById('reviewContainer');
    const formData = new FormData(form);
    let html = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85rem;">';
    const fields = {
      'Full Name': formData.get('fullName') || 'Not provided',
      'Email': formData.get('email') || 'Not provided',
      'Phone': formData.get('phone') || 'Not provided',
      'City': formData.get('city') || 'Not provided',
      'Province': formData.get('province') || 'Not provided',
      'Current Title': formData.get('currentTitle') || 'Not provided',
      'Current Company': formData.get('currentCompany') || 'Not provided',
      'Experience': formData.get('experience') || 'Not provided',
      'Expected Salary': formData.get('expectedSalary') || 'Not provided',
      'Skills': formData.get('skills') || 'Not provided',
      'Qualification': formData.get('qualification') || 'Not provided',
      'University': formData.get('university') || 'Not provided'
    };
    for (const [key, value] of Object.entries(fields)) {
      html += '<div><strong>' + key + ':</strong></div><div>' + (value || 'Not provided') + '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  nextBtn.addEventListener('click', function() {
    const currentStepEl = formSteps[currentStep];
    const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#dc3545';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if (!valid) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateForm();
    }
  });

  prevBtn.addEventListener('click', function() {
    if (currentStep > 0) {
      currentStep--;
      updateForm();
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const confirmCheck = document.getElementById('confirmCheck');
    const termsCheck = document.getElementById('termsCheck');
    if (!confirmCheck.checked) {
      alert('Please confirm that all information is accurate.');
      confirmCheck.focus();
      return;
    }
    if (!termsCheck.checked) {
      alert('Please agree to the Terms & Conditions and Privacy Policy.');
      termsCheck.focus();
      return;
    }
    this.submit();
  });

  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  });

  updateForm();
});
<\\/script>
</body>
</html>`;
}

function renderApplicationSuccess(formData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Application Submitted | CANOVA.ca</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
    .success-wrapper{max-width:550px;width:100%;background:#fff;border-radius:20px;padding:40px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.08)}
    .success-icon{font-size:4rem;margin-bottom:10px}
    .success-wrapper h1{font-size:1.8rem;color:#28a745;margin-bottom:5px}
    .success-wrapper p{color:#666;font-size:1rem;margin-bottom:25px}
    .divider{height:2px;background:linear-gradient(90deg,transparent,#ddd,transparent);margin:20px 0}
    .quiz-prompt{background:#f8f9fa;padding:20px;border-radius:12px;margin:15px 0}
    .quiz-prompt h3{color:#d62828;font-size:1.1rem;margin-bottom:5px}
    .quiz-prompt p{color:#888;font-size:0.9rem;margin-bottom:15px}
    .btn-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
    .btn{display:inline-block;padding:12px 35px;border:none;border-radius:50px;font-weight:700;font-size:1rem;cursor:pointer;text-decoration:none;transition:all 0.3s}
    .btn-primary{background:#d62828;color:#fff}
    .btn-primary:hover{background:#b01c1c;transform:translateY(-2px);box-shadow:0 8px 25px rgba(214,40,40,0.25)}
    .btn-secondary{background:#e5e7eb;color:#333}
    .btn-secondary:hover{background:#d1d5db}
    .countdown{color:#888;font-size:0.8rem;margin-top:12px}
    .countdown strong{color:#d62828}
  </style>
</head>
<body>
${AD_TOP}
<div class="success-wrapper">
  <div class="success-icon">✅</div>
  <h1>Thanks For Applying!</h1>
  <p>Your Application has been submitted successfully.</p>

  <div class="divider"></div>

  <div class="quiz-prompt">
    <h3>🎯 DO YOU WANT TO TEST YOURSELF BEFORE INTERVIEW?</h3>
    <p>Take a quick quiz to assess your interview readiness</p>
    <div class="btn-group">
      <a href="https://rightwing-production.up.railway.app/quiz" class="btn btn-primary" id="playNowBtn">🚀 PLAY NOW</a>
      <a href="https://rightwing-production.up.railway.app/quiz" class="btn btn-secondary" id="skipBtn">Skip</a>
    </div>
    <div class="countdown">Redirecting in <strong id="countdownTimer">3</strong> seconds...</div>
  </div>
</div>
${AD_BOTTOM}
<script>
document.addEventListener('DOMContentLoaded', function() {
  let countdown = 3;
  const timerDisplay = document.getElementById('countdownTimer');
  const redirectUrl = 'https://rightwing-production.up.railway.app/quiz';

  const countdownInterval = setInterval(function() {
    countdown--;
    if (timerDisplay) timerDisplay.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      window.location.href = redirectUrl;
    }
  }, 1000);

  document.getElementById('playNowBtn').addEventListener('click', function(e) {
    clearInterval(countdownInterval);
  });

  document.getElementById('skipBtn').addEventListener('click', function(e) {
    clearInterval(countdownInterval);
  });
});
<\\/script>
</body>
</html>`;
}

// ─── QUIZ PAGE ────────────────────────────────────────────────────────────────
app.get('/quiz', (req, res) => {
  res.send(renderQuizPage());
});

function renderQuizPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Interview Quiz | CANOVA.ca</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
    .quiz-wrapper{max-width:700px;width:100%;background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-radius:20px;padding:30px;border:1px solid rgba(255,255,255,0.08)}
    .quiz-header{text-align:center;margin-bottom:20px}
    .quiz-header h1{color:#ffd700;font-size:1.8rem;font-weight:800}
    .quiz-header p{color:#8899aa;font-size:0.9rem}
    .progress-section{display:flex;justify-content:space-between;padding:10px 16px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:15px}
    .progress-section .info{color:#8899aa;font-size:0.85rem}
    .progress-section .timer{color:#e94560;font-weight:700}
    .progress-bar{width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:4px;margin-bottom:20px;overflow:hidden}
    .progress-bar .fill{height:100%;background:linear-gradient(90deg,#ffd700,#e94560);border-radius:4px;transition:width 0.5s ease;width:0%}
    .question-area{min-height:250px}
    .question-number{color:#e94560;font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em}
    .question-text{color:#fff;font-size:1.15rem;font-weight:600;margin:10px 0 18px}
    .options-grid{display:grid;gap:10px}
    .option-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(255,255,255,0.03);border:2px solid rgba(255,255,255,0.06);border-radius:10px;cursor:pointer;transition:all 0.3s;color:#d0d0e0}
    .option-item:hover{border-color:rgba(255,215,0,0.25)}
    .option-item.selected{border-color:#ffd700;background:rgba(255,215,0,0.08)}
    .option-item .circle{width:26px;height:26px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:#666;flex-shrink:0;transition:all 0.3s}
    .option-item.selected .circle{border-color:#ffd700;background:#ffd700;color:#1a1a2e}
    .btn-group{display:flex;gap:12px;margin-top:25px;flex-wrap:wrap;justify-content:space-between}
    .btn{padding:11px 28px;border:none;border-radius:10px;font-weight:700;font-size:0.9rem;cursor:pointer;transition:all 0.3s}
    .btn-prev{background:rgba(255,255,255,0.05);color:#8899aa;border:1px solid rgba(255,255,255,0.06)}
    .btn-prev:hover{background:rgba(255,255,255,0.1)}
    .btn-next{background:linear-gradient(135deg,#ffd700,#f0c000);color:#1a1a2e}
    .btn-next:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(255,215,0,0.25)}
    .btn-next:disabled{opacity:0.35;cursor:not-allowed;transform:none;box-shadow:none}
    .btn-submit{background:linear-gradient(135deg,#e94560,#c73652);color:#fff}
    .btn-submit:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(233,69,96,0.3)}
    .result-container{text-align:center;padding:20px 0}
    .score-circle{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(233,69,96,0.1));border:3px solid rgba(255,215,0,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 20px}
    .score-number{font-size:3rem;font-weight:800;color:#ffd700;line-height:1}
    .score-label{font-size:0.8rem;color:#8899aa}
    .result-message{font-size:1.2rem;font-weight:600;color:#fff;margin-bottom:8px}
    .result-detail{color:#8899aa;font-size:0.9rem;margin-bottom:15px}
    .time-taken{color:#e94560;font-weight:700;font-size:1rem;margin-bottom:20px}
    .restart-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e0e0e0;padding:12px 35px;border-radius:10px;font-weight:600;font-size:0.9rem;cursor:pointer;transition:all 0.3s}
    .restart-btn:hover{background:rgba(255,255,255,0.1)}
    @media(max-width:600px){.quiz-wrapper{padding:18px}.btn{padding:10px 18px;font-size:0.8rem}}
  </style>
</head>
<body>
${AD_TOP}
<div class="quiz-wrapper" id="quizApp">
  <div class="quiz-header">
    <h1>🎯 Interview Quiz</h1>
    <p>Test your interview readiness</p>
  </div>
  <div class="progress-section">
    <span class="info">Question <strong id="qNum">1</strong> / <span id="totalQ">5</span></span>
    <span class="timer" id="timerDisplay">⏱ 00:00</span>
  </div>
  <div class="progress-bar"><div class="fill" id="progressFill"></div></div>
  <div class="question-area" id="questionArea"></div>
  <div class="btn-group">
    <button class="btn btn-prev" id="prevQBtn" style="display:none;">← Back</button>
    <button class="btn btn-next" id="nextQBtn">Next →</button>
    <button class="btn btn-submit" id="submitQuizBtn" style="display:none;">📊 Submit</button>
  </div>
</div>
${AD_BOTTOM}
<script>
var quizQuestions = [
  { q: "What is your greatest strength in a professional setting?", type: "text" },
  { q: "Describe a challenging situation you overcame.", type: "text" },
  { q: "Where do you see yourself in 5 years?", type: "text" },
  { q: "What motivates you to work hard?", type: "text" },
  { q: "Why do you want to join this company?", type: "text" }
];

var currentQ = 0;
var answers = {};
var timerSeconds = 0;
var timerInterval = null;

function renderQuestion() {
  var area = document.getElementById('questionArea');
  var q = quizQuestions[currentQ];
  document.getElementById('qNum').textContent = currentQ + 1;
  document.getElementById('totalQ').textContent = quizQuestions.length;
  document.getElementById('progressFill').style.width = ((currentQ) / (quizQuestions.length - 1)) * 100 + '%';

  document.getElementById('prevQBtn').style.display = currentQ === 0 ? 'none' : 'inline-block';
  document.getElementById('nextQBtn').style.display = currentQ === quizQuestions.length - 1 ? 'none' : 'inline-block';
  document.getElementById('submitQuizBtn').style.display = currentQ === quizQuestions.length - 1 ? 'inline-block' : 'none';

  var val = answers[currentQ] || '';
  area.innerHTML = '<div class="question-number">Question ' + (currentQ + 1) + '</div>' +
    '<div class="question-text">' + q.q + '</div>' +
    '<textarea style="width:100%;padding:14px;border-radius:10px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.08);color:#e0e0e0;font-size:0.95rem;min-height:120px;font-family:inherit;outline:none;resize:vertical;" ' +
    'oninput="saveAnswer(' + currentQ + ', this.value)" ' +
    'placeholder="Type your answer here...">' + val + '</textarea>';
}

function saveAnswer(idx, value) { answers[idx] = value; }

function nextQuestion() {
  if (currentQ < quizQuestions.length - 1) { currentQ++; renderQuestion(); }
}

function prevQuestion() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function submitQuiz() {
  var unanswered = false;
  for (var i = 0; i < quizQuestions.length; i++) {
    if (!answers[i] || answers[i].trim() === '') {
      unanswered = true;
      break;
    }
  }
  if (unanswered) { alert('Please answer all questions before submitting.'); return; }
  clearInterval(timerInterval);
  var mins = Math.floor(timerSeconds / 60);
  var secs = timerSeconds % 60;
  var timeStr = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  var area = document.getElementById('questionArea');
  area.innerHTML = '<div class="result-container">' +
    '<div class="score-circle">' +
      '<span class="score-number">✅</span>' +
      '<span class="score-label">Completed</span>' +
    '</div>' +
    '<div class="result-message">🎉 Great job! You have completed the quiz.</div>' +
    '<div class="result-detail">You have answered all ' + quizQuestions.length + ' questions thoughtfully.</div>' +
    '<div class="time-taken">⏱ Time taken: ' + timeStr + '</div>' +
    '<button class="restart-btn" onclick="restartQuiz()">🔄 Restart Quiz</button>' +
  '</div>';
  document.getElementById('prevQBtn').style.display = 'none';
  document.getElementById('nextQBtn').style.display = 'none';
  document.getElementById('submitQuizBtn').style.display = 'none';
}

function restartQuiz() {
  currentQ = 0; answers = {}; timerSeconds = 0;
  document.getElementById('timerDisplay').textContent = '⏱ 00:00';
  if (timerInterval) clearInterval(timerInterval);
  startTimer();
  renderQuestion();
  document.getElementById('prevQBtn').style.display = 'none';
  document.getElementById('nextQBtn').style.display = 'inline-block';
  document.getElementById('submitQuizBtn').style.display = 'none';
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(function() {
    timerSeconds++;
    var mins = Math.floor(timerSeconds / 60);
    var secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = '⏱ ' + String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  }, 1000);
}

document.getElementById('nextQBtn').addEventListener('click', nextQuestion);
document.getElementById('prevQBtn').addEventListener('click', prevQuestion);
document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);

startTimer();
renderQuestion();
<\\/script>
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
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const typeFilter = req.query.type || 'all';
  const locationFilter = req.query.location || '';
  const q = req.query.q || '';

  let jobIds = [];
  if (typeFilter === 'remote') {
    const start = (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= 50000; i++) jobIds.push(i);
  } else if (typeFilter === 'onsite') {
    const start = 50000 + (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= TOTAL_JOBS; i++) jobIds.push(i);
  } else {
    const start = (page - 1) * JOBS_PER_PAGE + 1;
    for (let i = start; i < start + JOBS_PER_PAGE && i <= TOTAL_JOBS; i++) jobIds.push(i);
  }

  const jobs = jobIds.map(id => getJobData(id));
  const totalPages = Math.ceil(TOTAL_JOBS / JOBS_PER_PAGE);

  const cards = jobs.map(job => `
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
      <span class="badge badge-exp">${job.experience}</span>
    </div>
  </div>
  <div class="card-meta">
    <span>📍 ${job.location}</span>
    <span>🏭 ${job.industry}</span>
    <span>📅 ${job.postedDate}</span>
  </div>
  <div class="card-desc">${job.description.substring(0, 200)}...</div>
  <div class="card-footer">
    <span class="card-salary">${job.salary}</span>
    <button class="btn-apply" onclick="event.preventDefault();openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">Apply Now</button>
  </div>
</div>
</a>`).join('');

  const pages = [];
  if (page > 1) pages.push(`<a href="/jobs?page=${page - 1}&type=${typeFilter}">← Prev</a>`);
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) pages.push(`<a href="/jobs?page=1&type=${typeFilter}">1</a><span>…</span>`);
  for (let p = start; p <= end; p++) {
    pages.push(p === page
      ? `<span class="current">${p}</span>`
      : `<a href="/jobs?page=${p}&type=${typeFilter}">${p}</a>`);
  }
  if (end < totalPages) pages.push(`<span>…</span><a href="/jobs?page=${totalPages}&type=${typeFilter}">${totalPages.toLocaleString()}</a>`);
  if (page < totalPages) pages.push(`<a href="/jobs?page=${page + 1}&type=${typeFilter}">Next →</a>`);

  const body = `
<div class="hero" style="padding:1.75rem 1.5rem">
  <h1 style="font-size:1.8rem">Browse <span class="accent">100,000 Jobs</span> in Canada</h1>
  <p>Showing page ${page.toLocaleString()} of ${totalPages.toLocaleString()}</p>
</div>
<div class="filter-row">
  <a href="/jobs"><span class="filter-chip ${typeFilter==='all'?'active':''}">All Jobs (100,000)</span></a>
  <a href="/jobs?type=remote"><span class="filter-chip ${typeFilter==='remote'?'active':''}">🌐 Remote (50,000)</span></a>
  <a href="/jobs?type=onsite"><span class="filter-chip ${typeFilter==='onsite'?'active':''}">🏢 On-site (50,000)</span></a>
</div>
<div class="container">
  ${AD_MIDDLE}
  <div class="page-grid">${cards}</div>
  <div class="pagination">${pages.join('')}</div>
</div>`;

  res.send(renderHTML({
    title: `Canada Jobs — Page ${page} of ${totalPages.toLocaleString()} | CANOVA.ca`,
    meta: `Browse ${TOTAL_JOBS.toLocaleString()} jobs in Canada. Page ${page}. Remote and on-site positions across all industries.`,
    bodyContent: body,
    schema: null
  }));
});

// ─── INDIVIDUAL JOB PAGE ───────────────────────────────────────────────────────
app.get('/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id < 1 || id > TOTAL_JOBS) {
    return res.status(404).send(renderHTML({
      title: 'Job Not Found | CANOVA.ca',
      meta: 'This job listing was not found.',
      bodyContent: `<div class="container" style="text-align:center;padding:4rem 1.5rem"><h1>404 — Job Not Found</h1><p style="margin:1rem 0 2rem">This job may have been filled or removed.</p><a href="/jobs" style="color:#d62828">← Browse All Jobs</a></div>`,
      schema: null
    }));
  }

  const job = getJobData(id);
  const schema = getJobSchema(job);

  const relatedIds = [
    Math.max(1, id - 2), Math.max(1, id - 1),
    Math.min(TOTAL_JOBS, id + 1), Math.min(TOTAL_JOBS, id + 2)
  ].filter(rid => rid !== id);
  const relatedJobs = relatedIds.slice(0, 3).map(rid => getJobData(rid));

  const relatedCards = relatedJobs.map(rj => `
<a href="/jobs/${rj.id}" style="display:block">
<div class="job-card" style="padding:1rem">
  <div class="card-title" style="font-size:.95rem">${rj.title}</div>
  <div class="card-company">${rj.company}</div>
  <div style="margin-top:.5rem;display:flex;gap:.5rem;flex-wrap:wrap">
    <span class="badge ${rj.isRemote ? 'badge-remote' : 'badge-office'}" style="font-size:.7rem">${rj.isRemote ? '🌐 Remote' : '🏢 On-site'}</span>
    <span class="badge badge-type" style="font-size:.7rem">${rj.jobType}</span>
  </div>
</div>
</a>`).join('');

  const body = `
<div class="container">
  <div class="breadcrumb">
    <a href="/">Home</a> › <a href="/jobs">Jobs</a> › <a href="/jobs?type=${job.isRemote ? 'remote' : 'onsite'}">${job.isRemote ? 'Remote' : 'On-site'}</a> › ${job.title}
  </div>
  ${AD_MIDDLE}
  <div class="job-detail">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
      <div>
        <h1>${job.title}</h1>
        <p style="font-size:1.05rem;color:#555;margin-top:.35rem">${job.company} · ${job.industry}</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
        <span class="badge ${job.isRemote ? 'badge-remote' : 'badge-office'}" style="font-size:.85rem;padding:.4rem 1rem">${job.isRemote ? '🌐 Remote' : '🏢 On-site'}</span>
        <span style="font-size:.8rem;color:#888">Job ID: CA-${String(job.id).padStart(6, '0')}</span>
      </div>
    </div>
    <div class="detail-meta">
      <span class="detail-chip highlight">💰 ${job.salary}</span>
      <span class="detail-chip">📍 ${job.location}</span>
      <span class="detail-chip">💼 ${job.jobType}</span>
      <span class="detail-chip">📊 ${job.experience}</span>
      <span class="detail-chip">🏭 ${job.industry}</span>
      <span class="detail-chip">📅 Posted: ${job.postedDate}</span>
    </div>
    <div class="detail-body">${job.description}</div>
    <div class="apply-section">
      <h3>Ready to Apply?</h3>
      <p>Submit your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> — takes less than 2 minutes</p>
      <button class="btn-apply-big" onclick="openApply('${job.title.replace(/'/g, "\\'")} at ${job.company.replace(/'/g, "\\'")}')">
        Apply Now →
      </button>
    </div>
  </div>

  <div style="margin-top:2rem">
    <h2 style="font-size:1.1rem;margin-bottom:1rem">Similar Jobs You Might Like</h2>
    <div class="page-grid">${relatedCards}</div>
  </div>
  <div style="text-align:center;margin-top:1.5rem">
    <a href="/jobs" style="color:#d62828;font-weight:600">← Browse All 100,000 Jobs</a>
  </div>
</div>`;

  res.send(renderHTML({
    title: `${job.title} at ${job.company} — ${job.location} | CANOVA.ca`,
    meta: `${job.title} job at ${job.company}. ${job.isRemote ? 'Remote' : job.location}. ${job.salary}. Apply now on CANOVA.ca.`,
    bodyContent: body,
    schema
  }));
});

// ─── SITEMAP INDEX ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  const totalSitemaps = 100;
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (let i = 1; i <= totalSitemaps; i++) {
    xml += `\n<sitemap><loc>https://rightwing-production.up.railway.app/sitemap-${i}.xml</loc></sitemap>`;
  }
  xml += `\n</sitemapindex>`;
  res.type('application/xml').send(xml);
});

app.get('/sitemap-:num.xml', (req, res) => {
  const num = parseInt(req.params.num);
  if (!num || num < 1 || num > 100) return res.status(404).send('Not found');
  const start = (num - 1) * 1000 + 1;
  const end = Math.min(num * 1000, TOTAL_JOBS);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (let i = start; i <= end; i++) {
    xml += `\n<url><loc>https://rightwing-production.up.railway.app/jobs/${i}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  }
  xml += `\n</urlset>`;
  res.type('application/xml').send(xml);
});

// ─── SITEMAP HTML PAGE ─────────────────────────────────────────────────────────
app.get('/sitemap', (req, res) => {
  const body = `
<div class="container">
  <h1 style="margin-bottom:1rem">Sitemap — CANOVA.ca</h1>
  <div class="info-box">📌 100,000 individual job pages + XML sitemaps for all search engines</div>
  ${AD_MIDDLE}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:1rem">
    <div class="job-card">
      <div class="card-title">Main Pages</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/" style="color:#d62828">🏠 Home</a>
        <a href="/jobs" style="color:#d62828">📋 All Jobs (100,000)</a>
        <a href="/jobs?type=remote" style="color:#d62828">🌐 Remote Jobs (50,000)</a>
        <a href="/jobs?type=onsite" style="color:#d62828">🏢 On-site Jobs (50,000)</a>
      </div>
    </div>
    <div class="job-card">
      <div class="card-title">XML Sitemaps</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/sitemap.xml" style="color:#d62828">📄 Sitemap Index</a>
        <a href="/sitemap-1.xml" style="color:#d62828">📄 Sitemap 1 (Jobs 1–1,000)</a>
        <a href="/sitemap-2.xml" style="color:#d62828">📄 Sitemap 2 (Jobs 1,001–2,000)</a>
        <span style="color:#888">… 100 sitemap files total</span>
      </div>
    </div>
    <div class="job-card">
      <div class="card-title">Job Pages Range</div>
      <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.75rem;font-size:.88rem">
        <a href="/jobs/1" style="color:#d62828">Job #1 (First Remote Job)</a>
        <a href="/jobs/50000" style="color:#d62828">Job #50,000 (Last Remote Job)</a>
        <a href="/jobs/50001" style="color:#d62828">Job #50,001 (First On-site Job)</a>
        <a href="/jobs/100000" style="color:#d62828">Job #100,000 (Last On-site Job)</a>
      </div>
    </div>
  </div>
</div>`;

  res.send(renderHTML({
    title: 'Sitemap | CANOVA.ca',
    meta: 'Complete sitemap of CANOVA.ca with 100,000 job listings across Canada.',
    bodyContent: body,
    schema: null
  }));
});

// ─── ROBOTS.TXT ────────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: https://rightwing-production.up.railway.app/sitemap.xml
Disallow: /api/`);
});

// ─── API ─────────────────────────────────────────────────────────────────────
app.get('/api/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (!id || id < 1 || id > TOTAL_JOBS) return res.status(404).json({ error: 'Job not found' });
  const job = getJobData(id);
  res.json({ job, schema: getJobSchema(job) });
});

app.get('/api/jobs', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const start = (page - 1) * limit + 1;
  const jobs = [];
  for (let i = start; i < start + limit && i <= TOTAL_JOBS; i++) {
    jobs.push(getJobData(i));
  }
  res.json({ page, limit, total: TOTAL_JOBS, jobs });
});

app.listen(PORT, () => {
  console.log(`🇨🇦 CANOVA.ca running on port ${PORT}`);
  console.log(`📋 ${TOTAL_JOBS.toLocaleString()} job pages ready`);
  console.log(`🏢 ${companies.length} companies hiring in Canada`);
  console.log(`📍 ${canadaLocations.length} locations across Canada`);
});
