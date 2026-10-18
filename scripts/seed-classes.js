const { Client } = require("pg");
const { randomUUID } = require("crypto");

const [instructorEmail, studentEmail] = process.argv.slice(2);
if (!instructorEmail || !studentEmail) {
  console.error("Usage: node scripts/seed-classes.js <instructor-email> <student-email>");
  process.exit(1);
}
const t = (input, out, visible) => ({ input, out, visible });

const classes = [
  { name: "CS 101 · Programming 1 · BSIT 1–1", days: [-7, 2, 5, 9, 14], assignments: [
    ["Sum of Two Numbers", "Python", 5, 30, "Read two whole numbers, one per line, and print their sum.\nExample: input 3 and 4 → output 7", [t("3\n4", "7", 1), t("10\n5", "15", 1), t("0\n0", "0", 1), t("-8\n3", "-5", 0), t("1000000\n1", "1000001", 0)]],
    ["Reverse a String", "Python", 5, 30, "Read one line of text and print it reversed.\nExample: hello → olleh", [t("hello", "olleh", 1), t("PACE", "ECAP", 1), t("a", "a", 1), t("racecar", "racecar", 0), t("Hello World", "dlroW olleH", 0)]],
    ["Even or Odd", "Python", 5, 30, "Read one integer and print Even or Odd.", [t("4", "Even", 1), t("7", "Odd", 1), t("0", "Even", 1), t("-3", "Odd", 0), t("100", "Even", 0)]],
    ["FizzBuzz", "Python", 4, 45, "Read one integer n. Print FizzBuzz if n is divisible by both 3 and 5, Fizz if divisible by 3, Buzz if divisible by 5, otherwise print n.", [t("15", "FizzBuzz", 1), t("9", "Fizz", 1), t("10", "Buzz", 1), t("7", "7", 0), t("30", "FizzBuzz", 0)]],
    ["Factorial", "Python", 3, 60, "Read a non-negative integer n and print n! (n factorial).\nExample: 5 → 120", [t("5", "120", 1), t("0", "1", 1), t("1", "1", 1), t("10", "3628800", 0), t("12", "479001600", 0)]],
  ]},
  { name: "IT 102 · Data Structures · BSIT 2–1", days: [-3, 1, 4, 8, 12], assignments: [
    ["Maximum of Three Numbers", "C", 5, 30, "Read three integers, one per line, and print the largest.", [t("3\n7\n5", "7", 1), t("10\n2\n9", "10", 1), t("-1\n-5\n-3", "-1", 0), t("4\n4\n4", "4", 0)]],
    ["Count Vowels", "JavaScript", 5, 30, "Read one line of text and print how many vowels (a, e, i, o, u, in any case) it contains.", [t("hello", "2", 1), t("PACE", "2", 1), t("rhythm", "0", 1), t("Education", "5", 0), t("AEIOU aeiou", "10", 0)]],
    ["Palindrome Check", "JavaScript", 5, 30, "Read one word and print Yes if it reads the same forwards and backwards, otherwise No. The check is case-sensitive.", [t("racecar", "Yes", 1), t("hello", "No", 1), t("level", "Yes", 1), t("Aa", "No", 0), t("abba", "Yes", 0)]],
    ["Array Sum", "C", 4, 45, "The first line is n, the number of integers. The second line has n integers separated by spaces. Print their sum.", [t("5\n1 2 3 4 5", "15", 1), t("3\n10 20 30", "60", 1), t("1\n7", "7", 1), t("4\n-1 -2 -3 -4", "-10", 0), t("2\n1000000 1000000", "2000000", 0)]],
    ["Second Largest", "Python", 3, 60, "The first line is n. The second line has n integers separated by spaces. Print the second largest distinct value.", [t("5\n3 9 1 7 4", "7", 1), t("3\n1 2 3", "2", 1), t("4\n5 5 4 3", "4", 1), t("3\n10 10 9", "9", 0), t("5\n-1 -2 -3 -4 -5", "-2", 0)]],
  ]},
  { name: "CS 201 · Web Programming · BSCS 2–1", days: [-1, 3, 6, 10, 15], assignments: [
    ["Greeting Formatter", "JavaScript", 5, 30, "Read a name and print Hello, <name>!\nExample: Ana → Hello, Ana!", [t("Ana", "Hello, Ana!", 1), t("Juan Dela Cruz", "Hello, Juan Dela Cruz!", 1), t("Z", "Hello, Z!", 0), t("Maria", "Hello, Maria!", 0)]],
    ["Celsius to Fahrenheit", "JavaScript", 5, 30, "Read a whole number of degrees Celsius and print the Fahrenheit value (F = C × 9/5 + 32). All test inputs give whole-number results.", [t("0", "32", 1), t("100", "212", 1), t("-40", "-40", 1), t("20", "68", 0), t("25", "77", 0)]],
    ["Word Count", "JavaScript", 5, 30, "Read one line of text and print the number of words. Words are separated by one or more spaces.", [t("hello world", "2", 1), t("one", "1", 1), t("the quick brown fox", "4", 1), t("a  b   c", "3", 0), t("I love PACE", "3", 0)]],
    ["Leap Year", "JavaScript", 4, 45, "Read a year and print Yes if it is a leap year, otherwise No. A leap year is divisible by 4, except years divisible by 100 unless they are also divisible by 400.", [t("2024", "Yes", 1), t("1900", "No", 1), t("2000", "Yes", 1), t("2023", "No", 0), t("2100", "No", 0)]],
    ["Prime Number Check", "JavaScript", 3, 60, "Read an integer and print Prime if it is a prime number, otherwise Not prime.", [t("7", "Prime", 1), t("10", "Not prime", 1), t("2", "Prime", 1), t("1", "Not prime", 0), t("97", "Prime", 0)]],
  ]},
];

