import { Router } from "express";
import { deleteRental, postRental } from "../controllers/rentalsController.js";
import { rentalValidation } from "../middlewares/rentalValidationMiddleware.js";
import { rentalDeleteValidation } from "../middlewares/rentalDeleteValidationMiddleware.js";

const router = Router();

router.get("/rentals");
router.post("/rentals", rentalValidation, postRental);
router.post("/rentals/:id/return");
router.delete("/rentals/:id", rentalDeleteValidation, deleteRental);

export default router;
