import { useContext, useEffect, useState } from "react"
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material'

import MyMapContext from "../context/MyMapContext"


const SearchBar = () => {
    const { center, map, setMovies, holdMovies, setSelectedInSearch, filteredMovies} = useContext(MyMapContext)
    
    const [ openBar, setOpenBar ] = useState(false)
    const [ filterParams, setFilterParams ] = useState(null)
    const [ checkedParams, setCheckedParams ] = useState(null)
    const [ selectedItem, setSelectedItem ] = useState(null)

    const customFilter = (param) => {
        const extractedData = holdMovies?.map((movie => movie[param]))
        const uniqueData = [...new Set(extractedData)]
        return uniqueData.map((elm, indx) => { return { id:indx, label:elm } })
    }

    useEffect(() => {
        setFilterParams({
            title: customFilter('title'),
            year: customFilter('year'),
            locations: customFilter('locations'),
            production: customFilter('production'),
            distributor: customFilter('distributor'),
            director: customFilter('director'),
            writer: customFilter('writer'),
        })
    }, [holdMovies])

    const isChecked = (e) => {
        const { target } = e
        // console.log(target.checked, target.value)
        setCheckedParams(target.value)
    }

    const selectedOnAutoComplete = (e) => {
        // console.log(e)
        const { type, target } = e
        if (type === 'click') {
            setSelectedItem(target.innerText)
            setSelectedInSearch({param: checkedParams, value: target.innerText})
            setOpenBar(false)
        } else if (type === 'keydown') {
            setSelectedItem(target.value)
            setSelectedInSearch({param: checkedParams, value: target.value})
            setOpenBar(false)
        }
    }

    const resetZoom = () => {
        map.panTo(center)
        map.setZoom(11)
        setOpenBar(false)
    }

    const reset = () => {
        setMovies(holdMovies)
        setOpenBar(false)
    }

    return (
        <div className={`absolute z-10 top-2 left-2 p-0.5 bg-white rounded-md ${openBar && 'w-48'}`}>
            <div className="relative p-1">
                <span className="text-2xl font-bold cursor-pointer" onClick={() => setOpenBar(!openBar)}>
                    ????{openBar && 'Options'}
                </span>
                <div className={`w-full capitalize ${openBar && 'p-2'}`}>
                {
                    openBar &&
                    <>
                        <Button className="w-full" variant="contained" onClick={() => resetZoom()}>
                            Reset Zoom
                        </Button>
                        <span className="w-full font-bold text-xl">Filter by...</span>
                        <FormControl>
                        <RadioGroup name="filter by..." onChange={(event) => isChecked(event)}>
                        {
                            Object.keys(filterParams).map((elm, indx) => 
                                <FormControlLabel
                                    key={indx}
                                    label={elm}
                                    value={elm}
                                    control={<Radio/>}
                                />
                            )
                        }
                        </RadioGroup>
                        </FormControl>
                        {
                            checkedParams &&
                            <Autocomplete
                                options={filterParams[checkedParams]}
                                autoComplete
                                renderInput={(params) => <TextField {...params} label={checkedParams} />}
                                onChange={(event) => selectedOnAutoComplete(event)}
                            />
                        }
                        <Button className="w-full" disabled={!filteredMovies} variant="contained" onClick={() => reset()}>
                            Show All
                        </Button>
                    </>
                }
                </div>
            </div>
        </div>
    )
}

export default SearchBar