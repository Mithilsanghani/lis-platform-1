# Test Scenarios & Expected Behavior

## 🎬 Primary Demo Scenario: "18 Silent Students on Graphs"

### Prerequisite Setup
```
Course: Advanced Data Structures (CS201)
Students: 45 total
Silent Students: 18 (all struggling with Graph Traversal)
Affected Lectures: L1, L2 (Graph content)
```

### Test Flow A: AI Insights → Action

**Step 1: View AI Insights**
1. Login as Professor
2. Click "Learning Insights" tab
3. See panel titled "AI Intelligence Panel"
4. Observe first card: "Graphs Concept Breakdown"

**Expected Output:**
```
┌─────────────────────────────────────────┐
│ 🔴 Graphs Concept Breakdown              │
│    [HIGH RISK] [Graphs] Metric          │
│                                          │
│ 18 students showing critical confusion   │
│ on Graph Traversal                       │
│ ⏰ 2 hours ago                           │
│                                          │
│ [Send to Students] [Copy] [⋯]           │
└─────────────────────────────────────────┘
```

**Step 2: Expand Insight**
1. Click the insight card
2. Card expands with 300ms animation

**Expected Output:**
```
┌─────────────────────────────────────────┐
│ 🔴 Graphs Concept Breakdown              │
│                                          │
│ WHY:                                     │
│ Pace increased 40% while providing      │
│ only 2 examples vs 5 in previous        │
│ topics. Students lack mental model.      │
│                                          │
│ ACTION PLAN:                             │
│ Add 3 visual examples (BFS/DFS/         │
│ Dijkstra walkthrough) + 1 interactive   │
│ problem in next class. Record video      │
│ for async learners.                     │
│                                          │
│ [Send to Students] [Copy] [⋯]           │
└─────────────────────────────────────────┘
```

**Step 3: Send to Students**
1. Click "Send to Students" button
2. Button shows success state (currently mock)

**Expected Behavior:**
- Button animates (scale 1.05)
- Temporarily shows "✓ Sent"
- In Phase 2: Would trigger webhook to email students

---

### Test Flow B: Heatmap → Feedback Breakdown

**Step 1: View Confusion Heatmap**
1. Scroll down past AI Insights Panel
2. See grid labeled "Concept Understanding Heatmap"
3. Observe 5 rows (Graphs, Trees, Sorting, DP, etc.) × 6 columns (L1-L6)

**Expected Grid State:**
```
          L1    L2    L3    L4    L5    L6
Graphs   [25%] [30%] [45%] [55%] [65%] [72%]
Trees    [45%] [35%] [55%] [65%] [75%] [80%]
Sorting  [75%] [80%] [85%] [82%] [80%] [78%]
DP       [55%] [60%] [62%] [58%] [70%] [72%]

Color Key:
🔴 Red   = 25%, 30%, 35% (Critical)
🟠 Orange = 45%, 55%, 58%, 60%, 62% (Confused)
🟡 Yellow = 65%, 70%, 72%, 75%, 78%, 80%+ (Partial)
🟢 Green  = 80%, 82%, 85%+ (Clear)
```

**Step 2: Hover Cell (Optional)**
1. Move mouse over Graphs, L1 cell (25%, red)
2. Cell highlights with blue ring

**Expected Behavior:**
- Ring appears around cell
- Cell scales slightly (whileHover={{ scale: 1.15 }})

**Step 3: Click Cell to Drill Down**
1. Click Graphs, L1 cell (25% understanding)
2. Modal opens with 300ms animation

**Expected Output:**
```
╔════════════════════════════════════════════╗
║ 📉 Graphs - Lecture 1                      ║
║ Current Understanding: 25% (RED)           ║  [X]
╟────────────────────────────────────────────╢
║ WHY STUDENTS ARE CONFUSED                  ║
║                                            ║
║ [Pie Chart: 14 red, 5 orange, 3 yellow]   ║
║                                            ║
║ Reasons:                                   ║
║ • Pace too fast              65% (14 stu)  ║
│ • Lacks examples             23% (5 stu)   ║
│ • Unclear terminology        12% (3 stu)   ║
║                                            ║
║ 🧠 AI RECOMMENDATION:                      ║
║ Graphs needs immediate revision. Schedule  ║
║ extra session with 3+ worked examples and  ║
║ interactive problems.                      ║
║                                            ║
║ [Schedule Revision] [Export Details]       ║
╚════════════════════════════════════════════╝
```

