
```
.
├── README.md
├── package-lock.json
├── package.json
├── scripts                        // init and SQL scripts
├── src
│   ├── app.ts                     // Express app
│   ├── controllers
│   │   ├── admins.ts              // admin user controllers
│   │   ├── infoscreens.ts         // "infoscreen" settings/models related controllers
│   │   └── timetables.ts          //  controller to respond to client's requests
│   ├── index.ts
│   ├── models
│   ├── routes
│   ├── services                     // business logic, API calls, data management
│   │   ├── busApi.ts
│   │   ├── dataFetcher.ts           // uses bus, train, and weather APIs at intervals, and deposits results to Cache
│   │   ├── databaseService.ts       // most common database actions
│   │   ├── timetableTransformer.ts  // transforms cached data to the form, that is returned to client
│   │   ├── trainApi.ts
│   │   └── weatherApi.ts
│   ├── types
│   └── utils
│       ├── RefreshManager.ts        // manages what IPs are notified, when server sends refresh command (flush cache) to clients
│       ├── cache.ts
│       ├── config.ts
│       ├── database.ts              // creates database connection
│       ├── logger.ts
│       ├── middleware.ts            // async routes' error handlers, generic middleware functions for infoscreen models
│       ├── passport.ts              // auth
│       └── transformUtilities.ts    // transforms database entities to a settings object
└── tsconfig.json
```