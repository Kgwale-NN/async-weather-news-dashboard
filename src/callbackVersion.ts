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

interface GeocodingResponse {
    results?: Array<{
        name: string
        country: string
        latitude: number
        longitude: number
    }>
}

type DataCallback<T> = (error: Error | null, data?: T) => void

const city = process.argv.slice(2).join(" ").trim()
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

if (!city) {
    console.error('Error: Enter a city, for example: npm run callback -- "Cape Town"')
    process.exit(1)
}

const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`

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

            let data: T
            try {
                data = JSON.parse(body) as T
            } catch {
                callback(new Error("The API returned invalid JSON"))
                return
            }

            callback(null, data)
        })

        response.on("error", callback)
    }).on("error", (error) => {
        callback(error)
    })
}

console.log(`Fetching weather for ${city} and news with callbacks...\n`)

getJson<GeocodingResponse>(geocodingUrl, (locationError, locations) => {
    if (locationError) {
        console.error(`Error: Location request failed: ${locationError.message}`)
        process.exitCode = 1
        return
    }

    const location = locations?.results?.[0]
    if (!location) {
        console.error(`Error: Location not found: ${city}`)
        process.exitCode = 1
        return
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`

    getJson<WeatherResponse>(weatherUrl, (weatherError, weather) => {
        if (weatherError || !weather) {
            console.error(`Error: Weather request failed: ${weatherError?.message ?? "No weather data returned"}`)
            process.exitCode = 1
            return
        }

        console.log(`Weather in ${location.name}, ${location.country}`)
        console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
        console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
        console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}\n`)

        getJson<NewsResponse>(newsUrl, (newsError, news) => {
            if (newsError || !news) {
                console.error(`Error: News request failed: ${newsError?.message ?? "No news data returned"}`)
                process.exitCode = 1
                return
            }

            console.log("Latest headlines (sample posts)")
            news.posts.forEach((post, index) => {
                console.log(`${index + 1}. ${post.title}`)
            })
        })
    })
})
