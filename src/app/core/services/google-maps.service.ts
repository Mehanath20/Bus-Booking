import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleMapsService {
    private loader: Loader;

    constructor() {
        this.loader = new Loader({
            apiKey: environment.googleMaps.apiKey,
            version: 'weekly',
            libraries: ['places', 'marker']
        });
    }

    async initMap(
        element: HTMLElement,
        options: any
    ): Promise<any> {
        await this.loader.load();
        const { Map } = await (window as any).google.maps.importLibrary('maps');
        return new Map(element, options);
    }

    async addMarker(
        map: any,
        position: any,
        title: string,
        icon?: string
    ): Promise<any> {
        const { AdvancedMarkerElement } = await (window as any).google.maps.importLibrary('marker');

        return new AdvancedMarkerElement({
            map,
            position,
            title
        });
    }

    async drawPolyline(
        map: any,
        path: any[],
        color: string = '#4285F4'
    ): Promise<any> {
        const { Polyline } = await (window as any).google.maps.importLibrary('maps');

        return new Polyline({
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map
        });
    }

    async animateMovingBus(
        map: any,
        path: any[],
        speed: number = 1000,
        onUpdate?: (position: any) => void
    ): Promise<any> {
        let currentIndex = 0;
        const marker = await this.addMarker(map, path[0], 'Bus', 'assets/bus-icon.png');

        const interval = setInterval(() => {
            if (currentIndex >= path.length - 1) {
                clearInterval(interval);
                return;
            }

            currentIndex++;
            const newPosition = path[currentIndex];
            marker.position = newPosition;

            if (onUpdate) {
                onUpdate(newPosition);
            }
        }, speed);

        return marker;
    }

    interpolatePath(
        start: any,
        end: any,
        steps: number = 10
    ): any[] {
        const path: any[] = [];
        for (let i = 0; i <= steps; i++) {
            const fraction = i / steps;
            const lat = start.lat + (end.lat - start.lat) * fraction;
            const lng = start.lng + (end.lng - start.lng) * fraction;
            path.push({ lat, lng });
        }
        return path;
    }
}
