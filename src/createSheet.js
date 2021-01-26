#!/usr/bin/env node
import Excel from 'exceljs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'; 
import dateFns from 'date-fns'
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createLines = ({ matricula, date, holidays }) => {
  const day = dateFns.getDate(date)
  const month = dateFns.getMonth(date) + 1
  const year = dateFns.getYear(date)
  
  const hours = ['08', '12', '13', dateFns.isFriday(date) ? '17' : '18']
  const minute = '00'

  if (holidays.some((holiday) => dateFns.isSameDay(date, dateFns.parseISO(holiday.date)))) {
    return []
  }

  return hours.map(hour => ([
    matricula,
    day,
    month,
    year,
    hour,
    minute,
  ]))
}

export default async function createSheet({ matricula, output = 'outputSheet.xlsx', date = new Date() }) {
  const data = await fs.readFile(path.join(__dirname, 'baseSheet.xlsx'))

  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(data);
  
  let sheet = workbook.worksheets[0]

  const lastWeekStart = dateFns.startOfWeek(dateFns.parseISO(date))

  const response = await axios.get('https://date.nager.at/api/v2/PublicHolidays/2021/BR')
  const holidays = response.data
  
  const days = [
    dateFns.addDays(lastWeekStart, 1),    // Segunda
    dateFns.addDays(lastWeekStart, 2),    // Terça
    dateFns.addDays(lastWeekStart, 3),    // Quarta
    dateFns.addDays(lastWeekStart, 4),    // Quinta
    dateFns.addDays(lastWeekStart, 5),    // Sexta
  ]
  
  const lines = days.map(date => createLines({ matricula, date, holidays })).reduce((acc, value) => [...acc, ...value])
  
  sheet.insertRows(2, lines, 'o+')

  await workbook.xlsx.writeFile(output);
}
