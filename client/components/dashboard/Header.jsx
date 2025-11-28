"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { TenantSelector } from "./TenantSelector";
import { useAuthStore } from "@/lib/state/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header({ onMenuClick }) {
	const { role, user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const roleLabels = {
		admin: "Administrador",
		socio_local: "Sócio Local",
		estabelecimento: "Estabelecimento",
		fotografo: "Fotógrafo",
		cliente: "Cliente",
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm flex items-center justify-center mesh-header-overlay">
			<div className="w-full flex h-[3.5rem] items-center gap-4 px-6 relative z-10">
				<Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={onMenuClick}>
					<Menu className="h-5 w-5" />
				</Button>

				<div className="flex flex-1 items-center justify-between gap-6">
					{/* Logo e Tenant Selector */}
					<div className="flex items-center gap-6 min-w-0 flex-1">
						<Image
							src="/logo-horizontal.png"
							alt="Prêmio Impera"
							width={200}
							height={24}
							className="h-6 w-auto object-contain flex-shrink-0"
							priority
						/>
						<TenantSelector />
					</div>

					{/* Ações do usuário */}
					<div className="flex items-center gap-2 flex-shrink-0">
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 relative hover:bg-muted/80 transition-colors mesh-accent-hover"
						>
							<Bell className="h-5 w-5" />
							<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-9 px-2 gap-2 rounded-lg hover:bg-muted/80 transition-colors mesh-accent-hover"
								>
									<Avatar className="h-8 w-8 ring-2 ring-border">
										<AvatarImage src="/background.png" alt="Avatar" />
										<AvatarFallback className="bg-primary/10 text-primary">
											<User className="h-4 w-4" />
										</AvatarFallback>
									</Avatar>
									<ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-64" align="end" forceMount>
								<DropdownMenuLabel className="font-normal p-3">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-semibold leading-none">{user?.name || "Usuário"}</p>
										<p className="text-xs leading-none text-muted-foreground truncate">
											{user?.email || "Email não disponível"}
										</p>
										<div className="pt-1">
											<span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
												{roleLabels[role] || role}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<User className="mr-2 h-4 w-4" />
									<span>Perfil</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Settings className="mr-2 h-4 w-4" />
									<span>Configurações</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="cursor-pointer text-destructive focus:text-destructive"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Sair</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
}
