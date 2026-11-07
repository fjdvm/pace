import type { RoleItems } from "./types";

export const instructorItems: RoleItems = {
  profile: [
    { id: "yearsTeaching", label: "Years of teaching programming courses", options: ["Less than 1", "1–3", "4–6", "7 or more"] },
    { id: "coursesHandled", label: "Programming courses currently handled", options: ["1", "2", "3", "4 or more"] },
    { id: "allowsAi", label: "Do you allow students to use AI tools?", options: ["Yes", "No", "With conditions"] },
  ],
  problems: [
    {
      label: "A. ASSIGNMENT MANAGEMENT",
      items: [
        { code: "P1", text: "I use several separate tools to post, collect, and check programming assignments." },
        { code: "P2", text: "Checking whether submitted programs run correctly takes much of my time." },
        { code: "P3", text: "Students' submissions arrive in formats that are hard to run or test (e.g., PDF or screenshots)." },
        { code: "P4", text: "I test each student's program by hand with my own inputs." },
        { code: "P5", text: "Students' submissions and scores are kept in different places, which makes them hard to track." },
      ],
    },
    {
      label: "B. STUDENTS' AI USE",
      items: [
        { code: "P6", text: "Students submit AI-generated code they cannot explain." },
        { code: "P7", text: "I cannot control how much AI help students receive while doing assignments." },
        { code: "P8", text: "AI tools give students complete solutions rather than guidance." },
        { code: "P9", text: "I cannot tell how much of a submission was written with AI help." },
        { code: "P10", text: "Students use AI tools to get answers instead of trying to solve the problem first." },
      ],
    },
    {
      label: "C. MONITORING",
      items: [
        { code: "P11", text: "I cannot tell whether a student typed their code or pasted it from another source." },
        { code: "P12", text: "I cannot see whether students leave the assignment to use other tabs or applications while working." },
        { code: "P13", text: "I find out about possible copying only after grading, if at all." },
        { code: "P14", text: "I cannot see how a student worked on an assignment, only the final file." },
        { code: "P15", text: "I cannot easily tell whether two similar submissions were copied from each other." },
      ],
    },
  ],
  acceptability: [
    {
      label: "PERCEIVED USEFULNESS",
      items: [
        { code: "PU1", text: "This setup lets me create, distribute, and collect programming assignments in one place." },
        { code: "PU2", text: "This setup helps me check whether submitted programs work correctly." },
        { code: "PU3", text: "This setup helps students get guidance without being handed complete solutions." },
        { code: "PU4", text: "This setup lets me see how students produced their submitted code." },
        { code: "PU5", text: "Overall, this setup is useful for handling programming courses." },
      ],
    },
    {
      label: "PERCEIVED EASE OF USE",
      items: [
        { code: "PEOU1", text: "Learning to use this setup is easy for me." },
        { code: "PEOU2", text: "Creating an assignment with test cases in this setup is easy." },
        { code: "PEOU3", text: "Reviewing student submissions and results in this setup is easy." },
        { code: "PEOU4", text: "Controlling how much AI help students receive in this setup is easy." },
        { code: "PEOU5", text: "Overall, this setup is easy to use." },
      ],
    },
    {
      label: "ATTITUDE TOWARD USE",
      items: [
        { code: "ATU1", text: "Using this setup in my programming classes is a good idea." },
        { code: "ATU2", text: "I like using this setup." },
        { code: "ATU3", text: "I am comfortable with how this setup handles students' use of AI." },
        { code: "ATU4", text: "Using this setup is a pleasant experience." },
        { code: "ATU5", text: "I feel positive about managing programming assignments in this setup." },
      ],
    },
    {
      label: "INTENTION TO USE",
      items: [
        { code: "BI1", text: "I intend to use this setup in future programming classes if it is available." },
        { code: "BI2", text: "I would allow students to use the AI help in this setup." },
        { code: "BI3", text: "I would recommend this setup to other instructors." },
        { code: "BI4", text: "I would use this setup for a full term." },
        { code: "BI5", text: "I would use this setup to review student work in future classes." },
      ],
    },
  ],
  features: [
    { code: "F1", text: "Setting the number of hearts lets me control how much AI help students receive." },
    { code: "F2", text: "Configuring hearts and regeneration time is easy to understand." },
    { code: "F3", text: "The visible and hidden test cases help me check whether submissions work correctly." },
    { code: "F4", text: "The activity summary shows me how a student produced the submitted code." },
    { code: "F5", text: "The activity flags help me decide which submissions to review more closely." },
  ],
};
