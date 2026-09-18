import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MandalRecord } from '../types'
import { stringToPhotoUrls } from './photoUtils'

const PDF_FILENAME = 'Ganesh_Mandal_Records_2026.pdf'

const DEVANAGARI_FONT_URL =
  'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf'

const DEVANAGARI_BOLD_FONT_URL =
  'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansDevanagari/NotoSansDevanagari-Bold.ttf'

let regularFontBase64: string | null = null
let boldFontBase64: string | null = null

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load font')
  const buf = await res.arrayBuffer()
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

async function loadFonts(): Promise<{ regular: string; bold: string }> {
  if (!regularFontBase64) {
    regularFontBase64 = await fetchAsBase64(DEVANAGARI_FONT_URL)
  }
  if (!boldFontBase64) {
    boldFontBase64 = await fetchAsBase64(DEVANAGARI_BOLD_FONT_URL)
  }
  return { regular: regularFontBase64, bold: boldFontBase64 }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

async function registerFonts(doc: jsPDF): Promise<void> {
  const { regular, bold } = await loadFonts()
  doc.addFileToVFS('NotoDev-Regular.ttf', regular)
  doc.addFileToVFS('NotoDev-Bold.ttf', bold)
  doc.addFont('NotoDev-Regular.ttf', 'NotoDev', 'normal')
  doc.addFont('NotoDev-Bold.ttf', 'NotoDev', 'bold')
  doc.setFont('NotoDev', 'normal')
}

// Date/Time शेवटी, Photos index 5-7
function buildBody(records: MandalRecord[]): string[][] {
  return records.map((r, idx) => {
    const photos = stringToPhotoUrls(r.idol_photo_url)
    return [
      String(idx + 1),
      r.mandal_name,
      r.president_name,
      r.president_mobile,
      r.information_type,
      photos[0] ? 'Photo 1' : '—',
      photos[1] ? 'Photo 2' : '—',
      photos[2] ? 'Photo 3' : '—',
      formatDateTime(r.created_at),
    ]
  })
}

export async function exportRecordsToPdf(
  records: MandalRecord[],
  filename: string = PDF_FILENAME,
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  })

  await registerFonts(doc)

  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFont('NotoDev', 'bold')
  doc.setFontSize(18)
  doc.text(
    'गणेशमूर्ती मंडळ माहिती नोंदणी २०२६',
    pageWidth / 2,
    40,
    { align: 'center' },
  )

  doc.setFont('NotoDev', 'normal')
  doc.setFontSize(10)
  doc.text(
    'गणेशमूर्ती मंडळ माहिती नोंदणी २०२६ | एकूण नोंदी: ' +
      records.length +
      ' | यादी तयार केली: ' +
      formatDateForHeader(),
    pageWidth / 2,
    58,
    { align: 'center' },
  )

  const body = buildBody(records)

  autoTable(doc, {
    head: [
      [
        'अ.क्र.',
        'मंडळाचे नाव',
        'अध्यक्षाचे नाव',
        'मोबाईल',
        'माहितीचा प्रकार',
        'Photos',
        '',
        '',
        'दिनांक / वेळ',
      ],
    ],
    body,
    startY: 78,
    styles: {
      font: 'NotoDev',
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'middle',
    },
    headStyles: {
      font: 'NotoDev',
      fontStyle: 'bold',
      fillColor: [169, 78, 10],
      textColor: [255, 255, 255],
      halign: 'center',       // सगळे headers center
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [250, 245, 240],
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },   // अ.क्र.
      1: { cellWidth: 110 },                     // मंडळाचे नाव
      2: { cellWidth: 90 },                      // अध्यक्षाचे नाव
      3: { cellWidth: 65, halign: 'center' },    // मोबाईल
      4: { cellWidth: 115 },                     // माहितीचा प्रकार
      5: {                                       // Photo 1
        cellWidth: 55,
        halign: 'center',
        textColor: [5, 99, 193],
        fontStyle: 'bold',
      },
      6: {                                       // Photo 2
        cellWidth: 55,
        halign: 'center',
        textColor: [5, 99, 193],
        fontStyle: 'bold',
      },
      7: {                                       // Photo 3
        cellWidth: 55,
        halign: 'center',
        textColor: [5, 99, 193],
        fontStyle: 'bold',
      },
      8: { cellWidth: 90, halign: 'center' },    // दिनांक / वेळ
    },
    didParseCell: (data) => {
      // Photos header merge (index 5, colSpan 3) + center
      if (data.section === 'head' && data.column.index === 5) {
        data.cell.colSpan = 3
        data.cell.styles.halign = 'center'
        data.cell.styles.valign = 'middle'
      }
    },
    didDrawCell: (data) => {
      if (data.section !== 'body') return
      if (data.column.index < 5) return       // photos आता index 5 पासून

      const row = records[data.row.index]
      if (!row) return

      const photos = stringToPhotoUrls(row.idol_photo_url)
      const url = photos[data.column.index - 5]
      if (!url) return

      // Clickable link
      doc.link(
        data.cell.x,
        data.cell.y,
        data.cell.width,
        data.cell.height,
        { url },
      )

      // Underline
      const x1 = data.cell.x + 4
      const y1 = data.cell.y + data.cell.height - 4
      const x2 = data.cell.x + data.cell.width - 4
      doc.setDrawColor(5, 99, 193)
      doc.setLineWidth(0.5)
      doc.line(x1, y1, x2, y1)
    },
  })

  doc.save(filename)
}

export async function exportFilteredRecordsToPdf(
  records: MandalRecord[],
): Promise<void> {
  await exportRecordsToPdf(
    records,
    'Ganesh_Mandal_Records_2026_Filtered.pdf',
  )
}