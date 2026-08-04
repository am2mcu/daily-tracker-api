import { Router } from "express";
import { deleteMe, getMe } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { updateEmail, updatePassword } from "../controllers/authController.js";

const router = Router();

router.use(authenticate);

router.route("/").get(getMe).delete(deleteMe);
router.route("/password").patch(updatePassword);
router.route("/email").patch(updateEmail);

export default router;
