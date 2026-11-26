# DOM benchmark comparison

Four small task-list applications implement the same add, edit and delete behavior with React, Angular, Vue and Svelte. Each app has a benchmark button for initial list renders at 100, 500 and 1,000 tasks, then an update and deletion of 50 tasks.

## Requirements and run

Use Node.js **24.15+** (recommended) or a version supported by the installed Angular CLI. Node 25 is not supported by Angular CLI 22.

```powershell
npm ci
npm test
npm run build
npm run preview
```

Open the local preview URL Vite prints (normally `http://127.0.0.1:4173`). The landing page links to all four production-built demos. Run each suite in the same browser tab/session conditions; the median timing rows are saved in same-origin `localStorage` and displayed on the landing page. Use **Clear saved runs** to discard old measurements. The UI also offers one-click task entry, priority changes, inline edits and deletion.

For iterative UI development, `npm run dev` serves the React, Vue and Svelte pages. The Angular app is built into the combined production preview by `npm run build`; use the combined preview for a fair comparison and the Angular page.

## Measurement protocol

- Production builds only; static demo datasets are generated before timing.
- Each operation runs three times after a small warmup; results show the median.
- Rendering starts from an empty list. Update and delete start from the same 1,000-task baseline.
- Timed duration begins immediately before the framework state change and ends after its framework-specific commit (`flushSync`, `nextTick`, `tick`, or Angular signal change detection) and a forced document layout.
- Updated task records and the delete target list are prepared outside the timer to focus the measurements on framework commit/render work.
- Chrome heap is an optional post-suite snapshot from the non-standard `performance.memory` API; browsers that do not expose it report N/A.

The benchmark includes framework commit and synchronous layout, but excludes display refresh/presentation. Run multiple sessions and record machine, browser, OS, power mode and build versions when submitting. Avoid background tabs, extensions, throttling changes and DevTools CPU sampling during timing. Do not compare values from different devices as if they were controlled results.

## Benchmark results and report

See [benchmark-results.md](./benchmark-results.md) for the recorded run table and [reflection-report.md](./reflection-report.md) for the 200–300-word reflection. Results are stored in the browser so you can repeat the benchmark; clear runs before collecting a new cohort.

## GitHub and free static hosting

After committing this folder, share its repository folder URL. To publish the built demo as a static site, deploy the generated `dist/` folder with a static host. For GitHub Pages in this monorepo, configure the site workflow to run `npm ci && npm run build`, then publish `dist/`; the app links use relative paths. For Cloudflare Pages, connect the repository, set the root directory to this folder, build command to `npm ci && npm run build`, and output directory to `dist`.
