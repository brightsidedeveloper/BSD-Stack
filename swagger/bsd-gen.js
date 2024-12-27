const fs = require('fs')
const path = require('path')

const apiFilePath = './api.json' // Path to your OpenAPI JSON file
const outputDir = '../client/src/api' // Output directory for generated files
const outputBSDFile = 'ez.ts' // API client file name
const outputTypesFile = 'types.ts' // Generated types file name
const requestFilePath = './util/request.ts' // Path to the request.ts file

// Utility function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// Utility function to convert a string to PascalCase
const toPascalCase = (str) => str.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')

// Function to generate TypeScript types from OpenAPI JSON
// Function to map OpenAPI types to TypeScript types
const mapOpenApiTypeToTsType = (type, items) => {
  if (type === 'integer') return 'number'
  if (type === 'array') {
    const itemType = items?.$ref ? toPascalCase(items.$ref.split('/').pop()) : mapOpenApiTypeToTsType(items?.type || 'unknown')
    return `${itemType}[]`
  }
  return type || 'unknown' // Default to the OpenAPI type for string, boolean, etc.
}

const generateTypes = (apiJson) => {
  const components = apiJson.components.schemas

  const generateInlineType = (schema, parentName) => {
    if (!schema.properties) return 'unknown'
    return `{\n${Object.entries(schema.properties)
      .map(([propName, propSchema]) => {
        const tsType = mapOpenApiTypeToTsType(propSchema.type, propSchema.items)
        return `  ${propName}${schema.required?.includes(propName) ? '' : '?'}: ${tsType};`
      })
      .join('\n')}\n}`
  }

  // Extract version from the first path (assuming consistent versioning in all paths)
  const versionMatch = Object.keys(apiJson.paths)[0].match(/\/(v\d+)/)
  const version = versionMatch ? versionMatch[1] : 'UnknownVersion'

  // Generate schema types with version prepended
  const schemaTypes = Object.entries(components)
    .map(([name, schema]) => {
      const typeName = `${version}${toPascalCase(name)}`
      const properties = Object.entries(schema.properties || {})
        .map(([propName, propSchema]) => {
          let tsType
          if (propSchema.type === 'array' && propSchema.items?.type === 'object') {
            tsType = `Array<${generateInlineType(propSchema.items, `${typeName}${capitalize(propName)}Item`)}>`
          } else {
            tsType = mapOpenApiTypeToTsType(propSchema.type, propSchema.items)
          }
          return `  ${propName}${schema.required?.includes(propName) ? '' : '?'}: ${tsType};`
        })
        .join('\n')

      return `export type ${typeName} = {\n${properties}\n}`
    })
    .join('\n\n')

  // Generate query parameter types with version prepended
  const parameterTypes = Object.entries(apiJson.paths)
    .flatMap(([path, methods]) =>
      Object.entries(methods).flatMap(([method, details]) => {
        if (!details.parameters) return []
        const operationId = details.operationId ? capitalize(details.operationId) : 'UnnamedOperation'
        const typeName = `${version}${operationId}Params`

        const properties = details.parameters
          .map((param) => {
            const tsType = mapOpenApiTypeToTsType(param.schema.type, param.schema.items)
            return `  ${param.name}${param.required ? '' : '?'}: ${tsType};`
          })
          .join('\n')

        return `export type ${typeName} = {\n${properties}\n}`
      })
    )
    .join('\n\n')

  return `
  /**
   * Auto-generated File - BSD
   */
  
  ${schemaTypes}

  ${parameterTypes}
  `
}

