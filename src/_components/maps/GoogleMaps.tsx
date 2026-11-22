'use client';
import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import styles from './styles.module.css';

type MarkerData = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    deal?: string;
};

type Props = {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    markers?: MarkerData[];
    mapId?: string;
    onMarkerClick?: (markerId: string) => void;
};

let mapsOptionsSet = false;

function ensureMapsOptionsSet() {
    if (mapsOptionsSet) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        throw new Error(
            'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined'
        );
    }

    setOptions({
        key: apiKey,
        v: 'weekly',
    });
    mapsOptionsSet = true;
}
export function GoogleMap({
                              latitude = 45.5017,
                              longitude = -73.5673,
                              zoom = 13,
                              markers = [],
                              mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
                              onMarkerClick,
                          }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const advancedMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
    const [mapReady, setMapReady] = useState(false);

    // 1. Create the map once on mount.
    useEffect(() => {
        if (!containerRef.current) return;
        let cancelled = false;

        const initMap = async () => {
            ensureMapsOptionsSet();

            try {
                ensureMapsOptionsSet();

                if (!mapId) {
                    throw new Error(
                        'Google Maps Map ID is not defined'
                    );
                }

                const { Map } =
                    (await importLibrary('maps')) as google.maps.MapsLibrary;

                if (cancelled || !containerRef.current) return;

                const map = new Map(containerRef.current, {
                    center: {
                        lat: latitude,
                        lng: longitude,
                    },
                    zoom,
                    disableDefaultUI: true,

                    // Styling is controlled by Google Cloud
                    // because a Map ID is being used.
                    mapId,
                });

                mapInstanceRef.current = map;
                setMapReady(true);
            } catch (err) {
                console.error('Failed to load Google Maps:', err);
            }
        };

        void initMap();

        return () => {
            cancelled = true;
            mapInstanceRef.current = null;
        };
        // Intentionally run once: center/zoom updates are handled below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Keep center/zoom in sync without recreating the map.
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        map.setCenter({ lat: latitude, lng: longitude });
        map.setZoom(zoom);
    }, [latitude, longitude, zoom, mapReady]);

    // 3. Sync markers: clear old ones, then add current ones.
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        let cancelled = false;

        const syncMarkers = async () => {
            const { AdvancedMarkerElement } = (await importLibrary(
                'marker'
            )) as google.maps.MarkerLibrary;
            if (cancelled) return;

            // Clear previous markers before adding the new set.
            advancedMarkersRef.current.forEach((m) => (m.map = null));
            advancedMarkersRef.current = [];

            markers.forEach((marker) => {
                const el = document.createElement('div');
                el.className = styles.dealMarker;
                el.textContent = marker.deal ?? marker.title;

                const advancedMarker = new AdvancedMarkerElement({
                    map,
                    position: { lat: marker.latitude, lng: marker.longitude },
                    content: el,
                    title: marker.title,
                });

                el.addEventListener('click', () => onMarkerClick?.(marker.id));
                advancedMarkersRef.current.push(advancedMarker);
            });
        };
        void syncMarkers();

        return () => {
            cancelled = true;
        };
        // Pass a stable/memoized `markers` reference from the parent (see note below).
    }, [markers, mapReady, onMarkerClick]);

    // 4. Clean up all markers on unmount.
    useEffect(() => {
        return () => {
            advancedMarkersRef.current.forEach((m) => (m.map = null));
            advancedMarkersRef.current = [];
        };
    }, []);

    return (
        <div
            ref={containerRef}
            role="application"
            aria-label="Map"
            style={{ width: '100%', height: '100%' }}
        />
    );
}