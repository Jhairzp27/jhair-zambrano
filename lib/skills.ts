/**
 * Datos del mapa de habilidades (sección STACK). Es el único archivo que hay que tocar
 * para cambiar lo que muestra el cerebro.
 *
 * ── Agregar una habilidad ──────────────────────────────────────────────────────────
 * 1. Añade una línea en SKILLS:
 *      { name: "MySQL", category: "Databases", level: "secondary" }
 *    · category: uno de los nombres de GROUPS.
 *    · level: "primary" (Core) · "secondary" (In use) · "learning" (Exploring).
 * 2. (Opcional) Conéctala en SYNAPSES:
 *    · Con una del mismo grupo:  ["MySQL", "SQL"]
 *    · Con otro grupo, con el porqué que se lee en la tarjeta:
 *        ["MySQL", "Java", "persistence for Java apps"]
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
 * El orden es el de las pestañas y el de las tarjetas que se van mostrando.
 */
export const GROUPS: Record<string, Group> = {
  Architecture: {
    cortex: "frontal lobe", role: "design", rgb: "249,115,22",
    center: [0.14, -0.32, -0.42], spread: [0.42, 0.16, 0.2],
  },
  "Agile & Requirements": {
    cortex: "prefrontal cortex", role: "planning", rgb: "167,139,250",
    center: [0.1, -0.02, -0.7], spread: [0.42, 0.2, 0.14],
  },
  Backend: {
    cortex: "motor cortex", role: "execution", rgb: "252,211,77",
    center: [0.16, -0.44, -0.02], spread: [0.42, 0.14, 0.18],
  },
  Frontend: {
    cortex: "occipital lobe", role: "perception", rgb: "245,228,196",
    center: [0.2, -0.06, 0.72], spread: [0.38, 0.24, 0.16],
  },
  Databases: {
    cortex: "parietal lobe", role: "storage & integration", rgb: "251,113,133",
    center: [0.14, -0.34, 0.36], spread: [0.42, 0.16, 0.18],
  },
  // Cian: el mismo tono de las luces RGB del teclado 3D.
  "Data & Analytics": {
    cortex: "left temporal lobe", role: "memory & insight", rgb: "56,189,248",
    center: [-0.48, 0.24, -0.12], spread: [0.2, 0.16, 0.4],
  },
  "Cloud & DevOps": {
    cortex: "cerebellum", role: "coordination", rgb: "205,127,80",
    center: [0, 0.5, 0.66], spread: [0.44, 0.12, 0.2],
  },
  "Soft Skills": {
    cortex: "right temporal lobe", role: "language & relationships", rgb: "52,211,153",
    center: [0.5, 0.24, -0.14], spread: [0.18, 0.16, 0.38],
  },
};

export const SKILLS: Skill[] = [
  { name: "UML", category: "Architecture", level: "primary" },
  { name: "Design Patterns", category: "Architecture", level: "primary" },
  { name: "SOLID", category: "Architecture", level: "primary" },
  { name: "Clean Code", category: "Architecture", level: "primary" },
  { name: "OOP", category: "Architecture", level: "primary" },
  { name: "SonarQube", category: "Architecture", level: "learning" },

  { name: "Requirements", category: "Agile & Requirements", level: "primary" },
  { name: "Scrum", category: "Agile & Requirements", level: "primary" },
  { name: "Project Management", category: "Agile & Requirements", level: "primary" },
  { name: "Kanban", category: "Agile & Requirements", level: "secondary" },

  { name: "Java", category: "Backend", level: "primary" },
  { name: "Jakarta EE", category: "Backend", level: "primary" },
  { name: "JPA", category: "Backend", level: "primary" },
  { name: "Python", category: "Backend", level: "primary" },
  { name: "Node.js", category: "Backend", level: "secondary" },
  { name: "JUnit", category: "Backend", level: "secondary" },
  { name: "Postman", category: "Backend", level: "secondary" },
  { name: "API Testing", category: "Backend", level: "secondary" },
  { name: "PHP", category: "Backend", level: "learning" },

  { name: "HTML/CSS", category: "Frontend", level: "primary" },
  { name: "JavaScript", category: "Frontend", level: "primary" },
  { name: "Responsive", category: "Frontend", level: "primary" },
  { name: "TypeScript", category: "Frontend", level: "secondary" },
  { name: "React", category: "Frontend", level: "secondary" },
  { name: "Next.js", category: "Frontend", level: "secondary" },
  { name: "Tailwind", category: "Frontend", level: "secondary" },

  { name: "SQL", category: "Databases", level: "primary" },
  { name: "PostgreSQL", category: "Databases", level: "primary" },
  { name: "SQLite", category: "Databases", level: "primary" },
  { name: "DB Modeling", category: "Databases", level: "primary" },
  { name: "Supabase", category: "Databases", level: "secondary" },
  { name: "DynamoDB", category: "Databases", level: "learning" },

  { name: "Pandas", category: "Data & Analytics", level: "primary" },
  { name: "Power BI", category: "Data & Analytics", level: "secondary" },
  { name: "Tableau", category: "Data & Analytics", level: "learning" },
  { name: "Excel", category: "Data & Analytics", level: "learning" },
  { name: "Google Sheets", category: "Data & Analytics", level: "learning" },
  { name: "Jupyter", category: "Data & Analytics", level: "learning" },
  { name: "NumPy", category: "Data & Analytics", level: "learning" },
  { name: "Matplotlib", category: "Data & Analytics", level: "learning" },

  { name: "Git", category: "Cloud & DevOps", level: "primary" },
  { name: "Docker", category: "Cloud & DevOps", level: "learning" },
  { name: "CI/CD", category: "Cloud & DevOps", level: "learning" },
  { name: "Lambda", category: "Cloud & DevOps", level: "learning" },
  { name: "AWS S3", category: "Cloud & DevOps", level: "learning" },
  { name: "Cognito", category: "Cloud & DevOps", level: "learning" },
  { name: "Boto3", category: "Cloud & DevOps", level: "learning" },

  { name: "Teamwork", category: "Soft Skills", level: "primary" },
  { name: "Leadership", category: "Soft Skills", level: "primary" },
  { name: "Proactivity", category: "Soft Skills", level: "primary" },
  { name: "Resilience", category: "Soft Skills", level: "primary" },
  { name: "Problem Solving", category: "Soft Skills", level: "primary" },
  { name: "Adaptability", category: "Soft Skills", level: "primary" },
  { name: "Accountability", category: "Soft Skills", level: "primary" },
  { name: "Event Planning", category: "Soft Skills", level: "primary" },
];

