/* ------------------------------------------------------------------ *
 *  Single source of truth for everything on the page.
 *
 *  Anything marked TODO is a fact I could not verify from Rohit's
 *  documents — replace the string and the site updates everywhere.
 * ------------------------------------------------------------------ */

export const profile = {
  name: 'Rohit Pise',
  initials: 'RP',
  role: 'Data Science & Applied AI',
  location: 'Indore, Madhya Pradesh, India',
  email: 'piserohit982@gmail.com',
  phone: 'TODO: phone number',
  github: 'https://github.com/zenex07',
  githubHandle: 'zenex07',
  linkedin: 'TODO: LinkedIn URL',
  resumeUrl: './assets/rohit-pise-resume.pdf',

  // Hero — three lines, revealed one after another.
  headline: ['Data science', 'with a sense', 'of craft.'],

  lede:
    'I build systems that turn messy, real-world data into something people can actually use — multimodal retrieval engines, machine learning pipelines, and the interfaces that make them feel effortless.',

  bio: [
    'I am an MCA student at Shri Vaishnav Institute of Computer Applications in Indore, working at the seam where machine learning meets product. My interest is less in models for their own sake and more in the whole path: the data that feeds them, the retrieval that grounds them, and the interface that finally makes them worth using.',
    'That has meant fine-tuning a vision-language model to answer property questions in Hinglish, shipping a dataset-agnostic regression tool that cleans and benchmarks itself, and building a full public website for a non-profit — forms, offline chatbot, donation flow and all.',
  ],

  availability: 'Open to internships, full-time roles and select freelance work',
};

export const stats = [
  { value: '3', label: 'Production projects shipped' },
  { value: '8', label: 'Certifications earned' },
  { value: '1', label: 'Paper presented, first author' },
  { value: 'Elite', label: 'NPTEL grade, IIT Kanpur' },
];

/* ------------------------------------------------------------------ *
 *  Projects — all three are real, read from Rohit's own repositories.
 * ------------------------------------------------------------------ */
export const projects = [
  {
    index: '01',
    title: 'CAM-RAG',
    subtitle: 'Multimodal Regional Real-Estate Assistant',
    year: '2026',
    role: 'Design, training & engineering',
    summary:
      'Upload a floor plan or a property photo, ask a question in Hinglish, and get an answer grounded in real listings with citations. A context-aware multimodal RAG pipeline built end to end.',
    detail:
      'CLIP encodes both images and text into a shared space, ChromaDB handles similarity search over the listing corpus, and a LoRA fine-tuned Qwen-7B / Llama-3-8B generates the grounded response. Served behind a FastAPI endpoint with a Gradio front end, containerised with Docker Compose, and linted, tested and built by GitHub Actions on every push. Faithfulness and relevance are scored by an evaluation harness rather than eyeballed.',
    stack: [
      'CLIP ViT-B/32',
      'Qwen-7B / Llama-3-8B',
      'LoRA (Unsloth)',
      'ChromaDB',
      'FastAPI',
      'Gradio',
      'Docker',
      'GitHub Actions',
    ],
    highlights: [
      'Shared-embedding retrieval across images and text',
      'Hinglish question answering with source citations',
      'Automated faithfulness & relevance evaluation',
      'One-command Docker Compose demo',
    ],
    links: [{ label: 'TODO: repo URL', href: '#' }],
    accent: 'terracotta',
  },
  {
    index: '02',
    title: 'Price Predictor',
    subtitle: 'Dataset-agnostic regression studio',
    year: '2025',
    role: 'Solo build',
    summary:
      'Point it at any CSV with a price-like column. It cleans the data, trains four models, compares them honestly, and lets you predict a new record — all from one Streamlit interface.',
    detail:
      'The refinement pass drops duplicates, imputes numerics by median and categoricals by mode, and caps outliers with the IQR rule — then reports exactly what it changed. Linear, Ridge, Random Forest and Gradient Boosting all train behind one shared preprocessing pipeline, scored with 5-fold cross-validation plus a held-out test split on R-squared, RMSE and MAE. The prediction form builds itself from whatever columns your dataset actually has.',
    stack: ['Python', 'scikit-learn', 'pandas', 'Streamlit', 'Matplotlib'],
    highlights: [
      'Transparent cleaning report, not a black box',
      'Four models compared under one pipeline',
      '5-fold CV plus held-out test scoring',
      'Form and charts generated from your own schema',
    ],
    links: [{ label: 'TODO: repo URL', href: '#' }],
    accent: 'clay',
  },
  {
    index: '03',
    title: 'Manavta Ki Pehchan',
    subtitle: 'Public website for a non-profit',
    year: '2026',
    role: 'Full build, design to deploy',
    summary:
      'A complete public presence for an NGO: volunteer and internship intake, events, team, a donation flow, and a chatbot that answers questions without calling an API.',
    detail:
      'Built in React and TypeScript on Vite, with Framer Motion for the motion layer and a component library built up from scratch — accordion, form fields, cards, carousel. The chatbot is fully rule-based and offline, matching intents locally so it costs nothing to run and never leaks a visitor question. Routing, SEO metadata, skip links and accessible form validation throughout; configured for Vercel with SPA rewrites and asset caching.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Formik + Yup', 'Vercel'],
    highlights: [
      'Offline, rule-based chatbot — zero API cost',
      'Volunteer, internship, contact and donation flows',
      'Accessible forms with schema validation',
      'SEO metadata and SPA routing configured for Vercel',
    ],
    links: [{ label: 'TODO: live URL', href: '#' }],
    accent: 'olive',
  },
];

