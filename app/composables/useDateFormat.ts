/**
 * 日付フォーマット用のcomposable
 * 様々な日付形式に対応し、日本語形式でフォーマットします
 */
export const useDateFormat = () => {
  /**
   * 日付を日本語形式でフォーマットします
   * @param dateInput - フォーマットする日付（文字列、Date、Firestore Timestamp等）
   * @returns フォーマットされた日付文字列、または '不明'
   */
  const formatDate = (
    dateInput: string | Date | undefined | unknown
  ): string => {
    if (!dateInput) return '不明'

    let date: Date

    try {
      // FirestoreのTimestampオブジェクトの場合
      if (
        dateInput &&
        typeof dateInput === 'object' &&
        'toDate' in dateInput &&
        typeof dateInput.toDate === 'function'
      ) {
        date = dateInput.toDate()
      }
      // Dateオブジェクトの場合
      else if (dateInput instanceof Date) {
        date = dateInput
      }
      // 文字列の場合
      else if (typeof dateInput === 'string') {
        date = new Date(dateInput)
      }
      // 数値のタイムスタンプの場合
      else if (typeof dateInput === 'number') {
        date = new Date(dateInput)
      }
      // その他の場合は文字列として扱う
      else {
        date = new Date(String(dateInput))
      }

      // 有効な日付かチェック
      if (isNaN(date.getTime())) {
        return '不明'
      }

      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('日付フォーマットエラー:', error)
      return '不明'
    }
  }

  /**
   * 日付を短い形式でフォーマットします（日付のみ）
   * @param dateInput - フォーマットする日付
   * @returns フォーマットされた日付文字列、または '不明'
   */
  const formatDateShort = (
    dateInput: string | Date | undefined | unknown
  ): string => {
    if (!dateInput) return '不明'

    let date: Date

    try {
      // FirestoreのTimestampオブジェクトの場合
      if (
        dateInput &&
        typeof dateInput === 'object' &&
        'toDate' in dateInput &&
        typeof dateInput.toDate === 'function'
      ) {
        date = dateInput.toDate()
      }
      // Dateオブジェクトの場合
      else if (dateInput instanceof Date) {
        date = dateInput
      }
      // 文字列の場合
      else if (typeof dateInput === 'string') {
        date = new Date(dateInput)
      }
      // 数値のタイムスタンプの場合
      else if (typeof dateInput === 'number') {
        date = new Date(dateInput)
      }
      // その他の場合は文字列として扱う
      else {
        date = new Date(String(dateInput))
      }

      // 有効な日付かチェック
      if (isNaN(date.getTime())) {
        return '不明'
      }

      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
    } catch (error) {
      console.error('日付フォーマットエラー:', error)
      return '不明'
    }
  }

  /**
   * 相対時間を表示します（例：3時間前、2日前）
   * @param dateInput - 基準となる日付
   * @returns 相対時間文字列、または '不明'
   */
  const formatRelativeTime = (
    dateInput: string | Date | undefined | unknown
  ): string => {
    if (!dateInput) return '不明'

    let date: Date

    try {
      // FirestoreのTimestampオブジェクトの場合
      if (
        dateInput &&
        typeof dateInput === 'object' &&
        'toDate' in dateInput &&
        typeof dateInput.toDate === 'function'
      ) {
        date = dateInput.toDate()
      }
      // Dateオブジェクトの場合
      else if (dateInput instanceof Date) {
        date = dateInput
      }
      // 文字列の場合
      else if (typeof dateInput === 'string') {
        date = new Date(dateInput)
      }
      // 数値のタイムスタンプの場合
      else if (typeof dateInput === 'number') {
        date = new Date(dateInput)
      }
      // その他の場合は文字列として扱う
      else {
        date = new Date(String(dateInput))
      }

      // 有効な日付かチェック
      if (isNaN(date.getTime())) {
        return '不明'
      }

      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMinutes < 1) {
        return 'たった今'
      } else if (diffMinutes < 60) {
        return `${diffMinutes}分前`
      } else if (diffHours < 24) {
        return `${diffHours}時間前`
      } else if (diffDays < 7) {
        return `${diffDays}日前`
      } else {
        return formatDateShort(dateInput)
      }
    } catch (error) {
      console.error('相対時間フォーマットエラー:', error)
      return '不明'
    }
  }

  return {
    formatDate,
    formatDateShort,
    formatRelativeTime,
  }
}
