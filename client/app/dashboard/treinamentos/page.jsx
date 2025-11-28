"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	FileText,
	Search,
	BookOpen,
	ExternalLink,
	Plus,
	Pencil,
	Trash2,
	Play,
	Clock,
	Video,
	FileText as FileTextIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { DashboardSkeleton } from "@/components/dashboard/Skeletons";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay";
import {
	getTreinamentos,
	getTreinamentosByCategoria,
	categoriasTreinamento,
	addTreinamento,
	updateTreinamento,
	deleteTreinamento,
} from "@/lib/mock/treinamentos";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePermissions } from "@/lib/permissions";
import { useAuthStore } from "@/lib/state/useAuthStore";
import { toast } from "sonner";

const emptyFormData = {
	tipo: "video",
	titulo: "",
	descricao: "",
	duracao: "",
	url: "",
	conteudo: "",
	categoria: "introducao",
};

export default function TreinamentosPage() {
	const { user } = useAuthStore();
	const permissions = usePermissions(user?.role);

	const [loading, setLoading] = useState(true);
	const [treinamentos, setTreinamentos] = useState([]);
	const [filteredTreinamentos, setFilteredTreinamentos] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
	const [selectedTreinamento, setSelectedTreinamento] = useState(null);

	// Estados para moderação (admin)
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingTreinamento, setEditingTreinamento] = useState(null);
	const [formData, setFormData] = useState(emptyFormData);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [treinamentoToDelete, setTreinamentoToDelete] = useState(null);
	const [saving, setSaving] = useState(false);

	const canCreate = permissions.canCreate("treinamentos");
	const canEdit = permissions.canEdit("treinamentos");
	const canDelete = permissions.canDelete("treinamentos");
	const isAdmin = canCreate || canEdit || canDelete;

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		filterTreinamentos();
	}, [searchTerm, categoriaAtiva, treinamentos]);

	async function loadData() {
		setLoading(true);
		try {
			await delay(DEFAULT_DELAY);
			const data = getTreinamentos();
			setTreinamentos(data);
		} catch (error) {
			console.error("Erro ao carregar treinamentos:", error);
		} finally {
			setLoading(false);
		}
	}

	function filterTreinamentos() {
		let filtered =
			categoriaAtiva === "todos" ? [...treinamentos] : treinamentos.filter((t) => t.categoria === categoriaAtiva);

		if (searchTerm) {
			filtered = filtered.filter(
				(t) =>
					t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
					t.descricao.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredTreinamentos(filtered.sort((a, b) => a.ordem - b.ordem));
	}

	// Funções de moderação
	function handleOpenCreateModal() {
		setEditingTreinamento(null);
		setFormData(emptyFormData);
		setFormModalOpen(true);
	}

	function handleOpenEditModal(treinamento, e) {
		e?.stopPropagation();
		setEditingTreinamento(treinamento);
		setFormData({
			tipo: treinamento.tipo,
			titulo: treinamento.titulo,
			descricao: treinamento.descricao,
			duracao: treinamento.duracao || "",
			url: treinamento.url || "",
			conteudo: treinamento.conteudo || "",
			categoria: treinamento.categoria,
		});
		setFormModalOpen(true);
	}

	function handleOpenDeleteDialog(treinamento, e) {
		e?.stopPropagation();
		setTreinamentoToDelete(treinamento);
		setDeleteDialogOpen(true);
	}

	async function handleSave() {
		if (!formData.titulo.trim()) {
			toast.error("O título é obrigatório");
			return;
		}
		if (!formData.descricao.trim()) {
			toast.error("A descrição é obrigatória");
			return;
		}
		if (formData.tipo === "video" && !formData.url.trim()) {
			toast.error("A URL do vídeo é obrigatória");
			return;
		}
		if (formData.tipo === "texto" && !formData.conteudo.trim()) {
			toast.error("O conteúdo do documento é obrigatório");
			return;
		}

		setSaving(true);
		try {
			await delay(500); // Simula salvamento

			const dadosParaSalvar = {
				tipo: formData.tipo,
				titulo: formData.titulo.trim(),
				descricao: formData.descricao.trim(),
				categoria: formData.categoria,
				...(formData.tipo === "video"
					? {
							duracao: formData.duracao.trim() || "00:00",
							url: formData.url.trim(),
							thumbnail: "/video-thumb.jpg",
					  }
					: {
							conteudo: formData.conteudo.trim(),
					  }),
			};

			if (editingTreinamento) {
				// Editando
				updateTreinamento(editingTreinamento.id, dadosParaSalvar);
				toast.success("Treinamento atualizado com sucesso!");
			} else {
				// Criando
				addTreinamento(dadosParaSalvar);
				toast.success("Treinamento criado com sucesso!");
			}

			// Recarrega os dados
			const data = getTreinamentos();
			setTreinamentos(data);
			setFormModalOpen(false);
		} catch (error) {
			console.error("Erro ao salvar:", error);
			toast.error("Erro ao salvar treinamento");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete() {
		if (!treinamentoToDelete) return;

		try {
			await delay(500); // Simula exclusão
			deleteTreinamento(treinamentoToDelete.id);
			toast.success("Treinamento excluído com sucesso!");

			// Recarrega os dados
			const data = getTreinamentos();
			setTreinamentos(data);
			setDeleteDialogOpen(false);
			setTreinamentoToDelete(null);
		} catch (error) {
			console.error("Erro ao excluir:", error);
			toast.error("Erro ao excluir treinamento");
		}
	}

	if (loading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="space-y-6">
			<Breadcrumb />

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Treinamentos</h1>
					<p className="text-muted-foreground mt-1">Vídeos e materiais de capacitação para Sócios Locais</p>
				</div>

				{/* Botão de adicionar - apenas para admin */}
				{canCreate && (
					<Button onClick={handleOpenCreateModal} className="gap-2">
						<Plus className="h-4 w-4" />
						Novo Treinamento
					</Button>
				)}
			</div>

			{/* Filtros */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar treinamentos..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>
			</div>

			{/* Tabs por Categoria */}
			<Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva} className="space-y-4">
				<TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
					<TabsTrigger
						value="todos"
						className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
					>
						📚 Todos
					</TabsTrigger>
					{categoriasTreinamento.map((cat) => (
						<TabsTrigger
							key={cat.id}
							value={cat.id}
							className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
						>
							{cat.icon} {cat.nome}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={categoriaAtiva} className="mt-6">
					{filteredTreinamentos.length === 0 ? (
						<EmptyState
							icon={BookOpen}
							title="Nenhum treinamento encontrado"
							description={
								canCreate
									? "Clique em 'Novo Treinamento' para adicionar o primeiro."
									: "Tente ajustar os filtros ou buscar por outro termo."
							}
						/>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredTreinamentos.map((treinamento) => (
								<div
									key={treinamento.id}
									className="group cursor-pointer relative"
									onClick={() => setSelectedTreinamento(treinamento)}
								>
									{/* Botões de ação - apenas para admin */}
									{isAdmin && (
										<div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											{canEdit && (
												<Button
													size="icon"
													variant="secondary"
													className="h-8 w-8 shadow-md"
													onClick={(e) => handleOpenEditModal(treinamento, e)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
											)}
											{canDelete && (
												<Button
													size="icon"
													variant="destructive"
													className="h-8 w-8 shadow-md text-white"
													onClick={(e) => handleOpenDeleteDialog(treinamento, e)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											)}
										</div>
									)}

									<div className="relative aspect-video rounded-lg bg-muted overflow-hidden mb-2">
										<div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
											{treinamento.tipo === "video" ? (
												<div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
													<div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-800 border-b-8 border-b-transparent ml-1" />
												</div>
											) : (
												<div className="text-4xl">📄</div>
											)}
										</div>
										{treinamento.tipo === "video" && (
											<span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
												{treinamento.duracao}
											</span>
										)}
									</div>
									<h4 className="font-medium text-sm line-clamp-1">{treinamento.titulo}</h4>
									<p className="text-xs text-muted-foreground line-clamp-2">
										{treinamento.descricao}
									</p>
								</div>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Modal de Visualização */}
			<Dialog open={!!selectedTreinamento} onOpenChange={() => setSelectedTreinamento(null)}>
				<DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
					{selectedTreinamento && (
						<>
							<DialogHeader>
								<div className="flex items-center gap-2 mb-3">
									<Badge variant="secondary" className="gap-1.5">
										{selectedTreinamento.tipo === "video" ? (
											<><Video className="h-3.5 w-3.5" /> Vídeo</>
										) : (
											<><FileText className="h-3.5 w-3.5" /> Documento</>
										)}
									</Badge>
									<Badge variant="outline">
										{categoriasTreinamento.find((c) => c.id === selectedTreinamento.categoria)?.icon}{" "}
										{categoriasTreinamento.find((c) => c.id === selectedTreinamento.categoria)?.nome}
									</Badge>
									{selectedTreinamento.tipo === "video" && selectedTreinamento.duracao && (
										<Badge variant="outline" className="ml-auto">
											<Clock className="h-3.5 w-3.5 mr-1" />
											{selectedTreinamento.duracao}
										</Badge>
									)}
								</div>
								<DialogTitle className="text-2xl tracking-tight">{selectedTreinamento.titulo}</DialogTitle>
								<DialogDescription className="text-base mt-2">{selectedTreinamento.descricao}</DialogDescription>
							</DialogHeader>

							<div className="space-y-6 py-4">
								{selectedTreinamento.tipo === "video" ? (
									<>
										{/* Player de vídeo */}
										<div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
											{/* Overlay escuro */}
											<div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
											
											{/* Botão de play central */}
											<div className="absolute inset-0 flex items-center justify-center">
												<a 
													href={selectedTreinamento.url} 
													target="_blank" 
													rel="noopener noreferrer"
													className="group"
												>
													<div className="relative">
														{/* Animação pulse */}
														<div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30" />
														
														{/* Botão de play */}
														<div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 cursor-pointer">
															<Play className="h-6 w-6 md:h-8 md:w-8 text-white ml-1" fill="white" />
														</div>
													</div>
												</a>
											</div>
											
											{/* Info bar inferior */}
											<div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
												<div className="flex items-center justify-between text-white">
													<div className="flex items-center gap-2 text-xs">
														<Video className="h-3.5 w-3.5 text-red-400" />
														<span className="text-white/80">YouTube</span>
													</div>
													{selectedTreinamento.duracao && (
														<div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded text-xs">
															<Clock className="h-3.5 w-3.5" />
															{selectedTreinamento.duracao}
														</div>
													)}
												</div>
											</div>
										</div>
										
										{/* Botões de ação */}
										<div className="flex flex-col sm:flex-row gap-3">
											<Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" asChild>
												<a href={selectedTreinamento.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
													<Play className="h-4 w-4 mr-2" fill="white" />
													Assistir no YouTube
												</a>
											</Button>
											<Button variant="outline" asChild>
												<a href={selectedTreinamento.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
													<ExternalLink className="h-4 w-4 mr-2" />
													Abrir em nova aba
												</a>
											</Button>
										</div>
										
										{/* Dica */}
										<div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
											<div className="p-2 bg-muted rounded-lg">
												<BookOpen className="h-5 w-5 text-muted-foreground" />
											</div>
											<div>
												<p className="font-medium text-sm mb-1">Dica de estudo</p>
												<p className="text-sm text-muted-foreground">
													Assista o vídeo completo e faça anotações dos pontos principais. 
													Você pode pausar e voltar sempre que precisar revisar algum conceito.
												</p>
											</div>
										</div>
									</>
								) : (
									<>
										{/* Conteúdo do documento */}
										<div className="prose prose-sm dark:prose-invert max-w-none p-6 bg-muted/30 rounded-lg border">
											<div 
												dangerouslySetInnerHTML={{ 
													__html: selectedTreinamento.conteudo
														.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
														.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
														.replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-4 mb-2">$1</h3>')
														.replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
														.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
														.replace(/\n/gim, '<br />')
												}} 
											/>
										</div>
										
										{/* Dica */}
										<div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
											<div className="p-2 bg-muted rounded-lg">
												<FileText className="h-5 w-5 text-muted-foreground" />
											</div>
											<div>
												<p className="font-medium text-sm mb-1">Material de consulta</p>
												<p className="text-sm text-muted-foreground">
													Este documento pode ser consultado a qualquer momento. 
													Salve os pontos mais importantes para referência futura.
												</p>
											</div>
										</div>
									</>
								)}
							</div>

							{/* Botões de ação - apenas para admin */}
							{isAdmin && (
								<DialogFooter className="gap-2 sm:gap-0">
									{canEdit && (
										<Button
											variant="outline"
											onClick={() => {
												setSelectedTreinamento(null);
												handleOpenEditModal(selectedTreinamento);
											}}
											className="inline-flex items-center justify-center"
										>
											<Pencil className="h-4 w-4 mr-2" />
											Editar
										</Button>
									)}
									{canDelete && (
										<Button
											variant="destructive"
											className="text-white inline-flex items-center justify-center"
											onClick={() => {
												setSelectedTreinamento(null);
												handleOpenDeleteDialog(selectedTreinamento);
											}}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Excluir
										</Button>
									)}
								</DialogFooter>
							)}
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* Modal de Criar/Editar Treinamento */}
			<Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
				<DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{editingTreinamento ? "Editar Treinamento" : "Novo Treinamento"}</DialogTitle>
						<DialogDescription>
							{editingTreinamento
								? "Atualize as informações do treinamento abaixo."
								: "Preencha as informações para criar um novo treinamento."}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{/* Tipo */}
						<div className="space-y-2">
							<Label>Tipo de Conteúdo</Label>
							<div className="flex gap-2">
								<Button
									type="button"
									variant={formData.tipo === "video" ? "default" : "outline"}
									className="flex-1 gap-2"
									onClick={() => setFormData({ ...formData, tipo: "video" })}
								>
									<Video className="h-4 w-4" />
									Vídeo
								</Button>
								<Button
									type="button"
									variant={formData.tipo === "texto" ? "default" : "outline"}
									className="flex-1 gap-2"
									onClick={() => setFormData({ ...formData, tipo: "texto" })}
								>
									<FileTextIcon className="h-4 w-4" />
									Documento
								</Button>
							</div>
						</div>

						{/* Título */}
						<div className="space-y-2">
							<Label htmlFor="titulo">Título *</Label>
							<Input
								id="titulo"
								placeholder="Ex: Como prospectar restaurantes"
								value={formData.titulo}
								onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
							/>
						</div>

						{/* Descrição */}
						<div className="space-y-2">
							<Label htmlFor="descricao">Descrição *</Label>
							<Textarea
								id="descricao"
								placeholder="Breve descrição do conteúdo..."
								value={formData.descricao}
								onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
								rows={2}
							/>
						</div>

						{/* Categoria */}
						<div className="space-y-2">
							<Label>Categoria</Label>
							<Select
								value={formData.categoria}
								onValueChange={(value) => setFormData({ ...formData, categoria: value })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{categoriasTreinamento.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.icon} {cat.nome}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Campos específicos para vídeo */}
						{formData.tipo === "video" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="url">URL do YouTube *</Label>
									<Input
										id="url"
										placeholder="https://youtube.com/watch?v=..."
										value={formData.url}
										onChange={(e) => setFormData({ ...formData, url: e.target.value })}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="duracao">Duração</Label>
									<Input
										id="duracao"
										placeholder="Ex: 12:34"
										value={formData.duracao}
										onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
									/>
								</div>
							</>
						)}

						{/* Campos específicos para documento */}
						{formData.tipo === "texto" && (
							<div className="space-y-2">
								<Label htmlFor="conteudo">Conteúdo (Markdown) *</Label>
								<Textarea
									id="conteudo"
									placeholder="# Título&#10;&#10;## Subtítulo&#10;&#10;Conteúdo do documento..."
									value={formData.conteudo}
									onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
									rows={10}
									className="font-mono text-sm"
								/>
								<p className="text-xs text-muted-foreground">
									Use Markdown: # para títulos, ## para subtítulos, - para listas, **texto** para
									negrito
								</p>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setFormModalOpen(false)} disabled={saving}>
							Cancelar
						</Button>
						<Button onClick={handleSave} disabled={saving}>
							{saving ? "Salvando..." : editingTreinamento ? "Salvar Alterações" : "Criar Treinamento"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog de Confirmação de Exclusão */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Excluir Treinamento</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir o treinamento "{treinamentoToDelete?.titulo}"?
							<br />
							Esta ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-white hover:bg-destructive/90"
						>
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
