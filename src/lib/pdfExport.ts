import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AIInsights } from './aiAnalysis';

export const generatePDF = async (insights: AIInsights, courseName: string, professorName: string = 'Professor') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper function to add text and handle page breaks
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, maxWidth: number = pageWidth - 20) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.35;
    const textHeight = lines.length * lineHeight;

    if (yPos + textHeight > pageHeight - 10) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(lines, 10, yPos);
    yPos += textHeight + 5;
  };

  // Cover Page
  doc.setFillColor(30, 58, 138); // IIT Blue
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Lecture Intelligence System', 10, 30);
  doc.setFontSize(16);
  doc.text('AI-Powered Teaching Analytics', 10, 45);

  yPos = 75;
  doc.setTextColor(0, 0, 0);
  addText(`Course: ${courseName}`, 18, true);
  addText(`Analyzed by: ${professorName}`, 12);
  addText(`Date: ${new Date(insights.timestamp).toLocaleDateString()}`, 12);
  addText(`Time: ${new Date(insights.timestamp).toLocaleTimeString()}`, 12);

  // Course Overview Section
  yPos += 10;
  addText('📊 COURSE OVERVIEW', 16, true);
  addText(`Total Lectures: ${insights.course_overview.total_lectures}`, 11);
  addText(`Total Feedback Received: ${insights.course_overview.total_feedback}`, 11);
  addText(`Average Clarity Score: ${insights.course_overview.avg_clarity_score}%`, 11);
  addText(`Improvement Trend: ${insights.course_overview.improvement_trend}`, 11);

  // Top Confusing Topics
  yPos += 10;
  if (insights.top_confusing_topics.length > 0) {
    addText('🔴 TOP CONFUSING TOPICS', 16, true);
    
    insights.top_confusing_topics.forEach((topic, idx) => {
      addText(
        `${idx + 1}. ${topic.topic} (${topic.confusion}% confusion) - Priority: ${topic.priority}`,
        11
      );
    });
  }

  // Revision Plan
  yPos += 10;
  if (insights.revision_plan.length > 0) {
    addText('📋 RECOMMENDED REVISION PLAN', 16, true);
    
    insights.revision_plan.forEach((plan, idx) => {
      addText(`${idx + 1}. ${plan.action}`, 11, true);
      addText(`   Duration: ${plan.duration}`, 10);
      addText(`   When: ${plan.when}`, 10);
      if (plan.method) {
        addText(`   Method: ${plan.method}`, 10);
      }
    });
  }

  // Teaching Insights
  yPos += 10;
  if (insights.teaching_insights.length > 0) {
    addText('💡 TEACHING INSIGHTS', 16, true);
    
    insights.teaching_insights.forEach((insight) => {
      addText(`• ${insight}`, 11);
    });
  }

  // Sentiment Breakdown
  yPos += 10;
  addText('📈 STUDENT FEEDBACK BREAKDOWN', 16, true);
  const total = insights.sentiment_breakdown.positive + insights.sentiment_breakdown.neutral + insights.sentiment_breakdown.negative;
  if (total > 0) {
    const posPercent = Math.round((insights.sentiment_breakdown.positive / total) * 100);
    const neuPercent = Math.round((insights.sentiment_breakdown.neutral / total) * 100);
    const negPercent = Math.round((insights.sentiment_breakdown.negative / total) * 100);

    addText(`✅ Fully Understood: ${insights.sentiment_breakdown.positive} (${posPercent}%)`, 11);
    addText(`⚠️  Partially Understood: ${insights.sentiment_breakdown.neutral} (${neuPercent}%)`, 11);
    addText(`❌ Need Clarity: ${insights.sentiment_breakdown.negative} (${negPercent}%)`, 11);
  }

  // Silent Students
  if (insights.silent_students.length > 0) {
    yPos += 10;
    addText('🤐 STUDENTS NEEDING ATTENTION', 16, true);
    
    insights.silent_students.forEach((student) => {
      addText(
        `${student.name} (${student.email}) - ${student.feedback_count} feedback submissions`,
        11
      );
    });
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `LIS v2.0 | IIT Gandhinagar | Generated ${new Date().toLocaleString()}`,
    10,
    pageHeight - 10
  );

  return doc;
};

export const downloadPDF = async (insights: AIInsights, courseName: string, professorName: string = 'Professor') => {
  try {
    const doc = await generatePDF(insights, courseName, professorName);
    const filename = `LIS-Insights-${courseName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    return filename;
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
};

export const generatePDFFromHTML = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    doc.save(filename);

    return filename;
  } catch (error) {
    console.error('HTML to PDF error:', error);
    throw error;
  }
};
