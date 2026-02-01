import React from 'react'
import { useTranslation } from 'react-i18next'
import { SudokuErrorDetail } from '../types/sudoku'

interface ErrorDisplayProps {
  error: string
  errorType: string
  errorDetails: SudokuErrorDetail[]
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorType, errorDetails }) => {
  const { t } = useTranslation()

  const getErrorLabel = () => {
    const label = t(`errors.${errorType}.label`, { defaultValue: '' })
    if (label) return label
    const camelCase = errorType.charAt(0).toLowerCase() + errorType.slice(1)
    return t(`errors.${camelCase}Error.label`, { defaultValue: 'Error' })
  }

  const getErrorHint = () => {
    const hint = t(`errors.${errorType}.hint`, { defaultValue: '' })
    if (hint) return hint
    const camelCase = errorType.charAt(0).toLowerCase() + errorType.slice(1)
    return t(`errors.${camelCase}Error.hint`, { defaultValue: '' })
  }

  return (
    <div className="error-message">
      <div className="error-label">{getErrorLabel()}</div>
      <div className={errorDetails.length > 0 ? 'error-text' : ''}>{error}</div>
      {errorDetails.length > 0 && (
        <div>
          <div className="error-locations-title">{t('errors.problemLocations')}</div>
          <div className="error-locations">
            {errorDetails.map((detail, index) => (
              <div key={index} className="error-location-item">
                {t('errors.locationDetail', {
                  row: detail.row + 1,
                  col: detail.column + 1,
                  value: detail.number,
                })}
              </div>
            ))}
          </div>
          {errorType && <div className="error-hint">{getErrorHint()}</div>}
        </div>
      )}
      {errorType === 'InternalServerError' && errorDetails.length === 0 && (
        <div className="error-hint">{t('errors.InternalServerError.hint')}</div>
      )}
    </div>
  )
}

export default ErrorDisplay
