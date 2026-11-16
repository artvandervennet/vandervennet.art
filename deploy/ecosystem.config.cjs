// How pm2 runs the site on the Pi, next to Odyfeed.
// The settings (port, guestbook folder, admin token) come from ~/.config/vandervennet.art.env.
const home = require('node:os').homedir()

module.exports = {
  apps: [
    {
      name: 'portfolio',
      cwd: `${home}/vandervennet.art`,
      script: '.output/server/index.mjs',
      interpreter: 'node',
      node_args: `--env-file=${home}/.config/vandervennet.art.env`,
      env: { NODE_ENV: 'production' },
    },
  ],
}
