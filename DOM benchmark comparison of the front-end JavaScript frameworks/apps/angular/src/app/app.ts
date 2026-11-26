import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { runBenchmarkSuite } from "../../../../src/benchmark.js";

@Component({
  imports: [CommonModule, FormsModule],
  selector: "app-root",
  templateUrl: "./app.html",
})
export class App {
  readonly tasks = signal<Task[]>([]);
  newTitle = "";
  newPriority: Priority = "medium";
  editingId: number | null = null;
  editTitle = "";
  editPriority: Priority = "medium";
  readonly running = signal(false);
  readonly progress = signal("");
  readonly results = signal<Array<{ operation: string; medianMs: number }>>([]);
  readonly heapMB = signal<number | null>(null);

  async replaceTasks(next: Task[]): Promise<void> {
    this.tasks.set(next);
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  addTask(event: Event): void {
    event.preventDefault();
    const title = this.newTitle.trim();
    if (!title) return;
    this.tasks.update((current) => [
      ...current,
      { id: Date.now() + Math.random(), title, priority: this.newPriority }
    ]);
    this.newTitle = "";
  }

  beginEdit(task: Task): void {
    this.editingId = task.id;
    this.editTitle = task.title;
    this.editPriority = task.priority;
  }

  saveEdit(id: number): void {
    const title = this.editTitle.trim();
    if (!title) return;
    this.tasks.update((current) => current.map((task) => task.id === id
      ? { ...task, title, priority: this.editPriority }
      : task));
    this.editingId = null;
  }

  removeTask(id: number): void {
    this.tasks.update((current) => current.filter((task) => task.id !== id));
  }

  trackTask(_index: number, task: Task): number {
    return task.id;
  }

  async runBenchmarks(): Promise<void> {
    this.running.set(true);
    this.progress.set("Starting benchmark…");
    try {
      const result = await runBenchmarkSuite("Angular", {
        replace: (next) => this.replaceTasks(next)
      }, ({ operation }) => {
        this.progress.set(`Measured ${operation}`);
      });
      this.results.set(result.measurements);
      this.heapMB.set(result.heapMB);
      this.progress.set("Complete. Results saved in this browser.");
    } catch (error) {
      this.progress.set(`Benchmark failed: ${error instanceof Error ? error.message : "unknown error"}`);
    } finally {
      this.running.set(false);
    }
  }
}

type Priority = "low" | "medium" | "high";
type Task = { id: number; title: string; priority: Priority };
