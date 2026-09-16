# Async Weather & News Dashboard

A Node.js and TypeScript learning project that fetches weather data and news headlines while demonstrating callbacks, promises, and async/await.

## Project status

- [x] Sprint 1: Project setup
- [x] Sprint 2: Callback version
- [x] Sprint 3: Promise version
- [x] Sprint 4: Async/await version
- [x] Sprint 5: Error handling and response consistency
- [ ] Sprint 6: Testing and documentation

## Available commands

```bash
npm run callback
npm run promise
npm run async
npm run typecheck
```

Pass a city after `--` to see weather for that place. For example:

```bash
npm run callback -- "Cape Town"
npm run promise -- "Cape Town"
npm run async -- "Cape Town"
```

The city name is looked up through Open-Meteo's geocoding API. The headlines are sample posts from DummyJSON, not location-based news.

# async-weather-news-dashboard
