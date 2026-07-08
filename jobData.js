// Job data generator - deterministically generates 100,000 jobs for Canada
const TOTAL_JOBS = 100000;

const jobTitles = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Analyst", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Cloud Architect", "Mobile Developer", "Android Developer", "iOS Developer",
  "Product Manager", "Project Manager", "Scrum Master", "Business Analyst",
  "UI/UX Designer", "Graphic Designer", "Brand Designer", "Web Designer",
  "Marketing Manager", "Digital Marketing Specialist", "SEO Specialist", "Content Writer",
  "Copywriter", "Social Media Manager", "Community Manager", "Growth Hacker",
  "Sales Manager", "Account Manager", "Business Development Manager", "Sales Executive",
  "Financial Analyst", "Accountant", "Finance Manager", "Auditor",
  "HR Manager", "HR Generalist", "Recruiter", "Talent Acquisition Specialist",
  "Operations Manager", "Supply Chain Manager", "Logistics Coordinator", "Procurement Officer",
  "Customer Success Manager", "Customer Support Specialist", "Technical Support Engineer",
  "Network Engineer", "Cybersecurity Analyst", "Information Security Officer",
  "Database Administrator", "Systems Administrator", "IT Manager", "CTO",
  "Legal Counsel", "Compliance Officer", "Risk Manager", "Contract Manager",
  "Healthcare Administrator", "Clinical Research Associate", "Pharmacist", "Nurse",
  "Teacher", "Education Consultant", "Instructional Designer", "Training Manager",
  "Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Structural Engineer",
  "Architect", "Urban Planner", "Environmental Consultant", "Safety Officer",
  "Real Estate Agent", "Property Manager", "Facilities Manager", "Construction Manager",
  "Research Analyst", "Policy Analyst", "Communications Manager", "Public Relations Officer",
  "Executive Assistant", "Administrative Officer", "Office Manager", "Receptionist",
  "Video Editor", "Motion Graphics Designer", "Content Strategist", "Brand Manager",
  "Partnerships Manager", "Customer Experience Manager", "Data Engineer", "BI Developer",
  "Scrum Master", "Agile Coach", "Release Manager", "Site Reliability Engineer",
  "Penetration Tester", "Cloud Engineer", "Platform Engineer", "API Developer",
  "Hotel Manager", "Restaurant Manager", "Chef", "Sommelier", "Event Manager",
  "Aviation Engineer", "Pilot", "Flight Attendant", "Airport Manager",
  "Mining Engineer", "Geologist", "Forestry Technician", "Environmental Scientist"
];

// 75+ Canada based companies + global companies with Canada presence
const companies = [
  // Canada based
  "Royal Bank of Canada (RBC)", "TD Bank", "Scotiabank", "BMO", "CIBC",
  "Shopify", "BlackBerry", "OpenText", "Constellation Software", "CGI",
  "Lululemon", "Canadian Tire", "Sobeys", "Metro Inc.", "Loblaws",
  "Tim Hortons", "Second Cup", "Dollarama", "Roots", "Hudson's Bay",
  "Air Canada", "WestJet", "Porter Airlines", "Bombardier", "Magna International",
  "Brookfield Asset Management", "Sun Life Financial", "Manulife", "Great-West Life",
  "CN Rail", "CPKC", "Teck Resources", "Barrick Gold", "Kinross Gold",
  "Aliment Couche-Tard", "Restaurant Brands International", "Gildan Activewear",
  "BCE Inc.", "Rogers Communications", "Telus", "Shaw Communications", "Videotron",
  "Enbridge", "TC Energy", "Suncor Energy", "Imperial Oil", "Cenovus Energy",
  "Nutrien", "Agrium", "Mosaic", "Saputo", "Maple Leaf Foods",
  
  // Global with Canada presence
  "Google Canada", "Amazon Canada", "Microsoft Canada", "Apple Canada", "Meta Canada",
  "IBM Canada", "Oracle Canada", "Cisco Canada", "Dell Canada", "HP Canada",
  "SAP Canada", "Salesforce Canada", "Accenture Canada", "Deloitte Canada",
  "PwC Canada", "KPMG Canada", "EY Canada", "McKinsey Canada",
  "HSBC Canada", "Citi Canada", "JPMorgan Canada", "Goldman Sachs Canada",
  "Unilever Canada", "P&G Canada", "Nestle Canada", "Coca-Cola Canada",
  "Shell Canada", "BP Canada", "ExxonMobil Canada", "Chevron Canada",
  "Siemens Canada", "GE Canada", "Schneider Electric Canada", "ABB Canada",
  "Boeing Canada", "Airbus Canada", "Lockheed Martin Canada",
  "Pfizer Canada", "Novartis Canada", "Roche Canada", "GSK Canada",
  "Samsung Canada", "LG Canada", "Sony Canada", "Panasonic Canada",
  "Toyota Canada", "Honda Canada", "Nissan Canada", "BMW Canada", "Mercedes Canada",
  "LVMH Canada", "Chanel Canada", "Gucci Canada", "Rolex Canada"
];

