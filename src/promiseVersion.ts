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

const city = process.argv.slice(2).join(" ").trim()
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

if (!city) {
    console.error('Error: Enter a city, for example: npm run promise -- "Cape Town"')
    process.exit(1)
}

const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
let weatherUrl = ""
let locationName = ""

const getJson = <T>(url: string): Promise<T> => {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let body = ""

            response.on("data", (chunk) => {
                body += chunk.toString()
            })

            response.on("end", () => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Request failed with status ${response.statusCode}`))
                    return
                }

                try {
                    resolve(JSON.parse(body) as T)
                } catch {
                    reject(new Error("The API returned invalid JSON"))
                }
            })

            response.on("error", reject)
        }).on("error", reject)
    })
}

const displayWeather = (weather: WeatherResponse): void => {
    console.log(`Weather in ${locationName}`)
    console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
    console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
    console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}`)
}

const displayNews = (news: NewsResponse): void => {
    console.log("Latest headlines (sample posts)")
    news.posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`)
    })
}

console.log(`Fetching weather for ${city} and news with Promises...`)
console.log("\n1. Chained Promises: location, then weather, then news\n")

getJson<GeocodingResponse>(geocodingUrl)
    .then((locations) => {
        const location = locations.results?.[0]
        if (!location) {
            throw new Error(`Location not found: ${city}`)
        }

        locationName = `${location.name}, ${location.country}`
        weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        return getJson<WeatherResponse>(weatherUrl)
    })
    .then((weather) => {
        displayWeather(weather)
        console.log()
        return getJson<NewsResponse>(newsUrl)
    })
    .then((news) => {
        displayNews(news)

        console.log("\n2. Promise.all(): weather and news together\n")
        return Promise.all([
            getJson<WeatherResponse>(weatherUrl),
            getJson<NewsResponse>(newsUrl)
        ])
    })
    .then(([weather, news]) => {
        displayWeather(weather)
        console.log()
        displayNews(news)

        console.log("\n3. Promise.race(): first API to respond\n")
        return Promise.race([
            getJson<WeatherResponse>(weatherUrl).then(() => "Weather API responded first"),
            getJson<NewsResponse>(newsUrl).then(() => "News API responded first")
        ])
    })
    .then((fastestResult) => {
        console.log(fastestResult)
    })
    .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error(`Error: ${message}`)
        process.exitCode = 1
    })
