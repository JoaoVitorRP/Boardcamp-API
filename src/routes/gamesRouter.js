import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesController.js";
import { gameValidation } from "../middlewares/gameValidationMiddleware.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", gameValidation, postGame);

export default router;
