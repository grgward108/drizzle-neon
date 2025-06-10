import { devConfig } from './dev';

// Add more environments as needed
// import { prodConfig } from './prod';
// import { stagingConfig } from './staging';

export type EnvConfig = typeof devConfig;

export function getConfig(env: string = 'dev'): EnvConfig {
  switch (env) {
    case 'dev':
      return devConfig;
    // case 'staging':
    //   return stagingConfig;
    // case 'prod':
    //   return prodConfig;
    default:
      return devConfig;
  }
}

// Get current environment from CDK context or env var
export const currentEnv = process.env.CDK_ENV || 'dev';
export const config = getConfig(currentEnv);
