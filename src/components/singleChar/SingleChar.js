import './singleChar.scss';
import { useParams/* , Link  */} from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const SingleChar = ({setId, setCharName}) => {
    const charId = useParams();
    const [char, setChar] = useState([]);
    const {loading, error, getCharecter} = useMarvelService();

    useEffect(() => {
        setId(charId.charId)
        getCharecter(charId.charId).then(onCharLoaded);
        // eslint-disable-next-line
    }, [])

    function onCharLoaded(res) {
        setChar(res);
        setCharName(res.name);
        
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const charInfo = !loading && ! error ? <Char char={char} /> : null;

    return (
        <div className="single-char">
            {errorMessage}
            {spinner}
            {charInfo}
        </div>
    )
}

const Char = ({char}) => {
    return (
        <>
            <img src={char.thumbnail} alt="char" className='single-char__img'/>
            <div>
                <div className="single-char__name">{char.name}</div>
                <div className="single-char__description">{char.description}</div>
                <a href={char.homepage} target="_blank" rel="noreferrer" className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={char.wiki} target="_blank" rel="noreferrer" className="button button__secondary" style={{'marginLeft': "15px"}}>
                    <div className="inner">Wiki</div>
                </a>
            </div>
        </>
        
    )
}

export default SingleChar;