import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import {apiController} from 'modules/api';
import {mediaController} from 'modules/media';

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(apiController.root, apiController.ctx);
app.use(mediaController.root, mediaController.ctx);
app.listen(5000);
