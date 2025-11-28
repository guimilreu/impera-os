const MOCK_DELAYS = {
  fast: 200,
  normal: 600,
  slow: 1200,
}

function getDelay() {
  if (typeof window === "undefined") return MOCK_DELAYS.normal
  const params = new URLSearchParams(window.location.search)
  const delayParam = params.get("delay")
  return MOCK_DELAYS[delayParam] || MOCK_DELAYS.normal
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getMockFlags() {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const flags = {}
  if (params.has("fail")) {
    flags[params.get("fail")] = true
  }
  if (params.has("otp")) flags.otp = params.get("otp")
  if (params.has("gps")) flags.gps = params.get("gps")
  if (params.has("geofence")) flags.geofence = params.get("geofence")
  if (params.has("upload")) flags.upload = params.get("upload")
  if (params.has("dupvote")) flags.dupvote = params.get("dupvote")
  if (params.has("ratelimit")) flags.ratelimit = params.get("ratelimit")
  if (params.has("ai")) flags.ai = params.get("ai")
  
  // Modo dev: permite GPS mock sempre
  if (params.has("dev")) {
    flags.dev = true
  }
  
  return flags
}

export const mockApi = {
  async otpStart(cpf, phone) {
    await delay(getDelay())
    const flags = getMockFlags()
    
    if (flags.otp === "fail") {
      throw new Error("Erro ao enviar código. Tente novamente.")
    }
    
    if (flags.ratelimit === "yes") {
      throw new Error("Muitas tentativas. Aguarde alguns minutos.")
    }

    return {
      success: true,
      expiresIn: 60,
    }
  },

  async otpVerify(phone, code) {
    await delay(getDelay())
    const flags = getMockFlags()
    
    if (flags.otp === "wrong") {
      throw new Error("Código inválido. Verifique e tente novamente.")
    }
    
    if (flags.otp === "expired") {
      throw new Error("Código expirado. Solicite um novo código.")
    }

    return {
      success: true,
      token: `mock_token_${Date.now()}`,
    }
  },

  async fetchPlate(plateId, editionId) {
    await delay(getDelay())
    
    return {
      id: plateId || "plate_001",
      name: "Salmão em Crosta de Ervas com Risoto de Aspargos",
      restaurant: "Bistrô Gourmet",
      category: "Prato Principal",
      photo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
      editionId: editionId || "edition_2025",
    }
  },

  async checkExistingVote(plateId, editionId, token) {
    await delay(getDelay())
    const flags = getMockFlags()
    
    if (flags.dupvote === "yes") {
      return {
        hasVoted: true,
        voteId: "vote_existing_123",
      }
    }
    
    return {
      hasVoted: false,
    }
  },

  async analyzeImage(fileUrl) {
    await delay(getDelay() * 2)
    const flags = getMockFlags()
    
    if (flags.ai === "fail") {
      throw new Error("Não foi possível analisar a imagem. Tente novamente.")
    }

    return {
      success: true,
      integrity: "ok",
      originality: "ok",
      analysis: {
        valid: true,
        confidence: 0.95,
      },
    }
  },

  async submitVote(voteData) {
    await delay(getDelay() * 1.5)
    const flags = getMockFlags()
    
    if (flags.upload === "fail") {
      throw new Error("Erro ao enviar avaliação. Tente novamente.")
    }
    
    if (flags.ratelimit === "yes") {
      throw new Error("Muitas avaliações em pouco tempo. Aguarde alguns minutos.")
    }

    const total = (
      voteData.apresentacao +
      voteData.sabor +
      voteData.experiencia
    ).toFixed(1)

    return {
      success: true,
      voteId: `vote_${Date.now()}`,
      total: parseFloat(total),
      badgeUnlocked: {
        code: "first_vote",
        name: "Primeira Avaliação",
      },
      rankingPosition: Math.floor(Math.random() * 50) + 1,
    }
  },

  async fetchRanking(category) {
    await delay(getDelay())
    
    const mockUsers = [
      { name: "Ana Silva", avatar: "/background.png" },
      { name: "Carlos Mendes", avatar: "/background.png" },
      { name: "Maria Santos", avatar: "/background.png" },
      { name: "João Oliveira", avatar: "/background.png" },
      { name: "Fernanda Costa", avatar: "/background.png" },
      { name: "Rafael Alves", avatar: "/background.png" },
      { name: "Juliana Lima", avatar: "/background.png" },
      { name: "Pedro Souza", avatar: "/background.png" },
      { name: "Camila Ferreira", avatar: "/background.png" },
      { name: "Lucas Rodrigues", avatar: "/background.png" },
    ]

    return {
      category: category || "Geral",
      items: mockUsers.map((user, idx) => ({
        user,
        points: (100 - idx * 5).toFixed(1),
      })),
      minVotes: 5,
    }
  },

  async fetchJurorProfile(token) {
    await delay(getDelay())
    
    return {
      name: "Jurado Impera",
      avatar: "/background.png",
      badges: [
        { code: "first_vote", name: "Primeira Avaliação" },
        { code: "enthusiast", name: "Entusiasta" },
      ],
      totalVotes: 17,
      rankingPosition: 12,
    }
  },
}

export async function getGPSStatus() {
  return new Promise((resolve) => {
    const flags = getMockFlags()
    
    // Em modo dev, sempre permite GPS mock
    if (flags.dev) {
      // Simula GPS mock sem precisar de permissão real
      setTimeout(() => {
        if (flags.gps === "denied") {
          resolve({ error: "Permissão de localização negada" })
          return
        }
        
        if (flags.gps === "timeout") {
          resolve({ error: "Timeout ao obter localização" })
          return
        }
        
        if (flags.gps === "fail") {
          resolve({ error: "Erro ao obter localização" })
          return
        }
        
        // GPS mock sempre funciona em dev
        const mockLat = -23.5505
        const mockLng = -46.6333
        const restaurantLat = -23.5505
        const restaurantLng = -46.6333
        const radiusKm = 0.1
        
        const distance = calculateDistance(mockLat, mockLng, restaurantLat, restaurantLng)
        
        if (flags.geofence === "outside") {
          resolve({
            success: true,
            latitude: mockLat,
            longitude: mockLng,
            inRadius: false,
            distance: "0.05",
          })
          return
        }
        
        resolve({
          success: true,
          latitude: mockLat,
          longitude: mockLng,
          inRadius: true,
          distance: "0.00",
        })
      }, 800)
      return
    }
    
    // Modo normal: usa GPS real
    if (typeof window === "undefined" || !navigator.geolocation) {
      resolve({ error: "Geolocalização não suportada" })
      return
    }

    if (flags.gps === "denied") {
      setTimeout(() => {
        resolve({ error: "Permissão de localização negada" })
      }, 1000)
      return
    }
    
    if (flags.gps === "timeout") {
      setTimeout(() => {
        resolve({ error: "Timeout ao obter localização" })
      }, 5000)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        const restaurantLat = -23.5505
        const restaurantLng = -46.6333
        const radiusKm = 0.1
        
        const distance = calculateDistance(lat, lng, restaurantLat, restaurantLng)
        
        if (flags.geofence === "outside") {
          resolve({
            success: true,
            latitude: lat,
            longitude: lng,
            inRadius: false,
            distance: distance.toFixed(2),
          })
          return
        }
        
        resolve({
          success: true,
          latitude: lat,
          longitude: lng,
          inRadius: distance <= radiusKm,
          distance: distance.toFixed(2),
        })
      },
      (error) => {
        let errorMessage = "Erro ao obter localização"
        
        // Tratamento específico de erros de geolocalização
        // error.code pode ser 1 (PERMISSION_DENIED), 2 (POSITION_UNAVAILABLE) ou 3 (TIMEOUT)
        if (error.code === 1 || error.code === error.PERMISSION_DENIED) {
          errorMessage = "Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador para continuar."
        } else if (error.code === 2 || error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Localização não disponível. Verifique se o GPS está ativado."
        } else if (error.code === 3 || error.code === error.TIMEOUT) {
          errorMessage = "Tempo esgotado ao obter localização. Tente novamente."
        } else if (error.message) {
          // Usa a mensagem padrão do erro se disponível
          errorMessage = error.message
        }
        
        // Flags de teste têm prioridade
        if (flags.gps === "denied") {
          errorMessage = "Permissão de localização negada"
        } else if (flags.gps === "timeout") {
          errorMessage = "Timeout ao obter localização"
        } else if (flags.gps === "fail") {
          errorMessage = "Erro ao obter localização"
        }
        
        resolve({ error: errorMessage })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

