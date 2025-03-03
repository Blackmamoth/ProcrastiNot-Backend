import { Router } from "express";
import AuthController from "../controllers/auth";
import TaskController from "../controllers/task";
import AuthMiddleware from "../middlewares/auth";
import ProfileController from "../controllers/profile";

const router = Router();

const authMiddleware = new AuthMiddleware();

const authController = new AuthController();
const taskController = new TaskController();
const profileController = new ProfileController();

router.post("/auth/signup", authController.authSignUp);
router.post("/auth/signin", authController.authSignIn);
router.get("/auth/signin/google", authController.oauthSignin);

router.post(
  "/task/create",
  authMiddleware.verifyBetterAuthToken,
  taskController.createTask,
);
router.post(
  "/task/get",
  authMiddleware.verifyBetterAuthToken,
  taskController.getTasks,
);
router.delete(
  "/task/delete",
  authMiddleware.verifyBetterAuthToken,
  taskController.deleteTask,
);
router.patch(
  "/task/update",
  authMiddleware.verifyBetterAuthToken,
  taskController.updateTask,
);

router.post(
  "/profile/add",
  authMiddleware.verifyBetterAuthToken,
  profileController.addProfile,
);

router.get(
  "/profile/get",
  authMiddleware.verifyBetterAuthToken,
  profileController.getProfile,
);

router.patch(
  "/profile/update",
  authMiddleware.verifyBetterAuthToken,
  profileController.updateProfile,
);

export default router;
