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
