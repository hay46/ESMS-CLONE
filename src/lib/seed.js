/**
 * Demo data used when no Firebase project is configured.
 *
 * The shapes below mirror the Firestore documents used by the live app, so the
 * mock backend and the Firebase backend are interchangeable.
 */

const unsplash = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const galleryImages = [
  unsplash('1541339907198-e08756ebafe3', 2070),
  unsplash('1577891729319-f69bc4313bb5'),
  unsplash('1509062522246-3755977927d7', 2104),
  unsplash('1503676260728-1c00da094a0b', 2022),
  unsplash('1524178232363-1fb2b075b655', 2070),
  unsplash('1497633762265-9d179a990aa6', 2073),
  unsplash('1511632765486-a01980e01a18', 2070),
  unsplash('1529333166437-7750a6dd5a70', 2069),
];

export const heroImage =
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2070&auto=format&fit=crop';

export const aboutImages = {
  legacy: unsplash('1541339907198-e08756ebafe3', 2070),
  students: unsplash('1509062522246-3755977927d7', 2104),
  library: unsplash('1524178232363-1fb2b075b655'),
  campus: unsplash('1577891729319-f69bc4313bb5'),
  map: unsplash('1524661135-423995f22d0b'),
};

export const subjectColors = {
  Mathematics: 'blue',
  English: 'emerald',
  Physics: 'violet',
  Chemistry: 'amber',
  Biology: 'rose',
  History: 'slate',
  'General Science': 'cyan',
  'Afaan Oromo': 'orange',
};

export const subjects = Object.keys(subjectColors);

export const seedStudents = [
  {
    id: 'st-1001',
    name: 'Abel Tesfaye',
    grade: 'Grade 9',
    studentId: 'AGS-1001',
    email: 'abel.tesfaye@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=12',
    enrollmentDate: '2023-09-04',
    hasIdCard: true,
    gpa: 3.72,
    attendance: 94,
  },
  {
    id: 'st-1002',
    name: 'Bethel Girma',
    grade: 'Grade 9',
    studentId: 'AGS-1002',
    email: 'bethel.girma@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=47',
    enrollmentDate: '2023-09-04',
    hasIdCard: true,
    gpa: 3.94,
    attendance: 98,
  },
  {
    id: 'st-1003',
    name: 'Caleb Bekele',
    grade: 'Grade 10',
    studentId: 'AGS-1003',
    email: 'caleb.bekele@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=33',
    enrollmentDate: '2022-09-05',
    hasIdCard: true,
    gpa: 3.41,
    attendance: 88,
  },
  {
    id: 'st-1004',
    name: 'Dagmawi Solomon',
    grade: 'Grade 10',
    studentId: 'AGS-1004',
    email: 'dagmawi.solomon@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=68',
    enrollmentDate: '2022-09-05',
    hasIdCard: false,
    gpa: 3.18,
    attendance: 81,
  },
  {
    id: 'st-1005',
    name: 'Ephraim Alemu',
    grade: 'Grade 11',
    studentId: 'AGS-1005',
    email: 'ephraim.alemu@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=11',
    enrollmentDate: '2021-09-06',
    hasIdCard: true,
    gpa: 3.85,
    attendance: 96,
  },
  {
    id: 'st-1006',
    name: 'Frehiwot Tadesse',
    grade: 'Grade 11',
    studentId: 'AGS-1006',
    email: 'frehiwot.tadesse@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=45',
    enrollmentDate: '2021-09-06',
    hasIdCard: true,
    gpa: 3.6,
    attendance: 92,
  },
  {
    id: 'st-1007',
    name: 'Getachew Mengist',
    grade: 'Grade 12',
    studentId: 'AGS-1007',
    email: 'getachew.mengist@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=60',
    enrollmentDate: '2020-09-07',
    hasIdCard: true,
    gpa: 3.99,
    attendance: 99,
  },
  {
    id: 'st-1008',
    name: 'Hanan Mohammed',
    grade: 'Grade 12',
    studentId: 'AGS-1008',
    email: 'hanan.mohammed@ags.edu.et',
    photo: 'https://i.pravatar.cc/300?img=25',
    enrollmentDate: '2020-09-07',
    hasIdCard: false,
    gpa: 3.55,
    attendance: 90,
  },
];

