import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/", (req, res) => res.json({ ok: true, message: "Mini PM API" }));

export default app;
