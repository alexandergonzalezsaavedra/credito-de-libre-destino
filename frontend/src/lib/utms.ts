export interface Utms {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

export function capturarUtms(): Utms {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    };
  }
  const utm = new URLSearchParams(window.location.search);
  return {
    utm_source: utm.get('utm_source') ?? '',
    utm_medium: utm.get('utm_medium') ?? '',
    utm_campaign: utm.get('utm_campaign') ?? '',
    utm_term: utm.get('utm_term') ?? '',
    utm_content: utm.get('utm_content') ?? '',
  };
}

export function utmsToString(utms: Utms): string {
  return Object.entries(utms)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join(' | ');
}
