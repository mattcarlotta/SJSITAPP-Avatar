import { deleteUserAvatar, updateUserAvatar } from "~controllers/avatars";
import { requireAuth, saveImage } from "~strategies";

export default (app) => {
  app.delete("/api/avatar/delete/:id", requireAuth, deleteUserAvatar);
  app.put("/api/avatar/update/:id", requireAuth, saveImage, updateUserAvatar);
};
