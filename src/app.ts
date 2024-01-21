import express from 'express';
// import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import config from './config';

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(cookieParser());

// app.get('/test', (req, res) => {
//   console.log(req.cookies)
//   res.cookie('orot-tk', 'tokenizer-898989', {
//     httpOnly: true,
//     expires: new Date('2023-10-12'),
//     sameSite: 'none',
//   });
//   res.send({text: 'cookies set'});
// });

app.use(morgan(config.env.isProduction ? 'common' : 'dev'));

export default app;
