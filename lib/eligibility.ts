export type VehicleType = 'motorcycle' | 'rickshaw' | 'car'

export interface EligibilityResult {
  eligible: boolean
  reason: string
  name: string
  vehicleType: VehicleType
  phone: string
}

// Mock name/vehicle pool keyed by CNIC area code last digit
const MOCK_PROFILES: Record<string, { name: string; vehicleType: VehicleType; phone: string }> = {
  '0': { name: 'Ahmad Khan', vehicleType: 'motorcycle', phone: '0300-1234567' },
  '1': { name: 'Fatima Bibi', vehicleType: 'rickshaw', phone: '0301-2345678' },
  '2': { name: 'Muhammad Ali', vehicleType: 'motorcycle', phone: '0302-3456789' },
  '3': { name: 'Zainab Noor', vehicleType: 'motorcycle', phone: '0303-4567890' },
  '4': { name: 'Hassan Raza', vehicleType: 'rickshaw', phone: '0304-5678901' },
  '5': { name: 'Sara Ahmed', vehicleType: 'car', phone: '0305-6789012' },
  '6': { name: 'Bilal Sheikh', vehicleType: 'car', phone: '0306-7890123' },
  '7': { name: 'Nadia Malik', vehicleType: 'car', phone: '0307-8901234' },
  '8': { name: 'Umar Farooq', vehicleType: 'car', phone: '0308-9012345' },
  '9': { name: 'Hina Baig', vehicleType: 'car', phone: '0309-0123456' },
}

// CNIC format validation: XXXXX-XXXXXXX-X
export function isValidCnicFormat(cnic: string): boolean {
  return /^\d{5}-\d{7}-\d$/.test(cnic)
}

/**
 * Deterministic mock eligibility logic:
 * - CNIC starting with "42101" → always Eligible (test user)
 * - Last digit of area code (first 5 chars) ∈ [0,1,2,3,4] → Eligible
 * - Otherwise → Not Eligible
 */
export function checkCnicMockEligibility(cnic: string): EligibilityResult {
  const areaCode = cnic.split('-')[0] // e.g. "42101"
  const lastDigit = areaCode[areaCode.length - 1] // e.g. "1"
  const profile = MOCK_PROFILES[lastDigit] ?? MOCK_PROFILES['0']

  const isTestUser = areaCode === '42101'
  const eligible = isTestUser || ['0', '1', '2', '3', '4'].includes(lastDigit)

  const reason = eligible
    ? `Aap eligible hain! Aapka area code subsidy zone mein hai aur aap ${profile.vehicleType} use karte hain.`
    : `Aap is waqt eligible nahin hain. Aapka area code subsidy zone se bahar hai. Dobara check karein.`

  return { eligible, reason, ...profile }
}
