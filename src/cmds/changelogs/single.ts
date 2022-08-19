import type { CommandOptions } from '../../lib/baseCommand';

import chalk from 'chalk';
import config from 'config';

import Command, { CommandCategories } from '../../lib/baseCommand';
import pushDoc from '../../lib/pushDoc';

export type Options = {
  dryRun?: boolean;
  filePath?: string;
};

export default class SingleChangelogCommand extends Command {
  constructor() {
    super();

    this.command = 'changelogs:single';
    this.usage = 'changelogs:single <file> [options]';
    this.description = 'Sync a single Markdown file to your ReadMe project as a Changelog post.';
    this.cmdCategory = CommandCategories.CHANGELOGS;
    this.position = 2;

    this.hiddenArgs = ['filePath'];
    this.args = [
      {
        name: 'key',
        type: String,
        description: 'Project API key',
      },
      {
        name: 'filePath',
        type: String,
        defaultOption: true,
      },
      {
        name: 'dryRun',
        type: Boolean,
        description: 'Runs the command without creating/updating any changelogs in ReadMe. Useful for debugging.',
      },
    ];
  }

  async run(opts: CommandOptions<Options>) {
    super.run(opts);

    const { dryRun, filePath, key } = opts;

    if (!filePath) {
      return Promise.reject(new Error(`No file path provided. Usage \`${config.get('cli')} ${this.usage}\`.`));
    }

    if (!(filePath.toLowerCase().endsWith('.md') || filePath.toLowerCase().endsWith('.markdown'))) {
      return Promise.reject(new Error('The file path specified is not a Markdown file.'));
    }

    const createdDoc = await pushDoc(key, undefined, dryRun, filePath, this.cmdCategory);

    return chalk.green(createdDoc);
  }
}
