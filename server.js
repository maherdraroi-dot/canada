const express = require('express');
const compression = require('compression');
const { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, canadaLocations, industries } = require('./jobData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────
const JOBS_PER_PAGE = 20;

// ─── APPLICATION FORM ROUTE ──────────────────────────────────────────────────
app.get('/apply', (req, res) => {
  res.send(renderApplicationForm());
});

app.post('/apply', (req, res) => {
  // Handle form submission
  const formData = req.body;
  console.log('Application submitted:', formData);
  
  // Send success response with quiz prompt
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
        <textarea name="coverLetter" placeholder="Write a brief cover letter explaining why you're the right fit for this role..."></textarea>
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
    // Update steps
    formSteps.forEach((step, i) => {
      step.classList.toggle('active', i === currentStep);
    });

    // Update indicators
    indicators.forEach((ind, i) => {
      ind.classList.remove('active', 'completed');
      if (i === currentStep) ind.classList.add('active');
      else if (i < currentStep) ind.classList.add('completed');
    });

    // Update progress bar
    const progress = (currentStep / (totalSteps - 1)) * 100;
    progressBar.style.width = progress + '%';

    // Update buttons
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = currentStep === totalSteps - 1 ? 'inline-block' : 'none';

    // Update review container on last step
    if (currentStep === totalSteps - 1) {
      updateReview();
    }

    // Scroll to top of form
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
      html += `<div><strong>${key}:</strong></div><div>${value || 'Not provided'}</div>`;
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // ─── Navigation ────────────────────────────────────────────────────────────
  nextBtn.addEventListener('click', function() {
    // Basic validation for current step
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

  // ─── Submit ────────────────────────────────────────────────────────────────
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
    // Submit the form
    this.submit();
  });

  // ─── Reset border on input ────────────────────────────────────────────────
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  });

  updateForm();
});
</script>
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

  // Stop countdown and redirect immediately on button click
  document.getElementById('playNowBtn').addEventListener('click', function(e) {
    clearInterval(countdownInterval);
  });

  document.getElementById('skipBtn').addEventListener('click', function(e) {
    clearInterval(countdownInterval);
  });
});
</script>
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

<script>
const quizQuestions = [
  { q: "What is your greatest strength in a professional setting?", type: "text" },
  { q: "Describe a challenging situation you overcame.", type: "text" },
  { q: "Where do you see yourself in 5 years?", type: "text" },
  { q: "What motivates you to work hard?", type: "text" },
  { q: "Why do you want to join this company?", type: "text" }
];

let currentQ = 0;
let answers = {};
let timerSeconds = 0;
let timerInterval = null;

function renderQuestion() {
  const area = document.getElementById('questionArea');
  const q = quizQuestions[currentQ];
  document.getElementById('qNum').textContent = currentQ + 1;
  document.getElementById('totalQ').textContent = quizQuestions.length;
  document.getElementById('progressFill').style.width = ((currentQ) / (quizQuestions.length - 1)) * 100 + '%';

  document.getElementById('prevQBtn').style.display = currentQ === 0 ? 'none' : 'inline-block';
  document.getElementById('nextQBtn').style.display = currentQ === quizQuestions.length - 1 ? 'none' : 'inline-block';
  document.getElementById('submitQuizBtn').style.display = currentQ === quizQuestions.length - 1 ? 'inline-block' : 'none';

  const val = answers[currentQ] || '';
  area.innerHTML = `
    <div class="question-number">Question ${currentQ + 1}</div>
    <div class="question-text">${q.q}</div>
    <textarea style="width:100%;padding:14px;border-radius:10px;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.08);color:#e0e0e0;font-size:0.95rem;min-height:120px;font-family:inherit;outline:none;resize:vertical;" 
      oninput="saveAnswer(${currentQ}, this.value)" 
      placeholder="Type your answer here...">${val}</textarea>
  `;
}

function saveAnswer(idx, value) { answers[idx] = value; }

function nextQuestion() {
  if (currentQ < quizQuestions.length - 1) { currentQ++; renderQuestion(); }
}

function prevQuestion() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function submitQuiz() {
  const unanswered = quizQuestions.some((_, i) => !answers[i]?.trim());
  if (unanswered) { alert('Please answer all questions before submitting.'); return; }
  clearInterval(timerInterval);
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  const area = document.getElementById('questionArea');
  area.innerHTML = `
    <div class="result-container">
      <div class="score-circle">
        <span class="score-number">✅</span>
        <span class="score-label">Completed</span>
      </div>
      <div class="result-message">🎉 Great job! You've completed the quiz.</div>
      <div class="result-detail">You've answered all ${quizQuestions.length} questions thoughtfully.</div>
      <div class="time-taken">⏱ Time taken: ${timeStr}</div>
      <button class="restart-btn" onclick="restartQuiz()">🔄 Restart Quiz</button>
    </div>
  `;
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
  timerInterval = setInterval(() => {
    timerSeconds++;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = `⏱ ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }, 1000);
}

document.getElementById('nextQBtn').addEventListener('click', nextQuestion);
document.getElementById('prevQBtn').addEventListener('click', prevQuestion);
document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);

startTimer();
renderQuestion();
</script>
</body>
</html>`;
}

// ─── EXISTING ROUTES ──────────────────────────────────────────────────────────
// ... (your existing home, jobs, job detail, sitemap, robots, API routes here)

// ─── RENDER HTML FUNCTION (existing) ─────────────────────────────────────────
// ... (your existing renderHTML function)

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  // ... your existing home route
});

// ─── JOB LISTING PAGE ──────────────────────────────────────────────────────────
app.get('/jobs', (req, res) => {
  // ... your existing jobs route
});

// ─── INDIVIDUAL JOB PAGE ───────────────────────────────────────────────────────
app.get('/jobs/:id', (req, res) => {
  // ... your existing job detail route
});

// ─── SITEMAP INDEX ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  // ... your existing sitemap routes
});

app.get('/sitemap-:num.xml', (req, res) => {
  // ... your existing sitemap routes
});

// ─── SITEMAP HTML PAGE ─────────────────────────────────────────────────────────
app.get('/sitemap', (req, res) => {
  // ... your existing sitemap route
});

// ─── ROBOTS.TXT ────────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  // ... your existing robots route
});

// ─── API ─────────────────────────────────────────────────────────────────────
app.get('/api/jobs/:id', (req, res) => {
  // ... your existing API routes
});

app.get('/api/jobs', (req, res) => {
  // ... your existing API routes
});

app.listen(PORT, () => {
  console.log(`🇨🇦 CANOVA.ca running on port ${PORT}`);
  console.log(`📋 ${TOTAL_JOBS.toLocaleString()} job pages ready`);
  console.log(`🏢 ${companies.length} companies hiring in Canada`);
  console.log(`📍 ${canadaLocations.length} locations across Canada`);
});