const canadaLocations = [
  // Ontario
  "Toronto, Ontario", "Ottawa, Ontario", "Mississauga, Ontario", "Brampton, Ontario",
  "Hamilton, Ontario", "Kitchener, Ontario", "Waterloo, Ontario", "London, Ontario",
  "Markham, Ontario", "Vaughan, Ontario", "Oakville, Ontario", "Burlington, Ontario",
  "Oshawa, Ontario", "Whitby, Ontario", "Ajax, Ontario", "Pickering, Ontario",
  "Guelph, Ontario", "Cambridge, Ontario", "Barrie, Ontario", "Peterborough, Ontario",
  "Kingston, Ontario", "Windsor, Ontario", "Sarnia, Ontario", "Thunder Bay, Ontario",
  "Sudbury, Ontario", "North Bay, Ontario", "Sault Ste. Marie, Ontario",
  
  // British Columbia
  "Vancouver, British Columbia", "Surrey, British Columbia", "Burnaby, British Columbia",
  "Richmond, British Columbia", "Coquitlam, British Columbia", "Langley, British Columbia",
  "Victoria, British Columbia", "Kelowna, British Columbia", "Kamloops, British Columbia",
  "Nanaimo, British Columbia", "Prince George, British Columbia", "Abbotsford, British Columbia",
  
  // Alberta
  "Calgary, Alberta", "Edmonton, Alberta", "Red Deer, Alberta", "Lethbridge, Alberta",
  "Fort McMurray, Alberta", "Medicine Hat, Alberta", "Grande Prairie, Alberta",
  
  // Quebec
  "Montreal, Quebec", "Quebec City, Quebec", "Laval, Quebec", "Gatineau, Quebec",
  "Longueuil, Quebec", "Sherbrooke, Quebec", "Trois-Rivières, Quebec",
  "Saguenay, Quebec", "Levis, Quebec", "Terrebonne, Quebec",
  
  // Manitoba
  "Winnipeg, Manitoba", "Brandon, Manitoba", "Steinbach, Manitoba",
  
  // Saskatchewan
  "Saskatoon, Saskatchewan", "Regina, Saskatchewan", "Prince Albert, Saskatchewan",
  "Moose Jaw, Saskatchewan", "Swift Current, Saskatchewan",
  
  // Nova Scotia
  "Halifax, Nova Scotia", "Dartmouth, Nova Scotia", "Sydney, Nova Scotia",
  "Truro, Nova Scotia", "New Glasgow, Nova Scotia",
  
  // Other Provinces
  "St. John's, Newfoundland and Labrador", "Moncton, New Brunswick",
  "Fredericton, New Brunswick", "Saint John, New Brunswick",
  "Charlottetown, Prince Edward Island", "Whitehorse, Yukon",
  "Yellowknife, Northwest Territories", "Iqaluit, Nunavut",
  
  // Remote
  "Remote — Canada", "Remote — Ontario, Canada"
];

