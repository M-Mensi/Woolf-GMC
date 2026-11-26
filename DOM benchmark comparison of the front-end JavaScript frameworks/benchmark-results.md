# Benchmark results

## Test setup

| Item | Value |
|---|---|
| Build mode | Production |
| Runtime | Node 24.22.3 for Angular build |
| Browser | VS Code embedded browser, Chromium 150.0.7871.250 / Electron 43.8.10 |
| Operating system / device | Windows (browser user agent reports Windows NT 10.0); device model not exposed |
| Run date | 2026-11-26 |
| Samples per operation | 3; median |
| Timing boundary | Framework state update through framework commit and forced document layout; paint/display wait excluded |
| Dataset | Generated 100, 500 or 1,000 tasks; 50 records updated or removed from a 1,000-task baseline |

## Comparison

Run each app's **Run full benchmark** button in the same browser and machine. The landing page reports the latest saved run per framework.

| Framework | Initial render 100 (ms) | 500 (ms) | 1,000 (ms) | Update 50 (ms) | Delete 50 (ms) | Post-run heap (MB) |
|---|---:|---:|---:|---:|---:|---:|
| React | 10.5 | 55.6 | 112.6 | 11.6 | 4.7 | 18.9 |
| Angular | 23.0 | 75.9 | 146.6 | 13.4 | 7.6 | 22.9 |
| Vue | 11.6 | 53.7 | 114.2 | 12.3 | 4.7 | 34.6 |
| Svelte | 14.6 | 63.4 | 121.8 | 23.4 | 16.8 | 55.5 |

### Raw timing samples (ms)

| Framework | Render 100 | Render 500 | Render 1,000 | Update 50 | Delete 50 |
|---|---|---|---|---|---|
| React | 11.1, 10.3, 10.5 | 48.7, 55.6, 77.3 | 105.3, 120.3, 112.6 | 14.2, 9.6, 11.6 | 10.1, 4.7, 4.2 |
| Angular | 23.0, 16.2, 24.1 | 75.9, 80.3, 71.6 | 146.6, 144.7, 185.9 | 14.5, 13.4, 11.1 | 12.2, 7.6, 7.3 |
| Vue | 12.0, 9.9, 11.6 | 51.2, 53.7, 54.2 | 105.6, 117.5, 114.2 | 12.5, 12.2, 12.3 | 15.5, 4.6, 4.7 |
| Svelte | 14.6, 18.4, 13.6 | 63.4, 63.7, 53.2 | 121.8, 116.4, 134.0 | 41.3, 23.4, 16.9 | 16.8, 17.8, 13.0 |

The application stores the raw samples and medians in browser `localStorage`; this markdown is the human-readable record. This is one run in the stated environment, not a statistically broad comparison. Repeat on the target submission device before drawing firm conclusions.

## Notes

Heap usage is available only in browsers exposing `performance.memory`, is a coarse post-run snapshot and includes browser/runtime overhead. Timings include framework commit and forced layout, but not display refresh. Results depend on browser, CPU, background activity and framework/package versions and should not be presented as universal rankings.
