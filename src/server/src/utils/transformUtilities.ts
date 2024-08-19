import { Location, View } from '../models/infoscreen.js';
import { LocationSettings, BusApiParams, TrainApiParams } from '../types/utilityTypes.js';

/**
 * Parse array of Locations for required settings information.
 * These settings are used for public timetable API calls.
 *
 * @param locations
 */
export function parseLocationSettings(locations: Location[]): LocationSettings[] {
  return locations.map((location) => {
    return {
      locationId: location.id,
      city: location.city,
      updateInterval: location.update_interval,
      train: _getTransformedTrain(location.views, location.city),
      bus: _getTransformedBus(location.views, location.city),
      theme: location.theme
    };
  });
}

function _getTransformedTrain(views: View[], locationName: string): TrainApiParams | null {
  let train = null;

  views.forEach((view) => {
    if (view.type === 'train' && view.enabled && view.stops[0] !== undefined) {
      // Note: While views can have multiple stops, train-views SHOULD have
      // only one stop. So far it is a feature.
      const stop = view.stops[0];
      train = {
        id: stop.stop_api_id,
        name: locationName,
        trips: stop.trips,
        title: stop.title
      };
    }
  });

  return train;
}

function _getTransformedBus(views: View[], locationName: string): BusApiParams | null {
  const bus: BusApiParams = {
    ids: [],
    trips: [],
    titles: [],
    viewIds: []
  };

  // Translate ä=a, ö=o, å=a, for bus params
  const sanitizedName = locationName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  views.forEach((view) => {
    if (view.type === 'bus' && view.enabled) {
      view.stops.forEach((stop) => {
        bus.ids.push(`${sanitizedName}:${stop.stop_api_id}`);
        bus.titles.push(stop.title);
        bus.trips.push(stop.trips);
        bus.viewIds.push(view.id);
      });
    }
  });

  if (bus.ids.length === 0) {
    return null;
  }
  return bus;
}

/**
 * Remove ipv6 part of a Request.ip string.
 * @param ip
 */
export function transformToIpv4(ip: string | undefined): string {
  const parsedIp = ip?.split(':').pop();

  if (parsedIp?.includes('.') || parsedIp === '1') {
    return parsedIp;
  }

  return '';
}
