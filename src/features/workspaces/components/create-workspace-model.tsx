"use client";
import React from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import { ResponsiveModal } from "@/components/responsive-model";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

const CreateWorkspaceModal = () => {
	const { isOpen, setIsOpen, close} = useCreateWorkspaceModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateWorkspaceForm onCancel={close}/>
		</ResponsiveModal>
	);
};

export default CreateWorkspaceModal;