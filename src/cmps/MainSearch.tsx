import React, { useEffect, useState } from 'react'
import { useForm } from '../services/customHooks'
import { store } from '../stores/storeHelpers'

interface Props {

}

export const MainSearch = (props: Props) => {

    const { userStore, tripStore } = store.useStore()
    const [searchResults, setSearchResults] = useState<({ imgUrl: string, txt: string, type: string, url: string }[] | undefined)>()
    const [formInputs, handleChange] = useForm({ searchStr: '' })

    useEffect(() => {
        getSearchResults()
    }, [formInputs.searchStr])

    const getSearchResults = async () => {
        console.log(formInputs.searchStr);
        if (formInputs.searchStr.length < 3) {
            setSearchResults(undefined)
            return
        }
        const users = await userStore.query(formInputs.searchStr)
        const trips = await tripStore.query(formInputs.searchStr)

        const searchResultsForDisplay: { imgUrl: string, txt: string, type: string, url: string }[] = []
        users?.forEach(user => {
            searchResultsForDisplay.push({ imgUrl: user.imgUrl, txt: user.fullname, type: 'user', url: `/user/${user._id}` })
        })
        trips?.forEach(trip => {
            searchResultsForDisplay.push({ imgUrl: trip.imgUrl, txt: trip.title, type: 'trip', url: `/trip/${trip._id}` })
        })
        setSearchResults(searchResultsForDisplay)
    }

    return (
        <div className="main-search-container">
            <input type="text" name="searchStr" autoComplete="off" placeholder="Search for users" onChange={handleChange} value={formInputs.searchStr} />
            {searchResults?.length && <div className="search-result-list">
                {searchResults.map(res => {
                    return (
                        <div className="search-result-preview" onClick={() => {
                            window.location.hash = res.url
                            setSearchResults(undefined)
                        }}>
                            <img src={res.imgUrl} alt="" />
                            <p>{res.txt}</p>
                        </div>
                    )
                })}
            </div>}
        </div>
    )
}
