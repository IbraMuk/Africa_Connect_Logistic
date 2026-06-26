// Configuration de la devise pour toute l'application
export const CURRENCY_CONFIG = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  decimalPlaces: 2,
  format: (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
}

// Fonction utilitaire pour formater les montants
export const formatCurrency = (amount: number, options?: {
  code?: string,
  symbol?: string,
  decimalPlaces?: number
}) => {
  const config = { ...CURRENCY_CONFIG, ...options }
  return `${config.symbol}${amount.toFixed(config.decimalPlaces)} ${config.code}`
}

// Fonction pour formater les grands montants (en millions)
export const formatLargeAmount = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M USD`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K USD`
  }
  return `$${amount.toFixed(2)} USD`
}