export const seedTeachers = [
  {
    id: 'tc-001',
    name: 'Dr. Abraham Tekle',
    title: 'School Director',
    email: 'director@ags.edu.et',
    subject: 'Administration',
    teacherId: 'T-001',
    bio: 'Dr. Abraham has over 20 years of experience in educational leadership. He is dedicated to fostering an environment where every student can achieve their full potential through academic excellence and character development.',
    photo: 'https://i.pravatar.cc/300?img=13',
  },
  {
    id: 'tc-002',
    name: 'Ms. Martha Gebre',
    title: 'Head of Academics',
    email: 'martha.gebre@ags.edu.et',
    subject: 'Mathematics',
    teacherId: 'T-002',
    bio: 'Ms. Martha oversees our curriculum development and teacher training. She believes in a holistic approach to education that balances rigorous academics with creative expression.',
    photo: 'https://i.pravatar.cc/300?img=49',
  },
  {
    id: 'tc-003',
    name: 'Mr. Samuel Bekele',
    title: 'Senior Mathematics Teacher',
    email: 'samuel.bekele@ags.edu.et',
    subject: 'Mathematics',
    teacherId: 'T-003',
    bio: 'With a passion for numbers, Mr. Samuel makes complex mathematical concepts accessible and exciting for students of all levels.',
    photo: 'https://i.pravatar.cc/300?img=15',
  },
  {
    id: 'tc-004',
    name: 'Mrs. Helen Tadesse',
    title: 'Science Department Head',
    email: 'helen.tadesse@ags.edu.et',
    subject: 'Biology',
    teacherId: 'T-004',
    bio: 'Mrs. Helen brings science to life through hands-on experiments and inquiry-based learning, encouraging students to explore the wonders of the natural world.',
    photo: 'https://i.pravatar.cc/300?img=44',
  },
  {
    id: 'tc-005',
    name: 'Mr. Dawit Girma',
    title: 'History & Social Studies',
    email: 'dawit.girma@ags.edu.et',
    subject: 'History',
    teacherId: 'T-005',
    bio: 'Mr. Dawit is passionate about helping students understand the past to better navigate the future. His classes are known for lively discussions and critical thinking.',
    photo: 'https://i.pravatar.cc/300?img=53',
  },
  {
    id: 'tc-006',
    name: 'Ms. Sara Yosef',
    title: 'English Language Specialist',
    email: 'sara.yosef@ags.edu.et',
    subject: 'English',
    teacherId: 'T-006',
    bio: 'Ms. Sara focuses on developing strong communication skills and a love for literature in her students, preparing them for success in a globalized world.',
    photo: 'https://i.pravatar.cc/300?img=32',
  },
  {
    id: 'tc-007',
    name: 'Mr. Kassahun Tilahun',
    title: 'Grade 8 Social Studies Teacher',
    email: 'kassahun.tilahun@ags.edu.et',
    subject: 'History',
    teacherId: 'T-007',
    bio: 'Mr. Kassahun brings history and geography to life for our grade 8 students, fostering a deep understanding of our society and its development.',
    photo: 'https://i.pravatar.cc/300?img=70',
  },
  {
    id: 'tc-008',
    name: 'Ms. Tigist Alemu',
    title: 'Grade 8 General Science Teacher',
    email: 'tigist.alemu@ags.edu.et',
    subject: 'General Science',
    teacherId: 'T-008',
    bio: 'Ms. Tigist is passionate about science and technology, guiding grade 8 students through the fascinating world of general science with hands-on experiments.',
    photo: 'https://i.pravatar.cc/300?img=26',
  },
  {
    id: 'tc-009',
    name: 'Mr. Tolosa Gemechu',
    title: 'Afaan Oromo Teacher',
    email: 'tolosa.gemechu@ags.edu.et',
    subject: 'Afaan Oromo',
    teacherId: 'T-009',
    bio: 'Mr. Tolosa is dedicated to teaching the Afaan Oromo language and culture, helping students develop strong linguistic skills and cultural appreciation.',
    photo: 'https://i.pravatar.cc/300?img=58',
  },
];

