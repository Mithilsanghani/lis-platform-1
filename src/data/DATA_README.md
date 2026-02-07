# LIS Platform - Mock Data Documentation

## Overview
This directory contains comprehensive dummy data for both teachers (professors) and students with equal depth and quality.

## Data Files

### 1. `mockData.ts` - Original Mock Data
Basic mock data including:
- 3 Professors
- 15 Students
- 4 Courses
- 7 Lectures
- Feedback entries
- Student metrics
- Topic performance
- AI insights

### 2. `mockDataV2.ts` - Version 2 Mock Data
Enhanced mock data with:
- 2 Professors
- 8 Students
- 3 Courses
- Multiple lectures per course
- Comprehensive feedback entries
- Lecture insights
- Course insights

### 3. `enhancedMockData.ts` - **NEW: Comprehensive Enhanced Data**
The most complete dataset with equal representation for both teachers and students:

#### Professor Data (8 Professors)
- **Basic Info**: Name, email, department, avatar
- **Teaching Profiles**: 
  - Specialization areas
  - Teaching style (interactive/lecture-heavy/project-based/balanced)
  - Years of experience
  - Student ratings
  - Research interests
  - Office hours
  - Preferred communication channels

- **Dashboard Metrics** (for each professor):
  - Total students taught
  - Active courses
  - Lecture counts
  - Feedback statistics
  - Engagement percentages
  - Silent students tracking
  - Course health metrics
  - Weekly trends
  - Top/struggling courses

#### Student Data (25 Students)
- **Basic Info**: Name, email, department, roll number, avatar
- **Learning Profiles**:
  - Year of study
  - CGPA
  - Learning style (visual/auditory/kinesthetic/reading-writing)
  - Study hours per week
  - Participation level
  - Attendance rate
  - Preferred learning time
  - Strengths and weaknesses
  - Career interests
  - Extracurricular activities

- **Dashboard Metrics** (for each student):
  - Enrolled courses
  - Lectures attended
  - Feedback submitted/pending
  - Understanding percentages
  - Engagement streaks
  - Comment counts
  - Weak/strong topics
  - Course risk levels
  - Weekly trends
  - Peer comparisons
  - AI tips

#### Course Data (9 Courses)
Courses across multiple departments:
- Computer Science (Data Structures, Algorithms, ML, Databases)
- Artificial Intelligence (Deep Learning)
- Data Science (Data Mining)
- Software Engineering
- Mathematics (Linear Algebra)
- Computer Networks

## Data Characteristics

### Equality & Similarity
Both professor and student data includes:
1. ✅ **Profile Information** - Detailed personal and professional/academic profiles
2. ✅ **Performance Metrics** - Comprehensive tracking of activities and outcomes
3. ✅ **Behavioral Data** - Learning/teaching styles, preferences, patterns
4. ✅ **Dashboard Views** - Complete dashboard data for their respective portals
5. ✅ **Trend Analysis** - Weekly trends and historical data
6. ✅ **AI Insights** - Personalized tips and recommendations
7. ✅ **Comparative Metrics** - Benchmarking against peers/standards

### Diversity in Data
- **Professors**: Various experience levels (5-15 years), teaching styles, departments, and ratings
- **Students**: Different academic performance (CGPA 6.8-9.2), learning styles, participation levels, and career interests
- **Realistic Patterns**: Some professors have multiple courses, students with different engagement levels, varying course health

### Sample Profiles

#### Example Professor (Prof. Rajesh Kumar)
```typescript
{
  name: "Dr. Rajesh Kumar",
  specialization: ["Data Structures", "Algorithms", "Competitive Programming"],
  teaching_style: "interactive",
  experience: 8 years,
  rating: 4.6/5,
  students: 15,
  courses: 1,
  avg_engagement: 78%
}
```

#### Example Student (Rahul Sharma)
```typescript
{
  name: "Rahul Sharma",
  year: 3,
  cgpa: 8.5,
  learning_style: "visual",
  study_hours: 35/week,
  participation: "high",
  attendance: 95%,
  understanding_avg: 85%,
  streak: 15 days
}
```

## Usage

### Import Enhanced Data
```typescript
import { enhancedMockData } from './data/enhancedMockData';

// Access professor data
const professors = enhancedMockData.professors;
const professorProfiles = enhancedMockData.professorProfiles;
const professorDashboards = enhancedMockData.professorDashboards;

// Access student data
const students = enhancedMockData.students;
const studentProfiles = enhancedMockData.studentProfiles;
const studentDashboards = enhancedMockData.studentDashboards;

// Access courses
const courses = enhancedMockData.courses;
```

### Query Examples

#### Get Professor with Full Profile
```typescript
const profId = 'prof-1';
const professor = enhancedMockData.professors.find(p => p.id === profId);
const profile = enhancedMockData.professorProfiles.find(p => p.professor_id === profId);
const dashboard = enhancedMockData.professorDashboards.find(p => p.professor_id === profId);
```

#### Get Student with Full Profile
```typescript
const stuId = 'stu-1';
const student = enhancedMockData.students.find(s => s.id === stuId);
const profile = enhancedMockData.studentProfiles.find(s => s.student_id === stuId);
const dashboard = enhancedMockData.studentDashboards.find(s => s.student_id === stuId);
```

## Data Statistics

### Professors (8 total)
- Departments: CS (4), Math (1), Data Science (1), AI (1), SE (1), Networks (1)
- Avg Experience: 9 years
- Avg Rating: 4.7/5
- Teaching Styles: Interactive (3), Balanced (3), Project-based (2), Lecture-heavy (1)

### Students (25 total)
- Departments: CS (15), Data Science (5), Math (5)
- CGPA Range: 6.8 - 9.2
- Avg CGPA: 8.2
- Learning Styles: Visual (11), Reading-Writing (7), Auditory (4), Kinesthetic (3)
- Attendance Range: 82% - 99%
- Avg Attendance: 92%

### Courses (9 total)
- CS Courses: 5
- Other Courses: 4
- Avg Students per Course: 12
- Health Range: 68% - 90%
- Avg Course Health: 80%

## Features for Development

### Testing Scenarios
1. **High Performer**: Student stu-5 (CGPA 9.1, 98th percentile)
2. **At-Risk Student**: Student stu-7 (CGPA 6.8, 45th percentile)
3. **Engaged Professor**: Prof-7 (90% course health, 98% response rate)
4. **Struggling Course**: course-4 (68% health, 5 silent students)
5. **Silent Students**: Multiple students with low participation

### Dashboard Views
- Complete data for rendering both professor and student dashboards
- Weekly trend data for charts
- Comparative metrics for peer analysis
- AI insights and recommendations

### Analytics & Insights
- Course health tracking
- Student risk levels
- Topic performance
- Engagement patterns
- Feedback analysis

## Notes
- All dates are realistic (Spring 2026 semester)
- Avatar URLs use placeholder service
- Email addresses follow institutional pattern
- Data is internally consistent (enrolled students match course counts)
- Realistic variation in performance and engagement

## Future Enhancements
- Add lecture-specific data with enhanced mock
- Include assignment and exam data
- Add peer interaction data
- Include historical semester data
- Add department-level analytics