/* ------------------------------------------------------------------ *
 *  Skills
 * ------------------------------------------------------------------ */
export const skillGroups = [
  {
    title: 'Machine learning',
    items: [
      'PyTorch',
      'scikit-learn',
      'Transformers',
      'LoRA / PEFT',
      'CLIP',
      'RAG pipelines',
      'Model evaluation',
    ],
  },
  {
    title: 'Data',
    items: [
      'Python',
      'pandas',
      'NumPy',
      'ChromaDB',
      'Feature engineering',
      'Data cleaning',
      'Matplotlib',
    ],
  },
  {
    title: 'Engineering',
    items: [
      'FastAPI',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Docker',
      'GitHub Actions',
      'Streamlit',
      'Gradio',
    ],
  },
  {
    title: 'Foundations',
    items: ['Cloud, IoT & Edge ML', 'Prompt engineering', 'Java', 'Git', 'Linux'],
  },
];

/* ------------------------------------------------------------------ *
 *  Certifications — every one verified against the certificate itself.
 * ------------------------------------------------------------------ */
export const certificates = [
  {
    title: 'Foundation of Cloud IoT Edge ML',
    issuer: 'NPTEL · IIT Kanpur',
    date: 'Feb – Apr 2024',
    badge: 'Elite',
    meta: '8-week course · consolidated score 67% · 3,022 certified',
    detail: 'Assignments 20.25/25 · Proctored exam 46.5/75 · Roll no. NPTEL24CS26S557600107',
    file: './assets/certificates/nptel-cloud-iot-edge-ml.pdf',
    image: './assets/certificates/nptel-cloud-iot-edge-ml-iitk.jpg',
  },
  {
    title: 'Data Science with Project Work',
    issuer: 'The Prime Step Technologies',
    date: 'Oct 2024 – Jun 2025',
    badge: 'Excellence',
    meta: '8-month practical training · certificate no. 305023042023Q',
    detail: 'Practical training in data science with accompanying project work.',
    file: './assets/certificates/prime-step-data-science.jpg',
    image: './assets/certificates/prime-step-data-science.jpg',
  },
  {
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    date: 'May 2026',
    badge: null,
    meta: 'With University College Cork, Ringling College of Art + Design, HEA & National Forum',
    detail: 'Core framework for working fluently and deliberately with AI systems.',
    file: './assets/certificates/anthropic-ai-fluency-framework-foundations.pdf',
    image: './assets/certificates/thumb-anthropic-framework-foundations.png',
  },
  {
    title: 'AI Fluency: AI Capabilities & Limitations',
    issuer: 'Anthropic',
    date: 'May 2026',
    badge: null,
    meta: 'Certificate of completion',
    detail: 'Where current AI systems are strong, where they fail, and how to tell the difference.',
    file: './assets/certificates/anthropic-ai-fluency-capabilities-limitations.pdf',
    image: './assets/certificates/thumb-anthropic-capabilities-limitations.png',
  },
  {
    title: 'AI Fluency for Students',
    issuer: 'Anthropic',
    date: 'May 2026',
    badge: null,
    meta: 'With University College Cork, Ringling College of Art + Design, HEA & National Forum',
    detail: 'Applying AI fluency to study, research and academic work.',
    file: './assets/certificates/anthropic-ai-fluency-for-students.pdf',
    image: './assets/certificates/thumb-anthropic-for-students.png',
  },
  {
    title: 'Innovating with Google Cloud AI',
    issuer: 'Simplilearn SkillUp · Powered by Google Cloud',
    date: '12 May 2026',
    badge: null,
    meta: 'Certificate code 10217369',
    detail: 'Applying Google Cloud AI services to product problems.',
    file: './assets/certificates/innovating-with-google-cloud-ai.pdf',
    image: null,
  },
  {
    title: 'Introduction to Prompt Engineering',
    issuer: 'Simplilearn SkillUp',
    date: '12 May 2026',
    badge: null,
    meta: 'Certificate code 10216252',
    detail: 'Structured prompting patterns for large language models.',
    file: './assets/certificates/introduction-to-prompt-engineering.pdf',
    image: null,
  },
  {
    title: 'Paper Presentation — SANMANTRANA 2026',
    issuer: 'SVVV Indore, with St. Cloud State University, USA',
    date: '11 – 13 Feb 2026',
    badge: 'Presented',
    meta: 'Multi-Disciplinary International Congress',
    detail:
      'Presented "Technological Singularity" at Frontiers of Science and Technology: Integrating Innovations for Sustainable Future.',
    file: './assets/certificates/sanmantrana-2026-paper-presentation.pdf',
    image: null,
  },
];

