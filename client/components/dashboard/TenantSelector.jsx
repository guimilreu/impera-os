"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { getAllCities, getEditionsByCity } from "@/lib/mock/tenants"

export function TenantSelector() {
  const { city, edition, setCity, setEdition, resetEdition } = useTenantStore()

  const cities = getAllCities()
  const editions = city ? getEditionsByCity(city.id) : []

  const handleCityChange = (cityId) => {
    const selectedCity = cities.find(c => c.id === parseInt(cityId))
    if (selectedCity) {
      setCity(selectedCity)
      resetEdition()
    }
  }

  const handleEditionChange = (editionId) => {
    const selectedEdition = editions.find(e => e.id === parseInt(editionId))
    if (selectedEdition) {
      setEdition(selectedEdition)
    }
  }

  return (
    <div className="flex items-center gap-1 relative">
      <Select 
        value={city?.id?.toString()} 
        onValueChange={handleCityChange}
      >
        <SelectTrigger className="w-[160px] h-9 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors mesh-accent-hover">
          <SelectValue placeholder="Selecione a cidade" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={edition?.id?.toString()} 
        onValueChange={handleEditionChange}
        disabled={!city}
      >
        <SelectTrigger className="w-[160px] h-9 border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors disabled:opacity-50 mesh-accent-hover">
          <SelectValue placeholder="Selecione a edição" />
        </SelectTrigger>
        <SelectContent>
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

