# What NOT To Do: Lessons Learned from a Broken Refactor

This document records mistakes made during a failed attempt to refactor the calendar component for performance, so future developers can avoid the same pitfalls.

## What Went Wrong

1. **Overcomplicated the Scroll Logic**
   - Tried to "improve" scroll behavior with unnecessary state, timers, and error handling.
   - Broke the simple, working scroll-to-date logic that was already robust.
   - Added complexity (like isListReady, clearScrollToTimestamp, etc.) that only introduced bugs.

2. **Changed Too Much at Once**
   - Refactored multiple files and core logic simultaneously.
   - Did not isolate performance improvements from working features.
   - Failed to keep the working scroll and virtualization logic untouched.

3. **Did Not Respect Existing Functionality**
   - Ignored the fact that demo.tsx already had perfect, smooth scrolling.
   - Did not test against the working demo before making changes.
   - Assumed performance improvements required rewriting core logic.

4. **Did Not Incrementally Test**
   - Made sweeping changes without verifying each step.
   - Did not check if scroll, selection, and rendering still worked after each change.

5. **Did Not Communicate Clearly**
   - Did not clarify with the team which features were critical to preserve.
   - Did not document the original working behavior before starting.

6. **Ignoring Project Constraints (Drag-to-Select)**
   - Attempted to implement a feature (drag-to-select) that required ejecting from Expo Go.
   - Failed to confirm early if such a change was acceptable within the project's constraints (e.g., staying within Expo Go).
   - Led to wasted effort and a broken feature that had to be reverted.

## What To Do Instead

- **If it works, don't fix it.**
- **Performance improvements should be additive, not destructive.**
- **Never break working scroll/virtualization logic for the sake of refactor.**
- **Test after every small change.**
- **Keep the code as simple as possible.**
- **Document the original behavior and requirements before starting.**
- **Ask for clarification if unsure about requirements.**

## Summary

The best refactor is one that improves performance and maintainability **without breaking any existing features**. Always respect the working code, and make changes incrementally with constant testing.

### Overall Lessons from this Interaction

This entire interaction serves as a prime example of several critical lessons in software development and debugging:

1.  **Validate Assumptions Early:** Before embarking on significant changes, especially those involving new libraries or architectural shifts, explicitly confirm compatibility and project constraints (e.g., "Are we allowed to eject from Expo Go?"). This prevents wasted effort.
2.  **Incremental Debugging is Key:** When a feature isn't working, break down the problem into the smallest possible units. Instead of making multiple changes at once, isolate the problematic area and test changes one by one. This helps pinpoint the exact cause of the issue.
3.  **Understand Library Nuances:** A superficial understanding of a library (like how Zustand selectors work to prevent re-renders) can lead to new, subtle bugs. Always delve deeper into the documentation and best practices for critical libraries.
4.  **Revert and Re-evaluate:** When a series of changes leads to a broken state, don't be afraid to revert to a known working state and re-evaluate the approach. Continuing to build on a broken foundation only compounds the problems.
5.  **Clear Communication is Paramount:** Misunderstandings about requirements (like the initial "slow" selection vs. the desire for multi-select) or constraints (Expo Go) can derail progress. Always ask clarifying questions and confirm understanding.
6.  **Performance is a Journey, Not a Single Fix:** Optimizing performance often involves multiple, iterative steps, each addressing a specific bottleneck. It's rarely a one-shot solution.