**Step 4: Schedule Revision**
1. Click "Schedule Revision" button
2. (Placeholder for calendar integration in Phase 2)

**Expected Behavior:**
- Button scales on hover (whileHover={{ scale: 1.05 }})
- In Phase 2: Opens calendar to schedule revision session

---

### Test Flow C: Silent Students → SMS Nudge

**Step 1: Open Silent Students**
1. Go back to Overview tab
2. Scroll to "Silent Students Detected" alert
3. Click "View Student Details" button

**Expected Output:**
```
Modal opens with:
- Header: "Silent Students Alert - 18 students"
- Subtitle: "haven't provided feedback in Data Structures"
- Toolbar: [Select Mode] [All(18)] [High] [Medium] [Low]
- List: 18 student cards below
```

**Step 2: View High Risk Students**
1. Click [High] filter button
2. List filters to show only high-risk students

**Expected Output:**
```
Showing 11 of 18 students (65% of total)

Student Cards (filtered):
✓ #1847 [HIGH RISK] [Graphs] 
  "Graphs are going too fast"
  ⏰ 2 hours ago
  [SMS] [1:1 Chat]

✓ #2043 [HIGH RISK] [Graphs]
  "Lost after DFS section"
  ⏰ 4 hours ago
  [SMS] [1:1 Chat]

... (9 more high-risk students)
```

