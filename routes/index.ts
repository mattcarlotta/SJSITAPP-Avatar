import { Router } from "express";
import { deleteUserAvatar, updateUserAvatar } from "~controllers";
import requireAuth from "~strategies";

const router = Router();

router.delete("/avatar/delete/:id", requireAuth, deleteUserAvatar);
router.put("/avatar/update/:id", requireAuth, updateUserAvatar);

export default router;
