/* eslint-disable @typescript-eslint/no-unused-vars */
import { DigiTrafficResponce } from '../types/apiResponceTypes.js';
import { DigiTrafficInterface } from '../types/servicesTypes.js';
import { trainBuffer } from '../utils/config.js';
import logger from '../utils/logger.js';

const apiUrl: string = 'https://rata.digitraffic.fi/api/v2/graphql/graphql';

export default class TrainApi implements DigiTrafficInterface {
  /**
   * Funktio hakee Digitrafficin api:lta trainStationId:tä vastaavat junat.
   * @param {string} trainStationId Juna-aseman lyhenne, esim. 'LH'
   * @param {number} numberOfDepartingTrains Montako lähtevää junaa
   * @returns {Promise<DigiTrafficResponce>} Palauttaa raa'an DigiTraffic response:n. JSON
   */
  async fetchTrainData(
    trainStationId: string,
    numberOfDepartingTrains: number
  ): Promise<DigiTrafficResponce> {
    const now = new Date().toISOString();
    const query: string = makeJsonQuery(trainStationId, numberOfDepartingTrains + trainBuffer, now);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      body: JSON.stringify({ query })
    });
    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        `Network response was not ok: ${response.status} - ${response.statusText}. Response: ${errorText}`
      );
      throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
    }
    const data: DigiTrafficResponce = (await response.json()) as DigiTrafficResponce;
    return data;
  }
  catch(error: string) {
    logger.error('Error fetching train data:', error);
    throw error;
  }

  /**
   * Funktio palauttaa juna-aseman kautta lähtevien junien listan 24h eteenpäin.
   * @param StopApiID Juna aseman 'id', esim 'LH'
   * @returns {Promise<DigiTrafficResponce>} Json jonka rakenne on määritelty DigiTrafficResponce:ssa
   */
  async getBackupTrainTimetable(StopApiID: string): Promise<DigiTrafficResponce> {
    const fullData = await this.fetchTrainData(StopApiID, 999);
    return fullData;
  }
}

function makeJsonQuery(
  trainStationId: string,
  numberOfDepartingTrains: number,
  currentTime: string
) {
  const query: string = `
  {
    trainsByStationAndQuantity(
      station: "${trainStationId}"
      arrivedTrains: 0
      departedTrains: 0
      arrivingTrains: 0
      includeNonStopping: false
      trainCategories: ["Commuter", "Long-distance"]
      departingTrains: ${numberOfDepartingTrains}
      where: {
      and: [
        {operator: {shortCode: {equals: "vr"}}},
      	{
          or: [
      			{timeTableRows: {contains: {scheduledTime: {greaterThan: "${currentTime}"}}}},
      			{timeTableRows: {contains: {liveEstimateTime: {greaterThan: "${currentTime}"}}}}
      		]
        }
      ]
  	}
  ){
      commuterLineid
      trainType {
        name
      }
      cancelled
      trainNumber
      departureDate
      timeTableRows {
        station {
          name
          shortCode
        }
        type
        scheduledTime
        liveEstimateTime
        differenceInMinutes
        actualTime
        commercialTrack
      }
    }
  }
  `;
  return query;
}
