"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/lib/state/useAuthStore"

// Mock de checklist
const mockChecklistItems = [
  { id: 1, item: 'Foto oficial entregue', checked: true },
  { id: 2, item: 'Cadastro completo', checked: true },
  { id: 3, item: 'Categorias confirmadas', checked: false },
  { id: 4, item: 'Cardápio validado', checked: true },
  { id: 5, item: 'Dados bancários', checked: false },
  { id: 6, item: 'Confirmação de horários', checked: true },
]

export default function ChecklistsPage() {
  const { role, estabelecimentoId } = useAuthStore()

  // Se for estabelecimento, mostrar apenas seu checklist
  // Se for admin/franqueado, mostrar todos
  const checklists = role === 'estabelecimento' 
    ? [{ id: estabelecimentoId || 1, nome: 'Meu Checklist', items: mockChecklistItems }]
    : [
        { id: 1, nome: 'Restaurante Sabor', items: mockChecklistItems },
        { id: 2, nome: 'Cantina Tradição', items: mockChecklistItems.map(i => ({ ...i, checked: !i.checked })) },
        { id: 3, nome: 'Bistrô Gourmet', items: mockChecklistItems },
      ]

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
        <p className="text-muted-foreground mt-1">Acompanhe o progresso dos checklists</p>
      </div>

      {checklists.map((checklist) => (
        <Card key={checklist.id}>
          <CardHeader>
            <CardTitle className="tracking-tight">{checklist.nome}</CardTitle>
            <CardDescription>Placeholder - Em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklist.items.map((item) => (
                  <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                    <TableCell>
                      <Checkbox checked={item.checked} disabled />
                    </TableCell>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>
                      {item.checked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Concluído</span>
                      ) : (
                        <span className="text-muted-foreground">Pendente</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

