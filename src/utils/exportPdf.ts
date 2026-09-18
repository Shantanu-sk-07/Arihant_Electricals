import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { MandalRecord } from '../types'
import { stringToPhotoUrls } from './photoUtils'
 
const PDF_FILENAME = 'Ganesh_Mandal_Records_2026.pdf'
 
function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}
 
function formatDateForHeader(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}
 
function getMaxPhotoCount(records: MandalRecord[]): number {
  let max = 0
  for (const r of records) {
    const photos = stringToPhotoUrls(r.idol_photo_url).filter(Boolean)
    if (photos.length > max) max = photos.length
  }
  return max
}
 
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
 
function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}
 
// Raw link position in PDF-space (pt), measured from the TOP of the FULL
// (unsplit) rendered image — not yet assigned to a specific page.
type RawPhotoLink = {
  xPt: number
  yPt: number
  widthPt: number
  heightPt: number
  url: string
}
 
function buildHtmlTable(records: MandalRecord[]): string {
  const maxPhotos = getMaxPhotoCount(records)
  const photoCols = Math.max(1, maxPhotos)
 
  let html = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');
 
      .pdf-container {
        font-family: 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', system-ui, sans-serif;
        background: #fff;
        padding: 20px;
        width: 1400px;
        color: #1a1a1a;
      }
      .pdf-title {
        text-align: center;
        font-size: 24px;
        font-weight: 800;
        color: #7c2905;
        margin-bottom: 8px;
      }
      .pdf-subtitle {
        text-align: center;
        font-size: 12px;
        color: #666;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      thead {
        background: #a94e0a;
        color: #fff;
      }
      th {
        padding: 10px 6px;
        border: 1px solid #8a3d06;
        text-align: center;
        font-weight: 700;
        white-space: nowrap;
      }
      td {
        padding: 8px 6px;
        border: 1px solid #e0d5c8;
        vertical-align: middle;
      }
      tr:nth-child(even) td {
        background: #faf5f0;
      }
      .center {
        text-align: center;
      }
      .photo-link {
        color: #0563C1;
        font-weight: 700;
        text-decoration: underline;
      }
    </style>
    <div class="pdf-container">
      <div class="pdf-title">गणेशमूर्ती मंडळ माहिती नोंदणी २०२६</div>
      <div class="pdf-subtitle">
        गणेशमूर्ती मंडळ माहिती नोंदणी २०२६ | एकूण नोंदी: ${records.length} | यादी तयार केली: ${formatDateForHeader()}
      </div>
      <table>
        <thead>
          <tr>
            <th>अ.क्र.</th>
            <th>मंडळाचे नाव</th>
            <th>अध्यक्षाचे नाव</th>
            <th>मोबाईल</th>
            <th>माहितीचा प्रकार</th>
            ${Array.from({ length: photoCols }, (_, i) =>
              `<th>${photoCols === 1 ? 'Photo' : `Photo ${i + 1}`}</th>`,
            ).join('')}
            <th>दिनांक / वेळ</th>
          </tr>
        </thead>
        <tbody>
  `
 
  records.forEach((r, idx) => {
    const photos = stringToPhotoUrls(r.idol_photo_url).filter(Boolean)
    const photoCells = Array.from({ length: photoCols }, (_, i) => {
      const url = photos[i]
      const label = photoCols === 1 ? 'Photo' : `Photo ${i + 1}`
      return url
        ? `<td class="center" data-photo-url="${escapeHtml(url)}"><span class="photo-link">${label}</span></td>`
        : `<td class="center"></td>`
    }).join('')
 
    html += `
      <tr>
        <td class="center">${idx + 1}</td>
        <td>${escapeHtml(r.mandal_name)}</td>
        <td>${escapeHtml(r.president_name)}</td>
        <td class="center">${escapeHtml(r.president_mobile)}</td>
        <td>${escapeHtml(r.information_type)}</td>
        ${photoCells}
        <td class="center">${formatDateTime(r.created_at)}</td>
      </tr>
    `
  })
 
  html += `
        </tbody>
      </table>
    </div>
  `
 
  return html
}
 
/**
 * Collects every clickable photo cell's position and converts it directly
 * into PDF-space points, using `ptPerPixel` = imgWidthPt / containerWidthCss.
 *
 * IMPORTANT: getBoundingClientRect() already returns CSS pixels, so it must
 * be scaled by (PDF-image-width-in-pt / container-CSS-width), NOT by the
 * html2canvas oversampling `scale` factor. Dividing by html2canvas's scale
 * (the old bug) only undoes oversampling — it does nothing to map CSS-pixel
 * space onto PDF-point space, which is why links drifted further off their
 * cells the further right/down they were.
 */
function collectRawPhotoLinks(
  container: HTMLElement,
  ptPerPixel: number,
): RawPhotoLink[] {
  const links: RawPhotoLink[] = []
  const containerRect = container.getBoundingClientRect()
 
  const photoCells = container.querySelectorAll<HTMLElement>('td[data-photo-url]')
 
  photoCells.forEach((cell) => {
    const rawUrl = cell.getAttribute('data-photo-url')
    if (!rawUrl) return
 
    const url = unescapeHtml(rawUrl)
    if (!url || !url.startsWith('http')) return
 
    const rect = cell.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
 
    links.push({
      xPt: (rect.left - containerRect.left) * ptPerPixel,
      yPt: (rect.top - containerRect.top) * ptPerPixel,
      widthPt: rect.width * ptPerPixel,
      heightPt: rect.height * ptPerPixel,
      url,
    })
  })
 
  return links
}
 
export async function exportRecordsToPdf(
  records: MandalRecord[],
  filename: string = PDF_FILENAME,
): Promise<void> {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.top = '0'
  container.style.background = '#fff'
  container.innerHTML = buildHtmlTable(records)
  document.body.appendChild(container)
 
  try {
    await document.fonts.ready
    await new Promise((resolve) => setTimeout(resolve, 500))
 
    const scale = 2
    const canvas = await html2canvas(container, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    })
 
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    })
 
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
 
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
 
    // --- Correct px -> pt conversion ratio ---
    // containerRect.width is the CSS pixel width of the rendered table
    // (should be ~1400px, the .pdf-container width). imgWidth is that same
    // table's width once placed into the PDF, in points. This ratio maps
    // ANY CSS-pixel coordinate inside the container to PDF points.
    const containerRect = container.getBoundingClientRect()
    const ptPerPixel = imgWidth / containerRect.width
 
    const rawLinks = collectRawPhotoLinks(container, ptPerPixel)
 
    const imgData = canvas.toDataURL('image/jpeg', 0.95)
 
    let heightLeft = imgHeight
    let position = 0
 
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
 
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
 
    // --- Assign each link to the correct page ---
    // rawLinks' yPt is measured from the top of the FULL (unsplit) image.
    // Since the image is tiled page-by-page at page-height intervals, the
    // page a link belongs to is simply yPt / pageHeight, and its position
    // within that page is the remainder.
    rawLinks.forEach((link) => {
      const pageIndex = Math.floor(link.yPt / pageHeight)
      const yOnPage = link.yPt - pageIndex * pageHeight
 
      // Guard against a row that happens to straddle a page break —
      // clip the box so it doesn't bleed onto the next page.
      const heightOnPage = Math.min(link.heightPt, pageHeight - yOnPage)
      if (heightOnPage <= 0) return
 
      pdf.setPage(pageIndex + 1)
      pdf.link(link.xPt, yOnPage, link.widthPt, heightOnPage, {
        url: link.url,
      })
    })
 
    pdf.save(filename)
  } finally {
    document.body.removeChild(container)
  }
}
 
export async function exportFilteredRecordsToPdf(
  records: MandalRecord[],
): Promise<void> {
  await exportRecordsToPdf(
    records,
    'Ganesh_Mandal_Records_2026_Filtered.pdf',
  )
}