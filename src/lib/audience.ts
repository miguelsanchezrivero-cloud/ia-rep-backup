import type { AudienceFilter, Campaign, Doctor, PharmacyStaff } from '../types'

export function filterDoctors(doctors: Doctor[], campaign: Campaign): Doctor[] {
  const f = campaign.filters
  return doctors.filter((d) => matchDoctor(d, f, campaign))
}

function matchDoctor(d: Doctor, f: AudienceFilter, campaign: Campaign): boolean {
  if (campaign.audience === 'pharmacy_staff') return false
  if (f.all) return true
  if (f.doctorIds?.length && !f.doctorIds.includes(d.id)) return false
  if (f.coveredOnly && !d.covered) return false
  if (f.uncoveredOnly && d.covered) return false
  if (campaign.audience === 'covered_doctors' && !d.covered) return false
  if (campaign.audience === 'uncovered_doctors' && d.covered) return false
  if (f.specialties?.length && !f.specialties.includes(d.specialty)) return false
  if (f.zones?.length && !f.zones.includes(d.zone)) return false
  if (f.cities?.length && !f.cities.includes(d.city)) return false
  if (f.realRepIds?.length && (!d.realRepId || !f.realRepIds.includes(d.realRepId))) return false
  if (f.tags?.length && !f.tags.some((t) => d.tags.includes(t))) return false
  return true
}

export function filterPharmacy(staff: PharmacyStaff[], campaign: Campaign): PharmacyStaff[] {
  if (campaign.audience !== 'pharmacy_staff') return []
  const f = campaign.filters
  if (f.pharmacyIds?.length) return staff.filter((p) => f.pharmacyIds!.includes(p.id))
  if (f.cities?.length) return staff.filter((p) => f.cities!.includes(p.city))
  return staff
}

export function estimateAudienceSize(
  campaign: Campaign,
  doctors: Doctor[],
  pharmacy: PharmacyStaff[],
): number {
  if (campaign.audience === 'pharmacy_staff') return filterPharmacy(pharmacy, campaign).length
  return filterDoctors(doctors, campaign).length
}
