import {Helmet} from "react-helmet";

import AppBanner from "../appBanner/AppBanner";
import SingleChar from "../singleChar/SingleChar";
import ComicsList from "../comicsList/ComicsList";
import { useState } from "react";

const CharPage = () => {
    const [id, setId] = useState(null);
    const [charName, setCharName] = useState('Character page');

    return (
        <>
            <Helmet>
                <title>{`${charName} page`}</title>
            </Helmet>
            <AppBanner/>
            <SingleChar setId={setId} setCharName={setCharName}/>
            <h2 className='single-char__comics'>Comics with this character :</h2>
            <ComicsList id={id} page="CharPage"/>
        </>
        
    )
}

export default CharPage;