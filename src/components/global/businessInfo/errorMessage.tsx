
import { FieldError } from 'react-hook-form'

interface ErrorMessageProps {
  error?: FieldError
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) {
    return null
  }

  return <span className="text-red text-sm mt-1">{error.message}</span>
}

