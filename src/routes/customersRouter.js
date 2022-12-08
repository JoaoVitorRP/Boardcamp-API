import { Router } from "express";
import { editCustomer, getCustomerById, getCustomers, postCustomer } from "../controllers/customersController.js";
import { customerValidation } from "../middlewares/customerValidationMiddleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", customerValidation, postCustomer);
router.put("/customers/:id", customerValidation, editCustomer);

export default router;
