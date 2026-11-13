import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, Check, ChevronDown,
  CircleHelp, Clock3, FileText, GraduationCap, LayoutDashboard, LogOut, Plus,
  Search, Settings2, Sparkles, Trash2, X,
} from "lucide-react";
import { api } from "./api.js";

const initialSession = () => {
  try {
    return JSON.parse(localStorage.getItem("educms-session") ?? "null");
  } catch {
    return null;
  }
};

const categories = ["Design", "Development", "Business", "Marketing", "Science", "General"];

function App() {
  const [session, setSession] = useState(initialSession);
  const [page, setPage] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total_courses: 0, total_lessons: 0, published_courses: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(Boolean(session));

  const signOut = useCallback(() => {
    localStorage.removeItem("educms-session");
    setSession(null);
    setCourses([]);
    setSelectedCourse(null);
    setPage("overview");
  }, []);

  const loadWorkspace = useCallback(async (token) => {
    try {
      const [courseData, dashboardData] = await Promise.all([
        api("/courses", { token }),
        api("/dashboard", { token }),
      ]);
      setCourses(courseData.courses);
      setStats(dashboardData.stats);
    } catch (error) {
      if (error.message.includes("session") || error.message.includes("Sign in")) signOut();
      else setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  useEffect(() => {
    if (session?.token) loadWorkspace(session.token);
    else setLoading(false);
  }, [session?.token, loadWorkspace]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return courses;
    return courses.filter((course) => `${course.title} ${course.category} ${course.status}`.toLowerCase().includes(normalized));
  }, [courses, query]);

  async function openCourse(course) {
    try {
      const data = await api(`/courses/${course.id}`, { token: session.token });
      setSelectedCourse(data.course);
      setLessons(data.lessons);
      setPage("course");
    } catch (error) {
      setNotice(error.message);
    }
  }

  function onSignedIn(nextSession) {
    localStorage.setItem("educms-session", JSON.stringify(nextSession));
    setSession(nextSession);
    setPage("overview");
  }

  async function saveCourse(form) {
    const editing = modal?.type === "course" && modal.course;
    const result = await api(editing ? `/courses/${editing.id}` : "/courses", {
      token: session.token,
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(form),
    });
    setModal(null);
    setNotice(editing ? "Course changes saved." : "Course created.");
    await loadWorkspace(session.token);
    if (editing && selectedCourse?.id === editing.id) setSelectedCourse(result.course);
  }

  async function removeCourse(course) {
    if (!window.confirm(`Delete “${course.title}” and all its lessons? This can't be undone.`)) return;
    try {
      await api(`/courses/${course.id}`, { token: session.token, method: "DELETE" });
      if (selectedCourse?.id === course.id) setPage("courses");
      setSelectedCourse(null);
      setNotice("Course deleted.");
      await loadWorkspace(session.token);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function saveLesson(form) {
    const editing = modal?.type === "lesson" && modal.lesson;
    const result = await api(editing ? `/lessons/${editing.id}` : `/courses/${selectedCourse.id}/lessons`, {
      token: session.token,
      method: editing ? "PATCH" : "POST",
      body: JSON.stringify(form),
    });
    setLessons((current) => editing
      ? current.map((lesson) => lesson.id === result.lesson.id ? result.lesson : lesson)
      : [...current, result.lesson]);
    setModal(null);
    setNotice(editing ? "Lesson changes saved." : "Lesson added.");
    await loadWorkspace(session.token);
  }

  async function removeLesson(lesson) {
    if (!window.confirm(`Delete “${lesson.title}”? This can't be undone.`)) return;
    try {
      await api(`/lessons/${lesson.id}`, { token: session.token, method: "DELETE" });
      setLessons((current) => current.filter((item) => item.id !== lesson.id));
      setNotice("Lesson deleted.");
      await loadWorkspace(session.token);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function moveLesson(index, direction) {
    const reordered = [...lessons];
    const target = index + direction;
    if (target < 0 || target >= reordered.length) return;
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    try {
      await api(`/courses/${selectedCourse.id}/lessons/order`, {
        token: session.token,
        method: "PATCH",
        body: JSON.stringify({ lessonIds: reordered.map((lesson) => String(lesson.id)) }),
      });
      setLessons(reordered);
      setNotice("Lesson order updated.");
      await loadWorkspace(session.token);
    } catch (error) {
      setNotice(error.message);
    }
  }

  async function updateStatus(course, status) {
    try {
      await api(`/courses/${course.id}`, { token: session.token, method: "PATCH", body: JSON.stringify({ status }) });
      setNotice(`Course ${status}.`);
      await loadWorkspace(session.token);
      if (selectedCourse?.id === course.id) setSelectedCourse({ ...selectedCourse, status });
    } catch (error) {
      setNotice(error.message);
    }
  }

  if (!session) return <AuthPage onSignedIn={onSignedIn} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setPage("overview"); }}>
          <span className="brand-mark"><GraduationCap size={22} strokeWidth={2.2} /></span>
          <span>edu<span className="brand-light">cms</span></span>
        </a>
        <div className="workspace-switch"><span className="workspace-avatar">{session.user.name.slice(0, 1).toUpperCase()}</span><span className="workspace-copy"><strong>{session.user.name}&apos;s space</strong><small>Personal workspace</small></span><ChevronDown size={16} /></div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav">
          <button className={page === "overview" ? "nav-item active" : "nav-item"} onClick={() => setPage("overview")}><LayoutDashboard size={18} />Overview</button>
          <button className={page === "courses" || page === "course" ? "nav-item active" : "nav-item"} onClick={() => setPage("courses")}><BookOpen size={18} />Courses<span className="nav-count">{courses.length}</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-icon"><CircleHelp size={17} /></span><strong>Need a hand?</strong><p>We&apos;re here to help you get started.</p><button onClick={() => setNotice("Help center is coming soon.")}>Visit help center <ArrowRight size={14} /></button></div>
          <button className="profile-row" onClick={signOut}><span className="profile-avatar">{session.user.name.slice(0, 1).toUpperCase()}</span><span><strong>{session.user.name}</strong><small>{session.user.email}</small></span><LogOut size={17} /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="mobile-brand"><span className="brand-mark"><GraduationCap size={20} /></span>educms</div><div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{page === "course" ? selectedCourse?.title : page === "courses" ? "Courses" : "Overview"}</strong></div><div className="topbar-right"><button className="icon-button" aria-label="Settings" onClick={() => setNotice("Settings are coming soon.")}><Settings2 size={18} /></button><span className="topbar-avatar">{session.user.name.slice(0, 1).toUpperCase()}</span></div></header>
        <div className="content-wrap">
          {loading ? <div className="loading-state"><span className="spinner" />Loading your workspace…</div> : page === "course" && selectedCourse ? (
            <CoursePage course={selectedCourse} lessons={lessons} onBack={() => setPage("courses")} onEdit={() => setModal({ type: "course", course: selectedCourse })} onStatus={updateStatus} onDelete={() => removeCourse(selectedCourse)} onAddLesson={() => setModal({ type: "lesson" })} onEditLesson={(lesson) => setModal({ type: "lesson", lesson })} onDeleteLesson={removeLesson} onMoveLesson={moveLesson} />
          ) : page === "courses" ? (
            <CoursesPage courses={visibleCourses} query={query} setQuery={setQuery} onCreate={() => setModal({ type: "course" })} onOpen={openCourse} onEdit={(course) => setModal({ type: "course", course })} onDelete={removeCourse} />
          ) : (
            <OverviewPage user={session.user} stats={stats} courses={courses} onCreate={() => setModal({ type: "course" })} onBrowse={() => setPage("courses")} onOpen={openCourse} />
          )}
        </div>
        {modal?.type === "course" && <CourseModal course={modal.course} onClose={() => setModal(null)} onSave={saveCourse} />}
        {modal?.type === "lesson" && <LessonModal lesson={modal.lesson} onClose={() => setModal(null)} onSave={saveLesson} />}
        {notice && <div className="toast" role="status"><span className="toast-check"><Check size={15} /></span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>}
      </main>
    </div>
  );
}

function OverviewPage({ user, stats, courses, onCreate, onBrowse, onOpen }) {
  const recent = courses.slice(0, 3);
  return (
    <>
      <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR LEARNING SPACE</div><h1>Good to see you, {user.name.split(" ")[0]} <span className="wave">✦</span></h1><p className="page-subtitle">A little progress each day adds up to big results.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={17} />Create a course</button></div>
      <div className="stat-grid">
        <StatCard icon={<BookOpen size={19} />} label="Total courses" value={stats.total_courses} tone="lilac" detail="In your workspace" />
        <StatCard icon={<FileText size={19} />} label="Lessons created" value={stats.total_lessons} tone="mint" detail="Across all your courses" />
        <StatCard icon={<GraduationCap size={19} />} label="Published" value={stats.published_courses} tone="peach" detail="Ready for learners" />
      </div>
      <section className="panel recent-panel"><div className="section-heading"><div><div className="eyebrow">KEEP THE MOMENTUM</div><h2>Recently updated</h2></div><button className="text-button" onClick={onBrowse}>View all courses <ArrowRight size={15} /></button></div>
        {recent.length ? <div className="recent-list">{recent.map((course, index) => <CourseRow key={course.id} course={course} index={index} onClick={() => onOpen(course)} />)}</div> : <EmptyState title="Your next great course starts here" description="Create a course to organize your lessons and share what you know." action="Create your first course" onAction={onCreate} />}
      </section>
      <section className="tip-banner"><span className="tip-spark"><Sparkles size={19} /></span><div><strong>Make learning feel effortless</strong><p>Break your course into short, focused lessons. Learners love a clear path to progress.</p></div><span className="tip-decoration">✳</span></section>
    </>
  );
}

function StatCard({ icon, label, value, tone, detail }) {
  return <article className="stat-card"><span className={`stat-icon ${tone}`}>{icon}</span><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div><span className="stat-dots">···</span></article>;
}

function CoursesPage({ courses, query, setQuery, onCreate, onOpen, onEdit, onDelete }) {
  return <>
    <div className="page-head"><div><div className="eyebrow">YOUR CONTENT LIBRARY</div><h1>Courses</h1><p className="page-subtitle">Create, organize, and share your knowledge.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={17} />New course</button></div>
    <div className="toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses…" aria-label="Search courses" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</div><span className="result-count">{courses.length} {courses.length === 1 ? "course" : "courses"}</span></div>
    {courses.length ? <div className="course-grid">{courses.map((course, index) => <CourseCard key={course.id} course={course} index={index} onOpen={() => onOpen(course)} onEdit={() => onEdit(course)} onDelete={() => onDelete(course)} />)}</div> : <section className="panel empty-panel"><EmptyState title={query ? "No courses found" : "A blank page is full of possibility"} description={query ? "Try a different search term." : "Start with an idea and build a learning experience around it."} action={query ? null : "Create a course"} onAction={onCreate} /></section>}
  </>;
}

function CourseCard({ course, index, onOpen, onEdit, onDelete }) {
  return <article className={`course-card card-tone-${index % 4}`}><div className="course-card-top"><span className={`category-icon category-${index % 4}`}><BookOpen size={20} /></span><CourseActions onEdit={onEdit} onDelete={onDelete} /></div><button className="course-title-button" onClick={onOpen}><span className="course-category">{course.category}</span><h3>{course.title}</h3></button><p className="course-description">{course.description || "No description yet. Add a little context for your learners."}</p><div className="course-card-footer"><span><FileText size={15} />{course.lesson_count} {course.lesson_count === 1 ? "lesson" : "lessons"}</span><StatusBadge status={course.status} /><button className="circle-arrow" aria-label={`Open ${course.title}`} onClick={onOpen}><ArrowRight size={16} /></button></div></article>;
}

function CourseRow({ course, index, onClick }) {
  return <button className="course-row" onClick={onClick}><span className={`row-course-icon category-${index % 4}`}><BookOpen size={18} /></span><span className="row-course-copy"><strong>{course.title}</strong><small>{course.category} <span>·</span> {course.lesson_count} lessons</small></span><StatusBadge status={course.status} /><span className="row-date"><Clock3 size={14} />{new Date(course.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><ArrowRight className="row-arrow" size={17} /></button>;
}

function CourseActions({ onEdit, onDelete }) {
  return <div className="course-actions"><button title="Edit course" onClick={onEdit}><Settings2 size={16} /></button><button title="Delete course" onClick={onDelete}><Trash2 size={15} /></button></div>;
}

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}><span />{status}</span>;
}

function EmptyState({ title, description, action, onAction }) {
  return <div className="empty-state"><span className="empty-icon"><BookOpen size={25} /></span><h3>{title}</h3><p>{description}</p>{action && <button className="button button-primary button-small" onClick={onAction}><Plus size={15} />{action}</button>}</div>;
}

function CoursePage({ course, lessons, onBack, onEdit, onStatus, onDelete, onAddLesson, onEditLesson, onDeleteLesson, onMoveLesson }) {
  return <>
    <button className="back-link" onClick={onBack}><ArrowLeft size={16} />All courses</button>
    <div className="course-detail-head"><div><div className="eyebrow">{course.category.toUpperCase()} <span className="eyebrow-dot">·</span> COURSE DETAILS</div><h1>{course.title}</h1><p className="page-subtitle">{course.description || "Add a description to give learners a preview of this course."}</p><div className="detail-meta"><StatusBadge status={course.status} /><span><BookOpen size={15} />{lessons.length} lessons</span><span><Clock3 size={15} />Updated {new Date(course.updated_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</span></div></div><div className="detail-actions"><button className="button button-secondary" onClick={onEdit}><Settings2 size={16} />Edit course</button><button className="button button-primary" onClick={onAddLesson}><Plus size={17} />Add lesson</button></div></div>
    <div className="detail-layout"><section className="panel lesson-panel"><div className="section-heading"><div><div className="eyebrow">THE LEARNING PATH</div><h2>Course lessons</h2></div><span className="result-count">{lessons.length} total</span></div>
      {lessons.length ? <div className="lesson-list">{lessons.map((lesson, index) => <article className="lesson-row" key={lesson.id}><span className="lesson-number">{String(index + 1).padStart(2, "0")}</span><span className="lesson-content"><strong>{lesson.title}</strong><small>{lesson.content || "No lesson content added yet."}</small></span><div className="lesson-actions"><button title="Move up" aria-label={`Move ${lesson.title} up`} disabled={index === 0} onClick={() => onMoveLesson(index, -1)}><ArrowUp size={15} /></button><button title="Move down" aria-label={`Move ${lesson.title} down`} disabled={index === lessons.length - 1} onClick={() => onMoveLesson(index, 1)}><ArrowDown size={15} /></button><button title="Edit lesson" aria-label={`Edit ${lesson.title}`} onClick={() => onEditLesson(lesson)}><Settings2 size={16} /></button><button title="Delete lesson" aria-label={`Delete ${lesson.title}`} onClick={() => onDeleteLesson(lesson)}><Trash2 size={15} /></button></div></article>)}</div> : <EmptyState title="Build your learning path" description="Add your first lesson to turn this course into a guided experience." action="Add first lesson" onAction={onAddLesson} />}
    </section><aside className="panel course-settings"><div className="eyebrow">COURSE SETTINGS</div><h3>Visibility</h3><p>Choose who can discover this course.</p><label className="status-select-label" htmlFor="course-status">Status</label><div className="select-wrap"><select id="course-status" value={course.status} onChange={(event) => onStatus(course, event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><ChevronDown size={15} /></div><div className="visibility-note">{course.status === "published" ? "This course is marked ready for learners." : course.status === "archived" ? "This course is archived and hidden from your active workspace." : "Only you can see this draft course."}</div><div className="danger-zone"><span>Danger zone</span><button onClick={onDelete}><Trash2 size={15} />Delete course</button></div></aside></div>
  </>;
}

function CourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({ title: course?.title ?? "", description: course?.description ?? "", category: course?.category ?? "General", status: course?.status ?? "draft" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return <Modal title={course ? "Edit course" : "Create a course"} subtitle={course ? "Update your course details and visibility." : "Give your new learning experience a home."} onClose={onClose}><form onSubmit={submit} className="modal-form"><Field label="Course name"><input autoFocus maxLength="160" required placeholder="e.g. Introduction to product design" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field><Field label="Description"><textarea maxLength="10000" rows="3" placeholder="What will learners take away from this course?" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field><div className="form-grid"><Field label="Category"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field><Field label="Status"><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field></div>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? "Saving…" : course ? "Save changes" : <><Plus size={16} />Create course</>}</button></div></form></Modal>;
}

function LessonModal({ lesson, onClose, onSave }) {
  const [form, setForm] = useState({ title: lesson?.title ?? "", content: lesson?.content ?? "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return <Modal title={lesson ? "Edit lesson" : "Add a lesson"} subtitle="Keep it focused and easy to follow." onClose={onClose}><form onSubmit={submit} className="modal-form"><Field label="Lesson title"><input autoFocus maxLength="160" required placeholder="e.g. Getting started" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></Field><Field label="Lesson content"><textarea maxLength="50000" rows="7" placeholder="Add notes, instructions, or learning material…" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} /></Field>{error && <div className="form-error" role="alert">{error}</div>}<div className="modal-footer"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? "Saving…" : lesson ? "Save changes" : <><Plus size={16} />Add lesson</>}</button></div></form></Modal>;
}

function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><h2 id="modal-title">{title}</h2><p>{subtitle}</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={19} /></button></div>{children}</section></div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function AuthPage({ onSignedIn }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify({ name, email, password }) });
      onSignedIn(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page"><div className="auth-aside"><a className="brand auth-brand" href="#"><span className="brand-mark"><GraduationCap size={22} /></span><span>edu<span className="brand-light">cms</span></span></a><div className="auth-quote"><span className="quote-mark">“</span><h1>Great ideas deserve a place to grow.</h1><p>Your knowledge can change someone&apos;s world. Let&apos;s make it easier to share.</p><div className="quote-orbit orbit-one" /><div className="quote-orbit orbit-two" /><div className="quote-orbit orbit-three" /></div><div className="auth-aside-foot">A little progress each day adds up to big results.</div></div><div className="auth-main"><div className="auth-card"><div className="auth-mobile-brand"><span className="brand-mark"><GraduationCap size={20} /></span>educms</div><div className="eyebrow">YOUR LEARNING WORKSPACE</div><h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2><p className="auth-subtitle">{mode === "login" ? "Sign in to continue building something wonderful." : "Start organizing your teaching content today."}</p><form className="modal-form auth-form" onSubmit={submit}>{mode === "register" && <Field label="Your name"><input autoComplete="name" required maxLength="100" placeholder="Jane Smith" value={name} onChange={(event) => setName(event.target.value)} /></Field>}<Field label="Email address"><input autoComplete="email" type="email" required maxLength="254" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field><Field label="Password"><input autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" minLength="8" maxLength="72" required placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? <>Sign in <ArrowRight size={17} /></> : <>Create account <ArrowRight size={17} /></>}</button></form><div className="auth-toggle">{mode === "login" ? "New to EduCMS?" : "Already have an account?"}<button onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></div><div className="auth-secure"><span><Check size={13} /></span>Your workspace is private and secure</div></div></div></div>;
}

export default App;
