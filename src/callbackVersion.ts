import https from "https"

interface WeatherResponse {
    current: {
        temperature_2m: number
        relative_humidity_2m: number
        wind_speed_10m: number
    }
    current_units: {
        temperature_2m: string
        relative_humidity_2m: string
        wind_speed_10m: string
    }
}

interface NewsResponse {
    posts: Array<{
        id: number
        title: string
    }>
}

type DataCallback<T> = (error: Error | null, data?: T) => void

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

const getJson = <T>(url: string, callback: DataCallback<T>): void => {
    https.get(url, (response) => {
        let body = ""

        response.on("data", (chunk) => {
            body += chunk.toString()
        })

        response.on("end", () => {
            if (response.statusCode !== 200) {
                callback(new Error(`Request failed with status ${response.statusCode}`))
                return
            }

            try {
                callback(null, JSON.parse(body) as T)
            } catch {
                callback(new Error("The API returned invalid JSON"))
            }
        })
    }).on("error", (error) => {
        callback(error)
    })
}

console.log("Fetching weather and news with callbacks...\n")


getJson<WeatherResponse>(weatherUrl, (weatherError, weather) => {
    if (weatherError || !weather) {
        console.error(`Weather error: ${weatherError?.message}`)
        return
    }

    console.log("Weather in Johannesburg")
    console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
    console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
    console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}\n`)

    getJson<NewsResponse>(newsUrl, (newsError, news) => {
        if (newsError || !news) {
            console.error(`News error: ${newsError?.message}`)
            return
        }

        console.log("Latest headlines")
        news.posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`)
        })
    })
})
