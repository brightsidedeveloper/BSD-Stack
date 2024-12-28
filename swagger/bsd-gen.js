const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const { log } = require('console')
require('dotenv').config()

const apiFilePath = './swagger/api.json' // Path to your OpenAPI JSON file
const output1Dir = './web/src/api' // Output directory for generated files
const output2Dir = './native/api' // Output directory for generated files
const outputDirGo = '../server/api'
const outputBSDFile = 'ez.ts' // API client file name
const outputTypesFile = 'types.ts' // Generated types file name
const requestFilePath = './swagger/util/request.ts' // Path to the request.ts file
const origin = process.env.SWAG_ORIGIN
if (!origin) {
  console.error(chalk.red('Error: Please set the ORIGIN environment variable'))
  process.exit(1)
}

const logStep = (message) => {
  const spinner = ora(chalk.greenBright(message)).start()
  return spinner
}

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

console.log(
  chalk.blueBright(`
    ███╗░░░███╗░█████╗░██╗░░██╗███████╗  ██████╗░░██████╗██████╗░
    ████╗░████║██╔══██╗██║░██╔╝██╔════╝  ██╔══██╗██╔════╝██╔══██╗
    ██╔████╔██║███████║█████═╝░█████╗░░  ██████╦╝╚█████╗░██║░░██║
    ██║╚██╔╝██║██╔══██║██╔═██╗░██╔══╝░░  ██╔══██╗░╚═══██╗██║░░██║
    ██║░╚═╝░██║██║░░██║██║░╚██╗███████╗  ██████╦╝██████╔╝██████╔╝
    ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝  ╚═════╝░╚═════╝░╚═════╝░ 
`)
)

// Main function to generate files
const main = () => {
  const spinner = logStep('Parsing OpenAPI JSON')
  const apiJson = JSON.parse(fs.readFileSync(apiFilePath, 'utf8'))
  spinner.succeed(chalk.green('Successfully parsed OpenAPI JSON'))

  // Web & Native
  const spinner2 = logStep('Generating files')
  const generatedTypes = generateTypes(apiJson)
  const generatedApiClient = generateApiClient(apiJson)
  const generatedQueries = generateQueries(apiJson)
  const outputQueriesFile = 'queries.ts'
  spinner2.succeed(chalk.green('Generated files'))

  // Web
  const spinner3 = logStep('Writing files to Web App')
  fs.mkdirSync(output1Dir, { recursive: true })
  fs.writeFileSync(path.join(output1Dir, outputTypesFile), generatedTypes, 'utf8')
  fs.writeFileSync(path.join(output1Dir, outputBSDFile), generatedApiClient, 'utf8')
  fs.writeFileSync(path.join(output1Dir, outputQueriesFile), generatedQueries, 'utf8')
  const destination1RequestPath = path.join(output1Dir, 'request.ts')
  fs.copyFileSync(requestFilePath, destination1RequestPath)
  spinner3.succeed(chalk.green(`Copied files into ${output1Dir}`))

  // Native
  const spinner4 = logStep('Writing files to Native App')
  fs.mkdirSync(output2Dir, { recursive: true })
  fs.writeFileSync(path.join(output2Dir, outputTypesFile), generatedTypes, 'utf8')
  fs.writeFileSync(path.join(output2Dir, outputBSDFile), generatedApiClient, 'utf8')
  fs.writeFileSync(path.join(output2Dir, outputQueriesFile), generatedQueries, 'utf8')
  spinner4.succeed(chalk.green(`Copied & Configured files into ${output2Dir}`))

  // Update request.ts for Native
  const requestContent = fs.readFileSync(requestFilePath, 'utf8')
  const updatedRequestContent = requestContent.replace("const BASE_URL = ''", `const BASE_URL = '${origin}'`)
  const destination2RequestPath = path.join(output2Dir, 'request.ts')
  fs.writeFileSync(destination2RequestPath, updatedRequestContent, 'utf8')

  // Go
  const spinner5 = logStep('Generating Go structs')
  const generatedGoStructs = generateGoStructs(apiJson)
  const goOutputDir = path.resolve(__dirname, outputDirGo)
  fs.mkdirSync(goOutputDir, { recursive: true })
  const goOutputFile = path.join(goOutputDir, 'types.go')
  fs.writeFileSync(goOutputFile, generatedGoStructs, 'utf8')
  spinner5.succeed(chalk.green(`Generated Go structs in ${outputDirGo.replace('.', '') + '/types.go'}`))

  log(chalk.green('\nDone!'))
}

main()
