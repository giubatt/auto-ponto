#!/usr/bin/env node
import { createRequire } from 'module';
import createSheet from './createSheet.js'
const meow = createRequire(import.meta.url)('meow');

const cli = meow(`
	Usage
	  $ foo <input>

	Options
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
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
