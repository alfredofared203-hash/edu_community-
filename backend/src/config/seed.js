require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const TeacherRating = require('../models/TeacherRating');
const Subject = require('../models/Subject');
const Material = require('../models/Material');
const SoftSkill = require('../models/SoftSkill');

// كلمة مرور موحّدة للحسابات التجريبية — موديل User يشفّرها تلقائياً عند الحفظ
const SEED_PASSWORD = 'password123';

const teachersData = [
  { name: 'أ. أحمد علي', email: 'ahmed.ali@edu.eg', role: 'teacher', grade: 'كل المراحل' },
  { name: 'أ. سارة محمود', email: 'sara.mahmoud@edu.eg', role: 'teacher', grade: 'كل المراحل' },
  { name: 'أ. محمد حسن', email: 'mohamed.hasan@edu.eg', role: 'teacher', grade: 'كل المراحل' },
];

const challengesData = [
  {
    title: 'ماراثون حل مسائل الفيزياء',
    description: 'حل ١٠ مسائل فيزياء صعبة تغطي قوانين نيوتن وحفظ الطاقة.',
    subject: 'الفيزياء',
    grade: 'الصف الأول الثانوي',
    points: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    active: true,
  },
  {
    title: 'مسابقة كتابة المقال العربي',
    description: 'اكتب مقالاً من ٥٠٠ كلمة عن أهمية التعليم في مصر الحديثة.',
    subject: 'اللغة العربية',
    grade: 'الصف الثاني الثانوي',
    points: 75,
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    active: true,
  },
  {
    title: 'التحضير لأولمبياد الرياضيات',
    description: 'مسائل جبر وهندسة متقدمة للتحضير للأولمبياد المصري للرياضيات.',
    subject: 'الرياضيات',
    grade: 'الصف الثالث الثانوي',
    points: 150,
    startDate: new Date(),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Ended 1 day ago
    active: true,
  },
  {
    title: 'تقرير معمل الأحياء',
    description: 'وثّق ملاحظاتك من تجربة مراقبة الخلية النباتية وكيفية انقسامها.',
    subject: 'الأحياء',
    grade: 'الصف الأول الثانوي',
    points: 80,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    active: true,
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/educommunity';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for seeding');

    // Clean up collections
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await ChallengeSubmission.deleteMany({});
    await TeacherRating.deleteMany({});
    await Subject.deleteMany({});
    await Material.deleteMany({});
    await SoftSkill.deleteMany({});
    console.log('🧹 Database collections cleared');

    // Create Admin (كلمة المرور بتتشفّر تلقائياً في موديل User)
    const admin = await User.create({
      name: 'مسؤول النظام',
      email: 'admin@edu.eg',
      password: SEED_PASSWORD,
      role: 'admin',
    });
    console.log('👑 Admin user created (admin@edu.eg / password123)');

    // Create Teachers
    const teachers = await Promise.all(
      teachersData.map(t =>
        User.create({
          ...t,
          password: SEED_PASSWORD,
        })
      )
    );
    console.log(`👨‍🏫 ${teachers.length} Teacher users created`);

    // Create Subjects (مواد دراسية) + Materials (محتوى تعليمي) للعرض
    const subjects = await Subject.insertMany([
      { name: 'الفيزياء', grade: 'sec-1', description: 'فيزياء الصف الأول الثانوي', icon: 'atom' },
      { name: 'الرياضيات', grade: 'sec-1', description: 'رياضيات الصف الأول الثانوي', icon: 'calculator' },
      { name: 'الأحياء', grade: 'sec-1', description: 'أحياء الصف الأول الثانوي', icon: 'dna' },
      { name: 'الرياضيات', grade: 'sec-2', description: 'رياضيات الصف الثاني الثانوي', icon: 'calculator' },
    ]);
    console.log(`📚 ${subjects.length} Subjects created`);

    const materials = await Material.insertMany([
      {
        title: 'ملخص قوانين نيوتن الثلاثة',
        description: 'شرح مبسّط لقوانين نيوتن مع أمثلة محلولة.',
        subject: subjects[0]._id, grade: 'sec-1', type: 'pdf',
        fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
        provider: 'external', uploadedBy: teachers[0]._id,
      },
      {
        title: 'فيديو: شرح الجاذبية الأرضية',
        description: 'فيديو توضيحي لكيفية عمل الجاذبية وتطبيقاتها.',
        subject: subjects[0]._id, grade: 'sec-1', type: 'video',
        fileUrl: 'https://www.youtube.com/embed/E43-CfukEgs',
        provider: 'external', uploadedBy: teachers[0]._id,
      },
      {
        title: 'مذكرة الجبر — الوحدة الأولى',
        description: 'أساسيات الجبر للصف الأول الثانوي.',
        subject: subjects[1]._id, grade: 'sec-1', type: 'pdf',
        fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
        provider: 'external', uploadedBy: teachers[1]._id,
      },
      {
        title: 'مراجعة رياضيات الصف الثاني (تحضير الإجازة)',
        description: 'مادة الصف التالي للاطّلاع المبكّر في الإجازة.',
        subject: subjects[3]._id, grade: 'sec-2', type: 'pdf',
        fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
        provider: 'external', isNextGrade: true, uploadedBy: teachers[1]._id,
      },
    ]);
    console.log(`🎞️  ${materials.length} Materials created`);

    // Create Challenges
    const challenges = await Challenge.insertMany(challengesData);
    console.log(`🏆 ${challenges.length} Challenges created`);

    // Create some students for leaderboard testing
    const studentsData = [
      { name: 'عمر ياسر', email: 'omar@edu.eg', points: 850, grade: 'الصف الأول الثانوي', schoolCode: 'SCH-Cairo-1' },
      { name: 'فاطمة أحمد', email: 'fatma@edu.eg', points: 920, grade: 'الصف الأول الثانوي', schoolCode: 'SCH-Cairo-1' },
      { name: 'علي حسن', email: 'ali@edu.eg', points: 740, grade: 'الصف الأول الثانوي', schoolCode: 'SCH-Giza-2' },
      { name: 'نور سليم', email: 'nour@edu.eg', points: 610, grade: 'الصف الثاني الثانوي', schoolCode: 'SCH-Alex-3' },
    ];

    const students = await Promise.all(
      studentsData.map(s =>
        User.create({
          ...s,
          password: SEED_PASSWORD,
          role: 'student',
          badges: ['بطل الأسبوع', 'مشارك نشط'],
        })
      )
    );
    console.log(`🎓 ${students.length} Student users created`);

    // Create some posts
    const post1 = await Post.create({
      userId: students[0]._id,
      content: 'خلصت ملخص شامل للفصل الخامس - الكيمياء العضوية! 🧪 يغطي جميع أنواع التفاعلات والآليات. أتمنى يساعدكم في الاستعداد لامتحانات منتصف العام!',
      subject: 'الكيمياء',
      likes: [students[1]._id, students[2]._id],
    });

    const post2 = await Post.create({
      userId: students[1]._id,
      content: 'حد يقدر يشرحلي الفرق بين الانقسام الميتوزي والميوزي؟ بتلغبط في المراحل. في حد عنده طريقة سهلة للحفظ؟ 🤔',
      subject: 'الأحياء',
      likes: [students[0]._id],
    });

    console.log('📝 Initial posts seeded');

    // Create a comment
    await Comment.create({
      postId: post2._id,
      userId: teachers[0]._id,
      content: 'أهلاً بك يا فاطمة، الانقسام الميتوزي ينتج خليتين متطابقتين تماماً للخلية الأم، بينما الميوزي ينتج 4 خلايا بكل منها نصف عدد الكروموسومات. سأقوم بنشر ملف ملخص كامل غداً!',
    });
    console.log('💬 Initial comments seeded');

    // Create Soft Skills
    await SoftSkill.insertMany([
      { title: 'مهارات التواصل', description: 'فن إيصال الأفكار بوضوح وبناء جسور التفاهم مع الآخرين بفعالية.', icon: 'Users', color: 'blue', coursesCount: 12, createdBy: admin._id },
      { title: 'القيادة الإيجابية', description: 'كيفية إلهام الفرق وتوجيه الطاقات نحو تحقيق الأهداف المشتركة برؤية واضحة.', icon: 'Award', color: 'emerald', coursesCount: 8, createdBy: admin._id },
      { title: 'إدارة الوقت', description: 'تنظيم المهام وتحديد الأولويات لتحقيق أقصى إنتاجية بأقل جهد وتوتر.', icon: 'Clock', color: 'amber', coursesCount: 15, createdBy: admin._id },
      { title: 'حل المشكلات', description: 'تطوير التفكير التحليلي والابتكاري لمواجهة التحديات بذكاء ومرونة.', icon: 'Lightbulb', color: 'indigo', coursesCount: 10, createdBy: admin._id },
    ]);
    console.log('🧠 Soft Skills seeded');

    console.log('🎉 Seeding successfully completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
