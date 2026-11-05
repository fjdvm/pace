# PACE

PACE (Pair-programming AI Coding Environment) is a classroom platform where anyone can teach or take classes, write code against assignments, and get rate-limited AI tutoring.

## Language

**User**:
A person signed in with a Google account. A User has no global role and can both teach and learn.
_Avoid_: Account, member, professor, teacher

**Admin**:
A User flagged as a platform operator, who manages AI provider keys, system status and research study results. Set manually, never through sign-in.
_Avoid_: Superuser, moderator

**Class**:
A group created by a User and joined by other Users with a join code.
_Avoid_: Course, section, room

**Instructor**:
The role a User holds inside a Class they created.
_Avoid_: Professor, teacher, owner

**Student**:
The role a User holds inside a Class they joined. A User holds exactly one role in any Class, so a Class's Instructor can never be one of its Students.
_Avoid_: Learner, member

**Post**:
Something an Instructor puts in a Class for its Students to work on. Every Post carries a Label. A Post is a Draft, invisible to Students, until the Instructor assigns it.
_Avoid_: Activity, assignment, quiz (these are Labels, not separate things)

**Item**:
One task inside a Post, worth a number of points. Its kind is Coding, Multiple choice or Short answer. A Post has one or more Items, whatever its Label, and its total points are the sum of its Items' points.
_Avoid_: Question, problem

**Submission**:
A Student's turned-in answers to a Post. It moves from Turned in to Graded to Returned; the Student sees the grade only once it is Returned. A Student can unsubmit until it is Graded, and a Submission after the due date is Late.
_Avoid_: Hand-in, attempt

**Stream entry**:
One row in a Class's Stream: either an Announcement or a link to a Post.
_Avoid_: Stream post

**Announcement**:
A message an Instructor shares in a Class's Stream. It has no due date and is not work for Students to hand in.
_Avoid_: Post, stream post

**Label**:
The name an Instructor gives a Post: Assignment, Activity or Quiz. Purely descriptive; a Label changes nothing about how the Post behaves.
_Avoid_: Type, kind, category

**Teaching / Enrolled**:
The two lists on a User's single dashboard: Classes where they are the Instructor, and Classes where they are a Student.
_Avoid_: My classes, joined classes

**Spark buddy**:
The PACE mascot, shown in the sign-in modal and used as the favicon.
_Avoid_: Logo, mark
