import Link from "next/link";

export default function ProjectCard({ project, index }) {
  return (
    <article className={`project-card project-card-${index + 1}`}>
      <Link
        className="project-visual"
        href={`/projects#${project.slug}`}
        aria-label={`Read about ${project.title}`}
      >
        <img src={project.image} alt={project.imageAlt} width="720" height="480" />
        <span className="project-number">0{index + 1}</span>
        <span className="project-arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="project-card-copy" id={project.slug}>
        <div>
          <p className="project-type">{project.type}</p>
          <h3>{project.title}</h3>
        </div>
        <p className="project-description">{project.description}</p>
        <ul className="tag-list" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