const generateApiClient = (apiJson) => {
  const classes = { Get: [], Post: [], Put: [], Patch: [], Delete: [] }

  // Extract version from the first path (assuming consistent versioning in all paths)
  const versionMatch = Object.keys(apiJson.paths)[0].match(/\/(v\d+)/)
  const version = versionMatch ? versionMatch[1] : 'UnknownVersion'

  const parameterTypes = Object.entries(apiJson.paths)
    .flatMap(([path, methods]) =>
      Object.entries(methods).flatMap(([method, details]) => {
        if (!details.parameters) return []
        const operationId = details.operationId ? capitalize(details.operationId) : 'UnnamedOperation'
        return `${version}${operationId}Params`
      })
    )
    .filter((typeName, index, self) => self.indexOf(typeName) === index) // Remove duplicates

  Object.entries(apiJson.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      const className = capitalize(method)
      const operationId = details.operationId ? capitalize(details.operationId) : 'UnnamedOperation'
      const functionName = `${version}${operationId}`
      const responseSchema = details.responses?.['200']?.content?.['application/json']?.schema
      const responseType = responseSchema
        ? responseSchema.$ref
          ? `${version}${toPascalCase(responseSchema.$ref.split('/').pop())}`
          : mapOpenApiTypeToTsType(responseSchema.type, responseSchema.items)
        : 'void'

      const paramSchema = details.parameters?.length
        ? `${version}${operationId}Params`
        : details.requestBody?.content?.['application/json']?.schema?.$ref
        ? `${version}${toPascalCase(details.requestBody.content['application/json'].schema.$ref.split('/').pop())}`
        : null

      const paramsType = paramSchema ? `params: ${paramSchema}` : ''
      const requestArgs = paramSchema ? `\`${path}\`, params` : `\`${path}\``

      const jsdoc = `
        /**
         * ${details.summary || 'No description provided'}
         * @returns {Promise<${responseType}>}
         */
      `.trim()

      classes[className].push(`
        ${jsdoc}
        static async ${functionName}(${paramsType}) {
          return ${method}<${responseType}>(${requestArgs});
        }
      `)
    })
  })

  const classCode = Object.entries(classes)
    .map(
      ([className, methods]) => `
  class ${className} {
    ${methods.join('\n  ')}
  }
  `
    )
    .join('\n')

  return `
  /**
   * Auto-generated File - BSD
   */

  import { get, post, put, patch, del } from './request';
  import { ${[...Object.keys(apiJson.components.schemas).map((name) => `${version}${toPascalCase(name)}`), ...parameterTypes].join(
    ', '
  )} } from './types';

  ${classCode}

  export default class ez {
    static get = Get;
    static post = Post;
    static put = Put;
    static patch = Patch;
    static delete = Delete;
  }
  `
}

const generateQueries = (apiJson) => {
  // Extract version from the first path (assuming consistent versioning in all paths)
  const versionMatch = Object.keys(apiJson.paths)[0].match(/\/(v\d+)/)
  const version = versionMatch ? versionMatch[1] : 'UnknownVersion'

  const queries = Object.entries(apiJson.paths)
    .flatMap(([path, methods]) =>
      Object.entries(methods).flatMap(([method, details]) => {
        if (method.toLowerCase() !== 'get') return []
        const operationId = details.operationId ? capitalize(details.operationId) : 'UnnamedOperation'
        const functionName = `create${version.toUpperCase()}${operationId}Query`
        const paramsType = details.parameters?.length ? `${version}${operationId}Params` : null

        const paramsArg = paramsType ? `params: ${paramsType}` : ''

        return `
export function ${functionName}(${paramsArg}) {
  return queryOptions({
    queryKey: ['${operationId.toLowerCase()}'${paramsType ? ', params' : ''}],
    queryFn() {
      return ez.get.${version}${operationId}(${paramsType ? 'params' : ''});
    },
  });
}`
      })
    )
    .join('\n\n')

  return `
/**
 * Auto-generated File - BSD
 */

import { queryOptions } from '@tanstack/react-query';
import ez from './ez';
import { ${[
    ...Object.entries(apiJson.paths)
      .flatMap(([_, methods]) =>
        Object.entries(methods).flatMap(([method, details]) =>
          method.toLowerCase() === 'get' && details.parameters
            ? `${version}${capitalize(details.operationId || 'UnnamedOperation')}Params`
            : []
        )
      )
      .filter((typeName, index, self) => self.indexOf(typeName) === index), // Remove duplicates
    ...Object.keys(apiJson.components.schemas).map((name) => `${version}${toPascalCase(name)}`),
  ].join(', ')} } from './types';

${queries}
`
}

