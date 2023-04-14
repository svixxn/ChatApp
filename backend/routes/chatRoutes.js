const express = require("express")
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatController");
const {protect} = require("../middlewares/authMiddleware");

const router = express.Router()

router.route('/').post(protect, accessChat).get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat)
router.route("/rename").patch(protect, renameGroup)
router.route("/groupremove").patch(protect, removeFromGroup)
router.route("/groupadd").patch(protect, addToGroup)

module.exports = router
