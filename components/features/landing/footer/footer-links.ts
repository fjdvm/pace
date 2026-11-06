export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  anchor?: boolean;
};

export type FooterColumnData = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumnData[] = [
  {
    title: "The study",
    links: [
      { label: "Statement of the problem", href: "#separate-tools", anchor: true },
      { label: "Conceptual framework", href: "#hearts", anchor: true },
      { label: "Methodology", href: "#monitoring", anchor: true },
      { label: "Questionnaire", href: "/research/questionnaire" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "For students", href: "#meet-spark", anchor: true },
      { label: "For instructors", href: "#meet-spark", anchor: true },
      { label: "Spark", href: "#meet-spark", anchor: true },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Researchers", href: "https://github.com/fjdvm/fr-gaits", external: true },
      { label: "Polytechnic University of the Philippines", href: "https://www.pup.edu.ph", external: true },
      { label: "Privacy and data", href: "/privacy" },
    ],
  },
];
