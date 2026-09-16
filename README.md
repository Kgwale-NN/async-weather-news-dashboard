# Async Weather & News Dashboard

A simple Node.js and TypeScript console dashboard that fetches weather for a city you enter and displays five sample headlines. It demonstrates three ways to handle asynchronous work: callbacks, Promises, and async/await.

## What the project does

1. You enter a city name in the command.
2. The [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) looks up its coordinates.
3. The [Open-Meteo Weather API](https://open-meteo.com/en/docs) returns current temperature, humidity, and wind speed.
4. [DummyJSON Posts](https://dummyjson.com/docs/posts) supplies five sample post titles to display as headlines.

The city is **not hardcoded**. The program does not automatically detect your GPS location; you provide a city. DummyJSON posts are sample content, **not live or local news**.

## Requirements

- Node.js and npm
- Internet access while running the dashboard

No API key is needed for this learning project.

## Install and run

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Kgwale-NN/async-weather-news-dashboard.git
cd async-weather-news-dashboard
npm install
```

Choose one version. Put your city after `--`:

```bash
npm run callback -- "Cape Town"
npm run promise -- "Cape Town"
npm run async -- "Cape Town"
```

To check the TypeScript code:

```bash
npm run typecheck
```

Use another city in place of `Cape Town`. A city and country, such as `"Paris, France"`, can help distinguish places with the same name. If you do not enter a city or no location is found, the program prints a readable error.

## Three asynchronous styles

| File | Style | What it demonstrates |
| --- | --- | --- |
| `src/callbackVersion.ts` | Callbacks with Node's `https` module | Location request → weather request → news request nested inside callbacks |
| `src/promiseVersion.ts` | Promises with Node's `https` module | `.then()` chaining, `Promise.all()` for weather and news together, and `Promise.race()` for the first response |
| `src/asyncAwaitVersion.ts` | Async/await with `fetch()` | `await` for each request and `try...catch` for failures |

`Promise.all()` waits for both requests to succeed. `Promise.race()` reports whichever request settles first; the winner can change between runs.

## Sample console output

These examples are shortened for readability. Weather values change over time, and the fastest API in `Promise.race()` can change.

### Callback version

```text
Fetching weather for Cape Town and news with callbacks...

Weather in Cape Town, South Africa
Temperature: 15.6°C
Humidity: 56%
Wind speed: 23.8 km/h

Latest headlines (sample posts)
1. His mother had always taught him
2. He was an expert but not in a discipline
...
```

### Promise version

```text
Fetching weather for Cape Town and news with Promises...

1. Chained Promises: location, then weather, then news
Weather in Cape Town, South Africa
Temperature: 15.6°C
Latest headlines (sample posts)
...

2. Promise.all(): weather and news together
Weather in Cape Town, South Africa
Latest headlines (sample posts)
...

3. Promise.race(): first API to respond
Weather API responded first
```

### Async/await version

```text
Fetching weather for Cape Town and news with async/await...

Weather in Cape Town, South Africa
Temperature: 15.6°C
Humidity: 56%
Wind speed: 23.8 km/h

Latest headlines (sample posts)
1. His mother had always taught him
2. He was an expert but not in a discipline
...
```

## Errors

All three versions print readable `Error: ...` messages and exit with a failure code if a request fails, the API returns invalid JSON, or the city cannot be found. They print a usage example if the city is missing.

## What I learned

- Callbacks run later when a request finishes. Nesting dependent callbacks makes the flow harder to read.
- A Promise represents a result that may arrive later. `.then()` chains dependent steps; `.catch()` handles failures.
- `Promise.all()` starts independent requests together and waits for both. `Promise.race()` continues with the first one to settle.
- `async/await` makes Promise-based steps read from top to bottom, while `try...catch` handles errors.
- The event loop lets Node.js handle other work while it waits for network responses; the program does not block on each request.

## Project structure

```text
async-weather-news-dashboard/
├── src/
│   ├── callbackVersion.ts
│   ├── promiseVersion.ts
│   └── asyncAwaitVersion.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Assignment checklist

- [x] Node.js and TypeScript setup
- [x] Callback implementation with nested `https` requests
- [x] Promise chaining, `Promise.all()`, and `Promise.race()`
- [x] Async/await implementation with `try...catch`
- [x] Readable error handling across all versions
- [x] Run all three npm commands and document sample outputs
