const path = require( 'path' );

const config = require( './config.js' );
const port = config.server.port;
const url = `http://localhost:${ port }`;

module.exports = {
    ui: {
        port: port + 2,
    },
    files: [
        path.join( config.projectRoot, 'auth/public/**/*.css' ),
        path.join( config.projectRoot, 'auth/public/**/*.js' ),
        path.join( config.projectRoot, 'short-term/public/**/*.css' ),
        path.join( config.projectRoot, 'short-term/public/**/*.js' ),
        path.join( config.projectRoot, 'mid-long-term/public/**/*.css' ),
        path.join( config.projectRoot, 'mid-long-term/public/**/*.js' ),
    ],
    watchEvents: [
        'add',
        'change',
        'unlink',
        'addDir',
        'unlinkDir',
    ],
    watch:     true,
    proxy:     url,
    port:      port + 1,
    ghostMode: {
        clicks:   true,
        scroll:   true,
        location: true,
        forms:    {
            submit:  true,
            inputs:  true,
            toggles: true,
        },
    },
    logLevel:        'debug',
    logPrefix:       'Browsersync',
    logConnections:  true,
    logFileChanges:  true,
    open:            'local',
    browser:         'default',
    reloadOnRestart: true,
    notify:          false,
    reloadDelay:     1000,
    startPath:       '/',
};
