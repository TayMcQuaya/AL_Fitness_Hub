const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign } = require("docx");

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const pillars = [
  {
    name: "Breathing",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Morning Breath Check", desc: "Take 5 deep belly breaths upon waking" },
      { phase: "2 (Days 6-10)", name: "Stress Reset", desc: "4-7-8 breathing when stressed (inhale 4s, hold 7s, exhale 8s)" },
      { phase: "3 (Days 11-15)", name: "Box Breathing Break", desc: "5-minute box breathing during lunch (4s inhale, 4s hold, 4s exhale, 4s hold)" },
      { phase: "4 (Days 16-20)", name: "Evening Wind-Down", desc: "10 slow breaths before bed, extending exhale" },
    ],
  },
  {
    name: "Sleep",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Consistent Wake Time", desc: "Wake up at the same time every day (within 30 min)" },
      { phase: "2 (Days 6-10)", name: "Screen Curfew", desc: "No screens 30 minutes before bed" },
      { phase: "3 (Days 11-15)", name: "Cool & Dark", desc: "Bedroom temp below 68\u00B0F, blackout conditions" },
      { phase: "4 (Days 16-20)", name: "Wind-Down Ritual", desc: "15-min relaxation routine (reading, stretching, journaling)" },
    ],
  },
  {
    name: "Hydration",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Morning Hydration", desc: "Drink 16oz water within 30 min of waking" },
      { phase: "2 (Days 6-10)", name: "Water Tracking", desc: "Log and drink at least 64oz total daily" },
      { phase: "3 (Days 11-15)", name: "Electrolyte Balance", desc: "Add electrolytes or mineral-rich water once daily" },
      { phase: "4 (Days 16-20)", name: "Pre-Meal Hydration", desc: "Drink 8oz water 15 min before each meal" },
    ],
  },
  {
    name: "Nutrition",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Protein First", desc: "Eat protein within 1 hour of waking" },
      { phase: "2 (Days 6-10)", name: "Eat the Rainbow", desc: "Include 3+ colors of vegetables daily" },
      { phase: "3 (Days 11-15)", name: "Mindful Eating", desc: "No screens during at least one meal, chew thoroughly" },
      { phase: "4 (Days 16-20)", name: "Fiber Focus", desc: "Aim for 25-30g fiber (track one day per week)" },
    ],
  },
  {
    name: "Movement",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Daily Walk", desc: "Walk for at least 10 minutes outdoors (15 min Phase 2, 20 min Phase 3+)" },
      { phase: "2 (Days 6-10)", name: "Movement Snacks", desc: "3 micro-movements throughout the day (squats, stretches, stairs)" },
      { phase: "3 (Days 11-15)", name: "Strength Session", desc: "2x per week bodyweight or resistance training (15+ min)" },
      { phase: "4 (Days 16-20)", name: "Mobility Work", desc: "5-10 min daily stretching or yoga" },
    ],
  },
  {
    name: "Environment",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Morning Light", desc: "Get 10 min of natural sunlight within 1 hour of waking" },
      { phase: "2 (Days 6-10)", name: "Declutter Zone", desc: "Spend 5 min tidying one area in your living space" },
      { phase: "3 (Days 11-15)", name: "Nature Time", desc: "Spend 20+ minutes in nature (park, garden, trail)" },
      { phase: "4 (Days 16-20)", name: "Digital Detox", desc: "1 hour phone-free time in the evening" },
    ],
  },
  {
    name: "Mindfulness",
    tasks: [
      { phase: "1 (Days 1-5)", name: "Gratitude Moment", desc: "Write or think of 3 things you're grateful for" },
      { phase: "2 (Days 6-10)", name: "Mindful Minute", desc: "1-5 minutes of present-moment awareness (Phase 2: 1 min, Phase 3+: 5 min)" },
      { phase: "3 (Days 11-15)", name: "Reflection Check", desc: "End-of-day reflection: What went well? What to improve?" },
      { phase: "4 (Days 16-20)", name: "Intention Setting", desc: "Set one clear intention each morning" },
    ],
  },
];

function makeHeaderRow() {
  return new TableRow({
    tableHeader: true,
    children: ["Phase", "Task Name", "Description"].map((text, i) =>
      new TableCell({
        borders: cellBorders,
        width: { size: i === 2 ? 5200 : i === 1 ? 2200 : 1960, type: WidthType.DXA },
        shading: { fill: "1A1A1A", type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })],
      })
    ),
  });
}

function makeDataRow(task) {
  const vals = [task.phase, task.name, task.desc];
  return new TableRow({
    children: vals.map((text, i) =>
      new TableCell({
        borders: cellBorders,
        width: { size: i === 2 ? 5200 : i === 1 ? 2200 : 1960, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: "Arial" })] })],
      })
    ),
  });
}

const children = [];

children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "21-Day Challenge Tasks", bold: true, size: 36, font: "Arial" })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "Text Review for Coach Al", size: 24, color: "666666", font: "Arial" })] }));
children.push(new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "All task names and descriptions from every pillar. Please review and mark any changes needed. Once approved, I will update the app.", size: 22, font: "Arial" })] }));

for (const pillar of pillars) {
  children.push(new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: `${pillar.name} (4 tasks)`, bold: true, size: 28, font: "Arial" })] }));
  children.push(
    new Table({
      columnWidths: [1960, 2200, 5200],
      rows: [makeHeaderRow(), ...pillar.tasks.map(makeDataRow)],
    })
  );
}

children.push(new Paragraph({ spacing: { before: 500, after: 200 }, children: [new TextRun({ text: "Total: 7 pillars x 4 tasks = 28 tasks", bold: true, size: 22, font: "Arial" })] }));
children.push(new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "Notes:", bold: true, size: 22, font: "Arial" })] }));
children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "\u2022 Each pillar has 4 phases that progressively unlock (1 task \u2192 2 \u2192 3 \u2192 4)", size: 20, font: "Arial" })] }));
children.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "\u2022 Phase 4 tasks carry through Days 16-21 (all 4 active)", size: 20, font: "Arial" })] }));
children.push(new Paragraph({ children: [new TextRun({ text: "\u2022 Please mark any task name or description you'd like changed and I will update the app", size: 20, font: "Arial" })] }));

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
  sections: [{ properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } }, children }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(__dirname + "/../exports/task-text-review.docx", buffer);
  console.log("Created task-text-review.docx");
});
