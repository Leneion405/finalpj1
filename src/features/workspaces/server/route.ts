import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createWorkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");

		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal("userId", user.$id),
		]);

		if (!members.total) {
			return c.json({
				data: { documents: [], total: 0 },
			});
		}

		const workspaceIds = members.documents.map((member) => {
			return member.workspaceId;
		});

		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
		);

		return c.json({
			data: workspaces,
		});
	})
	.post(
		"/",
		zValidator("json", createWorkSpaceSchema),
		sessionMiddleware,
		async (c) => {
			const databases = c.get("databases");
			const user = c.get("user");
			const storage = c.get("storage");
			const { name, image } = c.req.valid("json");

			let uploadedImageUrl: string | undefined ;

			if (image instanceof File ) {
				const file = await storage.createFile(
					IMAGES_BUCKET_ID,
					ID.unique(),
					image,
				);
				const  arrayBuffer = await storage.getFilePreview(
					IMAGES_BUCKET_ID,
					file.$id,
				)

				uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;


			}

			const workspaces = await databases.createDocument(
				DATABASE_ID,
				WORKSPACES_ID,
				ID.unique(),
				{
					name,
					userId: user.$id,
					imageUrl: uploadedImageUrl,
					inviteCode: generateInviteCode(6),
				}
			);

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				workspaceId: workspaces.$id,
				userId: user.$id,
				role: MemberRole.ADMIN,
			});

			return c.json({ data: workspaces });
		}
	);

export default app;