import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "mprgan";
import bodyParser from "body-parser";

//Security Packages

import helmet from "helmet";

dotenv.config();

const app = express();