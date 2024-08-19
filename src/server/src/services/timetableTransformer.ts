import {
  ApiResponse,
  BusLocation,
  DigiTrafficResponce,
  Stoptime
} from '../types/apiResponceTypes.js';
import {
  Destination,
  finalJson,
  OutputContent,
  OutputTrip,
  TransformedData,
  TripDetails,
  weatherOut
} from '../types/dataTypes.js';
import { LocationSettings } from '../types/utilityTypes.js';
import { trainBuffer, trainStationName } from '../utils/config.js';
import logger from '../utils/logger.js';
import { RefreshManager } from '../utils/RefreshManager.js';

// MARK: BUS BEGINS HERE
/**
 *  Transforms bus data: Calculate departure times to minutesToDeparture.
 * @param {ApiResponse} apiResponse Input data from fetchBusData() function
 * @param {string[]} busStopTitles List of titles to show on the screen. ex: ['To Mukkula' ,'To Travel Centre']
 * @returns {TransformedData} Returns JSON that is a type of TransformedData
 */
export function transformBusData(
  apiResponse: ApiResponse,
  busStopTitles?: string[]
): TransformedData {
  try {
    const transformStoptime = (stoptime: Stoptime): TripDetails => ({
      destinationName: stoptime.headsign || stoptime.trip.route.longName,
      shortName: stoptime.trip.route.shortName,
      minutesToDeparture: calculateDeparture(stoptime.serviceDay, stoptime.realtimeDeparture),
      realtime: stoptime.realtime,
      fullDepartureTime: calculateBusDeparture(stoptime.serviceDay, stoptime.realtimeDeparture)
    });

    const transformLocation = (busLocation: BusLocation, title: string): Destination => ({
      title,
      trips: busLocation?.stoptimesWithoutPatterns?.map(transformStoptime)
    });

    let i: number = 0;
    const busLocations = Object.entries(apiResponse.data);
    let title: string;
    const content = busLocations.map(([key, busLocation]) => {
      if (busStopTitles && Array.isArray(busStopTitles)) {
        title = busStopTitles[i];
        i++;
      } else {
        title = key.charAt(0).toUpperCase() + key.slice(1);
      }
      return transformLocation(busLocation, title);
    });

    return {
      type: 'bus',
      content
    };
  } catch (error) {
    logger.error('Timetable Transformer failed with bus data: ', error);
    return null;
  }
}

function calculateBusDeparture(serviceDay: number, time: number): Date {
  const utcTimeStamp = new Date(serviceDay * 1000 + time * 1000);
  return new Date(utcTimeStamp.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));
}

function calculateDeparture(serviceDay: number, realtimeDeparture: number): number | string {
  const now: number = Date.now();
  const departure = serviceDay * 1000 + realtimeDeparture * 1000;
  const timeToDeparture: number = departure - now;
  let minutesToDeparture: number = Math.floor(timeToDeparture / (60 * 1000));
  if (minutesToDeparture < 0) minutesToDeparture = 0;
  else if (minutesToDeparture > 60) {
    const departureTime = new Date(departure);
    return formatTime(departureTime as unknown as string);
  }
  return minutesToDeparture;
}

// MARK: TRAINS BEGIN HERE
/**
 * Function is used to transform data from fetchTrainData() function.
 * It transforms the departure times to finnish time. Calculates minutesToDeparture.
 * Removes unwanted characters from train stop names and orders the final list using time.
 * @param {DigiTrafficResponce} data Data from fetchTrainData() function. Type: DigiTrafficResponce
 * @param {string} stationTitle Title to show on screen on top of the train table. ex: 'Departures'
 * @param {string} stationShortCode Short code of the station you wish to filter the data for. ex: 'LH' for Lahti or 'HKI' for Helsinki
 * @param {number} numberOfTrains Number of departing trains to show as output.
 * @returns {OutputContent} Returns JSON
 */

