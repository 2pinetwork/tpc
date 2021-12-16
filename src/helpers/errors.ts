const humanize = (str: string) => {
  const [first, ...rest] = str

  return `${first.toUpperCase()}${rest.join('')}`.replace(/_/g, ' ')
}

const toMessage = (messages: string | Array<string>): string => {
  return typeof messages === 'string' ? messages : messages.join('; ')
}

const showErrors = (errors: { [attribute: string]: string | Array<string> }) => {
  if (Object.keys(errors).length) {
    console.log("\nUps... that didn't work:\n")

    Object.entries(errors).forEach(([attribute, messages]) => {
      console.log("  ->", humanize(attribute), toMessage(messages))
    })
  } else {
    console.log('Ups... that didn\'t work')
  }
}

export default showErrors
