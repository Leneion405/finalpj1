import { Account, Client, Databases, Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

export async function getWorkspaces() {
	try {
		const { databases, account } = await createSessionClient();
		const user = await account.get();

		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal("userId", user.$id),
		]);

		if (!members.total) {
			return { documents: [], total: 0 };
		}

		const workspaceIds = members.documents.map((member) => {
			return member.workspaceId;
		});

		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
		);

		return workspaces;
	} catch (error) {
		return { documents: [], total: 0 };
	}
}

interface getWorkspaceProps {
	workspaceId: string;
}

export const getWorkspace = async ({ workspaceId} : getWorkspaceProps) => {
	try {
		
		const { databases, account } = await createSessionClient();
		const user = await account.get();

		const member = await getMember({
			databases,
			userId: user.$id,
			workspaceId,
		})

		if (!member) {
			return null;
		}

		const workspace = await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId,
		);

		return workspace;
	} catch (error) {
		return null;
	}
}

interface getWorkspaceInfoProps {
	workspaceId: string;
}

export const getWorkspaceInfo = async ({ workspaceId} : getWorkspaceInfoProps) => {
	try {
		
		const { databases } = await createSessionClient();

		const workspace = await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId,
		);

		return { name: workspace.name };
	} catch  {
		return null;
	}
}