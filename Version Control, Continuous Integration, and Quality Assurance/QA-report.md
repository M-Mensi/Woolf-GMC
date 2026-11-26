# QA report

## Automated checks

The Node.js test runner covers:

- Average calculation and two-decimal rounding.
- CLI score parsing, including blank, non-decimal, and out-of-range values.
- Every letter-grade cutoff, including values immediately below the failing-grade boundary.
- Empty, non-array, sparse, non-finite, non-numeric, negative, and over-100 score inputs.
- Student-name trimming and blank-name rejection.

ESLint is configured with the recommended JavaScript rules for `src/` and `test/`. The latest local lint run reports no style or correctness findings. The build check runs Node's syntax checker on the CLI and gradebook modules. GitHub Actions is configured to run install, lint, test, and build checks on relevant pushes and pull requests.

Latest local verification: `npm ci` completed with 0 reported vulnerabilities, lint passed, all 7 tests passed, and the build check passed. The GitHub workflow has not run yet because this work has not been pushed.

## Review summary

A self-review checked the input-validation paths, grade cutoffs, CLI error handling, and that the workflow uses the project's lockfile and working directory. No defects were found in the final checks. No external peer review was conducted in this environment; the README describes the pull-request and reviewer workflow students should use.

## Version-control status

The local checkout already had an interactive rebase in progress when this exercise began. To avoid changing or interrupting that history, no branch, commit, merge, or push was performed for this exercise. The README contains the commands to create a feature branch, open a pull request, and practice conflict resolution after the rebase is completed.
