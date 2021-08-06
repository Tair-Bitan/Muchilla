import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxPopover } from '@reach/combobox'
import "@reach/combobox/styles.css"


interface Props {
    setCoords: Function
}

export const Search = ({ setCoords }: Props) => {

    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
        // requestOptions: {}
    })

    return (


        <div className="map-search" >

            <Combobox onSelect={async (address) => {
                setValue(address, false)
                clearSuggestions()
                try {
                    const results = await getGeocode({ address })
                    const { lat, lng } = await getLatLng(results[0])
                    setCoords({ lat, lng })
                } catch (err) {
                    console.log(err);
                }
            }
            }>
                <ComboboxInput
                    value={value}
                    onChange={(ev) => { setValue(ev.target.value) }}
                    disabled={!ready}
                    placeholder={'where do you wanna go?'}
                />

                <ComboboxPopover>
                    {status === "OK" && data.map(({ id, description }) => {
                        return (
                            <ComboboxOption key={id} value={description}></ComboboxOption>
                        )
                    })}
                </ComboboxPopover>


            </Combobox>
        </div>
    )
}
