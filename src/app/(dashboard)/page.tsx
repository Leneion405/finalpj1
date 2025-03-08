import { getCurrent } from "@/features/auth/action";
import { getWorkspaces } from "@/features/workspaces/action";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";

import { redirect } from "next/navigation";

export default async function Home() {
	const user = await getCurrent();
	if (!user) redirect("/sign-in");

	return(
		<div className="bg-neutral-500 p-">
			<CreateWorkspaceForm />
		</div>
	)
}