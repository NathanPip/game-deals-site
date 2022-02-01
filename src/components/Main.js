import React, {useState} from 'react'
import GamesList from './GamesList'
import OptionsMenu from './OptionsMenu';

export default function Main() {
    const [options, setOptions] = useState(null);

    return (
        <div>
            <OptionsMenu setOptions={setOptions}/>
            <GamesList options={options}/>
        </div>
    )
}
