export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumnData = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumnData[] = [
  {
    title: "The study",
    links: [
      { label: "Statement of the problem", href: "/study/problem" },
      { label: "Conceptual framework", href: "/study/framework" },
      { label: "Methodology", href: "/study/methodology" },
      { label: "Questionnaire", href: "/research/questionnaire" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "For students", href: "/students" },
      { label: "For instructors", href: "/instructors" },
      { label: "Spark", href: "/spark" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Researchers", href: "/researchers" },
      { label: "Polytechnic University of the Philippines", href: "https://www.pup.edu.ph", external: true },
      { label: "Privacy and data", href: "/privacy-and-data" },
    ],
  },
];
