/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiResponse } from '../types/apiResponceTypes.js';
import { TimeTableInterface } from '../types/servicesTypes.js';
import { DIGITRANSIT_API_KEY } from '../utils/config.js';
import logger from '../utils/logger.js';

const apiUrl: string = 'https://api.digitransit.fi/routing/v1/routers/waltti/index/graphql';

export default class BusApi implements TimeTableInterface {
  /**
   * Funktio hakee pysäkeile (locationIds) listan busseista (trips) määrän, jotka lähtevät sieltä
   * @param {string[]} locationIds parametri tulee olla LISTA vaikka olisikin vain yksi bussipysäkki.
   * @param {number} trips Montako bussia halutaan näkyviin.
   * @returns {Promise<ApiResponse>} Palauttaa ApiResponse tyyppisen lupauksen.
   */
  async fetchBusData(locationIds: string[], trips: number[]): Promise<ApiResponse> {
    const query = makeJsonQuery(locationIds, trips);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'digitransit-subscription-key': DIGITRANSIT_API_KEY
      },
      body: JSON.stringify({ query })
    });
    if (!response.ok) {
      throw Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
    }
    const data: ApiResponse = (await response.json()) as ApiResponse;
    return data;
  }
  catch(error: string) {
    logger.error('Error fetching bus data:', error);
    throw error;
  }

  async getBackupBusTimetable(list: string[]): Promise<ApiResponse> {
    // Ei varmasti fiksuin tapa hakea 24h listaa, mutta api palauttaa maksimissaan vain seuraavat 24h vaikka pyytäisi tuhansia.
    const paramList: number[] = Array(list.length).fill(200) as number[];
    const fullData = await this.fetchBusData(list, paramList);
    return fullData;
  }
}

function makeJsonQuery(locationIds: string[], tripsArray: number[], timeRange?: number): string {
  let output: string = '{\n';
  if (!timeRange) timeRange = 1000000;
  locationIds.forEach((locationId, index) => {
    output += `
      busStop${index + 1}: stop(id: "${locationId}") {
        name
          stoptimesWithoutPatterns(numberOfDepartures: ${tripsArray[index]}, timeRange: ${timeRange}) {
          trip {
            route {
              shortName
              longName
            }
          }
          headsign
          serviceDay
          realtimeDeparture
          realtime
        }
      }`;
  });
  output += '\n}';
  return output;
}