const generateGoStructs = (apiJson) => {
  const components = apiJson.components.schemas

  const nestedStructs = [] // To store generated nested structs

  const mapOpenApiTypeToGoType = (type, items, parentStructName, propName) => {
    if (type === 'integer') return 'int'
    if (type === 'number') return 'float64'
    if (type === 'string') return 'string'
    if (type === 'boolean') return 'bool'
    if (type === 'array') {
      const arrayItemType = items?.$ref
        ? `[]${toPascalCase(items.$ref.split('/').pop())}`
        : items?.type === 'object'
        ? `[]${generateNestedStructFromObject(parentStructName, propName, items)}`
        : `[]${mapOpenApiTypeToGoType(items.type, items.items, parentStructName, propName)}`
      return arrayItemType
    }
    if (type === 'object') {
      return generateNestedStructFromObject(parentStructName, propName, { properties: items })
    }
    return 'interface{}' // Default fallback
  }

  const generateNestedStructFromObject = (parentStructName, propName, schema) => {
    const structName = `${parentStructName}${capitalize(propName)}`
    if (nestedStructs.find((nested) => nested.name === structName)) {
      return structName // Avoid duplicate struct definitions
    }
    const fields = Object.entries(schema.properties || {})
      .map(([fieldName, fieldSchema]) => {
        const goType = fieldSchema.$ref
          ? `V1${toPascalCase(fieldSchema.$ref.split('/').pop())}`
          : mapOpenApiTypeToGoType(fieldSchema.type, fieldSchema.items, structName, fieldName)
        const jsonTag = `\`${'json:' + '"' + fieldName + '"'}\``
        return `  ${capitalize(fieldName)} ${goType} ${jsonTag}`
      })
      .join('\n')

    nestedStructs.push({ name: structName, definition: `type ${structName} struct {\n${fields}\n}` })
    return structName
  }

  const generateStruct = (name, schema) => {
    const structName = `V1${toPascalCase(name)}`
    const fields = Object.entries(schema.properties || {})
      .map(([propName, propSchema]) => {
        const goType = propSchema.$ref
          ? `V1${toPascalCase(propSchema.$ref.split('/').pop())}`
          : mapOpenApiTypeToGoType(propSchema.type, propSchema.items, structName, propName)
        const jsonTag = `\`${'json:' + '"' + propName + '"'}\``
        return `  ${capitalize(propName)} ${goType} ${jsonTag}`
      })
      .join('\n')
    return `type ${structName} struct {\n${fields}\n}`
  }

  const structs = Object.entries(components)
    .map(([name, schema]) => generateStruct(name, schema))
    .join('\n\n')

  const allStructs = [...nestedStructs.map((s) => s.definition), structs]

  return `// Auto-generated File - BSD\n\npackage api\n\n${allStructs.join('\n\n')}`
}

// Main function to generate files
const main = () => {
  // Read and parse the OpenAPI JSON
  const apiJson = JSON.parse(fs.readFileSync(apiFilePath, 'utf8'))

  // Generate types and API client
  const generatedTypes = generateTypes(apiJson)
  const generatedApiClient = generateApiClient(apiJson)
  const generatedQueries = generateQueries(apiJson)

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true })

  // Write the types file
  fs.writeFileSync(path.join(outputDir, outputTypesFile), generatedTypes, 'utf8')
  console.log(`Generated types at ${path.join(outputDir, outputTypesFile)}`)

  // Write the API client file
  fs.writeFileSync(path.join(outputDir, outputBSDFile), generatedApiClient, 'utf8')
  console.log(`Generated API client at ${path.join(outputDir, outputBSDFile)}`)

  // Write the queries file
  const outputQueriesFile = 'queries.ts'
  fs.writeFileSync(path.join(outputDir, outputQueriesFile), generatedQueries, 'utf8')
  console.log(`Generated queries at ${path.join(outputDir, outputQueriesFile)}`)

  // Copy the request.ts file to the output directory
  const destinationRequestPath = path.join(outputDir, 'request.ts')
  fs.copyFileSync(requestFilePath, destinationRequestPath)
  console.log(`Copied request.ts to ${destinationRequestPath}`)

  // Generate Go structs
  const generatedGoStructs = generateGoStructs(apiJson)

  // Ensure output directory exists
  const goOutputDir = path.join(__dirname, '../server/api')
  fs.mkdirSync(goOutputDir, { recursive: true })

  // Write the Go structs to a file
  const goOutputFile = path.join(goOutputDir, 'types.go')
  fs.writeFileSync(goOutputFile, generatedGoStructs, 'utf8')
  console.log(`Generated Go structs at ${goOutputFile}`)
}

main()
