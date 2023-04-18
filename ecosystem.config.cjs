module.exports = {
    apps: [
        {
            name: "vue app",
            script: "server.js",
            node_args: "--harmony",
            instances: 2,
            watch: ["server.js", "api", "dist/bundled/server", "templates"],
            watch_delay: 1000,
            max_memory_restart: "2G",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            },
            error_file: "../data/logs/error.log",
            log_type: "json",
            log_date_format: "DD-MM-YYYY / HH:mm:ss"
        }
    ]
};
