// PATCH /users/:userId/role
router.patch(
    "/:userId/role",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            // Validate role
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { role },
                { new: true },
            );

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ user });
        } catch (error) {
            console.error("Error updating user role:", error);
            res.status(500).json({ message: "Failed to update user role" });
        }
    },
);
