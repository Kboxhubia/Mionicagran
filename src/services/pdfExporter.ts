import jsPDF from 'jspdf';
import { SLIDES_DATA } from '../data/slidesData';

export interface PdfExportOptions {
  currentSlideIndex?: number;
  simulationParams?: {
    monthlySpend: number;
    capex: number;
    breakEvenMonths: number;
    year1Savings: number;
    threeYearSavings: number;
  };
  monthlySpend?: number;
  capex?: number;
  breakEvenMonths?: number;
  year1Savings?: number;
  threeYearSavings?: number;
}

export async function exportExecutivePdfReport(params?: PdfExportOptions) {
  const sim = params?.simulationParams || (params?.monthlySpend !== undefined ? {
    monthlySpend: params.monthlySpend,
    capex: params.capex || 48000,
    breakEvenMonths: params.breakEvenMonths || 3.4,
    year1Savings: params.year1Savings || 118000,
    threeYearSavings: params.threeYearSavings || 412000
  } : undefined);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const darkNavy = [10, 10, 11] as const;
  const cyan = [0, 229, 255] as const;
  const amber = [245, 158, 11] as const;
  const emerald = [16, 185, 129] as const;
  const textWhite = [255, 255, 255] as const;
  const textMuted = [161, 161, 170] as const;
  const cardBg = [22, 22, 24] as const;
  const borderCol = [39, 39, 42] as const;

  // Helper for background
  const drawPageBackground = (pageNum: number, totalPages: number) => {
    doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header top accent line
    doc.setDrawColor(amber[0], amber[1], amber[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, 18, pageWidth - margin, 18);

    // Footer rule
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('EXECUTIVE BRIEFING • AI INFRASTRUCTURE FINANCIAL STRATEGY (CAPEX vs OPEX)', margin, pageHeight - 7);
    doc.text(`Ing. Jorge Huerta • Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // ---------------- PAGE 1: EXECUTIVE BRIEFING COVER & CORE FINANCIAL FINDINGS ----------------
  drawPageBackground(1, 3);

  // Top Header Tag
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('EXECUTIVE C-LEVEL DOSSIER | AUGUST 2026', margin, 14);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('TELECOM & ENTERPRISE INFRASTRUCTURE', pageWidth - margin, 14, { align: 'right' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('The $180,000 USD Error: Why Your AI Strategy', margin, 26);
  doc.text('is Burning Capital on Cloud APIs', margin, 34);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('A Strategic Financial Architecture Analysis for CEOs, CFOs, and CTOs', margin, 41);

  // Author Card
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, 46, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, 46, contentWidth, 20, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('Prepared by: Ing. Jorge Huerta', margin + 5, 53);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Telecom Executive | AI Infrastructure & Financial Modeling Specialist (15+ Years Experience)', margin + 5, 59);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('Web Portal: https://kboxhubia-github-io.vercel.app/ | Email: kuboxhubia@gmail.com', margin + 5, 63);

  // Key Metric Callouts (3 boxes)
  const boxWidth = (contentWidth - 8) / 3;
  const boxY = 70;
  const boxH = 24;

  // Box 1: Annual Cloud Drain
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, boxY, boxWidth, boxH, 2, 2, 'F');
  doc.setDrawColor(244, 63, 94);
  doc.roundedRect(margin, boxY, boxWidth, boxH, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(244, 63, 94);
  doc.text('ANNUAL CLOUD DRAIN', margin + 4, boxY + 6);
  doc.setFontSize(13);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('>$180,000 / yr', margin + 4, boxY + 14);
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Pure recurring OPEX with $0 asset equity', margin + 4, boxY + 20);

  // Box 2: On-Prem Investment
  const box2X = margin + boxWidth + 4;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(box2X, boxY, boxWidth, boxH, 2, 2, 'F');
  doc.setDrawColor(cyan[0], cyan[1], cyan[2]);
  doc.roundedRect(box2X, boxY, boxWidth, boxH, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('4x L40S GPU ON-PREM', box2X + 4, boxY + 6);
  doc.setFontSize(13);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('$48,000 CAPEX', box2X + 4, boxY + 14);
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('192GB VRAM sovereign compute asset', box2X + 4, boxY + 20);

  // Box 3: Break-Even Horizon
  const box3X = margin + (boxWidth + 4) * 2;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(box3X, boxY, boxWidth, boxH, 2, 2, 'F');
  doc.setDrawColor(emerald[0], emerald[1], emerald[2]);
  doc.roundedRect(box3X, boxY, boxWidth, boxH, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text('BREAK-EVEN MILESTONE', box3X + 4, boxY + 6);
  doc.setFontSize(13);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  const breakEvenText = sim ? `${sim.breakEvenMonths.toFixed(1)} Months` : '3.4 Months';
  doc.text(breakEvenText, box3X + 4, boxY + 14);
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('100% Capital payback threshold', box3X + 4, boxY + 20);

  // Section 1: Strategic Financial Findings
  let curY = 100;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('1. EXECUTIVE SUMMARY & FINANCIAL ARBITRAGE', margin, curY);

  curY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  
  const summaryParagraphs = [
    'Enterprise artificial intelligence adoption across Telecom, ISP networks, and critical systems has exposed a major structural financial inefficiency: the unconstrained reliance on third-party cloud LLM APIs. When continuous token throughput scales linearly, monthly API fees compound uncontrollably without leaving residual balance sheet equity.',
    'By shifting 90% of base inference workloads to a dedicated on-premise 4x NVIDIA L40S high-density hardware cluster ($48,000 CAPEX), enterprises achieve capital break-even within 3.4 to 4 months. Over a standard 3-year depreciation window, this architecture yields over $412,000 in retained capital while slashing latency below 50ms and ensuring 100% data sovereignty.'
  ];

  summaryParagraphs.forEach(p => {
    const lines = doc.splitTextToSize(p, contentWidth);
    doc.text(lines, margin, curY);
    curY += lines.length * 4 + 2;
  });

  // Table: Financial Decision Matrix
  curY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('2. DECISION MATRIX: CLOUD API (OPEX) VS ON-PREMISE (CAPEX + OPEX)', margin, curY);

  curY += 4;
  const headers = ['Financial Metric', 'Cloud API (Pure OPEX)', 'On-Premise Cluster', 'Strategic Impact'];
  const colWidths = [42, 42, 42, 56];
  const rowHeight = 6.5;

  // Header Row
  doc.setFillColor(26, 26, 28);
  doc.rect(margin, curY, contentWidth, rowHeight, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(amber[0], amber[1], amber[2]);

  let xOffset = margin + 3;
  headers.forEach((h, i) => {
    doc.text(h, xOffset, curY + 4.5);
    xOffset += colWidths[i];
  });

  curY += rowHeight;

  const rows = [
    ['Cost per 1M Tokens', '$5.00 - $15.00', '$0.10 - $0.50', '96-98% Cost reduction'],
    ['Capital Break-Even', 'Never (Infinite Sunk)', '3.4 - 5.5 Months', 'Rapid ROI conversion'],
    ['Deterministic Latency', '350ms - 1,200ms', '< 50ms Local Edge', 'Critical for real-time telecom'],
    ['Data Sovereignty', 'Shared / Third-party', '100% Sovereign On-Prem', 'Zero compliance exposure'],
    ['Balance Sheet Treatment', 'Pure Operational Expense', 'Depreciable Capital Asset', '30-40% Annual tax equity'],
    ['MLOps Scalability', 'Metered Rate Limit', 'Unmetered (vLLM Engine)', '4.2x Continuous throughput']
  ];

  rows.forEach((row, rIdx) => {
    doc.setFillColor(rIdx % 2 === 0 ? 18 : 24, rIdx % 2 === 0 ? 18 : 24, rIdx % 2 === 0 ? 20 : 26);
    doc.rect(margin, curY, contentWidth, rowHeight, 'F');

    doc.setFont('helvetica', rIdx === 0 || rIdx === 1 ? 'bold' : 'normal');
    doc.setFontSize(7.5);

    let colX = margin + 3;
    row.forEach((cell, cIdx) => {
      if (cIdx === 1) doc.setTextColor(248, 113, 113);
      else if (cIdx === 2) doc.setTextColor(emerald[0], emerald[1], emerald[2]);
      else if (cIdx === 3) doc.setTextColor(cyan[0], cyan[1], cyan[2]);
      else doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);

      doc.text(cell, colX, curY + 4.5);
      colX += colWidths[cIdx];
    });

    curY += rowHeight;
  });

  // Dynamic Simulation Callout if available
  curY += 5;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(emerald[0], emerald[1], emerald[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(emerald[0], emerald[1], emerald[2]);
  doc.text('EXECUTIVE 3-YEAR CASH FLOW FORECAST (TCO)', margin + 5, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  const y1 = sim ? `$${sim.year1Savings.toLocaleString()}` : '$118,000+';
  const y3 = sim ? `$${sim.threeYearSavings.toLocaleString()}` : '$412,000+';
  doc.text(`• Year 1 Net Capital Retained: ${y1} (Accounting for hardware CAPEX, power, and maintenance)`, margin + 5, curY + 11);
  doc.text(`• 36-Month Cumulative Savings: ${y3} vs Cloud API baseline`, margin + 5, curY + 15.5);
  doc.text('• Recommended Strategy: Hybrid Architecture (90% On-Prem Base Load + 10% Cloud Burst Elasticity)', margin + 5, curY + 20);

  // ---------------- PAGE 2: COMPLETE PRESENTATION SLIDES SUMMARY ----------------
  doc.addPage();
  drawPageBackground(2, 3);

  // Top Header Tag Page 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('PRESENTATION SLIDES & EXECUTIVE DATA SUMMARY | PAGE 2', margin, 14);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('10-SLIDE STRATEGIC DECK', pageWidth - margin, 14, { align: 'right' });

  let p2Y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('3. STRUCTURED PRESENTATION DECK BREAKDOWN', margin, p2Y);

  p2Y += 5;

  SLIDES_DATA.forEach((slide, idx) => {
    const isCurrent = params?.currentSlideIndex === idx;
    const cardH = 22;

    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(margin, p2Y, contentWidth, cardH, 1.5, 1.5, 'F');
    doc.setDrawColor(isCurrent ? amber[0] : borderCol[0], isCurrent ? amber[1] : borderCol[1], isCurrent ? amber[2] : borderCol[2]);
    doc.setLineWidth(isCurrent ? 0.6 : 0.2);
    doc.roundedRect(margin, p2Y, contentWidth, cardH, 1.5, 1.5, 'S');

    // Slide number and title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(isCurrent ? amber[0] : textWhite[0], isCurrent ? amber[1] : textWhite[1], isCurrent ? amber[2] : textWhite[2]);
    doc.text(`Slide ${slide.id}: ${slide.title}`, margin + 4, p2Y + 5);

    // Badge / Category
    doc.setFontSize(7);
    doc.setTextColor(cyan[0], cyan[1], cyan[2]);
    doc.text(`[${slide.category}] • ${slide.badge}`, pageWidth - margin - 4, p2Y + 5, { align: 'right' });

    // Key takeaway
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const takeawayLines = doc.splitTextToSize(`Takeaway: ${slide.takeaway}`, contentWidth - 8);
    doc.text(takeawayLines.slice(0, 2), margin + 4, p2Y + 10);

    // Metrics Row
    let metX = margin + 4;
    slide.metrics.forEach((m) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      if (m.color === 'rose') doc.setTextColor(248, 113, 113);
      else if (m.color === 'emerald') doc.setTextColor(emerald[0], emerald[1], emerald[2]);
      else if (m.color === 'amber') doc.setTextColor(amber[0], amber[1], amber[2]);
      else doc.setTextColor(cyan[0], cyan[1], cyan[2]);

      doc.text(`${m.label}: ${m.value}`, metX, p2Y + 19);
      metX += 45;
    });

    p2Y += cardH + 2.5;
  });

  // ---------------- PAGE 3: TELECOM USE CASES, MLOPS & CONTACT ----------------
  doc.addPage();
  drawPageBackground(3, 3);

  // Top Header Tag Page 3
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('TELECOM USE CASES & MLOPS ARCHITECTURE | PAGE 3', margin, 14);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('IMPLEMENTATION BLUEPRINT', pageWidth - margin, 14, { align: 'right' });

  // Section 4: Telecom & Fiber Optics Use Cases
  let p3Y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('4. HIGH-IMPACT TELECOM & FIBER OPTICS DEPLOYMENTS', margin, p3Y);

  p3Y += 5;
  const useCases = [
    {
      title: 'A. Predictive Network Maintenance & Signal Optimization',
      desc: 'Real-time telemetry analysis at optical line terminals (OLT) predicts hardware degradation before fiber dropouts occur. Reduced outage downtime by 42% with <10ms local signal adjustment loops.'
    },
    {
      title: 'B. Automated Customer Churn Prediction in ISPs',
      desc: 'Autonomous neural classification models process subscriber traffic variance, support tickets, and speed tier utilization to preemptively trigger retention incentives, delivering +18.5% retention gains.'
    },
    {
      title: 'C. Automated GIS Mapping & Dynamic CAPEX Fiber Rollout',
      desc: 'AI-assisted routing models optimize trenching and aerial fiber paths over 5,400+ route km, accelerating rollout speed by 90% and compressing upfront CAPEX by -22%.'
    },
    {
      title: 'D. Real-Time Billing Fraud & 24/7 LLM Tier-1 Customer Agents',
      desc: 'Instant transaction anomaly detection protects >$1.2M in annual uncollected revenue, while local LLMs achieve 95% first contact resolution with 30% support OPEX savings.'
    }
  ];

  useCases.forEach(uc => {
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(margin, p3Y, contentWidth, 18, 1.5, 1.5, 'F');
    doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
    doc.roundedRect(margin, p3Y, contentWidth, 18, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(amber[0], amber[1], amber[2]);
    doc.text(uc.title, margin + 4, p3Y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const lines = doc.splitTextToSize(uc.desc, contentWidth - 8);
    doc.text(lines, margin + 4, p3Y + 11);

    p3Y += 21;
  });

  // Section 5: MLOps Stack
  p3Y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('5. MLOPS & EFFICIENCY LEVERS: MAXIMIZING HARDWARE ROI', margin, p3Y);

  p3Y += 5;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, p3Y, contentWidth, 30, 1.5, 1.5, 'F');
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, p3Y, contentWidth, 30, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('• vLLM (Virtual Large Language Models): Continuous batching reduces idle time <8% & boosts output 4.2x.', margin + 5, p3Y + 7.5);
  doc.text('• Quantization (INT4 / FP8): Reduces VRAM footprint by 70%, allowing 70B parameter models on a single 4x L40S node.', margin + 5, p3Y + 15);
  doc.text('• Dynamic Model Routing: Triage queries between ultra-fast quantized edge models and deep reasoning clusters.', margin + 5, p3Y + 22.5);

  // Section 6: Author Credentials & Contact
  p3Y += 35;
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, p3Y, contentWidth, 38, 1.5, 1.5, 'F');
  doc.setDrawColor(amber[0], amber[1], amber[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, p3Y, contentWidth, 38, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(amber[0], amber[1], amber[2]);
  doc.text('6. ENGAGEMENT & EXECUTIVE CONSULTATION', margin + 5, p3Y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textWhite[0], textWhite[1], textWhite[2]);
  doc.text('Schedule a 48-Hour Custom Financial Architecture Audit with Ing. Jorge Huerta to analyze your organization\'s', margin + 5, p3Y + 14);
  doc.text('exact token burn rate, GPU rack topology, and tailored CAPEX vs OPEX break-even timeline.', margin + 5, p3Y + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('Direct Email: kuboxhubia@gmail.com', margin + 5, p3Y + 26);
  doc.text('Official Web Portal & Interactive Widgets: https://kboxhubia-github-io.vercel.app/', margin + 5, p3Y + 31);

  // Save / Output PDF
  doc.save('Executive-AI-Financial-Architecture-Analysis-Jorge-Huerta.pdf');
}