const salaryRanges = [
  { display: "CAD 3,000 – 4,500/month", min: 3000, max: 4500 },
  { display: "CAD 4,500 – 6,500/month", min: 4500, max: 6500 },
  { display: "CAD 6,500 – 8,500/month", min: 6500, max: 8500 },
  { display: "CAD 8,500 – 12,000/month", min: 8500, max: 12000 },
  { display: "CAD 12,000 – 16,000/month", min: 12000, max: 16000 },
  { display: "CAD 16,000 – 22,000/month", min: 16000, max: 22000 },
  { display: "CAD 22,000 – 30,000/month", min: 22000, max: 30000 },
  { display: "CAD 30,000 – 40,000/month", min: 30000, max: 40000 },
  { display: "CAD 40,000+/month", min: 40000, max: 55000 },
  { display: "CAD 2,000 – 3,500/month", min: 2000, max: 3500 }
];

const jobTypes = ["FULL_TIME", "CONTRACTOR", "PART_TIME", "INTERN", "TEMPORARY"];
const jobTypeDisplay = { 
  "FULL_TIME": "Full-time", 
  "CONTRACTOR": "Contract", 
  "PART_TIME": "Part-time", 
  "INTERN": "Internship", 
  "TEMPORARY": "Temporary" 
};

const experienceLevels = [
  { display: "Entry Level", schema: "no requirements" },
  { display: "Mid Level",   schema: "2 years experience" },
  { display: "Senior Level",schema: "5 years experience" },
  { display: "Lead",        schema: "7 years experience" },
  { display: "Manager",     schema: "5 years experience" },
  { display: "Director",    schema: "8 years experience" },
  { display: "Executive",   schema: "10 years experience" }
];

const industries = [
  "Technology", "Fintech", "E-commerce", "Banking & Finance", "Oil & Gas",
  "Real Estate", "Healthcare", "Education", "Consulting", "Aviation",
  "Construction", "Logistics & Shipping", "Hospitality", "Retail", "Media & Entertainment",
  "Renewable Energy", "Automotive", "Telecommunications", "Legal", "Government",
  "Mining", "Forestry", "Agriculture", "Fisheries"
];

