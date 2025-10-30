"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Settings } from "lucide-react"

export function DevPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [flags, setFlags] = useState({
    gps: searchParams.get("gps") || "",
    geofence: searchParams.get("geofence") || "",
    otp: searchParams.get("otp") || "",
    ai: searchParams.get("ai") || "",
    upload: searchParams.get("upload") || "",
    dupvote: searchParams.get("dupvote") || "",
    ratelimit: searchParams.get("ratelimit") || "",
  })

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(flags).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    params.set("dev", "1")
    router.replace(`/votar?${params.toString()}`, { scroll: false })
  }, [flags, router])

  const updateFlag = (key, value) => {
    setFlags((prev) => ({ ...prev, [key]: value || "" }))
  }

  if (!searchParams.has("dev")) return null

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700"
        >
          <Settings className="h-5 w-5" />
        </button>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Painel de Desenvolvimento</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold">GPS</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gps"
                      checked={flags.gps === ""}
                      onChange={() => updateFlag("gps", "")}
                    />
                    <span>Normal (mock)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gps"
                      checked={flags.gps === "denied"}
                      onChange={() => updateFlag("gps", "denied")}
                    />
                    <span>Negado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gps"
                      checked={flags.gps === "timeout"}
                      onChange={() => updateFlag("gps", "timeout")}
                    />
                    <span>Timeout</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gps"
                      checked={flags.gps === "fail"}
                      onChange={() => updateFlag("gps", "fail")}
                    />
                    <span>Erro</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Geofence</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="geofence"
                      checked={flags.geofence === ""}
                      onChange={() => updateFlag("geofence", "")}
                    />
                    <span>Dentro do raio</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="geofence"
                      checked={flags.geofence === "outside"}
                      onChange={() => updateFlag("geofence", "outside")}
                    />
                    <span>Fora do raio</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">OTP</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otp"
                      checked={flags.otp === ""}
                      onChange={() => updateFlag("otp", "")}
                    />
                    <span>Normal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otp"
                      checked={flags.otp === "wrong"}
                      onChange={() => updateFlag("otp", "wrong")}
                    />
                    <span>Código errado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otp"
                      checked={flags.otp === "expired"}
                      onChange={() => updateFlag("otp", "expired")}
                    />
                    <span>Expirado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="otp"
                      checked={flags.otp === "fail"}
                      onChange={() => updateFlag("otp", "fail")}
                    />
                    <span>Falha ao enviar</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Análise de IA</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ai"
                      checked={flags.ai === ""}
                      onChange={() => updateFlag("ai", "")}
                    />
                    <span>Sucesso</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ai"
                      checked={flags.ai === "fail"}
                      onChange={() => updateFlag("ai", "fail")}
                    />
                    <span>Falha</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Upload</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="upload"
                      checked={flags.upload === ""}
                      onChange={() => updateFlag("upload", "")}
                    />
                    <span>Sucesso</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="upload"
                      checked={flags.upload === "fail"}
                      onChange={() => updateFlag("upload", "fail")}
                    />
                    <span>Falha</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Voto Duplicado</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dupvote"
                      checked={flags.dupvote === ""}
                      onChange={() => updateFlag("dupvote", "")}
                    />
                    <span>Permitir</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dupvote"
                      checked={flags.dupvote === "yes"}
                      onChange={() => updateFlag("dupvote", "yes")}
                    />
                    <span>Bloquear</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Rate Limit</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ratelimit"
                      checked={flags.ratelimit === ""}
                      onChange={() => updateFlag("ratelimit", "")}
                    />
                    <span>Normal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ratelimit"
                      checked={flags.ratelimit === "yes"}
                      onChange={() => updateFlag("ratelimit", "yes")}
                    />
                    <span>Bloquear</span>
                  </label>
                </div>
              </div>

              <Button onClick={() => setIsOpen(false)} className="w-full">
                Fechar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

