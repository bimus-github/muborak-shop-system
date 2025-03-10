'use server'

import { connect } from "@/database/config"
import axios from "axios"


connect()

export const sendTelegramSms = async (chatId: string, message: string) => {
    try {
        const url = process.env.TELEGRAM_BASE_URL!
        const res = await axios.post(`${url}/api/send-message/${chatId}`, {
            message
        },
            {
                headers: {
                    'x-api-key': process.env.TELEGRAM_X_API_KEY!,
                }
            }).then(res => res.data)

        return res
    } catch (error: any) {
        console.log(error)
    }
}