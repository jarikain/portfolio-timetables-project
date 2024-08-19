# "JuBu" Timetables

"JuBu" is an info-screen project for showing train and bus timetables. It is developed for
LAB University of Applied Sciences and meant to be used at their campuses.

This timetable project has 3 sub-projects:
- Front-end [client application](client) for the info-screen devices
- [Server application](server) that fetches timetable information at intervals and serves them in a custom format
- [Admin panel](adminPanel) for customizing the views and selecting the bus/train stops to be viewed

Technical documentation for common problems and use-cases can be found [here](server/tech-documentation.md).

## System Overview

![Overview of the project](jubu-overview.svg)

1. Frontend Applications:
    - Client and admin panel are served by the server application's internal web server
    - They interact with the server API
2. Client Response:
    - Response content is dynamically created based on *location settings* and client's IP
    - Response is formed from cached data
3. Location Settings:
    - Managed through the admin panel
    - Stored in database
    - Different train station and bus stop settings are possible (e.g., for different campuses)
    - One location setting can apply to multiple IP addresses
    - Each IP address is associated with exactly one location setting
4. Server Application Components:
   - Database interactions:
     - Fetches and updates settings issued by admin panel
   - Data Fetcher for saving external API queries:
     - Retrieves timetable and weather data
     - Stores settings and API responses to cache 
   - API request handling:
     - Responses to HTTP requests
     - Transforms cached data to client's response
5. Public API Query Schedule:
    - Daily: Backup (24h) timetables
    - Every 30 seconds: Near real-time arrival and delay estimates
    - If short term public API requests fail, response to client is formed from backup data


## API keys for running the application
Two API keys are required to run this application. These services have free tiers, which are generous
enough for this project.

For DigiTransit (buses), create an account and then go *Products -> Digitransit developer API ->
Subscribe*. The API key is in Profile.

https://portal-api.digitransit.fi/

OpenWeatherMap will have pre-made API key in *API keys* after signing in. The default subscription 
is free, and it has limit of 60 calls per minute.

https://openweathermap.org/

## Development

After cloning this project, run:
```bash
npm run init
npm run install:all
```

Then fill in the `server/.env`, with or without " "
```dotenv
DIGITRANSIT_API_KEY=example-key
WEATHER_API_KEY="example-key"
```

Run the app in dev mode. This command also builds the client and the admin panel with --watch flags:
```bash
npm run dev:all
```

Notes:
- The --watch flag re-builds the client and the admin panel every time there are changes to the TypeScript files
- The server is not run with --watch flags, as it fires the API requests upon restart, and it should not be restarting 
  uncontrollably - restart server if there are changes
- The dev server is run with [TSX](https://tsx.is/)
- Default addresses:
  - Client: http://localhost:3000
  - Admin panel: http://localhost:3000/hallinta 

## Installing for production
A setup script is provided for production release (tested on Ubuntu 22.04 LTS server).
After cloning this project, run:
```
./setup.sh
```
Fill in API keys to `server/.env`:

```bash
nano server/.env
```


```dotenv
DIGITRANSIT_API_KEY=example-key
WEATHER_API_KEY="example-key"
```

Fill in the details for client and admin panel `.env.production`

```
nano client/.env.production
nano adminPanel/.env.production
```

```dotenv
VITE_API_BASE_URL=
VITE_BASE_URL=
```

Start the service. The script *enables* the system service, so it is started on reboots:
```bash
sudo systemctl start jubu
```