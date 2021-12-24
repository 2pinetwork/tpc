type ErrorObject = {
  [attribute: string]: string | Array<string>
}

const humanize = (str: string) => {
  const [first, ...rest] = str

  return `${first.toUpperCase()}${rest.join('')}`.replace(/_/g, ' ')
}

const toMessage = (messages: string | Array<string | ErrorObject>): string => {
  return Array.isArray(messages) ? messages.join('; ') : messages
}

const isObject = (element: unknown) => typeof element === 'object'
const isString = (element: unknown) => typeof element === 'string'

const messagesType = (
  messages: string | Array<string> | Array<ErrorObject>
): string => {
  if (Array.isArray(messages) && (messages as any[]).every(isString)) {
    return 'array-of-strings'
  } else if (Array.isArray(messages) && (messages as any[]).every(isString)) {
    return 'array-of-objects'
  } else if (isObject(messages)) {
    return 'object'
  } else if (isString(messages)) {
    return 'string'
  } else {
    return 'unknown'
  }
}

const showErrorObject = (errors: ErrorObject) => {
  Object.entries(errors).forEach(([attribute, messages]) => {
    showError(attribute, messages)
  })
}

const showError = (attribute: string, messages: string | Array<string> | Array<ErrorObject>) => {
  switch(messagesType(messages)) {
    case 'string':
    case 'array-of-strings':
      console.log('  ->', humanize(attribute), toMessage(messages))
      break
    case 'array-of-objects':
      Array(messages).forEach((errorObject: unknown) => {
        showErrorObject(errorObject as ErrorObject)
      })
      break
    case 'object':
      showErrorObject((messages as unknown) as ErrorObject)
      break
    default:
      console.log('Unknown error')
  }
}

const showErrors = (errors: ErrorObject) => {
  if (Object.keys(errors).length) {
    console.log("\nUps... that didn't work:\n")

    showErrorObject(errors)
  } else {
    console.log('Ups... that didn\'t work')
  }
}

export default showErrors
