"use client"

import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { getAllCities, getEditionsByCity, getAllEditions, getCityById, getEditionById } from "@/lib/mock/tenants"
import { MapPin } from "lucide-react"

export function TenantSelector() {
  const { city, edition, setCity, setEdition, resetEdition } = useTenantStore()
  const { role, user } = useAuthStore()

  // Sócio Local só pode ver sua própria cidade
  const isSocioLocal = role === 'socio_local'
  const socioLocalCidadeId = user?.cidadeId
  const socioLocalEdicaoId = user?.edicaoId

  // Se for sócio local, força apenas a cidade dele (não a edição - ele pode escolher)
  useEffect(() => {
    if (isSocioLocal && socioLocalCidadeId) {
      const cidadeSocio = getCityById(socioLocalCidadeId)
      if (cidadeSocio && (!city || city.id !== socioLocalCidadeId)) {
        setCity(cidadeSocio)
      }
    }
  }, [isSocioLocal, socioLocalCidadeId, city, setCity])

  const allCities = getAllCities()
  
  // Sócio Local só vê sua própria cidade
  const cities = isSocioLocal && socioLocalCidadeId
    ? allCities.filter(c => c.id === socioLocalCidadeId)
    : allCities

  // Se "Todas Cidades" estiver selecionado, mostra todas as edições
  // Caso contrário, mostra apenas as edições da cidade selecionada
  const allEditions = city ? getEditionsByCity(city.id) : getAllEditions()
  
  // Sócio Local só vê edições da sua cidade
  const editions = isSocioLocal && socioLocalCidadeId
    ? getEditionsByCity(socioLocalCidadeId)
    : allEditions

  const handleCityChange = (cityId) => {
    // Sócio Local não pode mudar cidade
    if (isSocioLocal) return
    
    if (cityId === "all") {
      setCity(null)
      // Não reseta a edição, permite selecionar edição mesmo com "Todas Cidades"
    } else {
      const selectedCity = cities.find(c => c.id === parseInt(cityId))
      if (selectedCity) {
        setCity(selectedCity)
        resetEdition()
      }
    }
  }

  const handleEditionChange = (editionId) => {
    if (editionId === "all") {
      setEdition(null)
    } else {
      const selectedEdition = editions.find(e => e.id === parseInt(editionId))
      if (selectedEdition) {
        setEdition(selectedEdition)
      }
    }
  }

  // Se for sócio local, mostra cidade fixa + seletor de edições
  if (isSocioLocal) {
    const cidadeNome = city?.name || getCityById(socioLocalCidadeId)?.name || 'Cidade'
    
    return (
      <div className="flex items-center gap-2">
        {/* Cidade fixa (não editável) */}
        <Badge variant="secondary" className="h-9 px-3 flex items-center gap-2 text-sm font-normal">
          <MapPin className="h-3.5 w-3.5" />
          <span>{cidadeNome}</span>
        </Badge>
        
        {/* Seletor de edições (editável) */}
        <Select 
          value={edition?.id?.toString() || "all"} 
          onValueChange={handleEditionChange}
        >
          <SelectTrigger className="w-[160px] h-9 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors mesh-accent-hover">
            <SelectValue placeholder="Selecione a edição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              Todas as Edições
            </SelectItem>
            {editions.map((e) => (
              <SelectItem key={e.id} value={e.id.toString()}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 relative">
      <Select 
        value={city?.id?.toString() || "all"} 
        onValueChange={handleCityChange}
      >
        <SelectTrigger className="min-w-[180px] w-auto h-9 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors mesh-accent-hover">
          <SelectValue placeholder="Selecione a cidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Todas as Cidades
          </SelectItem>
          {cities.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={edition?.id?.toString() || "all"} 
        onValueChange={handleEditionChange}
      >
        <SelectTrigger className="w-[160px] h-9 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors mesh-accent-hover">
          <SelectValue placeholder="Selecione a edição" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Todas as Edições
          </SelectItem>
          {editions.map((e) => (
            <SelectItem key={e.id} value={e.id.toString()}>
              {city ? e.name : `${e.name} (${allCities.find(c => c.id === e.cityId)?.name})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