const jobDescriptions = [
  (title, company, isRemote, location) => `We are seeking a talented ${title} to join the team at ${company} in Canada. ${isRemote ? "This is a fully remote role open to qualified candidates across Canada." : `This role is based in ${location}.`}

You will be responsible for delivering high-quality work that drives business outcomes and contributes to ${company}'s growing operations in Canada and North American markets.

Key Responsibilities:
• Lead and execute core ${title.toLowerCase()} functions across the organization
• Collaborate with cross-functional teams to deliver on strategic objectives
• Analyze data and provide actionable insights to improve performance
• Mentor junior team members and contribute to knowledge sharing
• Ensure best practices are followed in all deliverables

Requirements:
• 3–5 years of experience in a similar ${title.toLowerCase()} role
• Strong communication and problem-solving skills
• Experience working in fast-paced global business environment
• Bachelor's degree in a relevant field
• Proficiency with modern tools and platforms

What We Offer:
• Competitive salary in CAD
• Comprehensive health benefits
• 3-4 weeks annual leave
• Remote work allowance
• Annual performance bonus
• Professional development budget
• RRSP matching program`,

  (title, company, isRemote, location) => `${company} is hiring a ${title}! We are a leading company in Canada looking for experienced professionals to scale our impact across the country.

${isRemote ? "This remote-first position allows you to work from anywhere in Canada with flexible hours." : `You will work from our ${location} office with a dynamic, ambitious team.`}

About the Role:
As a ${title} at ${company}, you will play a key role in shaping our products and services. You'll work closely with leadership and peers to execute on our mission.

What You'll Do:
• Drive key ${title.toLowerCase()} initiatives from planning to execution
• Build and maintain relationships with key stakeholders
• Report on KPIs and contribute to strategic planning
• Stay updated on industry trends globally and in Canada
• Represent ${company} with professionalism and integrity

What You Bring:
• 2–6 years proven experience as a ${title.toLowerCase()}
• Strong analytical and communication skills
• Team player with a growth mindset
• Relevant certification or degree preferred

Compensation & Benefits:
• Competitive CAD salary • Health benefits • Annual leave (3-4 weeks) • RRSP matching • Performance bonus`,

  (title, company, isRemote, location) => `Join ${company} as a ${title} and be part of one of Canada's most exciting companies!

${isRemote ? "🌐 Remote | Work from anywhere in Canada" : `📍 ${location}`}

We're building the future of business in Canada and need exceptional talent like you. This is a rare opportunity to work with a world-class brand.

The Opportunity:
You'll be taking on the ${title} role at a critical growth stage. Your work will directly impact millions of customers across Canada and beyond.

Day-to-Day Responsibilities:
• Execute and improve key workflows within the ${title.toLowerCase()} function
• Collaborate with product, engineering, and business teams
• Track metrics and optimize for performance
• Contribute to a culture of excellence and innovation
• Support senior leadership with reporting and strategy

Your Profile:
• 3+ years in ${title.toLowerCase()} or related field
• Comfortable in a fast-moving business ecosystem
• Strong interpersonal skills and professional work ethic
• Degree in relevant discipline (Master's is a plus)

Perks at ${company}:
Competitive salary | Health & dental benefits | RRSP matching | Annual bonus | 4 weeks leave | Learning budget | Flexible hours`
];

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getJobData(id) {
  const seed = id * 7919;
  const r = (offset = 0) => seededRandom(seed + offset);

  const isRemote = id <= TOTAL_JOBS / 2;

  const companyIndex = Math.floor((id - 1) / Math.ceil(TOTAL_JOBS / companies.length)) % companies.length;

  const titleIndex   = Math.floor(r(1) * jobTitles.length);
  const locationIndex= Math.floor(r(3) * canadaLocations.length);
  const salaryIndex  = Math.floor(r(4) * salaryRanges.length);
  const jobTypeIndex = Math.floor(r(5) * jobTypes.length);
  const expIndex     = Math.floor(r(6) * experienceLevels.length);
  const industryIndex= Math.floor(r(7) * industries.length);
  const descIndex    = Math.floor(r(8) * jobDescriptions.length);

  const title    = jobTitles[titleIndex];
  const company  = companies[companyIndex];
  const location = isRemote ? "Remote — Canada" : canadaLocations[locationIndex];
  const salary   = salaryRanges[salaryIndex];
  const jobType  = jobTypes[jobTypeIndex];
  const exp      = experienceLevels[expIndex];
  const industry = industries[industryIndex];
  const description = jobDescriptions[descIndex](title, company, isRemote, canadaLocations[locationIndex]);

  const daysAgo = Math.floor(r(9) * 60);
  const postedDate = new Date();
  postedDate.setDate(postedDate.getDate() - daysAgo);
  const validThrough = new Date(postedDate);
  validThrough.setDate(validThrough.getDate() + 90);

  return {
    id,
    title,
    company,
    location,
    salary: salary.display,
    salaryMin: salary.min,
    salaryMax: salary.max,
    jobType,
    jobTypeDisplay: jobTypeDisplay[jobType],
    experience: exp.display,
    experienceSchema: exp.schema,
    industry,
    isRemote,
    description,
    postedDate: postedDate.toISOString().split('T')[0],
    validThrough: validThrough.toISOString().split('T')[0],
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`
  };
}

function getJobSchema(job) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": `JOB-CA-${String(job.id).padStart(6, '0')}`
    },
    "datePosted": job.postedDate,
    "validThrough": `${job.validThrough}T00:00:00Z`,
    "employmentType": job.jobType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": `https://www.google.com/search?q=${encodeURIComponent(job.company)}`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.isRemote ? "Canada" : job.location.split(',')[0],
        "addressCountry": "CA"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Canada"
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "CAD",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": job.salaryMin,
        "maxValue": job.salaryMax,
        "unitText": "MONTH"
      }
    },
    "experienceRequirements": {
      "@type": "OccupationalExperienceRequirements",
      "monthsOfExperience": job.experienceSchema === "no requirements" ? 0
        : parseInt(job.experienceSchema) * 12
    },
    "industry": job.industry,
    "url": `/jobs/${job.id}`,
    "directApply": true
  };

  if (job.isRemote) {
    schema.jobLocationType = "TELECOMMUTE";
  }

  return schema;
}

module.exports = { getJobData, getJobSchema, TOTAL_JOBS, jobTitles, companies, canadaLocations, industries };
