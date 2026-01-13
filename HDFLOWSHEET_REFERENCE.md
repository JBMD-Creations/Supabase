# HDFlowsheet Reference - DO NOT DELETE THESE FEATURES

This document serves as a reference to ensure critical features from the original HDFlowsheet
(https://github.com/JBMD-Creations/HDFlowsheet) are preserved and not accidentally removed.

## Critical Components - NEVER DELETE

### 1. Operations Page Tabs (3 tabs required)
Location: `src/components/operations/OperationsPage.jsx`

| Tab | Icon | Component |
|-----|------|-----------|
| Checklists | 📋 | ChecklistsManager |
| Labs | 🧪 | LabsTracker |
| **Snippets** | ✂️ | SnippetsManager |

### 2. Snippet Sections (9 sections, 52+ snippets)
Location: `src/contexts/SnippetContext.jsx`

| Section | Icon | Snippet Count |
|---------|------|---------------|
| Weight & UF Management | ⚖️ | 1 |
| Pre Dialysis | 🏥 | 5 |
| Treatment Initiated | 💉 | 4 |
| During Treatment | ⏱️ | 2 |
| Hypertension Management | 🔴 | 7 |
| Hypotension Management | 🔵 | 12 |
| No Changes / Stable | ✅ | 8 |
| Access & Lines | 🩸 | 6 |
| Fluid Management | 💧 | 7 |

### 3. Pinned Quick Access Snippet
Location: `src/components/charting/SnippetsSidePanel.jsx`

**ALWAYS KEEP:** "Access visible and secure. Care ongoing."
- Must be styled with green gradient
- Must appear at top of snippet builder
- Must be selectable/toggleable

### 4. Snippet Builder Features
Location: `src/components/charting/SnippetsSidePanel.jsx`

Required features:
- Generated Note display (sticky at top)
- Copy to Clipboard button
- Clear button
- Weight & UF Calculator (in Weight section)
  - Pre Weight input
  - Dry Weight input
  - Auto-calculated: Pre Over DW, UF Goal, Target Weight
- BFR Slider (200-500, in Treatment section)
- UF Goal Slider (0-6 kg, in Treatment section)
- Collapsible/expandable sections

### 5. Snippet Manager Features
Location: `src/components/operations/SnippetsManager.jsx`

Required features:
- Display all snippets by section
- Click to copy functionality
- Add new snippet to any section
- Delete snippet (with confirmation)
- Tag display on each snippet

## Snippet Text Reference (All 52 snippets)

### Weight & UF Management
1. Pt denies any pains / SOB. No other voiced concerns.

### Pre Dialysis
1. Weight and goal reviewed and verified with pt.
2. Pt denies any pains / SOB. No other voiced concerns.
3. 5 mg Midodrine given for BP support.
4. T to 36.5 for BP support.
5. T to 36.0 for BP support.

### Treatment Initiated
1. Treatment initiated per orders. BFR [BFR], UF goal [UF Goal].
2. Pt tolerated treatment initiation without complaint.
3. Access cannulated without difficulty.
4. Good arterial/venous flow noted.

### During Treatment
1. Pt experiencing cramping.
2. UF to minimum.

### Hypertension Management
1. Pt BP elevated.
2. Pt denies any chest pain, SOB, dizziness or headache.
3. Pt reports taking his BP meds before tx.
4. 0.1 mg clonidine given for BP support.
5. BP stabilized after intervention.
6. Will continue to monitor BP closely.
7. T to 37 for BP support.

### Hypotension Management
1. Pt experiencing hypotension during treatment.
2. Pt BP low side.
3. Pt experienced > 20 pt SBP drop.
4. Pt experiencing side effects d/t hypotension - dizzy / light headedness.
5. Pt denies any s/s of hypotension such as light headedness, chest pain or SOB.
6. 5 mg Midodrine given for BP support.
7. 100mL NS bolus given for BP support.
8. BP stabilized, treatment continued.
9. UF to min for BP support.
10. T to 36.5 for BP support.
11. T already at 36.0.
12. MAP remains > 70.

### No Changes / Stable
1. Pt stable throughout treatment.
2. No complaints voiced.
3. Tolerating treatment well without intervention.
4. VS within normal limits.
5. No changes / Stable.
6. Pt resting comfortably in chair watching TV.
7. Pt resting comfortably in chair playing with phone.
8. Pt sleeping comfortably with head back and legs elevated. Chest rising and falling appropriately. No signs of distress.

### Access & Lines
1. Fistula assessment: good thrill and bruit noted.
2. Graft assessment: patent, no signs of infection.
3. Catheter site clean, dry, intact.
4. Dressing changed per protocol.
5. No signs of bleeding or hematoma at access site.
6. Good hemostasis achieved post-treatment.

### Fluid Management
1. IDWG within acceptable range.
2. Significant IDWG noted, fluid restriction education reinforced.
3. UF goal met without difficulty.
4. Pt reports improved adherence to fluid restriction.
5. Dietitian consult recommended for fluid management.
6. Signs/symptoms of fluid overload: SOB, edema, JVD.
7. Post-treatment weight at/near dry weight.

## Reference Source
Original HDFlowsheet: https://github.com/JBMD-Creations/HDFlowsheet/blob/main/index.html

When in doubt, ALWAYS refer to the original HDFlowsheet repository for the correct structure.
