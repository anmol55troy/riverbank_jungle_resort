import { generateSlug } from '../validation/slug'

export function parseLexicalJson(rawDescription: string): any {
  try {
    if (rawDescription) {
      return JSON.parse(rawDescription)
    }
  } catch {}
  return {
    root: {
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'text', text: rawDescription, version: 1 }], version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

export function parseJsonField(rawField: string, defaultValue: any = []): any {
  try {
    return JSON.parse(rawField)
  } catch {
    return defaultValue
  }
}

export function parseNumberField(formData: FormData, fieldName: string, defaultValue?: number): number | undefined {
  const value = formData.get(fieldName)
  if (value) {
    const parsed = Number(value)
    if (!isNaN(parsed)) return parsed
  }
  return defaultValue
}

export function parseStringField(formData: FormData, fieldName: string, defaultValue: string = ''): string {
  return String(formData.get(fieldName) || defaultValue).trim()
}
