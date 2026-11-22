import {GoogleMap} from "@/_components/maps/GoogleMaps";

export default function Page() {
    const markers = [
        {
            id: '1',
            latitude: 45.5017,
            longitude: -73.5673,
            title: '$15',
        },
        {
            id: '2',
            latitude: 45.5088,
            longitude: -73.554,
            title: '2 for 1',
        },
        {
            id: '3',
            latitude: 45.496,
            longitude: -73.58,
            title: '-25%',
        },
    ];
    return(
        <>
            <div style={{width: '100dvw', height: '100dvh'}}>
                <GoogleMap
                    latitude={45.5017}
                    longitude={-73.5673}
                    zoom={13}
                    markers={markers}
                />
            </div>
        </>
    )
}