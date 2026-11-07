Figma comparison for #167 (frames 80:511 and 86:1290):

- The backend has no topic names for week headings (such as “Strings” or “Basics”), so Classwork keeps real due-date week groups without inventing topics.
- There is no scheduled publishing field, so the screen shows real Draft/published state rather than fabricated “Scheduled · Oct 22” metadata.
- The current Classwork projection exposes turned-in/assigned counts, not the frame's graded/missing breakdown. It retains those real counts.
- Existing shared shell differences (logo/header/sidebar) are outside this ticket's Classwork changes.

Verified Draft labels, all four menu titles/subtitles, Activity editor navigation, Announcement and Material dialogs using mock auth at 1440 and 390. Teaching/Enrolled additionally checked at 2400, 1440 and 390 with a 1280px maximum and outer padding. No schema migration needed.
