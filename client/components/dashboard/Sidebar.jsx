"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LayoutDashboard,
	Building2,
	UtensilsCrossed,
	Award,
	Eye,
	FileText,
	ClipboardCheck,
	Settings,
	GraduationCap,
	Users,
	X,
	Briefcase,
	MessageSquare,
	Ticket,
	ShoppingCart,
	ChevronDown,
	ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/state/useAuthStore";

const menuItems = [
	// Seção: Principal
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		permission: "overview",
		section: "principal",
	},
	{
		title: "Estabelecimentos",
		href: "/dashboard/estabelecimentos",
		icon: Building2,
		permission: "estabelecimentos",
		section: "principal",
	},
	{
		title: "Receitas",
		href: "/dashboard/pratos",
		icon: UtensilsCrossed,
		permission: "pratos",
		section: "principal",
	},
	// Separador: Avaliação e Moderação
	{
		title: "Avaliação",
		href: "/dashboard/avaliacao",
		icon: Award,
		permission: "avaliacao",
		section: "avaliacao",
	},
	{
		title: "Moderação",
		href: "/dashboard/moderacao",
		icon: Eye,
		permission: "moderacao",
		section: "avaliacao",
	},
	{
		title: "Clientes",
		href: "/dashboard/clientes",
		icon: Users,
		permission: "clientes",
		section: "avaliacao",
	},
	// Separador: Gestão
	{
		title: "Gestão",
		icon: Briefcase,
		permission: "recados", // Permissão para ver a seção
		isSection: true,
		section: "gestao",
		children: [
			{
				title: "Recados",
				href: "/dashboard/gestao/recados",
				icon: MessageSquare,
				permission: "recados",
			},
			{
				title: "Convites",
				href: "/dashboard/gestao/convites",
				icon: Ticket,
				permission: "convites",
			},
			{
				title: "Vendas",
				href: "/dashboard/gestao/vendas",
				icon: ShoppingCart,
				permission: "vendas",
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
		],
	},
	// Separador: Educação
	{
		title: "Treinamentos",
		href: "/dashboard/treinamentos",
		icon: GraduationCap,
		permission: "treinamentos",
		section: "educacao",
	},
	// Separador: Sistema
	{
		title: "Configurações",
		href: "/dashboard/configuracoes",
		icon: Settings,
		permission: "configuracoes",
		section: "sistema",
	},
];

export function Sidebar({ className, mobileOpen, onClose }) {
	const pathname = usePathname();
	const { hasPermission, role } = useAuthStore();
	const [expandedSections, setExpandedSections] = useState({ "Gestão": true });

	// Filtra itens baseado em permissões
	const filteredItems = menuItems.filter((item) => {
		// Se não tem role ainda, não mostra nada
		if (!role) return false;
		
		// Se for uma seção com filhos, verifica se tem pelo menos um filho com permissão
		if (item.isSection && item.children) {
			return item.children.some(child => hasPermission(child.permission));
		}
		return hasPermission(item.permission);
	});

	// Agrupa itens por seção para renderização com separadores
	const groupedItems = filteredItems.reduce((acc, item) => {
		const section = item.section || "outros";
		if (!acc[section]) {
			acc[section] = [];
		}
		acc[section].push(item);
		return acc;
	}, {});

	// Define ordem e labels das seções
	const sectionOrder = [
		{ key: "principal", label: null }, // Sem label para principal
		{ key: "avaliacao", label: "Avaliação e Moderação" },
		{ key: "gestao", label: "Gestão" },
		{ key: "educacao", label: "Educação" },
		{ key: "sistema", label: "Sistema" },
		{ key: "outros", label: null }, // Sem label para outros
	];

	const toggleSection = (title) => {
		setExpandedSections(prev => ({
			...prev,
			[title]: !prev[title]
		}));
	};

	const renderMenuItem = (item, isChild = false) => {
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
						"group relative",
						isChild && "pl-8 text-sm"
					)}
					onClick={onClose}
				>
					<Icon
						className={cn(
							"mr-2 h-4 w-4 transition-colors",
							isActive
								? "text-primary"
								: "text-muted-foreground group-hover:text-foreground",
							isChild && "h-3.5 w-3.5"
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
	};

	const renderSectionItem = (item) => {
		const Icon = item.icon;
		const isExpanded = expandedSections[item.title];
		const hasActiveChild = item.children?.some(child => pathname === child.href);
		
		// Filtra filhos baseado em permissões
		const visibleChildren = item.children?.filter(child => hasPermission(child.permission)) || [];
		
		if (visibleChildren.length === 0) return null;

		return (
			<div key={item.title} className="space-y-1">
				<Button
					variant={"ghost"}
					className={cn(
						"w-full justify-start transition-all duration-200 cursor-pointer",
						hasActiveChild
							? "bg-[#e56d21]/5 hover:bg-[#e56d21]/10 text-secondary-foreground"
							: "hover:bg-[#e56d21]/5 hover:text-foreground mesh-sidebar-hover",
						"group relative"
					)}
					onClick={() => toggleSection(item.title)}
				>
					<Icon
						className={cn(
							"mr-2 h-4 w-4 transition-colors",
							hasActiveChild
								? "text-primary"
								: "text-muted-foreground group-hover:text-foreground"
						)}
					/>
					<span
						className={cn(
							"font-medium transition-colors flex-1 text-left",
							hasActiveChild
								? "text-secondary-foreground"
								: "text-muted-foreground group-hover:text-foreground"
						)}
					>
						{item.title}
					</span>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4 text-muted-foreground" />
					) : (
						<ChevronRight className="h-4 w-4 text-muted-foreground" />
					)}
				</Button>
				
				{isExpanded && (
					<div className="space-y-1">
						{visibleChildren.map((child) => renderMenuItem(child, true))}
					</div>
				)}
			</div>
		);
	};

	const renderSectionSeparator = (label, isFirst = false) => {
		if (!label) return null;
		return (
			<div className={cn(
				"px-3 mb-1",
				isFirst ? "mt-0 pt-2" : "mt-4 pt-3"
			)}>
				{!isFirst && (
					<div className="h-px bg-border/50 mb-2 -mx-3" />
				)}
				<span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
					{label}
				</span>
			</div>
		);
	};

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
				<div className="flex h-full flex-col overflow-hidden">
					<div className="flex items-center justify-between border-b p-4 md:hidden flex-shrink-0">
						<h2 className="text-lg font-semibold">Menu</h2>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<ScrollArea className="flex-1 min-h-0 px-3 py-4">
						<nav className="flex flex-col gap-1 relative">
							{sectionOrder.map((sectionInfo, index) => {
								const sectionItems = groupedItems[sectionInfo.key] || [];
								if (sectionItems.length === 0) return null;

								const isFirst = index === 0 || !sectionOrder.slice(0, index).some(s => groupedItems[s.key]?.length > 0);

								return (
									<div key={sectionInfo.key} className="relative">
										{renderSectionSeparator(sectionInfo.label, isFirst)}
										<div className="space-y-1">
											{sectionItems.map((item) => {
												if (item.isSection) {
													return renderSectionItem(item);
												}
												return renderMenuItem(item);
											})}
										</div>
									</div>
								);
							})}
						</nav>
					</ScrollArea>
				</div>
			</aside>
		</>
	);
}
