"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Eye, AlertTriangle, ImageIcon } from "lucide-react"
import { formatDateTime } from "@/lib/utils/format"
import { cn } from "@/lib/utils"

export function PhotoModerationItem({ 
  photo, 
  status, 
  onApprove, 
  onReject, 
  onView,
  disabled = false,
  ...props 
}) {
  const statusConfigs = {
    pendente: {
      label: 'Aguardando Aprovação',
      variant: 'secondary',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    },
    aprovada: {
      label: 'Aprovada ✓ Foto Oficial',
      variant: 'default',
      icon: CheckCircle2,
      color: 'text-green-600',
      className: 'bg-green-100 text-green-700 border-green-300',
    },
    aprovado: {
      label: 'Aprovada ✓ Foto Oficial',
      variant: 'default',
      icon: CheckCircle2,
      color: 'text-green-600',
      className: 'bg-green-100 text-green-700 border-green-300',
    },
    rejeitada: {
      label: 'Rejeitada',
      variant: 'destructive',
      icon: XCircle,
      color: 'text-red-600',
      className: 'bg-red-100 text-red-700 border-red-300',
    },
    reprovado: {
      label: 'Rejeitada',
      variant: 'destructive',
      icon: XCircle,
      color: 'text-red-600',
      className: 'bg-red-100 text-red-700 border-red-300',
    },
  }

  const config = statusConfigs[status] || statusConfigs.pendente
  const StatusIcon = config.icon

  return (
    <Card {...props} className={cn(
      "transition-all hover:shadow-md",
      status === 'aprovada' && "border-green-500 bg-green-50/30",
      status === 'rejeitada' && "border-red-300 opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Preview da foto */}
          <div className="relative">
            <div className="h-24 w-24 rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center relative">
              {(photo.url || photo.thumbnailUrl) ? (
                <>
                  <img 
                  src={photo.url || photo.thumbnailUrl} 
                  alt={photo.pratoNome || 'Foto do prato'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fallback = e.target.parentElement?.querySelector('.image-fallback')
                    if (fallback) {
                      e.target.style.display = 'none'
                      fallback.style.display = 'flex'
                    }
                  }}
                  onLoad={(e) => {
                    const fallback = e.target.parentElement?.querySelector('.image-fallback')
                    if (fallback) {
                      fallback.style.display = 'none'
                    }
                  }}
                />
                <div className="image-fallback absolute inset-0 flex items-center justify-center bg-muted" style={{ display: 'none' }}>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            {status === 'aprovada' && (
              <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 z-10">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <p className="font-semibold text-base truncate">{photo.pratoNome || 'Prato'}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {photo.estabelecimentoNome || 'Estabelecimento'}
                </p>
              </div>
              <Badge variant={config.variant} className={cn("shrink-0 text-xs", config.className)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                📸 Enviada por <strong>{photo.fotografoNome || 'Fotógrafo'}</strong>
              </p>
              <p>
                🕒 {photo.dataEnvio || photo.horario ? formatDateTime(photo.dataEnvio || photo.horario) : 'Data não disponível'}
              </p>
              {photo.moderadoPor && photo.dataModeração && (
                <p className="text-blue-600">
                  ✓ Moderada por <strong>{photo.moderadoPor}</strong> em {formatDateTime(photo.dataModeração)}
                </p>
              )}
            </div>

            {photo.motivoRejeicao && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <strong>Motivo da rejeição:</strong> {photo.motivoRejeicao}
              </div>
            )}

            {photo.observacoes && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                <strong>Observações:</strong> {photo.observacoes}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2">
            {onView && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(photo)} 
                disabled={disabled}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            )}
            
            {status === 'pendente' && (
              <>
                {onApprove && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => onApprove(photo)}
                    className="bg-green-600 hover:bg-green-700 w-full"
                    disabled={disabled}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                )}
                {onReject && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onReject(photo)}
                    disabled={disabled}
                    className="w-full text-white"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                )}
              </>
            )}

            {status === 'aprovada' && (
              <div className="text-xs text-center text-green-700 font-medium bg-green-100 py-2 px-3 rounded border border-green-300">
                ✓ Foto Oficial
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
