# Project Base


```json
{
    "pm2/reload/all": "pm2 restart all",
    "pm2/stop": "pm2 stop ecosystem.config.js",
    "pm2/delete": "pm2 delete ecosystem.config.js",
    "pm2/reload": "pm2 reload ecosystem.config.js --env production",
    "pm2/update": "pm2 reload ecosystem.config.js --env production --update-env",
    "pm2/status": "pm2 status",
    "pm2/start": "pm2-runtime ecosystem.config.js --env production"
}
```