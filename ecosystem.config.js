const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: process.env.DEPLOY_NAME,
      script: './server.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: 'origin/master',
      repo: 'https://github.com/davidcostadev/with-money.git',
      path: process.env.DEPLOY_PATH,
      'post-deploy': [
        'npm install',
        'npm run unit',
        'npm run build',
        `pm2 reload ecosystem.config.js --env production --name ${process.env.DEPLOY_NAME}`,
      ].join(' && '),
    },
  },
};
