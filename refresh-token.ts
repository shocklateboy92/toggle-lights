import * as express from 'express';
import * as passport from 'passport';
import { Strategy } from 'passport-smartthings';

const DEFAULT_PORT = 3000;
const app = express();

app.get('/auth', passport.authenticate('smart-things'), (req, res) => {
    res.send('Hello');
});

app.listen(DEFAULT_PORT, console.log.bind(null, 'server started'));