/* ------------------------------------------------------------------ *
 *  Research
 * ------------------------------------------------------------------ */
export const research = {
  title: 'Artificial Intelligence: Technological Singularity',
  authors: 'Rohit Pise, Yogesh Shrivastav, Karishma Chouhan',
  venue: 'SANMANTRANA 2026 — Multi-Disciplinary International Congress',
  host: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore, in association with St. Cloud State University, USA',
  date: 'February 2026',
  abstract:
    'The paper examines technological singularity — the hypothesised point at which artificial intelligence surpasses human intelligence and drives rapid, unpredictable change. It traces the theoretical foundations of the idea, surveys the thinkers who shaped it, and works through how superintelligence might actually be reached, alongside the ethical, social and economic consequences of getting there. Machine learning, neural networks, cognitive computing and robotics are assessed as the advancing fronts that make the question pressing rather than speculative.',
  keywords: ['Technological Singularity', 'Artificial Intelligence', 'Superintelligent systems'],
  file: './assets/certificates/sanmantrana-2026-paper-presentation.pdf',
};

/* ------------------------------------------------------------------ *
 *  Education
 * ------------------------------------------------------------------ */
export const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    school: 'Shri Vaishnav Institute of Computer Applications',
    university: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore',
    period: 'TODO: start year – expected graduation',
    note: 'Presented a first-authored paper at an international congress during the first semester.',
  },
  {
    degree: 'TODO: bachelor degree',
    school: 'TODO: institution',
    university: '',
    period: 'TODO: years',
    note: '',
  },
];

/* ------------------------------------------------------------------ *
 *  Freelance services
 * ------------------------------------------------------------------ */
export const services = [
  {
    title: 'ML & RAG systems',
    body: 'Retrieval pipelines, fine-tuned models and evaluation harnesses — built to be measured, not guessed at.',
  },
  {
    title: 'Data tooling',
    body: 'Cleaning, modelling and the dashboards around them, so a dataset becomes a decision instead of a spreadsheet.',
  },
  {
    title: 'Product websites',
    body: 'React and TypeScript front ends with accessible forms, sensible SEO and motion that serves the content.',
  },
];

/* ------------------------------------------------------------------ *
 *  How I work — the pinned, scroll-driven section.
 * ------------------------------------------------------------------ */
export const approach = [
  {
    step: '01',
    title: 'Read the data first',
    body: 'Before a model exists there is a dataset, and it is almost always worse than it looks. Duplicates, missing fields, outliers that are really typos. I profile it and report what I changed, so nobody downstream has to guess.',
  },
  {
    step: '02',
    title: 'Set a baseline worth beating',
    body: 'The simplest model that could work, scored on a metric that will not flatter it — cross-validated, held-out, the whole thing. Everything after that has to earn its complexity against this number.',
  },
  {
    step: '03',
    title: 'Ground it, then check it',
    body: 'Generated answers get sources attached and are scored for faithfulness and relevance. A confident wrong answer is worse than no answer, so the evaluation harness ships with the model, not after it.',
  },
  {
    step: '04',
    title: 'Build the thing people touch',
    body: 'A model behind an API nobody can use is a hobby. I finish the job — the interface, the accessible form, the deploy config — because that is the part that decides whether the work mattered.',
  },
];

/* ------------------------------------------------------------------ *
 *  Journey — every entry corroborated by a document in /public/assets.
 * ------------------------------------------------------------------ */
export const journey = [
  {
    date: 'Feb – Apr 2024',
    title: 'NPTEL Elite — Foundation of Cloud IoT Edge ML',
    org: 'IIT Kanpur',
    body: 'Eight weeks on pushing machine learning to the edge, finished with an Elite grade alongside 3,022 other certified candidates.',
  },
  {
    date: 'Oct 2024',
    title: 'Started data science training',
    org: 'The Prime Step Technologies',
    body: 'An eight-month practical programme, structured around project work rather than lectures.',
  },
  {
    date: 'Jun 2025',
    title: 'Completed training with a Certificate of Excellence',
    org: 'The Prime Step Technologies',
    body: 'Shipped the accompanying project work and closed out the programme.',
  },
  {
    date: 'Feb 2026',
    title: 'Presented at an international congress',
    org: 'SANMANTRANA 2026, SVVV Indore',
    body: 'First author on “Technological Singularity”, presented at a multi-disciplinary congress run with St. Cloud State University, USA.',
  },
  {
    date: 'May 2026',
    title: 'Five certifications in a month',
    org: 'Anthropic, and Google Cloud AI & prompt engineering coursework',
    body: 'Three Anthropic AI Fluency courses plus Innovating with Google Cloud AI and Introduction to Prompt Engineering.',
  },
  {
    date: '2026',
    title: 'Shipped CAM-RAG and Manavta Ki Pehchan',
    org: 'Independent and client work',
    body: 'A multimodal retrieval assistant and a full public website for a non-profit, both taken from empty repository to deployed.',
  },
];

export const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Credentials', href: '#credentials' },
  { label: 'Contact', href: '#contact' },
];
