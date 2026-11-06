import type { RoleItems } from "./types";

export const studentItems: RoleItems = {
  profile: [
    { id: "yearLevel", label: "Year level", options: ["1st year", "2nd year", "3rd year", "4th year"] },
    { id: "coursesTaken", label: "Number of programming courses taken", options: ["1", "2", "3", "4", "5 or more"] },
    {
      id: "aiUsage",
      label: "How often do you use AI tools such as ChatGPT for programming?",
      options: ["Never", "Sometimes", "Often"],
    },
  ],
  problems: [
    {
      label: "A. TOOL INTEGRATION",
      items: [
        { code: "P1", text: "I switch between several applications to finish one programming assignment." },
        { code: "P2", text: "Submitting my code takes extra steps, such as copying it into a document or converting it to PDF." },
        { code: "P3", text: "I lose time setting up or moving between tools instead of programming." },
        { code: "P4", text: "I cannot run or test my code in the same place where I read the assignment." },
        { code: "P5", text: "I find out whether my program is correct only after my instructor checks it." },
      ],
    },
    {
      label: "B. AI USE",
      items: [
        { code: "P6", text: "When I ask an AI tool for help, it gives me the complete solution instead of guiding me." },
        { code: "P7", text: "I submit code from an AI tool that I do not fully understand." },
        { code: "P8", text: "I ask an AI tool for help before trying to solve the problem myself." },
        { code: "P9", text: "The AI tool I use does not know the details of my assignment, so its answers do not fit what is asked." },
        { code: "P10", text: "I find it hard to explain my own code after getting help from an AI tool." },
      ],
    },
  ],
  acceptability: [
    {
      label: "PERCEIVED USEFULNESS",
      items: [
        { code: "PU1", text: "This setup lets me write, run, and submit programming assignments without switching between separate tools." },
        { code: "PU2", text: "The help available in this setup helps me find where my code goes wrong." },
        { code: "PU3", text: "The help available in this setup helps me understand the concepts used in the assignment." },
        { code: "PU4", text: "This setup encourages me to try solving problems on my own before asking for help." },
        { code: "PU5", text: "Overall, this setup is useful for completing programming assignments." },
      ],
    },
    {
      label: "PERCEIVED EASE OF USE",
      items: [
        { code: "PEOU1", text: "Learning to use this setup is easy for me." },
        { code: "PEOU2", text: "Writing and running code in this setup is easy." },
        { code: "PEOU3", text: "It is easy to ask the AI tool in this setup a question and understand its answer." },
        { code: "PEOU4", text: "Submitting my work in this setup is easy." },
        { code: "PEOU5", text: "Overall, this setup is easy to use." },
      ],
    },
    {
      label: "ATTITUDE TOWARD USE",
      items: [
        { code: "ATU1", text: "Using this setup for programming assignments is a good idea." },
        { code: "ATU2", text: "I like using this setup." },
        { code: "ATU3", text: "I am comfortable with the kind of AI help this setup gives me." },
        { code: "ATU4", text: "Using this setup is a pleasant experience." },
        { code: "ATU5", text: "I feel positive about doing my programming work in this setup." },
      ],
    },
    {
      label: "INTENTION TO USE",
      items: [
        { code: "BI1", text: "I intend to keep using this setup for future programming assignments." },
        { code: "BI2", text: "When I get stuck, I would turn to the help in this setup first." },
        { code: "BI3", text: "I would recommend this setup to other students." },
        { code: "BI4", text: "I would use this setup throughout a programming course." },
        { code: "BI5", text: "I would use this setup for practice even when it is not required." },
      ],
    },
  ],
  features: [
    { code: "F1", text: "Having a limited number of hearts makes me think about my question before asking the AI tutor." },
    { code: "F2", text: "The hearts counter and regeneration timer are easy to understand." },
    { code: "F3", text: "The AI tutor's hints give me enough help to continue without giving me the answer." },
    { code: "F4", text: "The visible test cases help me check my code before I submit it." },
    { code: "F5", text: "I am comfortable with PACE recording my typing, pasting, and tab switching while I work." },
  ],
};