**Step 3: Send Individual SMS**
1. Click [SMS] button on first student (#1847)
2. Button shows success state

**Expected Behavior:**
- Button changes text to "✓ Sent"
- Color changes to green
- After 2 seconds, reverts to "SMS"
- In Phase 2: Actual SMS sent via Twilio

**Step 4: Bulk SMS**
1. Click [Select Mode] button (top toolbar)
2. Checkboxes appear on each card

**Expected Output:**
```
✓ [✓] #1847 [HIGH RISK]
✓ [✓] #2043 [HIGH RISK]
✓ [_] #1923 [MEDIUM]
... (continue selecting high-risk only)

Bottom right: [Send SMS (11)] button appears
```

3. Click checkboxes for all 11 high-risk students
4. Click [Send SMS (11)] button
5. All 11 students receive nudge

**Expected Behavior:**
- Bulk button activates only when students selected
- In Phase 2: All 11 SMS sent in parallel
- Success notification shows

---

## 🧪 Secondary Test Scenarios

### Scenario 2: Dynamic Programming Struggles
1. AI Insights Panel → Expand 2nd card ("Dynamic Programming")
2. See 12 students affected, medium priority
3. Click "Send to Students" → Success
4. Confusion Heatmap → Click DP rows → See feedback breakdown

**Expected Data:**
```
DP confusion reasons:
- Abstractness high: 75% (18 students)
- Need real problems: 25% (6 students)

Students affected: 12/45 (27% of class)
Trend: Worsening (indicated by ↗️ icon)
```

### Scenario 3: Trees Mastery Track
1. AI Insights Panel → Expand 3rd card ("Trees Mastery")
2. Notice MEDIUM priority (yellow) vs RED
3. Only 8 students affected (vs 12-18 for others)
4. Action focuses on AVL rotations with animation

**Expected Data:**
```
Trees understanding:
- L1: 45% (Partial)
- L2: 35% (Confused - dip!)
- L3+: Improving 55% → 80%

Specific issue: AVL rotations (advanced topic)
Recommendation: Animation tool + 1:1 sessions
```

### Scenario 4: Filter by Risk Level
1. Silent Students Modal → Click [Medium]
2. Shows only 5 medium-risk students

**Expected Data:**
```
Medium Risk Students:
#1923 (Graphs) "Need more examples on BFS" 
#2156 (Trees) "Practice rotations with me"
#2201 (DP) "Understand DP, need speed"
... (2 more)

Action: Schedule group session vs individual SMS
```

---

## 🎯 Expected Visual Indicators

### Color Coding in AI Insights
```
🔴 HIGH (Graphs, DP)      - Red badge, pulsing dot
🟡 MEDIUM (Trees)         - Yellow badge, steady dot
🟢 LOW                    - Green badge

Animation: Pulsing every 2 seconds on high priority
```

### Color Coding in Heatmap
```
0-25%   🔴 Red     (Critical)
25-45%  🟠 Orange  (Confused)
45-70%  🟡 Yellow  (Partial)
70-100% 🟢 Green   (Clear)
```

### Color Coding in Silent Students
```
🔴 HIGH     - Red background, 11 students (65%)
🟡 MEDIUM   - Yellow background, 5 students (28%)
🟢 LOW      - Green background, 2 students (7%)
```

---

## 🔄 Interaction Patterns

### Pattern 1: Expandable Cards
```
Click Card → Height animates from 0 → auto
           Content fades in
           Chevron rotates 0° → 180°
           
Click again → Collapses
            Height animates back to 0
            Content fades out
            Chevron rotates 180° → 0°
```

### Pattern 2: Filter Buttons
```
[All(18)] [High] [Medium] [Low]
   ^                            
Active button = Blue background, white text

Click [High] →
[All(18)]  [High]  [Medium]  [Low]
           ^
           Now active (blue)
           List updates immediately
           Shows: "Showing 11 of 18 students"
```

### Pattern 3: Modal Open/Close
```
Click Button →
  Backdrop: opacity 0 → 1 (100ms)
  Modal: scale 0.95 → 1, y: 20 → 0 (300ms)
  
Click X or backdrop →
  Modal: scale 1 → 0.95, y: 0 → 20 (300ms)
  Backdrop: opacity 1 → 0 (100ms)
  Modal unmounts
```

---

## ✅ Validation Checklist

### Visual Correctness
- [ ] AI Insights shows 3 cards (not more, not less)
- [ ] Cards have Graphs, DP, Trees (in that order)
- [ ] Graphs card is RED (high priority)
- [ ] Heatmap grid shows correct understanding %
- [ ] All red cells (Graphs L1-L2) are correct color
- [ ] Pie chart appears when clicking heatmap cell

### Interaction Correctness
- [ ] Expand insight card → Shows Why + Action
- [ ] Collapse insight card → Back to summary
- [ ] Click heatmap cell → Modal opens (not closed)
- [ ] Filter [High] → Shows 11 students only
- [ ] Filter [Medium] → Shows 5 students only
- [ ] SMS button → Changes to "✓ Sent" for 2 sec
- [ ] Bulk SMS → Works with multiple selections

### Performance
- [ ] Animations smooth (60 FPS, no jank)
- [ ] Modal appears instantly (<300ms)
- [ ] Heatmap cells respond immediately to hover
- [ ] No console errors (F12 → Console)

---

## 📊 Expected Data Values

### Course 1: Advanced Data Structures (CS201)
```
Students: 45
Lectures: 12
Silent Students: 18 (40% of class!)
Avg Engagement: 82%

Struggling Topics:
1. Graph Traversal (18 students, HIGH severity, WORSENING)
2. AVL Trees (12 students, MEDIUM severity, STABLE)

AI Insights Generated: 3
- Graphs (Problem: pace too fast, Action: add examples)
- DP (Problem: too abstract, Action: real-world problems)
- Trees (Problem: rotations hard, Action: animation tool)
```

### Course 2: Algorithms & Complexity (CS202)
```
Students: 52
Lectures: 15
Silent Students: 5 (10% of class)
Avg Engagement: 78%

Struggling Topics:
1. Dynamic Programming (15 students, MEDIUM, IMPROVING)
```

---

## 🚨 Error Scenarios (Should NOT Happen)

### Error 1: Heatmap Cell Missing
```
If clicking a cell shows no modal:
❌ Check: Did you reload page?
❌ Check: Are there console errors?
✅ Fix: Press F12 → Console → Look for red text
```

### Error 2: AI Insights Empty
```
If Learning Insights shows blank:
❌ Check: Did page load completely?
❌ Check: Is server running (localhost:5174)?
✅ Fix: Refresh page (Ctrl+R)
```

### Error 3: Silent Students Modal Doesn't Open
```
If clicking button shows nothing:
❌ Check: Did you click the right button?
❌ Check: Are there console errors?
✅ Fix: Check browser console for errors
```

---

## 📝 Summary

**What to expect when clicking:**
- AI Insight card → Expands with Problem/Why/Action ✅
- Heatmap cell → Opens modal with pie chart ✅
- SMS button → Shows "✓ Sent" for 2 sec ✅
- "View Student Details" → Silent Students modal opens ✅
- Filter [High] → List shows 11 high-risk students ✅

**Animation smoothness:**
- All transitions: 300ms or less ✅
- No stutters or jumps ✅
- Responsive to cursor movement ✅

**Data accuracy:**
- 18 silent students on Graphs (exact number) ✅
- 65% say "pace too fast" (pie chart) ✅
- High priority cards pulse (animation) ✅
- Red cells = low understanding (color correct) ✅
