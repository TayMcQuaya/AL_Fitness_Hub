# Book Content Guide

## Source

The book content comes from the DOCX file "Burnt Out and Ready to Feel Great by Al Cummings" on the user's desktop. The text was extracted and placed into `constants.js` → `BOOK_CHAPTERS` array. Only narrative text was included — no images, tracking worksheets, tables, or fill-in sections.

## Structure

`BOOK_CHAPTERS` is an array of chapter objects in `constants.js` (search for `export const BOOK_CHAPTERS`).

Each chapter object:

```js
{
  id: "ch1",              // Unique ID. Used as key in readChapters storage.
  title: "Chapter 1",     // Shown in BookScreen list + ChapterView header
  subtitle: "The Athletic Paradox",  // Shown below title in BookScreen list + inside chapter body
  icon: "directions-run", // MaterialIcons name — shown in BookScreen list + chapter header icon
  readTime: 10,           // Estimated read time in minutes
  sections: [             // Array of content sections
    {
      heading: "Section Title",
      content: "Paragraph text here.\n\nNew paragraphs use \\n\\n."
    },
  ],
}
```

## Current Chapters (13 total)

| # | ID | Title | Subtitle | Badge |
|---|-----|-------|----------|-------|
| 0 | intro | Introduction | The Skinny Kid Who Ate Everything and Absorbed Nothing | Book icon |
| 1 | ch1 | Chapter 1 | When Your Lifestyle Choices Tell a Story | Number |
| 2 | ch2 | Chapter 2 | The Athletic Paradox | Number |
| 3 | ch3 | Chapter 3 | The Day I Learned to Breathe | Number |
| 4 | ch4 | Chapter 4 | The 5-Hour Sleep Delusion | Number |
| 5 | ch5 | Chapter 5 | The Dehydration Decades | Number |
| 6 | ch6 | Chapter 6 | Eating Everything, Absorbing Nothing | Number |
| 7 | ch7 | Chapter 7 | Movement Without Recovery | Number |
| 8 | ch8 | Chapter 8 | The Indoor Prison | Number |
| 9 | ch9 | Chapter 9 | The Anxious Achiever's Trap | Number |
| 10 | ch10 | Chapter 10 | Your 30-Day Foundation | Number |
| 11 | ch11 | Chapter 11 | The Tracking That Actually Works | Number |
| 12 | conclusion | Conclusion | The Life You're Actually Chasing | Trophy icon |

## How to Edit Chapter Content

1. Find `BOOK_CHAPTERS` in `constants.js`
2. Find the chapter by its `id`
3. Edit the `sections` array — each section has a `heading` and `content`
4. Use `\n\n` for paragraph breaks within `content`
5. Use `\u2022` for bullet points, `\u2014` for em dashes

## How to Add a New Chapter

1. Add a new object to the `BOOK_CHAPTERS` array at the desired position
2. Give it a unique `id` (e.g. `"ch12"`, `"appendix"`, `"bonus"`)
3. Set `title`, `subtitle`, `icon`, `readTime`, and `sections`
4. No other file changes needed — BookScreen and ChapterView render from this array dynamically

### Special IDs

In `BookScreen.js`, two IDs get special treatment for the number badge:
- `"intro"` → shows a book icon instead of a number
- `"conclusion"` → shows a trophy icon instead of a number

All other IDs show their array index as the number. If you add a chapter between existing ones, the numbers auto-adjust.

If adding an appendix/bonus after conclusion, either:
- Give it a normal ID (it will show its index number), or
- Add another special case in `BookScreen.js` at the icon rendering block (search for `chapter.id === "conclusion"`)

## How Chapter Progress Works

- `readChapters` is a `{ [chapterId]: boolean }` object stored in AsyncStorage
- Only IDs matching current `BOOK_CHAPTERS` entries will show as read in the UI
- Changing chapter IDs resets read progress for those chapters (old IDs become orphaned in storage — harmless)
- Progress bar: `chaptersRead / BOOK_CHAPTERS.length * 100`

## "Next Chapter" Teasers

Each chapter's last section ends with a teaser line like:
> "Next, I'll show you how..."

These are part of the `content` string in the final section. If reordering chapters, update these teasers to match the new order.

## Files Involved

| File | Role |
|------|------|
| `constants.js` | `BOOK_CHAPTERS` array — all content lives here |
| `components/BookScreen.js` | Chapter list, progress bar, special icon logic for intro/conclusion |
| `components/ChapterView.js` | Renders chapter content, navigation between chapters, mark-as-read |
| `App.js` | `handleSelectChapter`, `handleMarkChapterRead`, `selectedChapterId` state |
| `lib/storage.js` | Persists `readChapters` to AsyncStorage |
| `lib/sync.js` | Syncs book progress to Firestore (fire-and-forget) |
