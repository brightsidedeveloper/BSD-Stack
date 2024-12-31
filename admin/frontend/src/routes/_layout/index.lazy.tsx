import { createLazyFileRoute } from '@tanstack/react-router'
import { ReadAPI } from '../../../wailsjs/go/main/App'
import { ChangeEventHandler, useCallback, useEffect, useMemo } from 'react'
import OpenAPISchema, { OpenAPISchemaType } from '../../types/apiSchema'
import clsx from 'clsx'
import { atom, useAtom, useAtomValue } from 'jotai'

const apiAtom = atom<OpenAPISchemaType | null>(null)
const selectedEndpointAtom = atom<string | null>('/api/auth/signup')
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
      <section className="w-full p-4 h-[calc(100vh-64px)] overflow-y-auto">
        {!activeEndpoint && !activeSchema && (
          <>
            <h2 className="text-3xl font-bold mb-4">Swagger</h2>
            <p>Select an endpoint or schema to view details.</p>
          </>
        )}
        {activeSchema && (
          <div>
            <h3 className="text-2xl font-bold mb-4">{selectedSchema}</h3>
            <div className="p-2 bg-gray-200/10">
              <pre>{JSON.stringify(activeSchema, null, 2)}</pre>
            </div>
          </div>
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
      </section>
      <EndpointsAndSchemas />
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
  const [api, setApi] = useAtom(apiAtom)

  const selectedEndpoint = useAtomValue(selectedEndpointAtom)

  const summary = useMemo(() => activeEndpoint.post?.summary ?? '', [activeEndpoint.post])
  const onSummaryChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            summary: e.target.value,
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const operationId = useMemo(() => activeEndpoint.post?.operationId ?? '', [activeEndpoint.post])
  const onOperationIdChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            operationId: e.target.value.replace(/\s/g, ''),
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const security = useMemo(() => !!(activeEndpoint.post?.security ?? []).length, [activeEndpoint.post])
  const onSecurityChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            security: e.currentTarget.checked ? [{ bearerAuth: [] }] : [],
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const description1 = useMemo(() => activeEndpoint.post?.requestBody?.description ?? '', [activeEndpoint.post])
  const onDescriptionChange1 = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post || !curr.paths[selectedEndpoint].post.requestBody) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            // @ts-expect-error sdfsdfdsf
            requestBody: {
              // @ts-expect-error sdfsdfdsf
              ...updatedApi.paths[selectedEndpoint].post.requestBody,
              description: e.target.value,
            },
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const description2 = useMemo(() => activeEndpoint.post?.responses['200'].description ?? '', [activeEndpoint.post])
  const onDescriptionChange2 = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            responses: {
              // @ts-expect-error sdfsdfdsf
              ...updatedApi.paths[selectedEndpoint].post.responses,
              '200': {
                // @ts-expect-error sdfsdfdsf
                ...updatedApi.paths[selectedEndpoint].post.responses['200'],
                description: e.target.value,
              },
            },
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const schemaOpts = useMemo(() => {
    if (!api) return []
    return Object.keys(api.components?.schemas ?? {})
  }, [api])

  console.log(schemaOpts)

  const schema1 = useMemo(() => activeEndpoint.post?.requestBody?.content['application/json'].schema.$ref ?? '', [activeEndpoint.post])
  const onSchemaChange1 = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post || !curr.paths[selectedEndpoint].post.requestBody) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            requestBody: {
              // @ts-expect-error sdfsdfdsf
              ...updatedApi.paths[selectedEndpoint].post.requestBody,
              content: {
                'application/json': {
                  schema: {
                    $ref: e.target.value,
                  },
                },
              },
            },
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const schema2 = useMemo(() => activeEndpoint.post?.responses['200'].content['application/json'].schema.$ref ?? '', [activeEndpoint.post])
  const onSchemaChange2 = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr
        if (!curr.paths[selectedEndpoint]?.post) return curr

        const updatedApi = { ...curr }
        updatedApi.paths = { ...updatedApi.paths }
        updatedApi.paths[selectedEndpoint] = {
          ...updatedApi.paths[selectedEndpoint],
          // @ts-expect-error sdfsdfdsf
          post: {
            ...updatedApi.paths[selectedEndpoint].post,
            responses: {
              // @ts-expect-error sdfsdfdsf
              ...updatedApi.paths[selectedEndpoint].post.responses,
              '200': {
                // @ts-expect-error sdfsdfdsf
                ...updatedApi.paths[selectedEndpoint].post.responses['200'],
                content: {
                  'application/json': {
                    schema: {
                      $ref: e.target.value,
                    },
                  },
                },
              },
            },
          },
        }
        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  return (
    <div className="flex flex-col gap-2">
      <EditEndpointHeader method="POST" existing={!!activeEndpoint.post} onAdd={() => {}} onRemove={() => {}} />
      {activeEndpoint.post && (
        <>
          <div className="flex flex-col gap-2 [&_p]:text-lg [&_p]:font-semibold">
            <p>Definition:</p>
            <label className="font-light" htmlFor="summary">
              Summary:
            </label>
            <textarea id="summary" value={summary} onChange={onSummaryChange} className="w-full p-2 bg-gray-200/10" />
            <label className="font-light" htmlFor="operationId">
              Function Name:
            </label>
            <input id="operationId" value={operationId} onChange={onOperationIdChange} className="w-full p-2 bg-gray-200/10" />
            <div className="flex gap-2 item-center">
              <label className="font-light" htmlFor="security">
                Require Auth:
              </label>
              <input
                id="security"
                type="checkbox"
                checked={security}
                onChange={onSecurityChange}
                className="bg-gray-200/10 mt-[0.475rem]"
              />
            </div>
            <br />
            <p>Post Body:</p>
            <label className="font-light" htmlFor="description1">
              Description:
            </label>
            <textarea id="description1" value={description1} onChange={onDescriptionChange1} className="w-full p-2 bg-gray-200/10" />
            <label className="font-light" htmlFor="schema1">
              Schema:
            </label>
            <select id="schema1" className="w-full p-2 bg-gray-200/10" value={schema1} onChange={onSchemaChange1}>
              <option value="">Select a schema</option>
              {schemaOpts.map((schema) => (
                <option key={schema} value={`#/components/schemas/${schema}`}>
                  {schema}
                </option>
              ))}
            </select>
            <br />
            <p>Response:</p>
            <label className="font-light" htmlFor="description2">
              Description:
            </label>
            <textarea id="description2" value={description2} onChange={onDescriptionChange2} className="w-full p-2 bg-gray-200/10" />
            <label className="font-light" htmlFor="schema2">
              Schema:
            </label>
            <select id="schema2" className="w-full p-2 bg-gray-200/10" value={schema2} onChange={onSchemaChange2}>
              <option value="">Select a schema</option>
              {schemaOpts.map((schema) => (
                <option key={schema} value={`#/components/schemas/${schema}`}>
                  {schema}
                </option>
              ))}
            </select>
            <br />
            <p>Result:</p>
            <div className="p-2 bg-gray-200/10">
              <pre>{JSON.stringify(activeEndpoint.post, null, 2)}</pre>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface EndpointProps {
  activeEndpoint: OpenAPISchemaType['paths']['get']
}

function EndpointsAndSchemas() {
  const api = useAtomValue(apiAtom)

  const [selectedEndpoint, setSelectedEndpoint] = useAtom(selectedEndpointAtom)

  const endpoints = useMemo(() => {
    if (!api) return []
    return Object.keys(api.paths)
  }, [api])

  const [selectedSchema, setSelectedSchema] = useAtom(selectedSchemaAtom)

  const schemas = useMemo(() => {
    if (!api || !api.components || !api.components.schemas) return []
    return Object.keys(api.components.schemas)
  }, [api])

  return (
    <aside className="min-w-72 bg-gray-800/50 p-4 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-800">
      <div className="mb-4 flex items-center gap-4">
        <button className="p-2 bg-red-500 w-full">Cancel</button>
        <button className="p-2 bg-green-500 w-full">Write</button>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 bg-gray-500 w-full">+ Endpoint</button>
        <button className="p-2 bg-gray-500 w-full">+ Schema</button>
      </div>
      <hr className="my-4" />
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
      <hr className="my-4" />
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
