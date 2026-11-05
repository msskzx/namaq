# Matrix connector studio

Reuse the tree studio's controls and video exporter for matrix comparison connectors.

- Offer the studio when the visible matrix has drawable comparison connectors, including when connectors initially default to off. Comparison chips toggle independently. Opening with no chips selected enables all comparison types, and playback includes every selected type with its own connector color.
- Play draws each SVG connector from its source word to its destination. Completed connections remain visible; future connections wait. Pause freezes drawing. Replay uses Play; Reset restores the complete matrix while keeping the studio open.
- Reuse speed and recall preferences. Recall pauses before each connector with a solid hourglass prompt and localized seconds below it; timed expiry, tap, and keyboard reveal the connection. Video always uses a finite timer.
- Use the theme green for studio and video progress bars.
- Preserve comparison colors, both languages, themes, reduced motion, and matrix navigation. Changing comparison type or the current column stops playback and clears transient styles.
- Match each comparison chip to its connector color through the shared Button tone, and include the active chips and their word examples as a wrapping legend below the diagram in matrix and tree videos. Tree exports include all chips when none are selected.
- Use the page fonts for video chip labels and word examples, and wait for fonts before recording.
- Export the visible matrix column, its connectors, and timer into the existing video dialog without an app URL or tree title.
- Test controls, draw order, pause/reset, recall, comparison/column changes, cleanup, and export. Check the rendered paths and browser console, then run lint, TypeScript, the full suite, and a production build.
