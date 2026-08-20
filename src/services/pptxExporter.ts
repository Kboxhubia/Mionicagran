import pptxgen from 'pptxgenjs';
import { SLIDES_DATA } from '../data/slidesData';
import { Language } from '../types';
import { getLocalizedSlide } from './i18n';

export async function exportPowerPointPresentation(lang: Language = 'es') {
  const pptx = new pptxgen();

  // Set 16:9 Widescreen Layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Ing. Jorge Huerta';
  pptx.company = 'Kboxhubia AI Financial Systems';
  pptx.title = 'AI Financial Executive Presentation - CAPEX vs OPEX';
  pptx.subject = 'The $180,000 USD Error: Why Your AI Strategy is Burning Capital';

  // Master Palette Constants (Elegant Dark)
  const COLOR_BG = '0A0A0B';
  const COLOR_CARD = '161618';
  const COLOR_CARD_BORDER = '27272A';
  const COLOR_TEXT_WHITE = 'FFFFFF';
  const COLOR_TEXT_MUTED = 'A1A1AA';
  const COLOR_AMBER = 'F59E0B';
  const COLOR_CYAN = '00E5FF';
  const COLOR_EMERALD = '10B981';
  const COLOR_ROSE = 'F43F5E';

  // Build each slide from SLIDES_DATA
  SLIDES_DATA.forEach((slideData, index) => {
    const loc = getLocalizedSlide(slideData, lang);
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    // Speaker Notes (Presenter View)
    const speakerNotes = `[Slide ${slideData.id}: ${loc.title}]\n\nNarration (${lang.toUpperCase()}):\n${slideData.narration?.[lang] || slideData.narration?.es || ''}\n\nKey Takeaway:\n${loc.takeaway}`;
    slide.addNotes(speakerNotes);

    // Top Header Banner
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y: 0.4,
      w: 12.13,
      h: 0.04,
      fill: { color: COLOR_AMBER }
    });

    // Category / Badge Tag (Top Left)
    slide.addText(`SLIDE ${slideData.id} OF ${SLIDES_DATA.length} • ${loc.badge.toUpperCase()}`, {
      x: 0.6,
      y: 0.5,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      bold: true,
      color: COLOR_AMBER,
      fontFace: 'Arial'
    });

    // Author Tag (Top Right)
    slide.addText('ING. JORGE HUERTA • KBOXHUBIA AI', {
      x: 8.7,
      y: 0.5,
      w: 4.0,
      h: 0.3,
      fontSize: 9,
      bold: true,
      align: 'right',
      color: COLOR_CYAN,
      fontFace: 'Arial'
    });

    // Slide Title
    slide.addText(slideData.title, {
      x: 0.6,
      y: 0.85,
      w: 12.13,
      h: 0.75,
      fontSize: slideData.type === 'cover' ? 24 : 20,
      bold: true,
      color: COLOR_TEXT_WHITE,
      fontFace: 'Arial'
    });

    // Slide Subtitle
    slide.addText(slideData.subtitle, {
      x: 0.6,
      y: 1.6,
      w: 12.13,
      h: 0.4,
      fontSize: 11,
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial'
    });

    // --- Metrics Section (3 or 4 Cards) ---
    const metrics = slideData.metrics || [];
    const metricCount = metrics.length;
    if (metricCount > 0) {
      const totalWidth = 12.13;
      const gap = 0.25;
      const cardW = (totalWidth - (metricCount - 1) * gap) / metricCount;
      const cardY = 2.15;
      const cardH = 1.35;

      metrics.forEach((m, mIdx) => {
        const cardX = 0.6 + mIdx * (cardW + gap);
        let valColor = COLOR_CYAN;
        if (m.color === 'rose') valColor = COLOR_ROSE;
        else if (m.color === 'emerald') valColor = COLOR_EMERALD;
        else if (m.color === 'amber') valColor = COLOR_AMBER;

        // Metric Card Background
        slide.addShape(pptx.ShapeType.roundRect, {
          x: cardX,
          y: cardY,
          w: cardW,
          h: cardH,
          rectRadius: 0.1,
          fill: { color: COLOR_CARD },
          line: { color: m.highlight ? COLOR_EMERALD : COLOR_CARD_BORDER, width: m.highlight ? 1.5 : 1 }
        });

        // Metric Label
        slide.addText(m.label.toUpperCase(), {
          x: cardX + 0.15,
          y: cardY + 0.12,
          w: cardW - 0.3,
          h: 0.25,
          fontSize: 8.5,
          bold: true,
          color: COLOR_TEXT_MUTED,
          fontFace: 'Arial'
        });

        // Metric Value
        slide.addText(m.value, {
          x: cardX + 0.15,
          y: cardY + 0.38,
          w: cardW - 0.3,
          h: 0.55,
          fontSize: 18,
          bold: true,
          color: valColor,
          fontFace: 'Arial'
        });

        // Metric Subtext
        slide.addText(m.subtext, {
          x: cardX + 0.15,
          y: cardY + 0.95,
          w: cardW - 0.3,
          h: 0.3,
          fontSize: 8.5,
          color: COLOR_TEXT_MUTED,
          fontFace: 'Arial'
        });
      });
    }

    // --- Content Details / Bullets / Takeaways Card ---
    const contentY = 3.65;
    const contentH = 2.85;

    // Content Card Container
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: contentY,
      w: 12.13,
      h: contentH,
      rectRadius: 0.1,
      fill: { color: COLOR_CARD },
      line: { color: COLOR_CARD_BORDER, width: 1 }
    });

    // Content Header Tag
    slide.addText('EXECUTIVE ANALYSIS & STRATEGIC TAKEAWAY', {
      x: 0.85,
      y: contentY + 0.15,
      w: 11.6,
      h: 0.25,
      fontSize: 9,
      bold: true,
      color: COLOR_AMBER,
      fontFace: 'Arial'
    });

    // Takeaway Main Text
    slide.addText(`"${slideData.takeaway}"`, {
      x: 0.85,
      y: contentY + 0.42,
      w: 11.6,
      h: 0.65,
      fontSize: 11,
      bold: true,
      color: COLOR_TEXT_WHITE,
      fontFace: 'Arial'
    });

    // Key Bullets if present
    if (slideData.bullets && slideData.bullets.length > 0) {
      const bulletItems = slideData.bullets.map(b => ({
        text: `${b}\n`,
        options: {
          fontSize: 9.5,
          color: COLOR_TEXT_MUTED,
          bullet: { code: '2022' }
        }
      }));

      slide.addText(bulletItems, {
        x: 0.85,
        y: contentY + 1.1,
        w: 11.6,
        h: 1.55,
        fontFace: 'Arial'
      });
    } else {
      // If no bullets, show structured executive briefing highlights
      const highlightItems = [
        { text: `Sovereign Telecom Architecture: Zero data egress exposure and sub-50ms deterministic inference.\n`, options: { fontSize: 9.5, color: COLOR_TEXT_MUTED, bullet: { code: '2022' } } },
        { text: `Financial Capital Allocation: Reallocates unconstrained OPEX into 3-year depreciable balance sheet assets.\n`, options: { fontSize: 9.5, color: COLOR_TEXT_MUTED, bullet: { code: '2022' } } },
        { text: `Interactive Web Portal: Dynamic analytics widgets available at https://kboxhubia-github-io.vercel.app/\n`, options: { fontSize: 9.5, color: COLOR_TEXT_MUTED, bullet: { code: '2022' } } }
      ];

      slide.addText(highlightItems, {
        x: 0.85,
        y: contentY + 1.1,
        w: 11.6,
        h: 1.55,
        fontFace: 'Arial'
      });
    }

    // Bottom Slide Footer
    slide.addText('AI Infrastructure Financial Strategy • Ing. Jorge Huerta • Contact: kuboxhubia@gmail.com', {
      x: 0.6,
      y: 7.0,
      w: 10.0,
      h: 0.3,
      fontSize: 8,
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial'
    });

    slide.addText(`Page ${index + 1} of ${SLIDES_DATA.length}`, {
      x: 10.7,
      y: 7.0,
      w: 2.0,
      h: 0.3,
      fontSize: 8,
      align: 'right',
      color: COLOR_TEXT_MUTED,
      fontFace: 'Arial'
    });
  });

  // Save the PowerPoint file
  await pptx.writeFile({ fileName: 'Presentacion-Ejecutiva-IA-Financiera-Jorge-Huerta.pptx' });
}
