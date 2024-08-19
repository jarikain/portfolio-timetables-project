import { ApiResponse, DigiTrafficResponce } from './apiResponceTypes.js';
import { TrainStation, TransformedData } from './dataTypes.js';

export interface TimeTableInterface {
  fetchBusData(locationId: string[], trips: number[]): Promise<ApiResponse>;
}

export interface DigiTrafficInterface {
  fetchTrainData(
    trainStationId: string,
    numberOfDepartingTrains: number,
    trainStationName: string
  ): Promise<DigiTrafficResponce>;
}

export interface ProcessBusDataInterface {
  processBusData(data: ApiResponse): TransformedData;
}

export interface ProcessTrainDataInterface {
  processTrainData(data: DigiTrafficResponce): TrainStation;
}
