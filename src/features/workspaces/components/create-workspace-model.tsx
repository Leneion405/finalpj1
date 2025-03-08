"use client";
import React from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import { ResponsiveModal } from "@/components/responsive-model";

const CreateWorkspaceModal = () => {
	return (
		<ResponsiveModal open onOpenChange={() => {}}>
			<CreateWorkspaceForm />
		</ResponsiveModal>
	);
};

export default CreateWorkspaceModal;