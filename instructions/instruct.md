 Keep all state logic minimal and readable
 No backend — only **frontend/UI components**
- No routing or complex state libraries unless explicitly requested
---

## 💡 INTERVIEW CONTEXT

- This is a **live coding interview**
- The goal is to build a **UI-only React web app** quickly and cleanly
- Prioritize:
  - ✅ Clean layout
  - ✅ Clear hierarchy
  - ✅ Working buttons/forms
  - ✅ Polished feedback (loading, disabled, etc.)
- Do **not** over-engineer or abstract too early
- Do **not** add unused complexity (routing, Redux, backend calls, etc.)

---

## ⚠️ ERROR AVOIDANCE

- Do not leave syntax or type errors
- Always use valid TS/JS + JSX
- Avoid incomplete or ambiguous code blocks

---

## ✅ OUTPUT FORMAT

Every time you write a component:
- Include all imports at the top
- Make sure the code is **copy/paste ready**
- If a component needs props, declare the **interface** at the top