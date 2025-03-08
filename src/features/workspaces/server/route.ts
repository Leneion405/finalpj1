import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
.post(
    "/",
    zValidator("json", createWorkSpaceSchema),
    sessionMiddleware,
    async (c) => {
        const databases = c.get("databases");
        const user = c.get("user");
        const { name, image} = c.req.valid("json");
        const storage = c.get("storage");
        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
            const file = storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                image,
            )

            const arrayBuffer = await storage.getFilePreview(
                IMAGES_BUCKET_ID,
                 (await file).$id
            )
            uploadedImageUrl =`data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
        }
        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userID: user.$id,
                imageUrl: uploadedImageUrl,
            },
        )
        return c.json({data: workspace})
    }
)

export default app;