export const seedEvents = [
  {
    id: 'ev-1',
    title: 'Annual Science Fair',
    date: '2026-04-18',
    time: '09:00',
    location: 'School Main Hall',
    category: 'Academic',
    description:
      'Students from all grades showcase their innovative science projects and experiments. Parents and community members are welcome to attend.',
  },
  {
    id: 'ev-2',
    title: 'Inter-School Soccer Finals',
    date: '2026-04-25',
    time: '14:00',
    location: 'School Sports Ground',
    category: 'Sports',
    description:
      "Cheer for our school team as they compete in the regional finals. A day of excitement and school spirit!",
  },
  {
    id: 'ev-3',
    title: 'Parent-Teacher Conference',
    date: '2026-05-09',
    time: '08:30',
    location: 'Respective Classrooms',
    category: 'Academic',
    description:
      "An opportunity for parents to discuss their child's academic progress and development with teachers.",
  },
  {
    id: 'ev-4',
    title: 'Cultural Day Celebration',
    date: '2026-05-23',
    time: '10:00',
    location: 'School Courtyard',
    category: 'Social',
    description:
      'Celebrating the rich diversity of our community through traditional music, dance, and food from various cultures.',
  },
  {
    id: 'ev-5',
    title: 'Easter Holiday Break',
    date: '2026-04-11',
    time: '00:00',
    location: 'Campus Wide',
    category: 'Holiday',
    description:
      'School will be closed for the Easter holiday break. Classes will resume on the following Monday.',
  },
];

export const seedBlog = [
  {
    id: 'bl-1',
    title: 'Welcome to our new website',
    content:
      'We are excited to launch our new digital home. This platform will serve as a hub for all our school activities, news, and academic resources. Stay tuned for regular updates!',
    date: '2026-01-12',
    category: 'General',
    image: galleryImages[4],
  },
  {
    id: 'bl-2',
    title: 'Academic Excellence Awards',
    content:
      'Congratulations to all our high-achieving students who received awards this term. Your hard work and dedication continue to inspire us all.',
    date: '2026-02-02',
    category: 'Academic',
    image: galleryImages[2],
  },
  {
    id: 'bl-3',
    title: 'New Science Lab Equipment',
    content:
      'We have received state-of-the-art equipment for our labs, enhancing our hands-on learning experience for science students.',
    date: '2026-03-04',
    category: 'Academic',
    image: galleryImages[0],
  },
  {
    id: 'bl-4',
    title: 'Running Club Championship',
    content:
      'Our cross-country running club brought home three medals from the regional championship. Congratulations athletes!',
    date: '2026-03-18',
    category: 'Sports',
    image: galleryImages[5],
  },
];

export const seedNews = [
  {
    id: 'nw-1',
    title: 'School Reopening Dates',
    content:
      'Term 3 will begin on April 15th. We look forward to welcoming all students back for another productive term.',
    date: '2026-03-28',
    category: 'General',
  },
  {
    id: 'nw-2',
    title: 'Registration Open for Term 3',
    content:
      'Online registration for the new term is now open in the portal. Fees can be paid online and receipts uploaded from your dashboard.',
    date: '2026-04-02',
    category: 'Academic',
  },
];

