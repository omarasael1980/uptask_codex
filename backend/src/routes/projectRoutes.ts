import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/projects";
import {
  hasAuthorization,
  taskBelongsToProject,
  validateTaskExists,
} from "../middleware/tasks";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import {
  createNote,
  deleteNote,
  getTasksNotes,
} from "../controllers/NoteController";
const router = Router();

//region getAllProjects
router.get("/", authenticate, ProjectController.getAllProjects);
//region getAProjectById
router.get(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),
  handleInputErrors,
  ProjectController.getProjectById
);
//region createProject
router.post(
  "/",
  //middleware auth
  authenticate,
  //validaciones
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("projectDescription")
    .notEmpty()
    .withMessage("La descripción del proyecto es requerida"),

  handleInputErrors,
  ProjectController.createProject
);

//region editProject
router.put(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es requerido"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es requerido"),
  body("projectDescription")
    .notEmpty()
    .withMessage("La descripción del proyecto es requerida"),
  handleInputErrors,
  ProjectController.updateProject
);
//region deleteProject

router.delete(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("El id del proyecto no es válido"),

  handleInputErrors,
  ProjectController.deleteProject
);
//region TASKS
//region validate params 'projectId' and 'taskId'
router.param("projectId", validateProjectExists);
router.param("taskId", validateTaskExists);
router.param("taskId", taskBelongsToProject);
//region createTask
router.post(
  "/:projectId/tasks",
  authenticate,
  hasAuthorization,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handleInputErrors,

  TaskController.createTask
);
//region getTasks
router.get(
  "/:projectId/tasks",
  authenticate,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  handleInputErrors,

  TaskController.getTasks
);
//region getTaskById
router.get(
  "/:projectId/tasks/:taskId",
  authenticate,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  handleInputErrors,

  TaskController.getTaskById
);
//region updateTask
router.put(
  "/:projectId/tasks/:taskId",

  authenticate,
  hasAuthorization,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es requerido"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es requerida"),
  handleInputErrors,
  TaskController.updateTask
);

//region deleteTask
router.delete(
  "/:projectId/tasks/:taskId",
  authenticate,
  hasAuthorization,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  handleInputErrors,

  TaskController.deleteTask
);
//region updateStatusTask
router.post(
  "/:projectId/tasks/:taskId/status",
  authenticate,
  param("projectId").isMongoId().withMessage("El id del proyecto no es válido"),
  param("taskId").isMongoId().withMessage("El id de la tarea no es válido"),
  body("status").notEmpty().withMessage("El status de la tarea es requerido"),
  handleInputErrors,

  TaskController.updateStatusTask
);
export default router;
//region TEAMS
//region findMemberByEmail

router.post(
  "/:projectId/team/find",
  authenticate,
  body("email").isEmail().toLowerCase().withMessage("El email no es válido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);
//enviarIdTeam
router.post(
  "/:projectId/team",
  authenticate,
  body("id").isMongoId().withMessage("El id del usuario no es válido"),
  handleInputErrors,
  TeamMemberController.addMemberById
);
//region GetTeamProject
router.get(
  "/:projectId/team",
  authenticate,
  TeamMemberController.getTeamProject
);
//region eliminar elemento del Team
router.delete(
  "/:projectId/team/:userId",
  authenticate,
  param("userId").isMongoId().withMessage("El id del usuario no es válido"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);
//region NOTES
router.post(
  "/:projectId/tasks/:taskId/notes",
  authenticate,

  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es requerido"),
  handleInputErrors,
  createNote
);

//region getTasksNotes
router.get("/:projectId/tasks/:taskId/notes", authenticate, getTasksNotes);
//region deleteNote
router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  authenticate,
  deleteNote
);
