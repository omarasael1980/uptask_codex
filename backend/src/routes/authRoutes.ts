import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import {
  createUser,
  login,
  confirmToken,
  requestConfirmationCode,
  forgotPassword,
  validateToken,
  updatePassword,
  updateCurrentUserPassword,
  user,
  updateProfile,
  checkPassword,
} from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";

const router = Router();
//region create-account
router.post(
  "/create-account",
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password_confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    })
    .withMessage("Las contraseñas no coinciden"),
  handleInputErrors,
  createUser
);
//region confirm-account
router.post(
  "/confirm-account",
  body("token")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token debe tener 6 dígitos"),
  handleInputErrors,
  confirmToken
);
//region login
router.post(
  "/login/",
  body("email").isEmail().withMessage("El email no es válido"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía"),
  handleInputErrors,
  login
);
//region request-confirmation-code
router.post(
  "/request-confirmation-code",
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  requestConfirmationCode
);
//region forgot-password
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El email no es válido"),
  handleInputErrors,
  forgotPassword
);
//region validate-token
router.post(
  "/validate-token",
  body("token")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token debe tener 6 dígitos"),
  handleInputErrors,
  validateToken
);
//region update-password
router.post(
  "/update-password/:token",
  param("token")
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage("El token debe tener 6 dígitos"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password_confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    })
    .withMessage("Las contraseñas no coinciden"),
  handleInputErrors,
  updatePassword
);
router.get("/user", authenticate, user);
//region PROFILE
//region update-profile
router.put(
  "/profile",
  authenticate,
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("El email no es válido"),

  handleInputErrors,
  updateProfile
);
//region updatePassword
router.post(
  "/update-password/",
  authenticate,
  body("current_password")
    .notEmpty()
    .withMessage("La contraseña actual no puede estar vacía"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("password_confirmation")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    })
    .withMessage("Las contraseñas no coinciden"),
  handleInputErrors,
  updateCurrentUserPassword
);

//region checkPassword
router.post(
  "/check-password",
  authenticate,
  body("password")
    .isString()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía"),
  handleInputErrors,
  checkPassword
);
export default router;
