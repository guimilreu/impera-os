import { useState, useEffect, useRef, useMemo } from "react"

export function useMobileGuard() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      )
      const isMobileWidth = window.innerWidth <= 1024
      setIsMobile(isMobileUA || isMobileWidth)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, isClient }
}

export function useGPS() {
  const [status, setStatus] = useState({ loading: false, data: null, error: null })

  const getGPS = async () => {
    setStatus({ loading: true, data: null, error: null })
    try {
      const { getGPSStatus } = await import("./mockApi")
      const result = await getGPSStatus()
      if (result.error) {
        setStatus({ loading: false, data: null, error: result.error })
      } else {
        setStatus({ loading: false, data: result, error: null })
      }
    } catch (error) {
      setStatus({ loading: false, data: null, error: error.message || "Erro ao obter GPS" })
    }
  }

  return { data: status.data, error: status.error, loading: status.loading, getGPS }
}

export function useCamera() {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [facingMode, setFacingMode] = useState('environment') // 'environment' = traseira, 'user' = frontal
  const facingModeRef = useRef('environment') // Ref para manter valor atualizado

  const startCamera = async (preferredFacingMode = 'environment') => {
    setLoading(true)
    setError(null)
    
    // Para a stream atual se existir
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Seu navegador não suporta acesso à câmera")
      setLoading(false)
      return
    }

    try {
      // Tenta usar facingMode primeiro (suportado em mobile)
      let constraints = {
        video: {
          facingMode: preferredFacingMode,
          aspectRatio: 3/4, // Formato 3:4 (portrait)
        },
        audio: false,
      }
      
      let mediaStream
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (facingModeError) {
        // Se facingMode falhar, tenta com deviceId ou configuração básica
        console.warn("Erro com facingMode, tentando configuração alternativa:", facingModeError)
        constraints = {
          video: {
            aspectRatio: 3/4,
          },
          audio: false,
        }
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      }
      
      setStream(mediaStream)
      setFacingMode(preferredFacingMode)
      facingModeRef.current = preferredFacingMode // Atualiza a ref
      setLoading(false)
    } catch (err) {
      console.error("Erro ao acessar câmera:", err)
      let errorMessage = "Permissão de câmera negada ou câmera não disponível"
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permissão de câmera negada. Por favor, permita o acesso nas configurações do seu navegador."
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "Nenhuma câmera encontrada no dispositivo."
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Câmera está sendo usada por outro aplicativo."
      } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
        errorMessage = "A câmera não suporta as configurações solicitadas."
      }
      
      setError(errorMessage)
      setLoading(false)
    }
  }

  const switchCamera = async () => {
    // Usa a ref para garantir que temos o valor mais recente
    const currentFacingMode = facingModeRef.current
    const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment'
    await startCamera(newFacingMode)
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stream])

  return { stream, error, loading, startCamera, stopCamera, switchCamera, facingMode }
}

export function useOTPTimer(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1)
      }, 1000)
    } else if (seconds === 0) {
      setIsActive(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const start = () => {
    setSeconds(initialSeconds)
    setIsActive(true)
  }

  const reset = () => {
    setSeconds(initialSeconds)
    setIsActive(false)
  }

  return { seconds, isActive, start, reset }
}

/**
 * Hook genérico para gerenciar filtros de lista com busca, paginação e filtros customizados
 * @param {Object} options - Opções de configuração
 * @param {Array} options.initialData - Dados iniciais
 * @param {number} options.pageSize - Itens por página (default: 10)
 * @param {Array<string>} options.searchFields - Campos para busca
 * @param {Object} options.initialFilters - Filtros iniciais
 * @returns {Object} - Estado e funções para gerenciar a lista
 */
export function useListFilters(options = {}) {
  const { 
    initialData = [], 
    pageSize = 10, 
    searchFields = ['name'],
    initialFilters = {}
  } = options
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(initialData)
  
  // Atualiza dados quando initialData muda
  useEffect(() => {
    setData(initialData)
  }, [initialData])
  
  // Filtra dados
  const filteredData = useMemo(() => {
    let result = [...data]
    
    // Aplica busca
    if (search.trim()) {
      const term = search.toLowerCase().trim()
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field]
          if (value == null) return false
          return String(value).toLowerCase().includes(term)
        })
      )
    }
    
    // Aplica filtros customizados
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => {
          const itemValue = item[key]
          // Suporta comparação de números e strings
          return String(itemValue) === String(value)
        })
      }
    })
    
    return result
  }, [data, search, filters, searchFields])
  
  // Paginação
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])
  
  // Reset página quando filtros mudam
  useEffect(() => {
    setPage(1)
  }, [search, filters])
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const resetFilters = () => {
    setSearch('')
    setFilters(initialFilters)
    setPage(1)
  }
  
  return {
    // Estado
    search,
    filters,
    page,
    totalPages,
    totalItems: filteredData.length,
    // Dados
    data: paginatedData,
    allFilteredData: filteredData,
    // Funções
    setSearch,
    setFilters,
    updateFilter,
    setPage,
    resetFilters,
    setData,
  }
}


