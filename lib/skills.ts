/**
 * Datos del mapa de habilidades (sección STACK). Es el único archivo que hay que tocar
 * para cambiar lo que muestra el cerebro.
 *
 * ── Agregar una habilidad ──────────────────────────────────────────────────────────
 * 1. Añade una línea en SKILLS:
 *      { name: "Docker", category: "Tooling", level: "secondary" }
 *    · category: uno de los nombres de GROUPS.
 *    · level: "primary" (Core) · "secondary" (In use) · "learning" (Exploring).
 * 2. (Opcional) Conéctala en SYNAPSES:
 *    · Con una del mismo grupo:  ["Docker", "CI/CD"]
 *    · Con otro grupo, con el porqué que se lee en la tarjeta:
 *        ["Docker", "Lambda", "container images for functions"]
 * La neurona se coloca sola dentro de la región de su grupo: no hay coordenadas que calcular.
 *
 * ── Agregar un grupo ───────────────────────────────────────────────────────────────
 * Añade una entrada en GROUPS con un color y su región dentro del cerebro (center/spread,
 * en unidades del volumen: x → derecha, y ↓, z frente → nuca, todo entre -1 y 1).
 */

export type Level = "primary" | "secondary" | "learning";
export type Vec3 = readonly [number, number, number];

export interface Skill {
  name: string;
  category: string;
  level: Level;
}

export interface Group {
  cortex: string;
  /** Qué hace esa región: es el subtítulo del título dentro del cerebro. */
  role: string;
  rgb: string;
  /** Centro y radios de la nube de neuronas del grupo. */
  center: Vec3;
  spread: Vec3;
}

/** Relación entre dos skills. Las que cruzan de un grupo a otro llevan el porqué. */
export type Synapse = readonly [a: string, b: string, why?: string];

/**
 * Cada grupo vive en la región que hace ese trabajo en un cerebro real y tiene un tono propio.
 * El orden es el de las pestañas y el del recorrido automático.
 */
export const GROUPS: Record<string, Group> = {
  Architecture: {
    cortex: "frontal lobe", role: "planning", rgb: "249,115,22",
    center: [0.14, -0.14, -0.58], spread: [0.42, 0.24, 0.26],
  },
  "Soft Skills": {
    cortex: "right temporal lobe", role: "language & relationships", rgb: "52,211,153",
    center: [0.5, 0.24, -0.14], spread: [0.18, 0.16, 0.38],
  },
  Backend: {
    cortex: "motor cortex", role: "execution", rgb: "252,211,77",
    center: [0.16, -0.44, -0.06], spread: [0.42, 0.14, 0.2],
  },
  "Cloud & Databases": {
    cortex: "parietal lobe", role: "integration", rgb: "251,113,133",
    center: [0.14, -0.32, 0.42], spread: [0.42, 0.18, 0.22],
  },
  Frontend: {
    cortex: "occipital lobe", role: "perception", rgb: "245,228,196",
    center: [0.2, -0.06, 0.72], spread: [0.38, 0.24, 0.16],
  },
  Tooling: {
    cortex: "cerebellum", role: "coordination", rgb: "205,127,80",
    center: [0, 0.5, 0.66], spread: [0.44, 0.12, 0.2],
  },
  // Cian: el mismo tono de las luces RGB del teclado 3D.
  "Data & Analytics": {
    cortex: "left temporal lobe", role: "memory & insight", rgb: "56,189,248",
    center: [-0.48, 0.24, -0.12], spread: [0.2, 0.16, 0.4],
  },
};

