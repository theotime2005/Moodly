import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "login route is OK" });
});

export default router;
