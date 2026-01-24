import crypto from 'crypto'

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
}

interface TelegramInitData {
  query_id?: string
  user?: TelegramUser
  auth_date: number
  hash: string
}

/**
 * Validate Telegram Web App initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
 */
export function validateTelegramWebAppData(initData: string, botToken: string): TelegramInitData | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    
    if (!hash) {
      return null
    }

    // Remove hash from params and sort
    urlParams.delete('hash')
    const params: string[] = []
    urlParams.forEach((value, key) => {
      params.push(`${key}=${value}`)
    })
    params.sort()
    const dataCheckString = params.join('\n')

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) {
      return null
    }

    // Parse user data
    const userStr = urlParams.get('user')
    const user = userStr ? JSON.parse(userStr) : undefined
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10)
    const queryId = urlParams.get('query_id') || undefined

    // Check if data is not too old (24 hours)
    const now = Math.floor(Date.now() / 1000)
    if (now - authDate > 86400) {
      return null
    }

    return {
      query_id: queryId,
      user,
      auth_date: authDate,
      hash,
    }
  } catch (error) {
    console.error('Error validating Telegram data:', error)
    return null
  }
}

/**
 * Validate Telegram Login Widget data
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function validateTelegramLoginWidget(data: Record<string, string>, botToken: string): boolean {
  try {
    const { hash, ...restData } = data
    
    if (!hash) {
      return false
    }

    // Sort and join data
    const dataCheckArr = Object.keys(restData)
      .sort()
      .map(key => `${key}=${restData[key]}`)
    const dataCheckString = dataCheckArr.join('\n')

    // Create secret key (SHA256 of bot token)
    const secretKey = crypto
      .createHash('sha256')
      .update(botToken)
      .digest()

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (calculatedHash !== hash) {
      return false
    }

    // Check if data is not too old (24 hours)
    const authDate = parseInt(data.auth_date || '0', 10)
    const now = Math.floor(Date.now() / 1000)
    
    return now - authDate <= 86400
  } catch (error) {
    console.error('Error validating Telegram Login Widget:', error)
    return false
  }
}

/**
 * Send notification to Telegram bot
 */
export async function sendTelegramNotification(message: string, chatId?: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const adminChatId = chatId || process.env.TELEGRAM_ADMIN_CHAT_ID
    
    if (!botToken || !adminChatId) {
      console.log('Telegram notification skipped: missing bot token or chat ID')
      return false
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const result = await response.json() as { ok: boolean; description?: string }
    
    if (!result.ok) {
      console.error('Telegram notification error:', result.description)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error sending Telegram notification:', error)
    return false
  }
}
