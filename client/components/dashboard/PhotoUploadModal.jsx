"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, X, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function PhotoUploadModal({ open, onOpenChange, receita }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    const validFiles = []
    const newPreviews = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" não é uma imagem válida`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`"${file.name}" excede 5MB`)
        continue
      }

      validFiles.push(file)
      
      // Cria preview
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push({ file: file.name, preview: reader.result })
        if (newPreviews.length === validFiles.length) {
          setPreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  function handleRemoveFile(index) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function handleClearAll() {
    setSelectedFiles([])
    setPreviews([])
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      toast.error('Selecione pelo menos uma foto')
      return
    }

    setUploading(true)
    try {
      // Simula delay de upload
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aqui será feito o upload real para a API
      // const formData = new FormData()
      // selectedFiles.forEach((file, index) => {
      //   formData.append(`photos[${index}]`, file)
      // })
      // formData.append('pratoId', receita.id)
      // await api.uploadPhotos(formData)

      const quantidade = selectedFiles.length
      toast.success(`${quantidade} foto(s) de "${receita.nome || receita.name || 'receita'}" enviada(s) com sucesso! Aguardando aprovação do admin.`)
      
      // Limpa e fecha
      handleClearAll()
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao enviar fotos. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  if (!receita) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-purple-600" />
            Upload de Foto
          </DialogTitle>
          <DialogDescription>
            Envie várias fotos de "{receita.nome || receita.name || 'sem nome'}" - O admin escolherá a melhor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info da receita */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <Avatar className="h-12 w-12">
              <AvatarImage src={receita.foto || '/prato.jpg'} alt={receita.nome || receita.name || 'Receita'} />
              <AvatarFallback>{(receita.nome || receita.name || 'R').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{receita.nome || receita.name || 'Receita'}</p>
              <p className="text-sm text-muted-foreground">{receita.estabelecimentoNome || receita.categoria?.name || 'Receita'}</p>
            </div>
            {receita.foto && (
              <Badge variant="secondary" className="text-xs">
                Com foto
              </Badge>
            )}
          </div>

          {/* Preview da foto atual */}
          {receita.foto && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Foto atual aprovada:</p>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <img
                  src={receita.foto}
                  alt={receita.nome || receita.name || 'Receita'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Área de upload - sempre visível */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Envie suas fotos para aprovação:</p>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
                "border-purple-500/50"
              )}
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Selecione fotos</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você pode enviar múltiplas fotos (máx. 5MB cada)
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP • O admin escolherá a melhor
                </p>
              </div>
            </div>
          </div>

          {/* Preview das fotos selecionadas */}
          {previews.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{previews.length} foto(s) selecionada(s):</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover todas
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {previews.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-purple-500">
                      <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {selectedFiles[index]?.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>{selectedFiles.length} arquivo(s) pronto(s) para envio</span>
              </div>
            </div>
          )}

          {/* Observações */}
          {receita.observacoesRestaurante && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                Observações do restaurante:
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {receita.observacoesRestaurante}
              </p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              handleClearAll()
              onOpenChange(false)
            }}
            disabled={uploading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Foto
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

