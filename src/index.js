#!/usr/bin/env node
import { createRequire } from 'module';
import createSheet from './createSheet.js'
const meow = createRequire(import.meta.url)('meow');

const cli = meow(`
	Usage
	  $ auto-ponto --matricula 123

	Options
    --matricula, -m   "Matricula" number
                      Required
    
    --date, -d        Date that is inside the week, format YYYY-MM-DD
                      (e.g. 2021-02-03 to create timeshee for the week of 2021-02-01 to 2021-02-05)
                      Defaults to current date

    --output, -o      Name of the file to write the resulting sheet to
                      Defaults to "outputSheet.xlsx"

	Examples
	  $ auto-ponto --matricula 123 --date 2021-03-15 --output sheet.xlsx
`, {
  flags: {
    matricula: {
      type: 'number',
      alias: 'm'
    },
    output: {
      type: 'string',
      alias: 'o'
    },
    date: {
      type: 'string',
      alias: 'd'
    },
  }
});

createSheet({
  matricula: cli.flags.matricula,
  output: cli.flags.output,
  date: cli.flags.date,
});
