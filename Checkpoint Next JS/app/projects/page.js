import ProjectCard from "../../components/ProjectCard";
import { projects } from "../../data/projects";

export const metadata = {
  title: "Projects",
  description: "A collection of web projects, experiments, and things I’ve built.",
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="page-shell">
      <section className="page-hero projects-hero">
        <p className="eyebrow">A FEW THINGS I’VE MADE</p>
        <h1>
          Small ideas,
          <br />
          <span className="text-accent">made tangible.</span>
        </h1>
        <p className="page-intro">
          A selection of interfaces and experiments, each one a chance to learn
          something new and make it useful.
        </p>
      </section>

      <section className="section-shell projects-list">
        <div className="projects-toolbar">
          <span>SELECTED PROJECTS</span>
          <span>01 — 0{projects.length}</span>
        </div>
        <div className="project-grid project-grid-all">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
