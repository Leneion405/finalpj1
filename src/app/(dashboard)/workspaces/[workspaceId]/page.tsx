import { getCurrent } from "@/features/auth/qurries";
import { redirect } from "next/navigation";

import React from "react";

const WorkspaceIdPage = async () => {
	const user = await getCurrent();
	if ( !user ) redirect("/sign-in");

	return (
	<div>
		workspace Id
	</div>
	)
};

export default WorkspaceIdPage;