import * as XLSX from 'xlsx'
import type { MandalRecord } from '../types'
import { stringToPhotoUrls } from './photoUtils'

const EXCEL_FILENAME = 'Ganesh_Mandal_Records_2026.xlsx'

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

export function exportRecordsToExcel(
  records: MandalRecord[],
  filename: string = EXCEL_FILENAME,
): void {
  const aoa: (string | number)[][] = []

  // Header row — Date/Time शेवटी, Photos merge 5-7
  aoa.push([
    'अ.क्र.',
    'मंडळाचे नाव',
    'अध्यक्षाचे नाव',
    'मोबाईल नंबर',
    'माहितीचा प्रकार',
    'Photos',
    '',
    '',
    'दिनांक / वेळ',
  ])

  records.forEach((r, idx) => {
    const photos = stringToPhotoUrls(r.idol_photo_url)
    aoa.push([
      idx + 1,
      r.mandal_name,
      r.president_name,
      r.president_mobile,
      r.information_type,
      photos[0] ? 'Photo 1' : '',
      photos[1] ? 'Photo 2' : '',
      photos[2] ? 'Photo 3' : '',
      formatDateTime(r.created_at),
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Photos header merge — columns 5 to 7
  ws['!merges'] = [{ s: { r: 0, c: 5 }, e: { r: 0, c: 7 } }]

  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1')
  for (let R = 1; R <= range.e.r; R++) {
    const recordIndex = R - 1
    const record = records[recordIndex]
    if (!record) continue

    const photos = stringToPhotoUrls(record.idol_photo_url)

    // Photo columns are 5, 6, 7 now
    for (let C = 5; C <= 7; C++) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C })
      const cell = ws[addr] as XLSX.CellObject | undefined
      if (!cell) continue

      const url = photos[C - 5]
      if (!url) continue

      cell.l = { Target: url, Tooltip: 'Open photo' }
      cell.v = `Photo ${C - 4}`
      cell.s = {
        font: {
          color: { rgb: '0563C1' },   // blue
          underline: true,             // underline
          bold: true,
        },
      }
    }
  }

  // Column widths — Date शेवटी
  ws['!cols'] = [
    { wch: 6 },   // अ.क्र.
    { wch: 30 },  // मंडळाचे नाव
    { wch: 26 },  // अध्यक्षाचे नाव
    { wch: 14 },  // मोबाईल
    { wch: 32 },  // माहितीचा प्रकार
    { wch: 14 },  // Photo 1
    { wch: 14 },  // Photo 2
    { wch: 14 },  // Photo 3
    { wch: 18 },  // दिनांक / वेळ
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Records')
  XLSX.writeFile(wb, filename)
}

export function exportFilteredRecordsToExcel(
  records: MandalRecord[],
): void {
  exportRecordsToExcel(records, 'Ganesh_Mandal_Records_2026_Filtered.xlsx')
}