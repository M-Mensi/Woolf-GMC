# Version Control, Continuous Integration, and Quality Assurance

This folder contains a small Node.js gradebook calculator used to practice Git, CI, and QA. It validates scores from 0–100, calculates a student's average and letter grade, and provides a command-line example.

## Run and verify

Use Node.js 22.13 or later:

```powershell
npm ci
npm test
npm run lint
npm run build
npm start -- "Sam Lee" 84 91 87
```

The CLI prints a grade summary. It reports invalid input as an error instead of silently substituting a result.

## GitHub Actions

GitHub only discovers Actions workflows under `.github/workflows` at the repository root. Because this project is a folder inside a larger repository, its workflow is the one necessary file outside this folder: [`version-control-qa.yml`](../.github/workflows/version-control-qa.yml). It runs `npm ci`, lint, tests, and the build check on relevant pushes and pull requests. GitHub shows the result in the Actions tab and on the related commit or pull request; notifications depend on each user's GitHub notification settings.

## Git practice

The repository is shared with other exercises. From its root, make a feature branch, make a change, and publish it:

```powershell
git switch -c feature/gradebook-validation
git status
git add "Version Control, Continuous Integration, and Quality Assurance"
git commit -m "Validate gradebook scores"
git push -u origin feature/gradebook-validation
```

Open a pull request on GitHub, ask a classmate to review it, and wait for CI before merging. To get a teammate's latest changes:

```powershell
git fetch origin
git switch main
git pull --ff-only origin main
```

To practice a merge conflict, have two branches edit the same line, commit both changes, and merge one branch into the other. Git marks conflict sections with `<<<<<<<`, `=======`, and `>>>>>>>`. Edit the file to the agreed final version, remove the markers, run tests and lint, then `git add` the resolved file and commit the merge. Do not overwrite a teammate's work without discussing the intended result.

## QA and review

The test suite covers average calculations, letter-grade boundaries, invalid input, and student-name validation. ESLint checks the source and tests using a flat configuration. See [QA-report.md](./QA-report.md) for the checks and review status, and [reflection.md](./reflection.md) for the short reflection.