const code = () => Array.from({ length: 6 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("");

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const findUser = async (email, role) => {
    const r = await c.query("select id from users where email=$1 and role=$2", [email, role]);
    if (!r.rowCount) throw new Error(`No ${role} found with email ${email}`);
    return r.rows[0].id;
  };
  const INSTRUCTOR = await findUser(instructorEmail, "instructor");
  const STUDENT = await findUser(studentEmail, "student");
  await c.query("begin");
  try {
    for (const cls of classes) {
      const exists = await c.query("select 1 from classes where instructor_id=$1 and name=$2", [INSTRUCTOR, cls.name]);
      if (exists.rowCount) { console.log("skip existing", cls.name); continue; }
      const classId = randomUUID();
      let join;
      do { join = code(); } while ((await c.query("select 1 from classes where join_code=$1", [join])).rowCount);
      await c.query("insert into classes(id,name,instructor_id,join_code) values($1,$2,$3,$4)", [classId, cls.name, INSTRUCTOR, join]);
      await c.query("insert into enrollments(student_id,class_id) values($1,$2)", [STUDENT, classId]);
      for (const [i, [title, lang, hearts, regen, instructions, tests]] of cls.assignments.entries()) {
        const id = randomUUID();
        const due = new Date(); due.setUTCDate(due.getUTCDate() + cls.days[i]); due.setUTCHours(15, 59, 0, 0);
        await c.query("insert into assignments(id,title,instructions,language,due_date,hearts_count,hearts_regen_minutes,created_by) values($1,$2,$3,$4,$5,$6,$7,$8)", [id, title, instructions, lang, due, hearts, regen, INSTRUCTOR]);
        await c.query("insert into assignment_classes(assignment_id,class_id) values($1,$2)", [id, classId]);
        for (const x of tests) await c.query("insert into test_cases(id,assignment_id,input,expected_output,visible) values($1,$2,$3,$4,$5)", [randomUUID(), id, x.input, x.out, !!x.visible]);
        await c.query("insert into posts(id,class_id,author_id,type,body,assignment_id) values($1,$2,$3,'assignment_created',$4,$5)", [randomUUID(), classId, INSTRUCTOR, `New assignment posted: ${title}`, id]);
      }
      console.log("created", cls.name, join);
    }
    await c.query("commit");
  } catch (e) { await c.query("rollback"); throw e; }
  const r = await c.query("select c.name, c.join_code, (select count(*) from assignment_classes ac where ac.class_id=c.id)::int assignments, (select count(*) from enrollments e where e.class_id=c.id)::int students from classes c where instructor_id=$1 order by name", [INSTRUCTOR]);
  console.table(r.rows);
  await c.end();
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });
