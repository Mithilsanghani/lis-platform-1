# LIS Dashboard v3.0 - Quick Start Guide

## 🚀 Getting Started

### Start the Development Server
```bash
cd c:\Users\sangh\OneDrive\Desktop\lis-platform
npm run dev
```
Then open: **http://localhost:5174**

### Login (Instant Demo Access)
```
Role: Professor
- Click "Professor" button
- Instant access (no authentication)
```

---

## 📖 Feature Walkthrough

### 1️⃣ Dashboard Overview Tab
**What You See:**
- 4 metric cards: Active Courses, Total Lectures, Total Students, Avg Engagement
- Topics Needing Revision with severity badges
- Silent Students Alert
- Recent courses list

**Key Actions:**
- Click "View Student Details" → Opens Silent Students Modal
- Click course card → (Placeholder for course detail view)

---

### 2️⃣ Learning Insights Tab (Analytics)
**Sections in Order:**

#### **A. AI Insights Panel** (Top)
- 3 expandable insight cards showing Problems & Actions
- Click card to expand → See Why + Action Plan
- Buttons: "Send to Students", "Copy", "More Options"
- Summary stats at bottom (High Priority, Students Affected, Topics Covered)

**Example Insights:**
```
🔴 Graphs Concept Breakdown (18 students, HIGH)
   Problem: 18 students critical confusion on Graph Traversal
   Why: Pace 40% faster, only 2 examples vs 5 in previous topics
   Action: Add 3 visual examples + 1 interactive problem + record video

🔴 Dynamic Programming (12 students, HIGH)
   Problem: 12 students partially understanding DP fundamentals
   Why: Abstract without context, jumping to recursion tree
   Action: Use 2 business scenarios (knapsack, DNA), code along

🟡 Trees Mastery (8 students, MEDIUM)
   Problem: AVL rotations confusing 8 students
   Why: Visual diagrams flat, students lack 3D mental model
   Action: Use animation tool, schedule 1:1 sessions
```

#### **B. Confusion Heatmap** (Interactive Grid)
- **Grid**: Topics (rows) × Lectures (columns)
- **Colors**: Green (≥80%), Yellow (60-80%), Orange (40-60%), Red (<40%)
- **Interaction**:
  1. Hover cell → highlight with blue ring
  2. Click cell → Opens modal with feedback breakdown
  
**Modal Contents:**
- Pie chart: Why students confused (feedback reasons)
- Percentage bars: Each reason with student count
- AI Recommendation: Suggested action to improve
- Buttons: "Schedule Revision", "Export Details"

**Example:**
```
Graphs, Lecture 1
Understanding: 25%
Confused students say:
- 65% "Pace too fast" (14 students)
- 23% "Lacks examples" (5 students)
- 12% "Unclear terminology" (3 students)
→ AI Rec: Schedule revision with 3+ examples
```

#### **C. Charts** (Two columns)
- **Left**: Student Understanding Donut (% Fully/Partial/Unclear)
- **Right**: Silent Student Trend (7-day line chart)

#### **D. Topics Heatmap** (Secondary)
- Existing 5×5 grid showing understanding by topic
- (Replaced by Confusion Heatmap in primary position)

#### **E. Feedback Distribution** (Summary)
- Overall stats: 65% Fully, 25% Partial, 10% Need Clarity
- Animated progress bars

---

### 3️⃣ Silent Students Modal
**When Opens:**
- Click "View Student Details" in Overview tab
- Shows 18 students (default Graphs course)

**Interface:**
```
HEADER: Silent Students Alert - 18 students without feedback
TOOLBAR: 
  - [Select Mode] toggle button
  - Filter: [All(18)] [High] [Medium] [Low]
  - Bulk action: [Send SMS (n selected)]
  
STUDENT CARD (expandable):
  ✅ Roll#1847 [HIGH RISK] [Graphs topic]
  "Graphs are going too fast"
  ⏰ 2 hours ago
  [SMS Button] [1:1 Chat]
  [View Full History] ↓
  
  EXPANDED:
  Feedback History:
  • "Graphs too fast" - 2h ago
  • "Need more practice" - 1d ago
  • "Understood trees" - 3d ago
  
  Recommended Action:
  Schedule 1:1 focused on fundamentals, send video link
```

**Actions:**
- Click SMS button → Sends nudge message (shows "Sent" confirmation)
- Click "1:1 Chat" → (Placeholder for chat interface)
- Toggle "Select Mode" → Checkboxes appear
- Select students → [Send SMS (n)] button activates
- Use filter buttons to show only High/Medium/Low risk

---

## 🎯 Key Scenarios

### Scenario 1: "18 Students Confused on Graphs"
1. Open Learning Insights tab
2. Look at AI Insights Panel → See "Graphs Concept Breakdown" card
3. Click to expand → See action: "Add 3 examples + video"
4. Click "Send to Students" → Share with whole class
5. Go to Confusion Heatmap → Click Graphs cell
6. See pie chart: 65% say "pace too fast"
7. Click "Schedule Revision" → (Ready for calendar integration)

### Scenario 2: "Nudge Silent Students"
1. Overview tab → "View Student Details" button
2. SilentStudentsModal opens
3. Click Filter: [High] → Shows 11 high-risk students
4. Click [SMS] for individual student → Sends nudge
5. Or toggle [Select Mode] → Select 11 students → [Send SMS (11)]

### Scenario 3: "Generate Real AI Insights"
1. Learning Insights tab → Click "Regenerate" button
2. (Currently shows mock, will call OpenAI in Phase 2)
3. Insights update with fresh analysis from student feedback

---

## 🎨 UI Elements & How They Work

### Priority Badges
```
🔴 HIGH RISK     - Red background, pulsing dot
🟡 MEDIUM RISK   - Yellow background
🟢 LOW RISK      - Green background
```

### Expandable Cards
```
Click to expand ↓
┌─────────────────────────┐
│ Title [Collapsed View]  │  ← Shows main info only
└─────────────────────────┘
       ↓ [CLICK] ↓
┌─────────────────────────┐
│ Title                   │
│                         │
│ WHY: Long explanation   │  ← Expands to show details
│ ACTION: Specific steps   │
│ [Buttons]               │
└─────────────────────────┘
```

### Filter Buttons
```
[All(18)] [High] [Medium] [Low]
  ↑        ↑      ↑       ↑
  Active   Show   Show    Show
  shows    11     5       2
  all      only   only    only
```

### Select Mode
```
Toggle ON: Checkboxes appear next to each student
  ✓ #1847 - Graphs
  ✓ #2043 - Graphs
  ✓ #1923 - Graphs
  
  → [Send SMS (3)] button activates at bottom
  
Toggle OFF: Checkboxes hidden, show action buttons again
```

---

## 💡 Tips & Tricks

### Tip 1: Heatmap Deep Dive
- Red cells (low understanding) have the most actionable feedback
- Always click red cells first to understand root causes
- Green cells show topics that need maintenance practice

### Tip 2: AI Insights Workflow
1. Read Problem line (1 sentence summary)
2. Expand card to understand Why (root cause)
3. Use Action plan (specific, concrete steps)
4. Send to students in one click

### Tip 3: Silent Students Bulk Actions
- High risk only: Filter [High] → Select all → [Send SMS (11)]
- Saves time vs. clicking SMS button 11 times
- Perfect for scheduling office hours

### Tip 4: Export for Records
- Click "Export Details" on heatmap modal
- Saves CSV of feedback breakdown
- Great for documentation/reports

---

## 🔌 What's Coming in Phase 2

### Soon:
- [ ] Real OpenAI API calls (replace mock insights)
- [ ] Live Supabase data (replace mock courses)
- [ ] Actual SMS sending (Twilio integration)
- [ ] Predictive alerts ("Risk: DP confusion +20% trend")

### Later:
- [ ] PDF export for revision plans
- [ ] Radar chart (engagement multi-axis)
- [ ] Cohort comparison (Section A vs B)
- [ ] Student chat interface (1:1)
- [ ] PWA offline support

---

## 🐛 Known Limitations (To Fix)

1. **Data is Mock**: All numbers are hardcoded
   - Fix in Phase 2: Connect to Supabase
   
2. **SMS not sent**: Buttons show "Sent" but don't actually send
   - Fix in Phase 2: Integrate Twilio API
   
3. **No chat history**: "1:1 Chat" button is placeholder
   - Fix in Phase 3: Implement Supabase chat
   
4. **Regenerate doesn't work**: AI Insights stay static
   - Fix in Phase 2: Call OpenAI API

5. **Export doesn't download**: "Export Details" is placeholder
   - Fix in Phase 2: html2canvas + jsPDF

---

## 📞 Support

### If something breaks:
1. Check browser console (F12 → Console tab)
2. Look for red error messages
3. Restart dev server: `npm run dev`
4. Clear browser cache: Ctrl+Shift+Delete

### If you need to modify:
- Component styles: Look for Tailwind classes (text-red-400, bg-slate-800, etc.)
- Colors: Use palette in V3_IMPLEMENTATION.md
- Animations: Framer Motion syntax (initial, animate, exit)
- Data: Replace mock arrays with Supabase queries

---

## 📊 Mock Data Reference

### Test Case: "18 Silent on Graphs"
- Course: Advanced Data Structures (CS201)
- Silent Students: 18 total
- Primary Topic: Graph Traversal
- Risk Level: High
- Feedback Sample: "Pace too fast", "Lacks examples", "Complex algorithms"

### To test in code:
```typescript
// ProfessorDashboard.tsx
const courses = [
  {
    name: 'Advanced Data Structures',
    silentStudents: 18,           // ← This number
    strugglingTopics: [
      { name: 'Graph Traversal', severity: 'high', affectedStudents: 18 },
    ]
  }
];
```

---

## ✅ Pre-Demo Checklist

- [ ] Server running on localhost:5174
- [ ] Can login as Professor
- [ ] Overview tab shows 4 metric cards
- [ ] Click "View Student Details" → Modal opens
- [ ] Learning Insights tab shows 3 AI cards
- [ ] Click insight card → Expands to show Why/Action
- [ ] Click Confusion Heatmap cell (any color) → Modal opens with pie chart
- [ ] Silent Students modal filters work (click High/Medium/Low)
- [ ] Click SMS button → Shows "Sent" message
- [ ] No error messages in browser console
- [ ] Responsive: Test on mobile (Ctrl+Shift+M) → Works on small screens
