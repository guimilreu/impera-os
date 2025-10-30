export function validateCPF(cpf) {
  const clean = cpf.replace(/\D/g, "")
  if (clean.length !== 11) return false
  if (/^(\d)\1{10}$/.test(clean)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i]) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(clean[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i]) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(clean[10])) return false

  return true
}

export function validatePhone(phone) {
  const clean = phone.replace(/\D/g, "")
  // Aceita com ou sem código do país (55)
  if (clean.startsWith("55")) {
    return clean.length === 13 // 55 + 11 dígitos
  }
  return clean.length === 11 // Apenas DDD + número
}

export function validateOTP(otp) {
  return /^\d{6}$/.test(otp.replace(/\D/g, ""))
}

