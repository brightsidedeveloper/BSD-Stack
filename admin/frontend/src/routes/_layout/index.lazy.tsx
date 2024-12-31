import { createLazyFileRoute } from '@tanstack/react-router'
import { ReadAPI } from '../../../wailsjs/go/main/App'
import { useEffect, useMemo } from 'react'
import OpenAPISchema, { OpenAPISchemaType } from '../../types/apiSchema'
import clsx from 'clsx'
import { atom, useAtom, useAtomValue } from 'jotai'

const apiAtom = atom<OpenAPISchemaType | null>(null)
const selectedEndpointAtom = atom<string | null>(null)
const selectedSchemaAtom = atom<string | null>(null)

export const Route = createLazyFileRoute('/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [api, setApi] = useAtom(apiAtom)
  useEffect(() => {
    ReadAPI().then((res) => {
      setApi(OpenAPISchema.parse(JSON.parse(res)))
    })
  }, [setApi])

  const selectedEndpoint = useAtomValue(selectedEndpointAtom)
  const selectedSchema = useAtomValue(selectedSchemaAtom)

  const activeEndpoint = useMemo(() => {
    if (!selectedEndpoint || !api || !api.paths[selectedEndpoint]) return null
    return api.paths[selectedEndpoint]
  }, [selectedEndpoint, api])

  const activeSchema = useMemo(() => {
    if (!selectedSchema || !api || !api.components?.schemas[selectedSchema]) return null
    return api.components.schemas[selectedSchema]
  }, [selectedSchema, api])

  return (
    <div className="flex">
      <section className="w-1/2 p-4">
        {!activeEndpoint && !activeSchema && (
          <>
            <h2 className="text-3xl font-bold mb-4">Swagger</h2>
            <p>Select an endpoint or schema to view details.</p>
          </>
        )}
        {activeEndpoint && (
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold">{selectedEndpoint}</h3>
            <hr />
            <EditGet activeEndpoint={activeEndpoint} />
            <hr />
            <EditPost activeEndpoint={activeEndpoint} />
          </div>
        )}
        {activeSchema && (
          <div>
            <h3 className="text-2xl font-bold mb-4">{selectedSchema}</h3>
            <div className="p-2 bg-gray-200/10">
              <pre>{JSON.stringify(activeSchema, null, 2)}</pre>
            </div>
          </div>
        )}
      </section>
      <Endpoints />
      <Schemas />
    </div>
  )
}

function EditEndpointHeader({ method, existing, onAdd, onRemove }: EditEndpointHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h4 className="text-xl font-bold mb-2">{method}</h4>
      <button onClick={existing ? onRemove : onAdd} className="p-2 bg-gray-200/10 hover:bg-gray-200/15">
        {existing ? 'Remove' : 'Add'}
      </button>
    </div>
  )
}

interface EditEndpointHeaderProps {
  method: 'GET' | 'POST'
  existing: boolean
  onAdd: () => void
  onRemove: () => void
}

function EditGet({ activeEndpoint }: EndpointProps) {
  return (
    <div className="flex flex-col gap-2">
      <EditEndpointHeader method="GET" existing={!!activeEndpoint.get} onAdd={() => {}} onRemove={() => {}} />
      {activeEndpoint.get && (
        <div className="p-2 bg-gray-200/10">
          <pre>{JSON.stringify(activeEndpoint.get, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

function EditPost({ activeEndpoint }: EndpointProps) {
  return (
    <div className="flex flex-col gap-2">
      <EditEndpointHeader method="POST" existing={!!activeEndpoint.post} onAdd={() => {}} onRemove={() => {}} />
      {activeEndpoint.post && (
        <div className="p-2 bg-gray-200/10">
          <pre>{JSON.stringify(activeEndpoint.post, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

interface EndpointProps {
  activeEndpoint: OpenAPISchemaType['paths']['get']
}

function Endpoints() {
  const api = useAtomValue(apiAtom)

  const [selectedEndpoint, setSelectedEndpoint] = useAtom(selectedEndpointAtom)

  const endpoints = useMemo(() => {
    if (!api) return []
    return Object.keys(api.paths)
  }, [api])

  return (
    <aside className="w-1/4 bg-gray-800/50 p-4 min-h-screen border-r border-gray-800">
      <h3 className="text-xl font-bold underline text-center mb-4">Endpoints</h3>
      <div className="flex flex-col">
        {endpoints.map((endpoint) => {
          return (
            <button
              onClick={() => setSelectedEndpoint((curr) => (curr === endpoint ? null : endpoint))}
              className={clsx(
                'p-2 text-left w-full hover:bg-gray-200/10',
                selectedEndpoint === endpoint && 'hover:bg-gray-200/15 bg-gray-200/15 font-semibold'
              )}
              key={endpoint}
            >
              {endpoint}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function Schemas() {
  const api = useAtomValue(apiAtom)

  const [selectedSchema, setSelectedSchema] = useAtom(selectedSchemaAtom)

  const schemas = useMemo(() => {
    if (!api || !api.components || !api.components.schemas) return []
    return Object.keys(api.components.schemas)
  }, [api])

  return (
    <aside className="w-1/4 bg-gray-800/50 p-4 min-h-screen border-l border-gray-800">
      <h3 className="text-xl font-bold underline text-center mb-4">Schemas</h3>
      <div className="flex flex-col">
        {schemas.map((schema) => {
          return (
            <button
              onClick={() => setSelectedSchema((curr) => (curr === schema ? null : schema))}
              className={clsx(
                'p-2 text-left w-full hover:bg-gray-200/10',
                selectedSchema === schema && 'hover:bg-gray-200/15 bg-gray-200/15 font-semibold'
              )}
              key={schema}
            >
              {schema}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
