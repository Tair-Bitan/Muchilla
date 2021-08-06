import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from 'use-places-autocomplete';

interface Props {
    setCoords: Function
}

export const Search = ({ setCoords }: Props) => {

    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {

        }
    })

    return (
        <div className="map-search" >
            <input type="text"
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
                disabled={!ready}
                placeholder={'where do you wanna go?'}
            />
            <select
                name="suggestions"
                id="suggestions"
                onChange={async (ev) => {
                    setValue(ev.target.value, false)
                    clearSuggestions()
                    try {
                        const results = await getGeocode({ address: ev.target.value })
                        const placeId = results[0].place_id
                        const { lat, lng } = await getLatLng(results[0])
                        setCoords({ lat, lng })
                        const place: any = await getDetails({ placeId })
                        const placePhoto = place.photos[0].getUrl()
                        console.log(placePhoto);




                    } catch (err) {
                        console.log(err);
                    }
                }}>
                {status === "OK" && data.map(({ id, description }) => {
                    return (
                        <option key={id} value={description}>{description}</option>
                    )
                })}
            </select>
        </div>
    )
}