export const seedAdmissions = [
  {
    id: 'ad-1',
    studentName: 'Michael Berhanu',
    grade: 'Grade 9',
    guardianName: 'Salam Gebre',
    guardianPhone: '+251 911 234 567',
    guardianEmail: 'salam.gebre@example.com',
    previousSchool: 'Bole International School',
    lastGrade: 'Grade 8',
    status: 'Pending',
    submittedAt: '2026-03-22',
    note: '',
  },
  {
    id: 'ad-2',
    studentName: 'Sara Melaku',
    grade: 'Grade 7',
    guardianName: 'Kalkidan Wolde',
    guardianPhone: '+251 912 887 331',
    guardianEmail: 'kalkidan.wolde@example.com',
    previousSchool: 'Kolfe Keranio Academy',
    lastGrade: 'Grade 6',
    status: 'Approved',
    submittedAt: '2026-03-10',
    note: 'Strong mathematics placement result.',
  },
  {
    id: 'ad-3',
    studentName: 'Yonas Fikru',
    grade: 'Grade 11',
    guardianName: 'Temesgen Alemu',
    guardianPhone: '+251 913 445 221',
    guardianEmail: 'temesgen.alemu@example.com',
    previousSchool: 'Ethiopia Education Center',
    lastGrade: 'Grade 10',
    status: 'Pending',
    submittedAt: '2026-04-01',
    note: '',
  },
];

export const seedMessages = [
  {
    id: 'ms-1',
    studentId: 'st-1001',
    from: 'Dr. Abraham Tekle',
    title: 'Term 3 progress',
    message:
      'Dear Abel, your effort this term has been outstanding. Keep up the excellent work.',
    category: 'General',
    createdAt: '2026-03-30T09:15:00.000Z',
    read: false,
  },
  {
    id: 'ms-2',
    studentId: 'st-1001',
    from: 'Dr. Abraham Tekle',
    title: 'Mathematics support',
    message: 'Please meet with Mr. Samuel during break to review the algebra unit.',
    category: 'Academic',
    createdAt: '2026-04-02T13:40:00.000Z',
    read: true,
  },
  {
    id: 'ms-3',
    studentId: 'st-1002',
    from: 'Dr. Abraham Tekle',
    title: 'Well done',
    message: 'Congratulations on topping the grade 9 ranking this term!',
    category: 'General',
    createdAt: '2026-04-01T08:05:00.000Z',
    read: false,
  },
];

export const seedTeacherMessages = [
  {
    id: 'tm-1',
    teacherId: 'tc-003',
    studentId: 'st-1004',
    from: 'Dagmawi Solomon',
    message: 'Could you please share the notes for the last algebra class?',
    category: 'Academic',
    createdAt: '2026-04-03T11:20:00.000Z',
  },
  {
    id: 'tm-2',
    teacherId: 'tc-003',
    studentId: 'st-1001',
    from: 'Abel Tesfaye',
    message: 'Thank you for the extra help after class.',
    category: 'General',
    createdAt: '2026-04-04T15:05:00.000Z',
  },
];

export const seedAssignments = {
  mathematics: [
    { id: 1, title: 'Quadratic Equations — Problem Set', total: 20, date: '2026-03-24' },
    { id: 2, title: 'Functions & Graphs', total: 15, date: '2026-04-02' },
    { id: 3, title: 'Trigonometry Review', total: 25, date: '2026-04-14' },
  ],
  english: [
    { id: 1, title: 'Essay: My Community', total: 40, date: '2026-03-27' },
    { id: 2, title: 'Poetry Analysis', total: 20, date: '2026-04-09' },
  ],
  physics: [
    { id: 1, title: 'Kinematics Lab Report', total: 30, date: '2026-04-06' },
    { id: 2, title: 'Newton’s Laws Problems', total: 20, date: '2026-04-16' },
  ],
  history: [{ id: 1, title: 'Ethiopia 1974–1991 Essay', total: 50, date: '2026-04-11' }],
  biology: [{ id: 1, title: 'Cell Structure Quiz', total: 20, date: '2026-04-08' }],
  chemistry: [{ id: 1, title: 'Periodic Table Worksheet', total: 15, date: '2026-04-13' }],
  'general science': [{ id: 1, title: 'Forces & Motion Project', total: 35, date: '2026-04-17' }],
  'afaan oromo': [{ id: 1, title: 'Grammar: Sirnaa', total: 25, date: '2026-04-12' }],
};

