import type { CommandOptions } from '../../lib/baseCommand';

import chalk from 'chalk';

import Command, { CommandCategories } from '../../lib/baseCommand';
import createGHA from '../../lib/createGHA';
import prepareOas from '../../lib/prepareOas';

export interface Options {
  spec?: string;
  workingDirectory?: string;
}

export default class OpenAPIValidateCommand extends Command {
  constructor() {
    super();

    this.command = 'openapi:validate';
    this.usage = 'openapi:validate [file|url] [options]';
    this.description = 'Validate your OpenAPI/Swagger definition.';
    this.cmdCategory = CommandCategories.APIS;

    this.hiddenArgs = ['spec'];
    this.args = [
      {
        name: 'spec',
        type: String,
        defaultOption: true,
      },
      {
        name: 'workingDirectory',
        type: String,
        description: 'Working directory (for usage with relative external references)',
      },
      this.getGitHubArg(),
    ];
  }

  async run(opts: CommandOptions<Options>) {
    await super.run(opts);

    const { spec, workingDirectory } = opts;

    if (workingDirectory) {
      process.chdir(workingDirectory);
    }

    const { specPath, specType } = await prepareOas(spec, 'openapi:validate');
    return Promise.resolve(chalk.green(`${specPath} is a valid ${specType} API definition!`)).then(msg =>
      createGHA(msg, this.command, this.args, { ...opts, spec: specPath } as CommandOptions<Options>)
    );
  }
}
