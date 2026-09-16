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

interface GeocodingResponse {
    results?: Array<{
        name: string
        country: string
        latitude: number
        longitude: number
    }>
}

const city = process.argv.slice(2).join(" ").trim()
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

if (!city) {
    console.error('Error: Enter a city, for example: npm run async -- "Cape Town"')
    process.exit(1)
}

const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`

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
        console.log(`Fetching weather for ${city} and news with async/await...\n`)

        const locations = await getJson<GeocodingResponse>(geocodingUrl)
        const location = locations.results?.[0]
        if (!location) {
            throw new Error(`Location not found: ${city}`)
        }

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        const weather = await getJson<WeatherResponse>(weatherUrl)
        console.log(`Weather in ${location.name}, ${location.country}`)
        console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
        console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
        console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}\n`)

        const news = await getJson<NewsResponse>(newsUrl)
        console.log("Latest headlines (sample posts)")
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
