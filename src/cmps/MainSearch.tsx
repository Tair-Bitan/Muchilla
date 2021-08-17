import React, { useEffect, useState } from 'react'
import { useForm } from '../services/customHooks'
import { store } from '../stores/storeHelpers'

interface Props {

}

export const MainSearch = (props: Props) => {

    const { userStore } = store.useStore()
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
        const userSearchResults = users?.map(user => {
            return { imgUrl: user.imgUrl, txt: user.fullname, type: 'user', url: `/user/${user._id}` }
        })
        setSearchResults(userSearchResults)
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
