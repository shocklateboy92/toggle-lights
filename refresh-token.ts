import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as fs from 'fs-extra';

import { Strategy } from 'passport-smartthings';
import { exec } from 'child_process';

const DEFAULT_PORT = 3000;
const CONFIG_FILE = './config.json';
const USER_FILE = './userInfo.json';

const app = express();
app.use(
    session({
        secret: 'yolo-swag'
    })
);

async function init() {
    const configExists = await fs.pathExists(CONFIG_FILE);
    if (!configExists) {
        console.error(
            'Please create a "config.json" file with "clientID" and "clientSecret" from SmartThings'
        );

        process.exit(1);
    }

    const config: {
        clientID: string;
        clientSecret: string;
    } = await fs.readJson(CONFIG_FILE);

    passport.use(new Strategy({ ...config }));

    app.get(
        '/auth',
        passport.authenticate(
            'smartthings',
            { session: false, scope: ['app'] },
            (...args) => console.log(JSON.stringify(args))
        )
    ).get('/auth/smartthings/callback', (req, res, next) => {
        passport.authenticate(
            'smartthings',
            { session: false, scope: ['app'] },
            async (error, user, info) => {
                try {
                    await fs.writeJson(
                        USER_FILE,
                        { error, user, info },
                        { spaces: 4 }
                    );
                } catch (e) {
                    return next(e);
                }

                if (error) {
                    return next(error);
                }

                res.send('OK');
            }
        )(req, res, next);
    });

    app.listen(DEFAULT_PORT, () => {
        const url = `http://localhost:${DEFAULT_PORT}/auth`;
        console.log(`Listening on ${url}`);
        if (process.platform === 'linux') {
            exec(`xdg-open ${url}`);
        }
    });
}

init();
