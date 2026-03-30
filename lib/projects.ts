export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  gitlab?: string;
  demo?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    title: "Corporate Social Responsibility Management System",
    description:
      "This project implements a corporate social responsibility management platform using a custom MVC stack that follows the Boundary–Control–Entity (BCE) methodology. It is written in pure PHP 8.2 with PDO.",
    tags: ["PHP", "Django", "PostgreSQL", "React"],
    gitlab: "https://gitlab.com/sim2025q4-cnzahj/csit314-group-project",
    featured: true,
  }
];
