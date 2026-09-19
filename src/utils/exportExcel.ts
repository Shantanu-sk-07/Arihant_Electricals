import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
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

export async function exportRecordsToExcel(
  records: MandalRecord[],
  filename: string = EXCEL_FILENAME,
): Promise<void> {
  const workbook = new ExcelJS.Workbook()
  const ws = workbook.addWorksheet('Records', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  ws.addRow([
    'अ.क्र.',
    'मंडळाचे नाव',
    'गाव / पत्ता',
    'अध्यक्षाचे नाव',
    'मोबाईल नंबर',
    'माहितीचा प्रकार',
    'Photos',
    '',
    '',
    'दिनांक / वेळ',
  ])

  const headerRow = ws.getRow(1)
  headerRow.height = 28
  headerRow.font = {
    bold: true,
    color: { argb: 'FFFFFFFF' },
    size: 11,
  }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    // Fresh orange — #FF8C42 (vibrant, warm)
    fgColor: { argb: 'FFFF8C42' },
  }
  headerRow.border = {
    top: { style: 'thin', color: { argb: 'FFD96A1F' } },
    left: { style: 'thin', color: { argb: 'FFD96A1F' } },
    bottom: { style: 'thin', color: { argb: 'FFD96A1F' } },
    right: { style: 'thin', color: { argb: 'FFD96A1F' } },
  }

  ws.mergeCells(1, 7, 1, 9)

  records.forEach((r, idx) => {
    const photos = stringToPhotoUrls(r.idol_photo_url)
    const row = ws.addRow([
      idx + 1,
      r.mandal_name,
      r.mandal_village ?? '',
      r.president_name,
      r.president_mobile,
      r.information_type,
      photos[0] ? 'Photo 1' : '',
      photos[1] ? 'Photo 2' : '',
      photos[2] ? 'Photo 3' : '',
      formatDateTime(r.created_at),
    ])

    row.alignment = { vertical: 'middle', wrapText: true }
    row.height = 22

    if (idx % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF7F0' },
      }
    }

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE0D5C8' } },
        left: { style: 'thin', color: { argb: 'FFE0D5C8' } },
        bottom: { style: 'thin', color: { argb: 'FFE0D5C8' } },
        right: { style: 'thin', color: { argb: 'FFE0D5C8' } },
      }
    })

    for (let i = 0; i < 3; i++) {
      const url = photos[i]
      if (!url) continue

      const cell = row.getCell(7 + i)
      cell.value = {
        text: `Photo ${i + 1}`,
        hyperlink: url,
        tooltip: 'Open photo',
      }
      cell.font = {
        color: { argb: 'FF0563C1' },
        underline: true,
        bold: true,
        size: 11,
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }

    row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' }
    row.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' }
  })

  // Column widths — मंडळ aani गाव columns vadhavले
  const columnWidths = [
    6,   // अ.क्र.
    36,  // मंडळाचे नाव (28 → 36)
    45,  // गाव / पत्ता (28 → 45)
    26,  // अध्यक्षाचे नाव
    14,  // मोबाईल
    34,  // माहितीचा प्रकार
    12,  // Photo 1
    12,  // Photo 2
    12,  // Photo 3
    18,  // दिनांक / वेळ
  ]
  columnWidths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w
  })

  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 10 },
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, filename)
}

export async function exportFilteredRecordsToExcel(
  records: MandalRecord[],
): Promise<void> {
  await exportRecordsToExcel(
    records,
    'Ganesh_Mandal_Records_2026_Filtered.xlsx',
  )
}