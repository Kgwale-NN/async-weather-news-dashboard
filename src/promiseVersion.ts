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

const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
const newsUrl = "https://dummyjson.com/posts?limit=5&select=id,title"

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
        }).on("error", reject)
    })
}

const displayWeather = (weather: WeatherResponse): void => {
    console.log("Weather in Johannesburg")
    console.log(`Temperature: ${weather.current.temperature_2m}${weather.current_units.temperature_2m}`)
    console.log(`Humidity: ${weather.current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}`)
    console.log(`Wind speed: ${weather.current.wind_speed_10m} ${weather.current_units.wind_speed_10m}`)
}

const displayNews = (news: NewsResponse): void => {
    console.log("Latest headlines")
    news.posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`)
    })
}

console.log("1. Chained Promises: weather, then news\n")

getJson<WeatherResponse>(weatherUrl)
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
    .catch((error: Error) => {
        console.error(`Promise error: ${error.message}`)
    })
