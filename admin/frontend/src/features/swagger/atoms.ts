import { OpenAPISchemaType } from '../../types/apiSchema'
import { atom } from 'jotai'

export const apiAtom = atom<OpenAPISchemaType | null>(null)
export const selectedEndpointAtom = atom<string | null>(null)
export const selectedSchemaAtom = atom<string | null>(null)