export function processTrainData(
  data: DigiTrafficResponce,
  stationTitle?: string,
  stationShortCode?: string,
  numberOfTrains?: number
): OutputContent {
  const now = new Date();

  function calculateMinutesToDeparture(dateStr: string): number {
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    return Math.max(0, Math.round(diffMs / 60000)); // Minutes
  }

  const numberOfOutputTrains = data.data.trainsByStationAndQuantity.length - trainBuffer;

  const trips: OutputTrip[] = data.data.trainsByStationAndQuantity
    .map((train) => {
      // Etsi haluttu rivi jokaisesta junasta
      const desiredRow = train.timeTableRows.find((row) => {
        const departureTime = new Date(row.liveEstimateTime || row.scheduledTime);
        return (
          row.station.shortCode === stationShortCode &&
          row.type === 'DEPARTURE' &&
          row.actualTime == null &&
          departureTime > now
        );
      });
      // Jos haluttu rivi löytyy, palauta uusi objekti, muuten palauta undefined
      if (desiredRow) {
        const destinationName = train.timeTableRows[train.timeTableRows.length - 1].station.name;
        const shortName = train.commuterLineid || `${train.trainType.name} ${train.trainNumber}`;
        const delayed =
          desiredRow.differenceInMinutes !== null && desiredRow.differenceInMinutes > 0;
        const cancelled = train.cancelled;

        return {
          destinationName: destinationName.replace(' asema', ''),
          shortName,
          commercialTrack: desiredRow.commercialTrack,
          delayed,
          departureTime: formatTime(desiredRow.scheduledTime),
          liveEstimateTime: formatTime(desiredRow.liveEstimateTime || desiredRow.scheduledTime),
          minutesToDeparture: calculateMinutesToDeparture(
            desiredRow.liveEstimateTime || desiredRow.scheduledTime
          ),
          cancelled: cancelled,
          fullDepartureTime: desiredRow.scheduledTime
        };
      } else {
        return undefined;
      }
    })
    .filter((trip) => trip !== undefined) as OutputTrip[]; // Suodataan undefined pois

  // Lajitellaan junat aikajärjestykseen departureTime:n mukaan
  trips.sort((a, b) => {
    const timeA = new Date(`${a.fullDepartureTime}`).getTime();
    const timeB = new Date(`${b.fullDepartureTime}`).getTime();
    return timeA - timeB;
  });
  let outputTitle: string;

  if (stationTitle) {
    outputTitle = stationTitle;
  } else {
    outputTitle = trainStationName;
  }

  if (trips.length > (numberOfTrains || 8) + trainBuffer) {
    return {
      type: 'train',
      content: [
        {
          title: outputTitle,
          trips: trips.slice(0, numberOfTrains)
        }
      ]
    };
  } else if (trips.length == 0 || null || undefined) {
    return null;
  }

  return {
    type: 'train',
    content: [
      {
        title: outputTitle,
        trips: trips.slice(0, numberOfOutputTrains)
      }
    ]
  };
}

// Junille tarvittava ajanmuunin
function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  let finnishDate = date.toLocaleTimeString('fi-FI', {
    hour: '2-digit',
    minute: '2-digit'
  });
  finnishDate = finnishDate.replace('.', ':');
  return finnishDate.slice(0, 5); // "HH:MM" in ISO 8601
}

// MARK: Final Json here
/**
 * Builds a final JSON that our backend returns from /timetables api calls
 * @param {weatherOut} weatherData Weather. JSON.
 * @param {TransformedData} busData Transformed Bus Data. JSON.
 * @param {OutputContent} trainData Transformed Train Data. JSON.
 * @param {LocationSettings} settings Cached location settings. JSON.
 * @param {string } ip
 * @returns {finalJson} Returns JSON.
 */
export function makeFinalJson(
  weatherData: weatherOut | null,
  busData: TransformedData | null,
  trainData: OutputContent | null,
  settings: LocationSettings | undefined,
  ip: string | undefined
): finalJson {
  const interval = settings?.updateInterval;
  const cityName = settings?.city;
  const viewIds = settings?.bus?.viewIds;

  const baseObject: Partial<finalJson> = {
    viewChangeIntervalSeconds: interval,
    location: cityName,
    theme: settings?.theme
  };

  if (weatherData !== null) {
    baseObject.weather = weatherData;
  }

  const views: (TransformedData | OutputContent)[] = [];

  if (busData && busData.content.length > 0) {
    if (!viewIds || viewIds.length === 0) {
      // If no viewIds provided, treat all bus data as one view
      views.push(busData);
    } else {
      let currentView: TransformedData = { type: 'bus', content: [] };
      let currentViewId = viewIds[0];
      busData.content.forEach((stop, index) => {
        if (currentView && viewIds[index] !== currentViewId) {
          if (currentView.content.length > 0) {
            views.push(currentView);
          }
          currentView = { type: 'bus', content: [] };
          currentViewId = viewIds[index];
        }
        currentView?.content.push(stop);
      });

      // Push the last view if it has content
      if (currentView.content.length > 0) {
        views.push(currentView);
      }
    }
  }

  if (trainData?.content[0].trips !== undefined) {
    views.push(trainData);
  }

  if (views.length > 0) {
    baseObject.views = views;
  }

  addNewDateLines(baseObject as finalJson);
  addRefreshNeeded(baseObject as finalJson, ip);

  return baseObject as finalJson;
  // Muoto jota palautuksen pitäisi olla alla
  // return {
  //   viewChangeIntervalSeconds: interval,
  //   location: cityName,
  //   theme: LAB,
  //   weather: weatherData,
  //   refreshNeeded: false,
  //   views: [busData, trainData]
  // };
}

