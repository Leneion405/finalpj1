import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";


export const Sidebar = () => {
	return (
		<aside className="h-full bg-neutral-100 p-4 w-full">
			<Link href="/">
				<Image src="/logo.svg" alt="logo" width={168} height={90} />
			</Link>
			<DottedSeparator className="my-4" />

			<DottedSeparator className="my-7" />
			<Navigation />
		</aside>
	);
};
