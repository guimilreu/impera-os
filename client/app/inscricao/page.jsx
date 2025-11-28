"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  UtensilsCrossed, 
  Camera, 
  CreditCard, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Calendar,
  Instagram,
  Globe,
} from "lucide-react"
import { toast } from "sonner"
import { categorias } from "@/lib/mock/categorias"
import { getAllCities, getEditionsByCity } from "@/lib/mock/tenants"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils/format"

// Etapas do formulário
const STEPS = [
  { id: 1, title: "Dados do Estabelecimento", icon: Building2 },
  { id: 2, title: "Receita Participante", icon: UtensilsCrossed },
  { id: 3, title: "Agendamento da Foto", icon: Camera },
  { id: 4, title: "Pagamento", icon: CreditCard },
  { id: 5, title: "Confirmação", icon: CheckCircle2 },
]

// Horários disponíveis para foto
const HORARIOS_DISPONIVEIS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
]

// Preço da inscrição
const PRECO_INSCRICAO = 350

export default function InscricaoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Dados do estabelecimento
    nomeEstabelecimento: "",
    cnpj: "",
    endereco: "",
    bairro: "",
    cidade: "",
    edicao: "",
    telefone: "",
    whatsapp: "",
    email: "",
    instagram: "",
    website: "",
    horarioFuncionamento: "",
    responsavel: "",
    
    // Dados da receita
    nomeReceita: "",
    categoria: "",
    descricao: "",
    preco: "",
    ingredientes: "",
    restricoes: [],
    disponibilidade: "almoco_jantar",
    instagramReceita: "",
    
    // Agendamento da foto
    dataFoto: "",
    horarioFoto: "",
    observacoesFoto: "",
    
    // Dados de acesso
    senha: "",
    confirmarSenha: "",
    
    // Termos
    aceitaTermos: false,
    aceitaRegulamento: false,
  })

  const cities = getAllCities()
  const editions = formData.cidade ? getEditionsByCity(parseInt(formData.cidade)) : []

  function updateFormData(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleRestricaoChange(restricao, checked) {
    setFormData(prev => ({
      ...prev,
      restricoes: checked 
        ? [...prev.restricoes, restricao]
        : prev.restricoes.filter(r => r !== restricao)
    }))
  }

  function validateStep(step) {
    switch (step) {
      case 1:
        if (!formData.nomeEstabelecimento) {
          toast.error("Nome do estabelecimento é obrigatório")
          return false
        }
        if (!formData.cnpj) {
          toast.error("CNPJ é obrigatório")
          return false
        }
        if (!formData.endereco) {
          toast.error("Endereço é obrigatório")
          return false
        }
        if (!formData.cidade) {
          toast.error("Selecione a cidade")
          return false
        }
        if (!formData.edicao) {
          toast.error("Selecione a edição")
          return false
        }
        if (!formData.telefone) {
          toast.error("Telefone é obrigatório")
          return false
        }
        if (!formData.email) {
          toast.error("E-mail é obrigatório")
          return false
        }
        if (!formData.responsavel) {
          toast.error("Nome do responsável é obrigatório")
          return false
        }
        return true
        
      case 2:
        if (!formData.nomeReceita) {
          toast.error("Nome da receita é obrigatório")
          return false
        }
        if (!formData.categoria) {
          toast.error("Selecione a categoria")
          return false
        }
        if (!formData.descricao) {
          toast.error("Descrição da receita é obrigatória")
          return false
        }
        if (!formData.preco) {
          toast.error("Preço é obrigatório")
          return false
        }
        return true
        
      case 3:
        if (!formData.dataFoto) {
          toast.error("Selecione a data da sessão de fotos")
          return false
        }
        if (!formData.horarioFoto) {
          toast.error("Selecione o horário da sessão de fotos")
          return false
        }
        if (!formData.senha) {
          toast.error("Crie uma senha de acesso")
          return false
        }
        if (formData.senha.length < 6) {
          toast.error("A senha deve ter pelo menos 6 caracteres")
          return false
        }
        if (formData.senha !== formData.confirmarSenha) {
          toast.error("As senhas não conferem")
          return false
        }
        return true
        
      case 4:
        if (!formData.aceitaTermos) {
          toast.error("Você precisa aceitar os termos de uso")
          return false
        }
        if (!formData.aceitaRegulamento) {
          toast.error("Você precisa aceitar o regulamento do circuito")
          return false
        }
        return true
        
      default:
        return true
    }
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  function prevStep() {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  async function handleSubmit() {
    if (!validateStep(4)) return
    
    setLoading(true)
    try {
      // Simula envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Inscrição realizada com sucesso!")
      setCurrentStep(5)
    } catch (error) {
      toast.error("Erro ao processar inscrição. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Gera datas disponíveis (próximos 30 dias úteis)
  function getAvailableDates() {
    const dates = []
    const today = new Date()
    let count = 0
    
    while (dates.length < 20) {
      const date = new Date(today)
      date.setDate(today.getDate() + count)
      
      // Pula fins de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
      count++
    }
    
    return dates
  }

  const availableDates = getAvailableDates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Circuito Gastronômico</h1>
                <p className="text-xs text-muted-foreground">Inscrição de Estabelecimento</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Já tenho cadastro
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center transition-all",
                      isCompleted && "bg-green-500 text-white",
                      isActive && "bg-orange-500 text-white ring-4 ring-orange-200",
                      !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-800 text-gray-500"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-2 text-center max-w-[80px]",
                      isActive ? "font-semibold text-orange-600" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={cn(
                      "h-1 w-12 md:w-24 mx-2",
                      isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-800"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1: Dados do Estabelecimento */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Dados do Estabelecimento
              </CardTitle>
              <CardDescription>
                Preencha as informações do seu restaurante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nomeEstabelecimento">Nome do Estabelecimento *</Label>
                  <Input
                    id="nomeEstabelecimento"
                    placeholder="Ex: Restaurante Sabor da Terra"
                    value={formData.nomeEstabelecimento}
                    onChange={(e) => updateFormData('nomeEstabelecimento', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => updateFormData('cnpj', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Nome do Responsável *</Label>
                  <Input
                    id="responsavel"
                    placeholder="Nome completo"
                    value={formData.responsavel}
                    onChange={(e) => updateFormData('responsavel', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Select 
                    value={formData.cidade} 
                    onValueChange={(v) => {
                      updateFormData('cidade', v)
                      updateFormData('edicao', '')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edicao">Edição *</Label>
                  <Select 
                    value={formData.edicao} 
                    onValueChange={(v) => updateFormData('edicao', v)}
                    disabled={!formData.cidade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a edição" />
                    </SelectTrigger>
                    <SelectContent>
                      {editions.map((edition) => (
                        <SelectItem key={edition.id} value={edition.id.toString()}>
                          {edition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo *</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento"
                  value={formData.endereco}
                  onChange={(e) => updateFormData('endereco', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) => updateFormData('bairro', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                  <Input
                    id="horarioFuncionamento"
                    placeholder="Ex: Seg-Sex 11h-22h, Sáb-Dom 11h-23h"
                    value={formData.horarioFuncionamento}
                    onChange={(e) => updateFormData('horarioFuncionamento', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 0000-0000"
                    value={formData.telefone}
                    onChange={(e) => updateFormData('telefone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData('whatsapp', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@restaurante.com.br"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@seurestaurante"
                    value={formData.instagram}
                    onChange={(e) => updateFormData('instagram', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://www.seurestaurante.com.br"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Receita Participante */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                Receita Participante
              </CardTitle>
              <CardDescription>
                Cadastre o prato que participará do circuito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="nomeReceita">Nome da Receita *</Label>
                  <Input
                    id="nomeReceita"
                    placeholder="Ex: Risotto de Camarão ao Molho de Maracujá"
                    value={formData.nomeReceita}
                    onChange={(e) => updateFormData('nomeReceita', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(v) => updateFormData('categoria', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço *</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.preco}
                    onChange={(e) => updateFormData('preco', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Receita *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva seu prato de forma atrativa..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => updateFormData('descricao', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredientes">Ingredientes Principais</Label>
                <Textarea
                  id="ingredientes"
                  placeholder="Liste os ingredientes principais separados por vírgula..."
                  rows={2}
                  value={formData.ingredientes}
                  onChange={(e) => updateFormData('ingredientes', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Restrições Alimentares</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Vegano', 'Vegetariano', 'Sem Glúten', 'Sem Lactose', 'Low Carb', 'Kosher', 'Halal', 'Orgânico'].map((restricao) => (
                    <div key={restricao} className="flex items-center space-x-2">
                      <Checkbox
                        id={restricao}
                        checked={formData.restricoes.includes(restricao)}
                        onCheckedChange={(checked) => handleRestricaoChange(restricao, checked)}
                      />
                      <Label htmlFor={restricao} className="text-sm cursor-pointer">
                        {restricao}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="disponibilidade">Disponibilidade</Label>
                  <Select 
                    value={formData.disponibilidade} 
                    onValueChange={(v) => updateFormData('disponibilidade', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Quando está disponível?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="almoco_jantar">Almoço e Jantar</SelectItem>
                      <SelectItem value="almoco">Apenas Almoço</SelectItem>
                      <SelectItem value="jantar">Apenas Jantar</SelectItem>
                      <SelectItem value="todos">Todos os horários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagramReceita">Instagram da Receita</Label>
                  <Input
                    id="instagramReceita"
                    placeholder="Link do post ou @perfil"
                    value={formData.instagramReceita}
                    onChange={(e) => updateFormData('instagramReceita', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Agendamento da Foto */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-orange-500" />
                Agendamento da Foto
              </CardTitle>
              <CardDescription>
                Escolha a data e horário para a sessão de fotos profissional do seu prato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                  📸 Sessão de Fotos Profissional
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Nosso fotógrafo irá até seu estabelecimento para fotografar o prato inscrito. 
                  Certifique-se de que o prato estará pronto e apresentável no horário agendado.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataFoto">Data da Sessão *</Label>
                  <Select 
                    value={formData.dataFoto} 
                    onValueChange={(v) => updateFormData('dataFoto', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a data" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horarioFoto">Horário *</Label>
                  <Select 
                    value={formData.horarioFoto} 
                    onValueChange={(v) => updateFormData('horarioFoto', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {HORARIOS_DISPONIVEIS.map((horario) => (
                        <SelectItem key={horario} value={horario}>
                          {horario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoesFoto">Observações para o Fotógrafo</Label>
                <Textarea
                  id="observacoesFoto"
                  placeholder="Informações adicionais como ponto de referência, estacionamento, etc."
                  rows={3}
                  value={formData.observacoesFoto}
                  onChange={(e) => updateFormData('observacoesFoto', e.target.value)}
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Crie sua Senha de Acesso</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Você usará o e-mail <strong>{formData.email}</strong> e esta senha para acessar o sistema.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha *</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.senha}
                      onChange={(e) => updateFormData('senha', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Digite novamente"
                      value={formData.confirmarSenha}
                      onChange={(e) => updateFormData('confirmarSenha', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Pagamento */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Pagamento da Inscrição
              </CardTitle>
              <CardDescription>
                Revise os dados e confirme o pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo */}
              <div className="space-y-4">
                <h4 className="font-semibold">Resumo da Inscrição</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estabelecimento</p>
                    <p className="font-semibold">{formData.nomeEstabelecimento}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Receita</p>
                    <p className="font-semibold">{formData.nomeReceita}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-semibold">
                      {categorias.find(c => c.id.toString() === formData.categoria)?.name || '-'}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Sessão de Fotos</p>
                    <p className="font-semibold">
                      {formData.dataFoto && new Date(formData.dataFoto + 'T12:00:00').toLocaleDateString('pt-BR')} às {formData.horarioFoto}
                    </p>
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Valor da Inscrição</p>
                    <p className="text-3xl font-bold">{formatCurrency(PRECO_INSCRICAO)}</p>
                  </div>
                  <CreditCard className="h-12 w-12 opacity-50" />
                </div>
                <p className="text-sm text-orange-100 mt-2">
                  Inclui: participação no circuito + sessão de fotos profissional + materiais de divulgação
                </p>
              </div>

              {/* Termos */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onCheckedChange={(checked) => updateFormData('aceitaTermos', checked)}
                  />
                  <Label htmlFor="aceitaTermos" className="text-sm cursor-pointer leading-relaxed">
                    Li e aceito os <a href="#" className="text-orange-600 underline">Termos de Uso</a> e a{' '}
                    <a href="#" className="text-orange-600 underline">Política de Privacidade</a>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="aceitaRegulamento"
                    checked={formData.aceitaRegulamento}
                    onCheckedChange={(checked) => updateFormData('aceitaRegulamento', checked)}
                  />
                  <Label htmlFor="aceitaRegulamento" className="text-sm cursor-pointer leading-relaxed">
                    Li e aceito o <a href="#" className="text-orange-600 underline">Regulamento do Circuito Gastronômico</a>
                  </Label>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              <div className="space-y-3">
                <h4 className="font-semibold">Forma de Pagamento</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <CreditCard className="h-6 w-6" />
                    <span>Cartão de Crédito</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <span className="text-2xl">📱</span>
                    <span>PIX</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <span className="text-2xl">📄</span>
                    <span>Boleto</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmação */}
        {currentStep === 5 && (
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Inscrição Realizada com Sucesso!</h2>
              <p className="text-muted-foreground mb-6">
                Seu estabelecimento foi inscrito no Circuito Gastronômico.
              </p>

              <div className="max-w-md mx-auto space-y-4 text-left mb-8">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Próximos passos:</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Confirmação enviada para {formData.email}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Aguarde a confirmação do pagamento
                    </li>
                    <li className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-blue-600" />
                      Sessão de fotos: {formData.dataFoto && new Date(formData.dataFoto + 'T12:00:00').toLocaleDateString('pt-BR')} às {formData.horarioFoto}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push('/')}>
                  Voltar ao Início
                </Button>
                <Button onClick={() => router.push('/login')}>
                  Acessar Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Confirmar e Pagar
                    <CreditCard className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

