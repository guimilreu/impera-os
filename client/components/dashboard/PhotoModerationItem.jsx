"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Eye } from "lucide-react"
import { formatDateTime } from "@/lib/utils/format"

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
      label: 'Pendente',
      variant: 'secondary',
    },
    aprovado: {
      label: 'Aprovado',
      variant: 'default',
      className: 'bg-green-500',
    },
    reprovado: {
      label: 'Reprovado',
      variant: 'destructive',
    },
  }

  const config = statusConfigs[status] || statusConfigs.pendente

  return (
    <Card {...props}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={photo.url || '/prato.jpg'} alt="Foto" />
            <AvatarFallback>Foto</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium">{photo.pratoNome || 'Prato'}</p>
              <Badge variant={config.variant} className={config.className}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {photo.estabelecimentoNome || 'Estabelecimento'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDateTime(photo.horario || new Date())}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onView && (
              <Button variant="ghost" size="icon" onClick={() => onView(photo)} disabled={disabled}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {status === 'pendente' && (
              <>
                {onApprove && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onApprove(photo)}
                    className="text-green-600 hover:text-green-700"
                    disabled={disabled}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                {onReject && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onReject(photo)}
                    className="text-red-600 hover:text-red-700"
                    disabled={disabled}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

