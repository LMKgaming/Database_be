import express from "express";
import { 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);           // GET /api/users
router.post("/", createUser);        // POST /api/users
router.put("/:id", updateUser);      // PUT /api/users/US001
router.delete("/:id", deleteUser);   // DELETE /api/users/US001

export default router;