// MARK: BACKUP HERE
/**
 * Funktio käy läpi sille syötetyn datan ja palauttaa seuraavat (trips) määrän junia jotka eivät ole vielä lähteneet asemalta
 * @param {DigiTrafficResponce} trainResponse Raaka data DigiTrafficin Apilta
 * @param {number} trips Montako junaa halutaan palauttaa isosta listasta
 * @param {Date} startTime Date() aikaleima mistä lähdetään vertaamaan
 * @returns
 */
export function processBackupTrainData(
  trainResponse: DigiTrafficResponce,
  trips: number,
  startTime: Date
): DigiTrafficResponce {
  const trains = trainResponse.data.trainsByStationAndQuantity;
  const now = startTime;

  const upcomingTrains = trains.filter((train) => {
    const scheduledTime = new Date(train.timeTableRows[0].scheduledTime);
    return scheduledTime > now;
  });

  const sortedTrains = upcomingTrains.sort((a, b) => {
    const timeA = new Date(`${a.timeTableRows[0].scheduledTime}`).getTime();
    const timeB = new Date(`${b.timeTableRows[0].scheduledTime}`).getTime();
    return timeA - timeB;
  });

  return {
    data: {
      trainsByStationAndQuantity: sortedTrains.slice(0, trips - trainBuffer)
    }
  };
}

/**
 * Funktio käy läpi sille syötetyn datan a palauttaa seuraavat (trips) määrän busseja kullekkin pysäkille, jotka eivät ole vielä lähteneet.
 * @param busResponse Raaka data DigiTransitin apilta
 * @param trips Lähtevien bussien määrä
 * @param startTime Date() aikaleima johon verrataan lähteviä busseja
 * @returns
 */
export function processBackupBusData(
  busResponse: ApiResponse,
  trips: number,
  startTime: Date
): ApiResponse {
  const now = Math.floor(startTime.getTime() / 1000);

  const filteredBuses = Object.keys(busResponse.data).reduce(
    (result, busStopKey) => {
      const busStop = busResponse.data[busStopKey];
      const filteredStopTiems = busStop.stoptimesWithoutPatterns
        .filter((bus) => {
          const departureTime = bus.serviceDay + bus.realtimeDeparture;
          return departureTime > now;
        })
        .slice(0, trips);

      result[busStopKey] = {
        ...busStop,
        stoptimesWithoutPatterns: filteredStopTiems
      };
      return result;
    },
    {} as { [key: string]: BusLocation }
  );

  return {
    data: filteredBuses
  };
}

// MARK: New date lines
/**
 * Funktio käy läpi sille annetun finalJsonin ja lisää view:sseissä oleviin bussi ja juna listoihin "Next Day" olion.
 * @param json JSON tyyppiä finalJson
 * @returns JSON
 */
function addNewDateLines(json: finalJson) {
  json.views.forEach((view) => {
    view?.content.forEach((content) => {
      const maxLength = content?.trips?.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newTrips: any[] = [];

      content?.trips?.forEach((trip, index) => {
        newTrips.push(trip);

        const nextTrip = content.trips[index + 1];

        if (nextTrip && nextTripIsNextDay(trip, nextTrip)) {
          const nextDayString = new Date(nextTrip.fullDepartureTime).toLocaleDateString('fi-FI');
          newTrips.push({
            destinationName: nextDayString,
            nextDay: true
          });
        }
      });

      if (newTrips.length > maxLength) {
        newTrips.splice(maxLength);
      }

      content.trips = newTrips;
    });
  });
  return json;
}

function nextTripIsNextDay(trip: OutputTrip | TripDetails, nextTrip: OutputTrip | TripDetails) {
  const thisLocalDate = new Date(trip.fullDepartureTime).toLocaleDateString('fi-FI');
  const nextLocalDate = new Date(nextTrip.fullDepartureTime).toLocaleDateString('fi-FI');

  const [thisDay, thisMonth, thisYear] = thisLocalDate.split('.').map(Number);
  const [nextDay, nextMonth, nextYear] = nextLocalDate.split('.').map(Number);

  const thisDate = new Date(thisYear, thisMonth - 1, thisDay);
  const nextDate = new Date(nextYear, nextMonth - 1, nextDay);

  thisDate.setHours(0, 0, 0, 0);
  nextDate.setHours(0, 0, 0, 0);

  const millisecondsInDay = 60 * 60 * 24 * 1000;
  return nextDate.getTime() - thisDate.getTime() >= millisecondsInDay;
}

function addRefreshNeeded(finalJson: finalJson, ip: string | undefined): finalJson {
  finalJson.refreshNeeded = RefreshManager.getInstance().checkIp(ip);

  return finalJson;
}
