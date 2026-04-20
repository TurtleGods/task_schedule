Follow these tasks and execute directly (do not stop at analysis):

[Scope]
- Focus on ./src/theme, ./src/components, and any files that define or consume theme tokens.

[Execution Flow]
1. Identify theme-related files (tokens, CSS variables, ThemeContext, shared UI components).
2. Step 3 — Bright mode:
   - Audit current tokens and styles.
   - Adjust contrast to meet WCAG AA standards.
   - Prefer modifying existing variables instead of introducing new ones.
3. Step 4 — Dark/Light consistency:
   - Ensure both modes use the same CSS variable names (e.g., --bg-primary, --text-primary).
   - Remove hardcoded color classes and replace them with token-based styles.
   - Align shared components (buttons, cards, inputs, layout surfaces).
4. Apply all changes directly to the repo (write files, do not only suggest).
5. Step 5 — Verification:
   - Run npm run build
   - If errors occur, prioritize fixing theme-related TS/CSS issues
   - Fix and re-run until build passes or a real blocker appears

[Rules]
- Do not stop after listing or audit
- Do not wait for confirmation
- Prefer minimal, safe diffs
- Reuse existing structure where possible
- If blocked, explicitly state the blocker and continue with what is possible

[Output Requirements]
After each major step:
- files changed
- what was modified
- reason

Final output:
- Table of changed files
- Summary of bright mode improvements
- Summary of dark/light consistency fixes
- Build result
- Remaining issues (if any)

Start now:
1. First list the theme-related files
2. Then immediately proceed to Step 3 without waiting