import { Router } from "express";
import { deleteRental, finishRental, getRentals, postRental } from "../controllers/rentalsController.js";
import { rentalValidation } from "../middlewares/rentalValidationMiddleware.js";
import { rentalDeleteValidation } from "../middlewares/rentalDeleteValidationMiddleware.js";
import { rentalReturnValidation } from "../middlewares/rentalReturnValidationMiddleware.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", rentalValidation, postRental);
router.post("/rentals/:id/return", rentalReturnValidation, finishRental);
router.delete("/rentals/:id", rentalDeleteValidation, deleteRental);

export default router;
