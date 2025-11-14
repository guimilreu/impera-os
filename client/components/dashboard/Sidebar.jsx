"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LayoutDashboard,
	MapPin,
	Calendar,
	Building2,
	UtensilsCrossed,
	Vote,
	Shield,
	Eye,
	FileText,
	ClipboardCheck,
	Settings,
	X,
} from "lucide-react";
import { useAuthStore } from "@/lib/state/useAuthStore";

const menuItems = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		permission: "overview",
	},
	{
		title: "Cidades",
		href: "/dashboard/cidades",
		icon: MapPin,
		permission: "cidades",
	},
	{
		title: "Edições",
		href: "/dashboard/edicoes",
		icon: Calendar,
		permission: "edicoes",
	},
	{
		title: "Estabelecimentos",
		href: "/dashboard/estabelecimentos",
		icon: Building2,
		permission: "estabelecimentos",
	},
	{
		title: "Pratos",
		href: "/dashboard/pratos",
		icon: UtensilsCrossed,
		permission: "pratos",
	},
	{
		title: "Votos",
		href: "/dashboard/votos",
		icon: Vote,
		permission: "votos",
	},
	{
		title: "Auditoria",
		href: "/dashboard/auditoria",
		icon: Shield,
		permission: "auditoria",
	},
	{
		title: "Moderação",
		href: "/dashboard/moderacao",
		icon: Eye,
		permission: "moderacao",
	},
	{
		title: "Relatórios",
		href: "/dashboard/relatorios",
		icon: FileText,
		permission: "relatorios",
	},
	{
		title: "Checklists",
		href: "/dashboard/checklists",
		icon: ClipboardCheck,
		permission: "checklists",
	},
	{
		title: "Configurações",
		href: "/dashboard/configuracoes",
		icon: Settings,
		permission: "configuracoes",
	},
];

export function Sidebar({ className, mobileOpen, onClose }) {
	const pathname = usePathname();
	const { hasPermission } = useAuthStore();

	const filteredItems = menuItems.filter((item) => hasPermission(item.permission));

	return (
		<>
			{/* Overlay mobile */}
			{mobileOpen && (
				<div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform md:translate-x-0",
					mobileOpen ? "translate-x-0" : "-translate-x-full",
					className
				)}
			>
				<div className="flex h-full flex-col">
					<div className="flex items-center justify-between border-b p-4 md:hidden">
						<h2 className="text-lg font-semibold">Menu</h2>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<ScrollArea className="flex-1 px-3 py-4">
						<nav className="flex flex-col gap-1">
							{filteredItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;

								return (
									<Link key={item.href} href={item.href}>
										<Button
											variant={"ghost"}
											className={cn(
												"w-full justify-start transition-all duration-200 cursor-pointer",
												isActive
													? "bg-[#e56d21]/5 hover:bg-[#e56d21]/10 text-secondary-foreground border border-[#e56d21]/30 mesh-sidebar-active"
													: "hover:bg-[#e56d21]/5 hover:text-foreground mesh-sidebar-hover",
												"group relative"
											)}
											onClick={onClose}
										>
											<Icon
												className={cn(
													"mr-2 h-4 w-4 transition-colors",
													isActive
														? "text-primary"
														: "text-muted-foreground group-hover:text-foreground"
												)}
											/>
											<span
												className={cn(
													"font-medium transition-colors",
													isActive
														? "text-secondary-foreground"
														: "text-muted-foreground group-hover:text-foreground"
												)}
											>
												{item.title}
											</span>
										</Button>
									</Link>
								);
							})}
						</nav>
					</ScrollArea>
				</div>
			</aside>
		</>
	);
}
