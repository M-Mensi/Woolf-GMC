const express = require("express");

module.exports = (controller) => {
  const router = express.Router();

  router.route("/").post(controller.create).get(controller.getAll);
  router
    .route("/:id")
    .get(controller.getOne)
    .put(controller.update)
    .delete(controller.delete);

  return router;
};
