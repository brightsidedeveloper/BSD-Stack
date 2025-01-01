import { createLazyFileRoute } from '@tanstack/react-router'
import { ReadAPI, RunMakeBSD } from '../../../wailsjs/go/main/App'
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import OpenAPISchema, { CheatAny, OpenAPISchemaType } from '../../types/apiSchema'
import clsx from 'clsx'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { apiAtom, selectedEndpointAtom, selectedSchemaAtom } from '../../features/swagger/atoms'
import { JSX } from 'react/jsx-runtime'

export const Route = createLazyFileRoute('/_layout/api')({
  component: RouteComponent,
})
const dirtyAtom = atom(false)

function RouteComponent() {
  const [ogApi, setOgApi] = useState<OpenAPISchemaType | null>(null)
  const [api, setApi] = useAtom(apiAtom)
  console.log(JSON.stringify(api))
  useEffect(() => {
    ReadAPI().then((res) => {
      setApi(OpenAPISchema.parse(JSON.parse(res)))
      setOgApi(OpenAPISchema.parse(JSON.parse(res)))
    })
  }, [setApi])

  const setDirtyAtom = useSetAtom(dirtyAtom)

  const reset = useCallback(() => {
    setApi(ogApi)
  }, [ogApi, setApi])

  const isDirty = useMemo(() => JSON.stringify(ogApi) !== JSON.stringify(api), [api, ogApi])
  useEffect(() => {
    if (isDirty) {
      setDirtyAtom(true)
    } else {
      setDirtyAtom(false)
    }
  }, [isDirty, setDirtyAtom])

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
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold mb-4">{selectedSchema}</h3>
              <button onClick={() => {}} className="p-2 bg-gray-200/10 hover:bg-gray-200/15">
                Delete
              </button>
            </div>
            <SchemaEditor />
            <SchemaViewer schema={activeSchema} name={selectedSchema} />
          </div>
        )}
        {activeEndpoint && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedEndpoint}</h3>
              <button onClick={() => {}} className="p-2 bg-gray-200/10 hover:bg-gray-200/15">
                Delete
              </button>
            </div>
            <hr />
            <EditGet activeEndpoint={activeEndpoint} />
            <hr />
            <EditPost activeEndpoint={activeEndpoint} />
          </div>
        )}
      </section>
      <EndpointsAndSchemas reset={reset} />
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

  const schema1 = useMemo(() => {
    const schemaRef = activeEndpoint.post?.requestBody?.content?.['application/json']?.schema?.$ref
    return schemaRef || '' // Return the schema ref or an empty string
  }, [activeEndpoint.post])

  const onSchemaChange1 = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const selectedSchemaRef = e.target.value
      console.log(selectedSchemaRef)
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr

        const updatedApi = { ...curr }

        const post = updatedApi.paths[selectedEndpoint]?.post

        if (!post) return curr

        if (selectedSchemaRef === 'nununuununununu') {
          post.requestBody = undefined
          return updatedApi
        }

        // Ensure requestBody exists
        if (!post.requestBody) {
          post.requestBody = {
            description: '',
            content: {},
          }
        }

        // Ensure application/json content exists
        if (!post.requestBody.content['application/json']) {
          post.requestBody.content['application/json'] = {
            schema: { $ref: selectedSchemaRef },
          }
        } else {
          post.requestBody.content['application/json'].schema.$ref = selectedSchemaRef
        }

        return updatedApi
      })
    },
    [selectedEndpoint, setApi]
  )

  const schema2 = useMemo(() => activeEndpoint.post?.responses['200'].content['application/json'].schema.$ref ?? '', [activeEndpoint.post])
  const onSchemaChange2 = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const selectedSchemaRef = e.target.value
      setApi((curr) => {
        if (!curr || !selectedEndpoint) return curr

        const updatedApi = { ...curr }
        const post = updatedApi.paths[selectedEndpoint]?.post

        if (!post) return curr

        // Ensure responses['200'] exists
        if (!post.responses) {
          post.responses = {}
        }
        if (!post.responses['200']) {
          post.responses['200'] = {
            description: '',
            content: {},
          }
        }

        // Ensure application/json content exists
        if (!post.responses['200'].content['application/json']) {
          post.responses['200'].content['application/json'] = {
            schema: { $ref: selectedSchemaRef },
          }
        } else {
          post.responses['200'].content['application/json'].schema.$ref = selectedSchemaRef
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
              {schema1 ? <option value="nununuununununu">None</option> : <option value="">Select a schema</option>}
              {schemaOpts.map((schema) => (
                <option key={schema} value={`#/components/schemas/${schema}`}>
                  {schema}
                </option>
              ))}
            </select>
            {api?.components && schema1 && (
              <SchemaViewer
                schema={api.components.schemas[schema1.split('/')[schema1.split('/').length - 1]]}
                name={schema1.split('/')[schema1.split('/').length - 1]}
              />
            )}
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
              {!schema2 && <option value="">Select a schema</option>}
              {schemaOpts.map((schema) => (
                <option key={schema} value={`#/components/schemas/${schema}`}>
                  {schema}
                </option>
              ))}
            </select>
            {api?.components && schema2 && (
              <SchemaViewer
                schema={api.components.schemas[schema2.split('/')[schema2.split('/').length - 1]]}
                name={schema2.split('/')[schema2.split('/').length - 1]}
              />
            )}
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

function EndpointsAndSchemas({ reset }: EndpointsAndSchemasProps) {
  const api = useAtomValue(apiAtom)
  const isDirty = useAtomValue(dirtyAtom)
  const [selectedEndpoint, setSelectedEndpoint] = useAtom(selectedEndpointAtom)

  const [endpointQuery, setEndpointQuery] = useState('')

  const endpoints = useMemo(() => {
    if (!api) return []
    return Object.keys(api.paths).filter((endpoint) => endpointQuery === '' || endpoint.toLowerCase().includes(endpointQuery.toLowerCase()))
  }, [api, endpointQuery])

  const [selectedSchema, setSelectedSchema] = useAtom(selectedSchemaAtom)

  const [schemaQuery, setSchemaQuery] = useState('')

  const schemas = useMemo(() => {
    if (!api || !api.components || !api.components.schemas) return []
    return Object.keys(api.components.schemas).filter(
      (schema) => schemaQuery === '' || schema.toLowerCase().includes(schemaQuery.toLowerCase())
    )
  }, [api, schemaQuery])

  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <aside className="min-w-72 bg-gray-800/50 p-4 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-800">
      {isDirty ? (
        <div className="mb-4 flex items-center gap-4">
          <button onClick={reset} className="p-2 bg-red-500 w-full">
            Cancel
          </button>
          <button className="p-2 bg-green-500 w-full">Write</button>
        </div>
      ) : (
        <button
          disabled={running}
          onClick={() => {
            setRunning(true)
            setProgress(1)
            RunMakeBSD()
              .then(() => {
                setProgress(2)
                setTimeout(() => {
                  setProgress(0)
                  setRunning(false)
                }, 500)
              })
              .catch(() => {
                setProgress(-1)
                setTimeout(() => {
                  setProgress(0)
                  setRunning(false)
                }, 500)
              })
          }}
          className="p-2 bg-blue-500 w-full mb-4 disabled:bg-gray-500"
        >
          {!progress ? (
            <pre>make bsd 🔥</pre>
          ) : progress === 2 ? (
            <pre>done! 🎉</pre>
          ) : progress === -1 ? (
            <pre>error! 😢</pre>
          ) : (
            <pre>runnin 🏃</pre>
          )}
        </button>
      )}
      <div className="flex items-center gap-4">
        <button className="p-2 bg-gray-500 w-full">+ Endpoint</button>
        <button className="p-2 bg-gray-500 w-full">+ Schema</button>
      </div>
      <hr className="my-4" />
      <h3 className="text-xl font-bold underline text-center mb-4">Endpoints</h3>
      <div className="flex flex-col">
        <input
          value={endpointQuery}
          onChange={(e) => setEndpointQuery(e.target.value)}
          placeholder="Search endpoints..."
          className="p-2 bg-gray-200/10 mb-2"
        />
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
        <input
          value={schemaQuery}
          onChange={(e) => setSchemaQuery(e.target.value)}
          placeholder="Search schemas..."
          className="p-2 bg-gray-200/10 mb-2"
        />
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

interface EndpointsAndSchemasProps {
  reset: () => void
}

export function SchemaEditor() {
  const api = useAtomValue(apiAtom)
  const setApi = useSetAtom(apiAtom)
  const selectedSchema = useAtomValue(selectedSchemaAtom)

  const activeSchema = useMemo(() => {
    if (!selectedSchema || !api || !api.components?.schemas[selectedSchema]) return null
    return api.components.schemas[selectedSchema]
  }, [selectedSchema, api])

  const updateSchema = useCallback(
    (newSchema: CheatAny) => {
      setApi((curr) => {
        if (!curr || !selectedSchema) return curr
        const updatedApi = { ...curr }
        // @ts-expect-error sdfsdfdsf
        updatedApi.components.schemas[selectedSchema] = newSchema
        return updatedApi
      })
    },
    [selectedSchema, setApi]
  )

  if (!activeSchema) {
    return <div>Select a schema to edit.</div>
  }

  return (
    <div>
      <RecursiveEditor value={activeSchema} onChange={updateSchema} path="" />
    </div>
  )
}

function RecursiveEditor({ value, onChange, path }: { value: CheatAny; onChange: (newValue: CheatAny) => void; path: string }) {
  // Update a primitive or simple field
  const handlePrimitiveChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string) => {
      const newValue = { ...value, [key]: e.target.value }
      onChange(newValue)
    },
    [value, onChange]
  )

  // Update nested fields
  const handleNestedChange = useCallback(
    (key: string, newValue: CheatAny) => {
      const updatedValue = { ...value, properties: { ...value.properties, [key]: newValue } }
      onChange(updatedValue)
    },
    [value, onChange]
  )

  // Add a new field to the object
  const handleAddField = useCallback(() => {
    const newKey = `newField${Object.keys(value.properties || {}).length + 1}`
    const updatedValue = {
      ...value,
      properties: {
        ...(value.properties || {}),
        [newKey]: { type: 'string', example: '' },
      },
    }
    onChange(updatedValue)
  }, [value, onChange])

  // Delete a field from the object
  const handleDeleteField = useCallback(
    (key: string) => {
      const updatedProperties = { ...value.properties }
      delete updatedProperties[key]
      const updatedRequired = value.required?.filter((requiredKey: string) => requiredKey !== key)
      const updatedValue = { ...value, properties: updatedProperties, required: updatedRequired }
      onChange(updatedValue)
    },
    [value, onChange]
  )

  // Rename a field
  const handleRenameField = useCallback(
    (oldKey: string, newKey: string) => {
      const updatedProperties = { ...value.properties }
      updatedProperties[newKey] = updatedProperties[oldKey]
      delete updatedProperties[oldKey]

      const updatedRequired = value.required?.map((requiredKey: string) => (requiredKey === oldKey ? newKey : requiredKey))

      const updatedValue = { ...value, properties: updatedProperties, required: updatedRequired }
      onChange(updatedValue)
    },
    [value, onChange]
  )

  // Toggle required for a field
  const handleToggleRequired = useCallback(
    (key: string) => {
      const isRequired = value.required?.includes(key)
      const updatedRequired = isRequired
        ? value.required?.filter((requiredKey: string) => requiredKey !== key)
        : [...(value.required || []), key]

      const updatedValue = { ...value, required: updatedRequired }
      onChange(updatedValue)
    },
    [value, onChange]
  )

  // Add default fields for objects and arrays
  const addDefaults = useCallback(() => {
    if (value.type === 'object' && !value.properties) {
      onChange({ ...value, properties: {} })
    } else if (value.type === 'array' && !value.items) {
      onChange({ ...value, items: { type: 'string', example: '' } })
    }
  }, [value, onChange])

  useEffect(() => {
    addDefaults()
  }, [addDefaults])

  if (value.type === 'object') {
    return (
      <div className="p-2 border mb-4">
        <h4 className="text-lg font-bold mb-2">Object</h4>
        {Object.entries(value.properties || {}).map(([key, subValue]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-light mb-1">Key:</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={key}
                onChange={(e) => handleRenameField(key, e.target.value)}
                className="p-1 border bg-gray-800 text-white w-full"
              />
              <button onClick={() => handleDeleteField(key)} className="text-red-500 text-sm">
                Delete
              </button>
            </div>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={value.required?.includes(key) || false} onChange={() => handleToggleRequired(key)} />
              Required
            </label>
            <RecursiveEditor value={subValue} onChange={(newValue) => handleNestedChange(key, newValue)} path={`${path}.${key}`} />
          </div>
        ))}
        <button onClick={handleAddField} className="text-blue-500">
          + Add Field
        </button>
      </div>
    )
  }

  if (value.type === 'array') {
    if (!value.items) {
      onChange({ ...value, items: { type: 'string', example: '' } })
    }

    return (
      <div className="p-2 border mb-4">
        <h4 className="text-lg font-bold mb-2">Array</h4>
        <label className="block text-sm font-light mb-1">Items</label>
        {value.items && (
          <RecursiveEditor value={value.items} onChange={(newValue) => onChange({ ...value, items: newValue })} path={`${path}.items`} />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <label className="block text-sm font-light mb-1">Type:</label>
        <select value={value.type || ''} onChange={(e) => handlePrimitiveChange(e, 'type')} className="w-full p-1 bg-gray-800 text-white ">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="null">Null</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
      </div>
      <label className="block text-sm font-light mb-1">Example</label>
      <input
        type="text"
        value={value.example || ''}
        onChange={(e) => handlePrimitiveChange(e, 'example')}
        className="w-full p-1 bg-gray-800 text-white"
      />
      <hr className="my-4" />
    </div>
  )
}

function SchemaViewer({ schema, name }: { schema: CheatAny; name: string | null }) {
  const renderSchema = (schema: CheatAny, indentLevel = 0): JSX.Element => {
    if (!schema?.type) return <>{schema}</>
    if (schema.type === 'object') {
      return (
        <>
          <div style={{ marginLeft: `${indentLevel * 20}px` }}>{'{'}</div>
          {Object.entries(schema.properties || {}).map(([key, value]) => (
            <div key={key} style={{ marginLeft: `${(indentLevel + 1) * 20}px` }}>
              {key}
              {schema.required?.includes(key) ? '' : '?'}: {renderSchema(value, indentLevel + 1)}
            </div>
          ))}
          <div style={{ marginLeft: `${indentLevel * 20}px` }}>{'}'}</div>
        </>
      )
    }

    if (schema.type === 'array') {
      return <>{renderSchema(schema.items, indentLevel)}[]</>
    }

    return <span>{schema.type}</span>
  }

  return (
    <div className="p-4 bg-gray-800 text-white font-mono">
      <div>
        <span className="font-bold">{name} </span>
        {renderSchema(schema)}
      </div>
    </div>
  )
}