export const SKILLS: Skill[] = [
  { name: "Java", category: "Backend", level: "primary" },
  { name: "Jakarta EE", category: "Backend", level: "primary" },
  { name: "JPA", category: "Backend", level: "primary" },
  { name: "Python", category: "Backend", level: "primary" },
  { name: "Node.js", category: "Backend", level: "secondary" },
  { name: "PHP", category: "Backend", level: "learning" },

  { name: "UML", category: "Architecture", level: "primary" },
  { name: "Design Patterns", category: "Architecture", level: "primary" },
  { name: "SOLID", category: "Architecture", level: "primary" },
  { name: "Clean Code", category: "Architecture", level: "primary" },
  { name: "OOP", category: "Architecture", level: "primary" },
  { name: "Requirements", category: "Architecture", level: "primary" },
  { name: "SonarQube", category: "Architecture", level: "learning" },

  { name: "HTML/CSS", category: "Frontend", level: "primary" },
  { name: "JavaScript", category: "Frontend", level: "primary" },
  { name: "Responsive", category: "Frontend", level: "primary" },
  { name: "TypeScript", category: "Frontend", level: "secondary" },
  { name: "React", category: "Frontend", level: "secondary" },
  { name: "Next.js", category: "Frontend", level: "secondary" },
  { name: "Tailwind", category: "Frontend", level: "secondary" },

  { name: "PostgreSQL", category: "Cloud & Databases", level: "primary" },
  { name: "DB Modeling", category: "Cloud & Databases", level: "primary" },
  { name: "Supabase", category: "Cloud & Databases", level: "secondary" },
  { name: "Lambda", category: "Cloud & Databases", level: "learning" },
  { name: "AWS S3", category: "Cloud & Databases", level: "learning" },
  { name: "Cognito", category: "Cloud & Databases", level: "learning" },
  { name: "DynamoDB", category: "Cloud & Databases", level: "learning" },
  { name: "Boto3", category: "Cloud & Databases", level: "learning" },

  { name: "SQL", category: "Data & Analytics", level: "primary" },
  { name: "SQLite", category: "Data & Analytics", level: "primary" },
  { name: "Pandas", category: "Data & Analytics", level: "primary" },
  { name: "Power BI", category: "Data & Analytics", level: "secondary" },
  { name: "Tableau", category: "Data & Analytics", level: "learning" },
  { name: "Excel", category: "Data & Analytics", level: "learning" },
  { name: "Google Sheets", category: "Data & Analytics", level: "learning" },
  { name: "Jupyter", category: "Data & Analytics", level: "learning" },
  { name: "NumPy", category: "Data & Analytics", level: "learning" },
  { name: "Matplotlib", category: "Data & Analytics", level: "learning" },

  { name: "Git", category: "Tooling", level: "primary" },
  { name: "Scrum", category: "Tooling", level: "primary" },
  { name: "Postman", category: "Tooling", level: "secondary" },
  { name: "API Testing", category: "Tooling", level: "secondary" },
  { name: "JUnit", category: "Tooling", level: "secondary" },
  { name: "Docker", category: "Tooling", level: "learning" },
  { name: "CI/CD", category: "Tooling", level: "learning" },

  { name: "Teamwork", category: "Soft Skills", level: "primary" },
  { name: "Leadership", category: "Soft Skills", level: "primary" },
  { name: "Proactivity", category: "Soft Skills", level: "primary" },
  { name: "Resilience", category: "Soft Skills", level: "primary" },
  { name: "Problem Solving", category: "Soft Skills", level: "primary" },
  { name: "Adaptability", category: "Soft Skills", level: "primary" },
  { name: "Accountability", category: "Soft Skills", level: "primary" },
  { name: "Project Management", category: "Soft Skills", level: "primary" },
  { name: "Event Planning", category: "Soft Skills", level: "primary" },
];

export const SYNAPSES: Synapse[] = [
  // Dentro de cada región
  ["Java", "Jakarta EE"], ["Jakarta EE", "JPA"],
  ["UML", "Design Patterns"], ["Design Patterns", "SOLID"], ["SOLID", "Clean Code"], ["OOP", "SOLID"],
  ["UML", "Requirements"], ["Clean Code", "SonarQube"],
  ["HTML/CSS", "JavaScript"], ["HTML/CSS", "Responsive"], ["JavaScript", "TypeScript"],
  ["TypeScript", "React"], ["React", "Next.js"], ["Next.js", "Tailwind"], ["Tailwind", "Responsive"],
  ["PostgreSQL", "DB Modeling"], ["PostgreSQL", "Supabase"], ["Lambda", "AWS S3"],
  ["Lambda", "DynamoDB"], ["Lambda", "Cognito"], ["Boto3", "AWS S3"],
  ["SQL", "SQLite"], ["Pandas", "NumPy"], ["Pandas", "Matplotlib"], ["Jupyter", "Pandas"],
  ["Excel", "Google Sheets"], ["Power BI", "Excel"], ["Power BI", "Tableau"], ["SQL", "Power BI"],
  ["Git", "CI/CD"], ["CI/CD", "Docker"], ["Postman", "API Testing"], ["JUnit", "API Testing"],
  ["Project Management", "Accountability"], ["Problem Solving", "Adaptability"], ["Teamwork", "Event Planning"],
  ["Leadership", "Teamwork"], ["Proactivity", "Problem Solving"], ["Resilience", "Adaptability"],

  // Entre regiones
  ["JPA", "PostgreSQL", "ORM persisting to the relational database"],
  ["Python", "Boto3", "AWS SDK for Python"],
  ["Python", "Pandas", "data wrangling in Python"],
  ["SQLite", "Python", "lightweight databases for scripts and apps"],
  ["SQL", "PostgreSQL", "querying relational databases"],
  ["DB Modeling", "SQL", "schemas designed for the queries they serve"],
  ["Java", "OOP", "the paradigm it is built on"],
  ["Jakarta EE", "Design Patterns", "dependency injection, DAO and MVC"],
  ["Java", "JUnit", "unit testing the code"],
  ["Node.js", "JavaScript", "the same language on server and client"],
  ["Next.js", "Supabase", "auth and data for web apps"],
  ["React", "Design Patterns", "component composition"],
  ["UML", "DB Modeling", "from diagram to schema"],
  ["SonarQube", "CI/CD", "quality gates in the pipeline"],
  ["Requirements", "Scrum", "user stories and backlog"],
  ["CI/CD", "Lambda", "automated deployment"],
  ["Scrum", "Teamwork", "sprint-based collaboration"],
  ["Scrum", "Project Management", "iterative delivery"],
  ["Leadership", "Scrum", "leading sprint teams"],
  ["Git", "Teamwork", "branches, PRs and code review"],
  ["Requirements", "Project Management", "scope and deliverables"],
  ["Power BI", "Project Management", "dashboards to track project KPIs"],
  ["Problem Solving", "Design Patterns", "proven solutions to recurring problems"],
];