export const SYNAPSES: Synapse[] = [
  // Dentro de cada región
  ["UML", "Design Patterns"], ["Design Patterns", "SOLID"], ["SOLID", "Clean Code"], ["OOP", "SOLID"],
  ["Clean Code", "SonarQube"],
  ["Requirements", "Scrum"], ["Scrum", "Kanban"], ["Scrum", "Project Management"], ["Requirements", "Project Management"],
  ["Java", "Jakarta EE"], ["Jakarta EE", "JPA"], ["Java", "JUnit"], ["JUnit", "API Testing"], ["Postman", "API Testing"],
  ["HTML/CSS", "JavaScript"], ["HTML/CSS", "Responsive"], ["JavaScript", "TypeScript"],
  ["TypeScript", "React"], ["React", "Next.js"], ["Next.js", "Tailwind"], ["Tailwind", "Responsive"],
  ["SQL", "PostgreSQL"], ["SQL", "SQLite"], ["PostgreSQL", "DB Modeling"], ["DB Modeling", "SQL"], ["PostgreSQL", "Supabase"],
  ["Pandas", "NumPy"], ["Pandas", "Matplotlib"], ["Jupyter", "Pandas"],
  ["Excel", "Google Sheets"], ["Power BI", "Excel"], ["Power BI", "Tableau"],
  ["Git", "CI/CD"], ["CI/CD", "Docker"], ["CI/CD", "Lambda"], ["Lambda", "AWS S3"], ["Lambda", "Cognito"], ["Boto3", "AWS S3"],
  ["Leadership", "Teamwork"], ["Proactivity", "Problem Solving"], ["Resilience", "Adaptability"],
  ["Teamwork", "Event Planning"], ["Problem Solving", "Adaptability"],

  // Entre regiones
  ["JPA", "PostgreSQL", "ORM persisting to the relational database"],
  ["SQLite", "Python", "lightweight databases for scripts and apps"],
  ["Python", "Pandas", "data wrangling in Python"],
  ["Python", "Boto3", "AWS SDK for Python"],
  ["SQL", "Power BI", "queries that feed the dashboards"],
  ["Lambda", "DynamoDB", "serverless functions with NoSQL storage"],
  ["Next.js", "Supabase", "auth and data for web apps"],
  ["UML", "DB Modeling", "from diagram to schema"],
  ["UML", "Requirements", "requirements turned into models"],
  ["Java", "OOP", "the paradigm it is built on"],
  ["Jakarta EE", "Design Patterns", "dependency injection, DAO and MVC"],
  ["React", "Design Patterns", "component composition"],
  ["Node.js", "JavaScript", "the same language on server and client"],
  ["Docker", "Jakarta EE", "packaging the app for any environment"],
  ["SonarQube", "CI/CD", "quality gates in the pipeline"],
  ["Git", "Teamwork", "branches, PRs and code review"],
  ["Scrum", "Teamwork", "sprint-based collaboration"],
  ["Leadership", "Scrum", "leading sprint teams"],
  ["Accountability", "Project Management", "owning scope and deadlines"],
  ["Power BI", "Project Management", "dashboards to track project KPIs"],
  ["Problem Solving", "Design Patterns", "proven solutions to recurring problems"],
];
