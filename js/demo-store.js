/*
 * EmpowerOne browser-demo repository.
 * This adapter keeps the static prototype coherent across routes. It is not
 * authentication or tenant security: production authorization must be enforced
 * by the API/database before returning organisation data.
 */
(() => {
  const STORAGE_KEY = 'empowerone.demo.v1';
  const roles = ['superadmin', 'creator', 'spoc', 'learner'];
  const initial = () => ({
    version: 1,
    organisations: [
      { id: 'jetex', name: 'Jetex Manufacturing Pvt. Ltd.', status: 'Active', activeLearners: 147, licenceLimit: 200, completionRate: 74, overdueLearners: 12, contractStart: '2025-04-01', contractEnd: '2027-03-31', city: 'Pune', state: 'Maharashtra', industry: 'Automotive', departments: ['Manufacturing', 'Materials', 'Quality', 'Maintenance', 'Engineering / R&D', 'Tool Room', 'NPD'], courseIds: ['inventory-management', 'oee-ole', 'supplier-capacity'], spocs: ['Priya Sharma'], spocEmail: 'priya.s@jetex.com' },
      { id: 'abc-auto', name: 'ABC Auto Components', status: 'Active', activeLearners: 86, licenceLimit: 120, completionRate: 61, contractStart: '2025-08-01', contractEnd: '2027-07-31', city: 'Chennai', state: 'Tamil Nadu', industry: 'Automotive', departments: ['Manufacturing', 'Quality', 'Materials'], courseIds: ['inventory-management', 'oee-ole'], spocs: ['Meera Joshi'], spocEmail: 'meera.j@abcauto.com' },
      { id: 'shakti', name: 'Shakti Precision Systems', status: 'Active', activeLearners: 63, licenceLimit: 100, completionRate: 82, contractStart: '2026-01-01', contractEnd: '2027-12-31', city: 'Pune', state: 'Maharashtra', industry: 'Precision Manufacturing', departments: ['Manufacturing', 'Maintenance', 'Tool Room'], courseIds: ['oee-ole', 'supplier-capacity'], spocs: ['Arun Desai'], spocEmail: 'arun.d@shaktiprecision.com' },
      { id: 'nova', name: 'Nova Industrial Works', status: 'Onboarding', activeLearners: 0, licenceLimit: 80, completionRate: 0, contractStart: '2026-08-01', contractEnd: '2027-07-31', city: 'Ahmedabad', state: 'Gujarat', industry: 'Industrial Manufacturing', departments: ['Manufacturing', 'Materials', 'NPD'], courseIds: [], spocs: ['Kavita Rao'], spocEmail: 'kavita.r@novaindustrial.com' }
    ],
    users: [
      { id: 'user-admin', name: 'Ananya Rao', email: 'admin@empowerone.in', role: 'superadmin' },
      { id: 'user-creator', name: 'Devika Shah', email: 'creator@empowerone.in', role: 'creator' },
      { id: 'user-spoc', name: 'Priya Sharma', email: 'hr@jetexmfg.com', role: 'spoc', organisationId: 'jetex' },
      { id: 'user-learner', name: 'Aarav Mehta', email: 'learner@jetexmfg.com', role: 'learner', organisationId: 'jetex', department: 'Manufacturing', designation: 'Line Operator' }
    ],
    courses: [
      { id: 'inventory-management', title: 'Inventory Management', department: 'Materials', creator: 'Devika Shah', status: 'Published', approvalStatus: 'Approved', moduleCount: 8, duration: '8 hours', requiredItemCount: 27, assessment: { passPercent: 70, unlimitedAttempts: true } },
      { id: 'oee-ole', title: 'OEE & OLE', department: 'Manufacturing', creator: 'Devika Shah', status: 'Published', approvalStatus: 'Approved', moduleCount: 6, duration: '3 hours', requiredItemCount: 18, assessment: { passPercent: 70, unlimitedAttempts: true } },
      { id: 'supplier-capacity', title: 'Supplier Capacity', department: 'Materials', creator: 'Devika Shah', status: 'Published', approvalStatus: 'Approved', moduleCount: 5, duration: '2 hours', requiredItemCount: 15, assessment: { passPercent: 70, unlimitedAttempts: true } },
      { id: 'lean-manufacturing', title: 'Lean Manufacturing Foundations', department: 'Manufacturing', creator: 'Rohan Kulkarni', status: 'Published', approvalStatus: 'Approved', moduleCount: 5, duration: '2.5 hours', requiredItemCount: 16, assessment: { passPercent: 70, unlimitedAttempts: true } },
      { id: 'resource-planning-fundamentals', title: 'Resource Planning Fundamentals', department: 'Manufacturing', creator: 'Ravi Kumar', status: 'In Review', approvalStatus: 'Pending', moduleCount: 7, duration: '4 hours', requiredItemCount: 22, modules: [{title:'Capacity Fundamentals',items:[{title:'Resource planning in a plant',type:'video'},{title:'Key production resources',type:'pdf'}]},{title:'Demand vs Capacity',items:[{title:'Translate demand into load',type:'video'},{title:'Capacity review worksheet',type:'document'}]}], assessment: { passPercent: 70, questionCount: 20, unlimitedAttempts: true } },
      { id: '5s-workplace-organisation', title: '5S Workplace Organisation', department: 'Manufacturing', creator: 'Meena Pillai', status: 'In Review', approvalStatus: 'Pending', moduleCount: 5, duration: '2.5 hours', requiredItemCount: 18, modules: [{title:'Sort and Set in Order',items:[{title:'Identify point-of-use tools',type:'video'},{title:'Visual location standards',type:'document'}]},{title:'Sustain the Standard',items:[{title:'Layered 5S checks',type:'video'}]}], assessment: { passPercent: 70, questionCount: 18, unlimitedAttempts: true } },
      { id: 'quality-systems-awareness', title: 'Quality Systems Awareness', department: 'Quality', creator: 'Ravi Kumar', status: 'In Review', approvalStatus: 'Pending', moduleCount: 6, duration: '3 hours', requiredItemCount: 20, modules: [{title:'Quality at the Source',items:[{title:'Build quality into each operation',type:'video'},{title:'Inspection records guide',type:'pdf'}]},{title:'IATF and Plant Controls',items:[{title:'Traceability on the line',type:'video'},{title:'Nonconformance quick reference',type:'document'}]}], assessment: { passPercent: 70, questionCount: 20, unlimitedAttempts: true } }
    ],
    learners: [
      { id: 'learner-rajesh', first: 'Rajesh', last: 'Kumar', email: 'rajesh.k@jetex.com', department: 'Manufacturing', designation: 'Line Operator', organisationId: 'jetex', status: 'Completed', progress: 100 },
      { id: 'learner-priyanka', first: 'Priyanka', last: 'Singh', email: 'priyanka.s@jetex.com', department: 'Materials', designation: 'Stores In-Charge', organisationId: 'jetex', status: 'Completed', progress: 100 },
      { id: 'learner-amit', first: 'Amit', last: 'Mahajan', email: 'amit.m@jetex.com', department: 'Quality', designation: 'QC Inspector', organisationId: 'jetex', status: 'In Progress', progress: 30 },
      { id: 'learner-vijay', first: 'Vijay', last: 'Nair', email: 'vijay.n@jetex.com', department: 'Manufacturing', designation: 'Machine Operator', organisationId: 'jetex', status: 'Overdue', progress: 0 },
      { id: 'learner-suresh', first: 'Suresh', last: 'Patil', email: 'suresh.p@jetex.com', department: 'Maintenance', designation: 'Maintenance Technician', organisationId: 'jetex', status: 'In Progress', progress: 55 },
      { id: 'learner-neha', first: 'Neha', last: 'Kulkarni', email: 'neha.k@jetex.com', department: 'Materials', designation: 'Purchase Officer', organisationId: 'jetex', status: 'Completed', progress: 100 }
    ],
    assignments: [],
    progress: [],
    attempts: [],
    approvals: [
      { id: 'approval-resource', courseId: 'resource-planning-fundamentals', creatorId: 'user-creator', status: 'Pending', submittedAt: '2026-09-24T09:30:00.000Z' },
      { id: 'approval-5s', courseId: '5s-workplace-organisation', creatorId: 'user-creator', status: 'Pending', submittedAt: '2026-09-23T09:30:00.000Z' },
      { id: 'approval-quality', courseId: 'quality-systems-awareness', creatorId: 'user-creator', status: 'Pending', submittedAt: '2026-09-21T09:30:00.000Z' }
    ],
    notifications: [],
    settings: {}
  });

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (value && value.version === 1) {
        const defaults=initial();
        value.organisations ||= defaults.organisations;
        value.organisations.forEach(org=>{const seed=defaults.organisations.find(item=>item.id===org.id);if(org.overdueLearners===undefined)org.overdueLearners=seed?.overdueLearners||0;});
        value.settings ||= {};
        ['users','courses','learners','assignments','progress','attempts','approvals','notifications'].forEach(key=>{if(!Array.isArray(value[key]))value[key]=defaults[key];});
        localStorage.setItem(STORAGE_KEY,JSON.stringify(value));
        return value;
      }
      const state = initial();
      const oldLearners = JSON.parse(localStorage.getItem('empowerone.learners') || '[]');
      oldLearners.forEach(learner => {
        if (!state.learners.some(existing => existing.email.toLowerCase() === learner.email.toLowerCase())) {
          state.learners.push({ ...learner, id: `learner-${Date.now()}-${state.learners.length}`, organisationId: 'jetex', status: 'Not Started', progress: 0 });
          const org = state.organisations[0];
          org.activeLearners = Math.min(org.licenceLimit, org.activeLearners + 1);
        }
      });
      state.organisations.forEach(org => org.courseIds.forEach(courseId => state.assignments.push({ organisationId: org.id, courseId, assignedAt: '2026-01-01T00:00:00.000Z' })));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    } catch (error) {
      return initial();
    }
  }

  let state = read();
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  document.documentElement.classList.add('demo-mode');
  const contextBar = document.querySelector('.topbar .tb-right, .learn-topbar, #topbar-assess');
  if (contextBar && !contextBar.querySelector('.demo-environment-badge')) {
    const badge = document.createElement('span');
    badge.className = 'demo-environment-badge';
    badge.textContent = 'Demo environment';
    badge.setAttribute('aria-label', 'Demo environment. Data is saved in this browser only.');
    contextBar.appendChild(badge);
  }
  function currentRole() {
    const savedRole = sessionStorage.getItem('empowerone.demoRole');
    return roles.includes(savedRole) ? savedRole : 'spoc';
  }
  function currentOrganisationId() {
    return sessionStorage.getItem('empowerone.demoOrganisationId') || 'jetex';
  }
  function renderRoleShell() {
    const role=currentRole();
    const routes={
      superadmin:[['super-admin-dashboard.html','Dashboard','M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'],['organisations.html','Organisations','M3 21h18 M5 21V7l7-4 7 4v14 M9 21v-6h6v6'],['learners.html','Learners','M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8'],['course-management.html','Courses','m12 2 10 5-10 5L2 7z M2 12l10 5 10-5 M2 17l10 5 10-5'],['course-approval.html','Approvals','m9 12 2 2 4-4 M21 12a9 9 0 1 1-5-8'],['content-creator.html','Content','M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'],['settings.html','Settings','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M3 12h2m14 0h2 M12 3v2m0 14v2']],
      creator:[['content-creator.html','Course builder','M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6'],['course-management.html','My courses','m12 2 10 5-10 5L2 7z M2 12l10 5 10-5'],['settings.html','Settings','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8']],
      spoc:[['spoc-dashboard.html','Dashboard','M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'],['learners.html','Learners','M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0 8'],['organisation-courses.html','Courses','m12 2 10 5-10 5L2 7z M2 12l10 5 10-5'],['spoc-dashboard.html#reports','Reports','M4 19V5m8 14V9m8 10V3'],['settings.html','Settings','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8']],
      learner:[['learner-dashboard.html','My learning','M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z'],['learner-dashboard.html#assigned-courses','Assigned courses','m12 2 10 5-10 5L2 7z M2 12l10 5 10-5'],['learner-dashboard.html#completed-courses','Completed courses','m9 12 2 2 4-4 M21 12a9 9 0 1 1-5-8'],['settings.html','Profile & settings','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8']]
    };
    const menu=document.querySelector('.sidebar .snav');
    if(menu){
      const current=decodeURIComponent(location.pathname.split('/').pop()||'');
      const links=routes[role]||routes.spoc;
      menu.innerHTML=links.map((item,index)=>{const [href,label,path]=item;const target=href.split('#')[0];const active=(target===current)||(!current&&index===0);return `${index===0?'<div class="snav-section">Workspace</div>':''}<a href="${href}" class="snav-item${active?' active':''}"${active?' aria-current="page"':''}><svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg><span>${label}</span></a>`;}).join('');
    }
    document.querySelectorAll('[data-roles]').forEach(control=>{control.hidden=!control.dataset.roles.split(',').includes(role);});
    const userId=sessionStorage.getItem('empowerone.demoUserId')||(role==='superadmin'?'user-admin':role==='creator'?'user-creator':role==='learner'?'user-learner':'user-spoc');
    const user=state.users.find(item=>item.id===userId)||state.users.find(item=>item.role===role);
    const org=getOrganisation(currentOrganisationId());
    if(user){
      document.querySelectorAll('.sidebar-user,.sidebar-foot .suser').forEach(block=>{const name=block.querySelector('.suser-name');if(name)name.textContent=user.name;const roleText=block.querySelector('.suser-role');if(roleText)roleText.textContent=role==='learner'?`${user.designation||'Learner'} · ${user.department||'Manufacturing'}`:role==='superadmin'?'Platform Administrator':role==='creator'?'Content Creator':`SPOC · ${org?.name||'Organisation'}`;const avatar=block.querySelector('.av');if(avatar)avatar.textContent=user.name.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();});
      document.querySelectorAll('.topbar .tb-right .av,.learn-topbar .av,#topbar-assess .av').forEach(avatar=>{avatar.textContent=user.name.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase();avatar.setAttribute('aria-label',user.name);});
    }
    if((role==='spoc'||role==='learner')&&org){const context=document.querySelector('.breadcrumb .t-tm');if(context)context.textContent=org.name;}
  }
  function assertRole(allowed) {
    if (!allowed.includes(currentRole())) throw new Error('This action is not available for the current demo role.');
  }
  function scopedOrganisationId(requestedId) {
    const role = currentRole();
    if (role === 'spoc' || role === 'learner') {
      const ownId = currentOrganisationId();
      if (requestedId && requestedId !== ownId) throw new Error('Organisation access is restricted in this demo.');
      return ownId;
    }
    return requestedId || currentOrganisationId();
  }
  function idFor(value) { return String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function getOrganisation(id) { return state.organisations.find(org => org.id === (id || currentOrganisationId())) || null; }
  function getVisibleLearners(organisationId) {
    const scopedId = scopedOrganisationId(organisationId);
    return state.learners.filter(learner => learner.organisationId === scopedId);
  }
  function assignedCourseIds(organisationId) {
    const scopedId = scopedOrganisationId(organisationId);
    return state.assignments.filter(item => item.organisationId === scopedId).map(item => item.courseId);
  }
  function addLearner(input, organisationId) {
    assertRole(['spoc', 'superadmin']);
    const scopedId = scopedOrganisationId(organisationId);
    const org = getOrganisation(scopedId);
    if (!org) throw new Error('Organisation not found.');
    if (org.activeLearners >= org.licenceLimit) throw new Error('All learner licences are in use.');
    const email = String(input.email || '').trim().toLowerCase();
    if (!email || state.learners.some(learner => learner.organisationId === scopedId && learner.email.toLowerCase() === email)) throw new Error('A learner with this email already exists.');
    const uniqueId = window.crypto && typeof window.crypto.randomUUID === 'function' ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const learner = { id: `learner-${uniqueId}`, first: String(input.first || '').trim(), last: String(input.last || '').trim(), email, department: String(input.department || '').trim(), designation: String(input.designation || '').trim(), employeeId: String(input.employeeId || '').trim(), organisationId: scopedId, status: 'Not Started', progress: 0, assignedCourseIds: assignedCourseIds(scopedId), createdAt: new Date().toISOString() };
    state.learners.push(learner);
    state.users.push({ id: learner.id, name: `${learner.first} ${learner.last}`, email, role: 'learner', organisationId: scopedId, department: learner.department, designation: learner.designation });
    org.activeLearners += 1;
    state.notifications.unshift({ id: `notification-${Date.now()}`, title: 'Learner added', body: `${learner.first} ${learner.last} received ${learner.assignedCourseIds.length} organisation-assigned courses.`, createdAt: new Date().toISOString(), read: false, organisationId: scopedId });
    save();
    return learner;
  }
  function addOrganisation(input) {
    assertRole(['superadmin']);
    const name=String(input.name||'').trim();
    if(!name)throw new Error('Enter an organisation name.');
    if(state.organisations.some(org=>org.name.toLowerCase()===name.toLowerCase()))throw new Error('An organisation with this name already exists.');
    const id=idFor(name);
    const organisation={id,name,status:'Onboarding',activeLearners:0,licenceLimit:Math.max(1,Number(input.licenceLimit)||1),contractStart:input.contractStart||'',contractEnd:input.contractEnd||'',departments:[],courseIds:[],spocs:input.spocName?[String(input.spocName).trim()]:[],city:String(input.city||'').trim(),state:String(input.state||'').trim(),industry:String(input.industry||'').trim(),spocEmail:String(input.spocEmail||'').trim()};
    state.organisations.push(organisation);
    if(organisation.spocs.length)state.users.push({id:`spoc-${id}`,name:organisation.spocs[0],email:organisation.spocEmail,role:'spoc',organisationId:id});
    save();return organisation;
  }
  function assignCourses(courseId, organisationIds) {
    assertRole(['superadmin']);
    if (!state.courses.some(course => course.id === courseId)) throw new Error('Course not found.');
    const nextIds = new Set(organisationIds);
    state.assignments = state.assignments.filter(item => item.courseId !== courseId || !state.organisations.some(org => org.id === item.organisationId));
    state.organisations.forEach(org => {
      org.courseIds = org.courseIds.filter(id => id !== courseId);
      if (!nextIds.has(org.id)) return;
      org.courseIds.push(courseId);
      state.assignments = state.assignments.filter(item => !(item.organisationId === org.id && item.courseId === courseId));
      state.assignments.push({ organisationId: org.id, courseId, assignedAt: new Date().toISOString() });
    });
    state.learners.forEach(learner => {
      learner.assignedCourseIds = learner.assignedCourseIds || [];
      if (nextIds.has(learner.organisationId) && !learner.assignedCourseIds.includes(courseId)) learner.assignedCourseIds.push(courseId);
      if (!nextIds.has(learner.organisationId)) learner.assignedCourseIds = learner.assignedCourseIds.filter(id => id !== courseId);
    });
    state.notifications.unshift({ id: `notification-${Date.now()}`, title: 'Course assignment updated', body: `${getCourse(courseId)?.title || courseId} was assigned to ${nextIds.size} organisations.`, createdAt: new Date().toISOString(), read: false });
    save();
  }
  function getCourse(courseId) { return state.courses.find(course => course.id === courseId) || null; }
  function courseIdForTitle(title) {
    const normalized = String(title).toLowerCase().trim();
    if (normalized.includes('supplier capacity')) return 'supplier-capacity';
    if (normalized.includes('5s workplace')) return '5s-workplace-organisation';
    return state.courses.find(course => course.title.toLowerCase() === normalized)?.id || idFor(title);
  }
  function saveCourse(course) {
    assertRole(['creator', 'superadmin']);
    const baseId=idFor(course.title);
    const titleAlreadyExists=state.courses.some(item=>item.title.toLowerCase()===String(course.title||'').toLowerCase());
    const id = course.id || (titleAlreadyExists?`${baseId}-${Date.now().toString(36)}`:baseId);
    const existing = state.courses.findIndex(item => item.id === id);
    const current=existing>=0?state.courses[existing]:null;
    const preserveReview=current?.status==='In Review';
    const saved = { ...(current || {}), ...course, id, status: preserveReview?'In Review':'Draft', approvalStatus: preserveReview?'Pending':'Draft', updatedAt: new Date().toISOString() };
    if (existing >= 0) state.courses[existing] = saved; else state.courses.push(saved);
    save();
    return saved;
  }
  function submitCourse(courseId) {
    assertRole(['creator']);
    const course = getCourse(courseId);
    if (!course) throw new Error('Save this course as a draft before submitting it.');
    course.status = 'In Review'; course.approvalStatus = 'Pending';
    const approval = { id: `approval-${Date.now()}`, courseId, creatorId: sessionStorage.getItem('empowerone.demoUserId') || 'user-creator', status: 'Pending', submittedAt: new Date().toISOString() };
    state.approvals.unshift(approval);
    state.notifications.unshift({ id: `notification-${Date.now()}`, title: 'Course submitted for review', body: `${course.title} is waiting for Super Admin review.`, createdAt: new Date().toISOString(), read: false });
    save();
    return approval;
  }
  function reviewCourse(courseId, outcome, comment) {
    assertRole(['superadmin']);
    const course = getCourse(courseId);
    if (!course) throw new Error('Course not found.');
    const approval = state.approvals.find(item => item.courseId === courseId && item.status === 'Pending');
    if (approval?.creatorId && approval.creatorId === sessionStorage.getItem('empowerone.demoUserId')) throw new Error('Creators cannot approve their own content.');
    if (!['Approved', 'Rejected'].includes(outcome)) throw new Error('Choose approve or reject.');
    if (outcome === 'Rejected' && !String(comment || '').trim()) throw new Error('Add a rejection reason before continuing.');
    course.approvalStatus = outcome;
    course.status = outcome === 'Approved' ? 'Published' : 'Draft';
    if (approval) { approval.status = outcome; approval.comment = String(comment || '').trim(); approval.reviewedAt = new Date().toISOString(); }
    save();
    return course;
  }
  function addNotification(notification) {
    const entry = { id: `notification-${Date.now()}`, createdAt: new Date().toISOString(), read: false, ...notification };
    state.notifications.unshift(entry);
    save();
    document.dispatchEvent(new CustomEvent('empowerone:notifications-changed'));
    return entry;
  }
  function saveUserSettings(userId, values) {
    const user = state.users.find(item => item.id === userId);
    if (!user || user.id !== (sessionStorage.getItem('empowerone.demoUserId') || 'user-spoc')) throw new Error('You can only update your own demo settings.');
    if (values.name) user.name = String(values.name).trim();
    state.settings[userId] = { ...(state.settings[userId] || {}), ...values, updatedAt: new Date().toISOString() };
    save();
    return state.settings[userId];
  }
  function saveOrganisationProfile(values, organisationId) {
    assertRole(['spoc', 'superadmin']);
    const org = getOrganisation(scopedOrganisationId(organisationId));
    if (!org) throw new Error('Organisation not found.');
    if (values.name) org.name = String(values.name).trim();
    if (Array.isArray(values.departments)) org.departments = values.departments.map(item => String(item).trim()).filter(Boolean);
    if(currentRole()==='superadmin'){
      ['city','state','industry','contractStart','contractEnd'].forEach(key=>{if(values[key]!==undefined)org[key]=String(values[key]).trim();});
      if(values.licenceLimit!==undefined)org.licenceLimit=Math.max(org.activeLearners,Number(values.licenceLimit)||org.licenceLimit);
      if(values.spocName!==undefined)org.spocs=values.spocName?[String(values.spocName).trim()]:[];
      if(values.spocEmail!==undefined)org.spocEmail=String(values.spocEmail).trim();
    }
    save();
    return org;
  }
  function recordVideoProgress(learnerId, courseId, itemId, currentTime, duration) {
    assertRole(['learner']);
    const learner = state.learners.find(item => item.id === learnerId) || state.users.find(item => item.id === learnerId);
    if (learner?.organisationId) scopedOrganisationId(learner.organisationId);
    else if (currentRole() !== 'learner') assertRole(['spoc', 'superadmin']);
    const watched = Math.max(0, Number(currentTime) || 0);
    const total = Math.max(0, Number(duration) || 0);
    const key = `${learnerId}:${courseId}:${itemId}`;
    const record = state.progress.find(item => item.id === key) || { id: key, learnerId, courseId, itemId, completed: false, completedAt: null };
    record.lastPosition = watched;
    record.duration = total;
    record.percent = total ? Math.min(100, Math.round(watched / total * 100)) : 0;
    if (record.percent >= 90) { record.completed = true; record.completedAt ||= new Date().toISOString(); }
    if (!state.progress.includes(record)) state.progress.push(record);
    save();
    return record;
  }
  function completeContentItem(learnerId, courseId, itemId) {
    assertRole(['learner']);
    const learner = state.learners.find(item => item.id === learnerId) || state.users.find(item => item.id === learnerId);
    if (learner?.organisationId) scopedOrganisationId(learner.organisationId);
    else if (currentRole() !== 'learner') assertRole(['spoc', 'superadmin']);
    const key=`${learnerId}:${courseId}:${itemId}`;
    let record=state.progress.find(item=>item.id===key);
    if(!record){record={id:key,learnerId,courseId,itemId,lastPosition:0,duration:0,percent:100,completed:true,completedAt:new Date().toISOString()};state.progress.push(record);}
    else {record.percent=100;record.completed=true;record.completedAt ||= new Date().toISOString();}
    save();return record;
  }
  function submitAttempt(learnerId, courseId, score, total) {
    assertRole(['learner']);
    const course = getCourse(courseId);
    if (!course) throw new Error('Course not found.');
    const learner = state.learners.find(item => item.id === learnerId) || state.users.find(item => item.id === learnerId);
    if (learner?.organisationId) scopedOrganisationId(learner.organisationId);
    const completeItems = state.progress.filter(item => item.learnerId === learnerId && item.courseId === courseId && item.completed).length;
    const required = Number(course.requiredItemCount) || 0;
    if (required && completeItems < required) throw new Error('Complete all required learning content before submitting the assessment.');
    const points = Math.max(0, Number(score) || 0);
    const totalPoints = Math.max(1, Number(total) || 1);
    const percent = Math.round(points / totalPoints * 100);
    const attempts = state.attempts.filter(item => item.learnerId === learnerId && item.courseId === courseId);
    const attempt = { id: `attempt-${Date.now()}`, learnerId, courseId, score: points, total: totalPoints, percent, attemptNumber: attempts.length + 1, passed: percent >= 70, submittedAt: new Date().toISOString() };
    state.attempts.push(attempt);
    save();
    return attempt;
  }
  function getSnapshot() { return state; }
  function searchRecords(query) {
    const needle=String(query||'').trim().toLowerCase();if(!needle)return [];
    const results=[];const role=currentRole();
    const orgId=currentOrganisationId();
    if(role==='superadmin')state.organisations.filter(item=>item.name.toLowerCase().includes(needle)).forEach(item=>results.push({type:'Organisation',title:item.name,detail:`${item.activeLearners} active learners · ${item.status}`,href:`organisations.html?org=${encodeURIComponent(item.id)}`}));
    const learners=(role==='superadmin'||role==='spoc')?getVisibleLearners(orgId):[];
    learners.filter(item=>`${item.first} ${item.last} ${item.email} ${item.department} ${item.designation}`.toLowerCase().includes(needle)).forEach(item=>results.push({type:'Learner',title:`${item.first} ${item.last}`,detail:`${item.department} · ${item.designation}`,href:'learners.html'}));
    const visibleCourseIds=role==='learner'?assignedCourseIds(orgId):role==='spoc'?assignedCourseIds(orgId):null;
    state.courses.filter(item=>(!visibleCourseIds||visibleCourseIds.includes(item.id))&&(role!=='creator'||item.creator==='Devika Shah'||item.status==='Draft')&&item.title.toLowerCase().includes(needle)).forEach(item=>results.push({type:'Course',title:item.title,detail:`${item.moduleCount||0} modules · ${item.status}`,href:role==='learner'?'learner-dashboard.html':role==='spoc'?'organisation-courses.html':'course-management.html'}));
    return results.slice(0,8);
  }
  function markNotificationsRead(organisationId) {
    const scopedId=scopedOrganisationId(organisationId);
    state.notifications.forEach(item=>{if(!item.organisationId||item.organisationId===scopedId)item.read=true;});
    save();
  }
  function applyOverdueAction(action, values, organisationId) {
    assertRole(['spoc']);
    const scopedId=scopedOrganisationId(organisationId);
    const overdue=state.learners.filter(learner=>learner.organisationId===scopedId&&learner.status==='Overdue');
    if(!overdue.length)throw new Error('There are no overdue learner records in this demo organisation.');
    const now=new Date().toISOString();
    if(action==='reassign'){
      const courseId=String(values.courseId||'');
      if(!state.assignments.some(item=>item.organisationId===scopedId&&item.courseId===courseId))throw new Error('Choose a course currently assigned to this organisation.');
      overdue.forEach(learner=>{learner.assignmentOverrides=learner.assignmentOverrides||{};learner.assignmentOverrides[courseId]={reassignedAt:now,reason:'SPOC follow-up'};});
    }else if(action==='extend'){
      const deadline=String(values.deadline||'');
      if(!deadline||new Date(`${deadline}T23:59:59`)<=new Date())throw new Error('Choose a future deadline.');
      overdue.forEach(learner=>{learner.deadlineAt=deadline;learner.status='In Progress';});
      orgMetricUpdate(scopedId,overdue.length);
    }else throw new Error('Choose a supported follow-up action.');
    addNotification({title:action==='reassign'?'Overdue learning reassigned':'Deadline extended',body:`${action==='reassign'?'Learning assignment updated':'New deadline set'} for ${overdue.length} overdue sample learner record${overdue.length===1?'':'s'}.`,organisationId:scopedId});
    return overdue;
  }
  function orgMetricUpdate(organisationId, decrement){const org=getOrganisation(organisationId);if(!org)return;org.overdueLearners=Math.max(0,(Number(org.overdueLearners)||0)-decrement);}
  function visibleNotifications() {
    const role=currentRole();const orgId=currentOrganisationId();
    return state.notifications.filter(item=>role==='superadmin'||!item.organisationId||item.organisationId===orgId);
  }
  function installGlobalControls() {
    const bar=document.querySelector('.topbar .tb-right');if(!bar)return;
    let wrapper=bar.querySelector('.tb-search');
    if(!wrapper){wrapper=document.createElement('label');wrapper.className='tb-search';const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','2');icon.setAttribute('aria-hidden','true');const circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx','11');circle.setAttribute('cy','11');circle.setAttribute('r','8');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','m21 21-4.35-4.35');icon.append(circle,path);const input=document.createElement('input');input.type='search';input.placeholder='Search…';input.setAttribute('aria-label','Search within your role access');input.autocomplete='off';wrapper.append(icon,input);bar.insertBefore(wrapper,bar.firstChild);}
    const input=wrapper.querySelector('input');let results=wrapper.querySelector('.command-results');
    if(!results){results=document.createElement('div');results.className='command-results';results.hidden=true;results.setAttribute('role','listbox');wrapper.appendChild(results);}
    function renderResults(){const found=searchRecords(input.value);results.replaceChildren();if(!input.value.trim()){results.hidden=true;return;}if(!found.length){const empty=document.createElement('div');empty.className='command-empty';empty.textContent='No matching records in your access scope.';results.appendChild(empty);}else found.forEach(item=>{const link=document.createElement('a');link.className='command-result';link.href=item.href;link.setAttribute('role','option');const title=document.createElement('strong');title.textContent=item.title;const detail=document.createElement('span');detail.textContent=`${item.type} · ${item.detail}`;link.append(title,detail);results.appendChild(link);});results.hidden=false;}
    input.addEventListener('input',renderResults);input.addEventListener('focus',()=>{if(input.value)renderResults();});
    document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();input.focus();input.select();}if(event.key==='Escape'){input.value='';results.hidden=true;input.blur();}});
    document.addEventListener('click',event=>{if(!wrapper.contains(event.target))results.hidden=true;});
    let bell=bar.querySelector('.notification-trigger');
    if(!bell){bell=document.createElement('button');bell.type='button';bell.className='icon-btn notification-trigger';bell.setAttribute('aria-label','Notifications');bell.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/></svg><span class="notification-count" hidden></span>';bar.insertBefore(bell,bar.querySelector('.av')||null);}
    let panel=bar.querySelector('.notification-panel');
    if(!panel){panel=document.createElement('section');panel.className='notification-panel';panel.hidden=true;panel.setAttribute('aria-label','Notifications');bell.insertAdjacentElement('afterend',panel);}
    function showNotifications(){const entries=visibleNotifications();panel.replaceChildren();const heading=document.createElement('div');heading.className='notification-heading';heading.textContent='Notifications';panel.appendChild(heading);if(!entries.length){const empty=document.createElement('p');empty.className='command-empty';empty.textContent='You’re all caught up.';panel.appendChild(empty);}else entries.slice(0,8).forEach(item=>{const row=document.createElement('article');row.className=`notification-item${item.read?'':' unread'}`;const title=document.createElement('strong');title.textContent=item.title;const body=document.createElement('span');body.textContent=item.body;row.append(title,body);panel.appendChild(row);});const unread=entries.filter(item=>!item.read).length;const count=bell.querySelector('.notification-count');count.textContent=unread;count.hidden=!unread;if(unread){const clear=document.createElement('button');clear.type='button';clear.className='notification-clear';clear.textContent='Mark all as read';clear.addEventListener('click',()=>{markNotificationsRead(currentOrganisationId());showNotifications();});panel.appendChild(clear);}}
    bell.addEventListener('click',(e)=>{e.stopPropagation();panel.hidden=!panel.hidden;if(profilePanel)profilePanel.hidden=true;showNotifications();});
    document.addEventListener('empowerone:notifications-changed',showNotifications);
    
    // Add Profile Dropdown
    let avatar=bar.querySelector('.av');
    let profilePanel=bar.querySelector('.profile-panel');
    if(avatar && !profilePanel){
      profilePanel=document.createElement('section');
      profilePanel.className='notification-panel profile-panel';
      profilePanel.hidden=true;
      profilePanel.style.width='220px';
      avatar.insertAdjacentElement('afterend',profilePanel);
      
      const editProfile=document.createElement('a');
      editProfile.className='command-result';
      editProfile.href='settings.html';
      editProfile.innerHTML='<strong>Edit Profile</strong><span>Manage your account</span>';
      
      const logout=document.createElement('a');
      logout.className='command-result mt2';
      logout.href='login.html';
      logout.style.borderTop='1px solid var(--border)';
      logout.style.borderRadius='0 0 8px 8px';
      logout.innerHTML='<strong style="color:var(--danger)">Sign Out</strong><span>Clear session</span>';
      
      profilePanel.append(editProfile,logout);
      
      avatar.addEventListener('click',(e)=>{
        e.stopPropagation();
        profilePanel.hidden=!profilePanel.hidden;
        panel.hidden=true; // hide notifs
      });
    }

    document.addEventListener('click',event=>{
      if(!panel.contains(event.target)&&event.target!==bell)panel.hidden=true;
      if(profilePanel && !profilePanel.contains(event.target)&&event.target!==avatar)profilePanel.hidden=true;
    });
    showNotifications();
  }

  window.EmpowerOneData = Object.freeze({ roles, getSnapshot, getOrganisation, getVisibleLearners, assignedCourseIds, addLearner, addOrganisation, assignCourses, getCourse, courseIdForTitle, saveCourse, submitCourse, reviewCourse, recordVideoProgress, completeContentItem, submitAttempt, applyOverdueAction, addNotification, markNotificationsRead, visibleNotifications, searchRecords, saveUserSettings, saveOrganisationProfile, currentRole, currentOrganisationId, reload: () => { state = read(); return state; } });
  renderRoleShell();
  installGlobalControls();
})();