export const seedGrades = {
  mathematics: { score: 18, grade: 'A', status: 'On Track', attendance: 95 },
  english: { score: 35, grade: 'A-', status: 'On Track', attendance: 98 },
  physics: { score: 26, grade: 'B+', status: 'On Track', attendance: 92 },
  history: { score: 44, grade: 'B', status: 'Needs Review', attendance: 88 },
  biology: { score: 18, grade: 'A', status: 'On Track', attendance: 97 },
  chemistry: { score: 13, grade: 'B+', status: 'On Track', attendance: 90 },
};

export const seedAttendance = {
  'st-1001': { Present: 42, Absent: 2, Late: 1 },
  'st-1002': { Present: 44, Absent: 0, Late: 1 },
  'st-1003': { Present: 40, Absent: 3, Late: 2 },
  'st-1004': { Present: 38, Absent: 5, Late: 2 },
  'st-1005': { Present: 43, Absent: 1, Late: 1 },
  'st-1006': { Present: 41, Absent: 3, Late: 1 },
  'st-1007': { Present: 45, Absent: 0, Late: 0 },
  'st-1008': { Present: 41, Absent: 2, Late: 2 },
};

export const seedPayments = {
  'st-1001': [
    { id: 'py-1', amount: 3500, date: '2026-01-10', description: 'Tuition Fee', term: 'Term 1' },
    { id: 'py-2', amount: 500, date: '2026-02-05', description: 'Registration Fee', term: 'Term 2' },
  ],
  'st-1002': [{ id: 'py-3', amount: 4000, date: '2026-01-10', description: 'Tuition Fee', term: 'Term 1' }],
};

export const seedReceipts = {
  'st-1001': [
    {
      id: 'rc-1',
      amount: 3500,
      date: '2026-01-12',
      description: 'Tuition Fee — Term 1',
      reference: 'CBE/TRX/88213',
      status: 'Verified',
    },
  ],
};

export const seedRegistrations = [
  { id: 'rg-1', userId: 'st-1001', eventId: 'ev-1' },
  { id: 'rg-2', userId: 'st-1001', eventId: 'ev-4' },
];

export const seedProfiles = {
  'director@ags.edu.et': {
    uid: 'director-1',
    name: 'Dr. Abraham Tekle',
    email: 'director@ags.edu.et',
    role: 'director',
    title: 'School Director',
    grade: '',
    photo: 'https://i.pravatar.cc/300?img=13',
    studentId: '',
    teacherId: 'T-001',
  },
  'teacher@ags.edu.et': {
    uid: 'teacher-1',
    name: 'Mr. Samuel Bekele',
    email: 'teacher@ags.edu.et',
    role: 'teacher',
    title: 'Senior Mathematics Teacher',
    grade: '',
    photo: 'https://i.pravatar.cc/300?img=15',
    studentId: '',
    teacherId: 'T-003',
    subject: 'Mathematics',
  },
  'student@ags.edu.et': {
    uid: 'st-1001',
    name: 'Abel Tesfaye',
    email: 'student@ags.edu.et',
    role: 'student',
    title: '',
    grade: 'Grade 9',
    photo: 'https://i.pravatar.cc/300?img=12',
    studentId: 'AGS-1001',
    teacherId: '',
    enrollmentDate: '2023-09-04',
    hasIdCard: true,
  },
};

export const demoAccounts = [
  { role: 'director', email: 'director@ags.edu.et', password: 'password123' },
  { role: 'teacher', email: 'teacher@ags.edu.et', password: 'password123' },
  { role: 'student', email: 'student@ags.edu.et', password: 'password123' },
];

export const tuition = { tuition: 3500, registration: 500, currency: 'ETB' };