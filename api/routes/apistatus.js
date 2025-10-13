import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "API en ligne et fonctionnelle" });
});

export default router;
