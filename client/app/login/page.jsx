"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, AlertCircle, LogIn } from "lucide-react"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { findUserByCredentials } from "@/lib/mock/users"
import { initializePratosForEstabelecimento } from "@/lib/mock/pratos"
import { delay } from "@/lib/utils/delay"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { isAuthenticated, login, logout } = useAuthStore()

  // Aguarda montagem do componente antes de verificar autenticação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redireciona se já estiver autenticado (após montagem e com delay mínimo)
  useEffect(() => {
    if (!mounted) return
    
    // Pequeno delay para garantir que o Zustand foi hidratado
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.push('/dashboard')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [mounted, isAuthenticated, router])

  // Função para limpar sessão (útil para testes)
  function handleClearSession() {
    logout()
    localStorage.removeItem('auth-storage')
    toast.success('Sessão limpa!')
  }

  // Não renderiza até montar (evita flash de conteúdo)
  if (!mounted) {
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simula delay de API
      await delay(600)

      // Validação básica
      if (!email || !password) {
        setError("Por favor, preencha todos os campos")
        setLoading(false)
        return
      }

      // Busca usuário
      const user = findUserByCredentials(email, password)

      if (!user) {
        setError("Email ou senha incorretos")
        setLoading(false)
        return
      }

      // Se for estabelecimento, verifica se é o primeiro login e inicializa pratos mockados
      if (user.role === 'estabelecimento' && user.estabelecimentoId) {
        const storageKey = `pratos_inicializados_${user.estabelecimentoId}`
        const pratosJaInicializados = localStorage.getItem(storageKey)
        
        if (!pratosJaInicializados) {
          // Primeiro login - inicializa pratos mockados
          const pratosCriados = initializePratosForEstabelecimento(user.estabelecimentoId)
          localStorage.setItem(storageKey, 'true')
          
          if (pratosCriados && pratosCriados.length > 0) {
            toast.success(`${pratosCriados.length} receitas iniciais criadas!`, {
              description: 'Você pode editá-las na página de Receitas',
            })
          }
        }
      }

      // Faz login
      login(user)
      toast.success(`Bem-vindo, ${user.name}!`)
      
      // Redireciona para dashboard
      router.push('/dashboard')
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-8">
        {/* Card de Login */}
        <Card className="shadow-xl border-0 shadow-slate-200/50 dark:shadow-slate-900/50">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-4 ring-primary/5">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Bem-vindo</CardTitle>
            <CardDescription className="text-base">
              Entre com suas credenciais para acessar o dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
          {isAuthenticated && (
          <Alert className="animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Você já está autenticado. Será redirecionado em instantes...
              </AlertDescription>
            </Alert>
          )}
      </div>
    </div>
  )
}

