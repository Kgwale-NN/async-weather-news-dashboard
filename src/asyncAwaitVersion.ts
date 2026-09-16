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

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

const getJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    try {
        return await response.json() as T
    } catch {
        throw new Error("The API returned invalid JSON")
    }
}

const runDashboard = async (): Promise<void> => {
    try {
        console.log("Fetching weather and news with async/await...\n")

        const weather = await getJson<WeatherResponse>(weatherUrl)
        console.log("Weather in Johannesburg")
        console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
        console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
        console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}\n`)

        const news = await getJson<NewsResponse>(newsUrl)
        console.log("Latest headlines")
        news.posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title}`)
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error(`Error: ${message}`)
        process.exitCode = 1
    }
}

runDashboard()
