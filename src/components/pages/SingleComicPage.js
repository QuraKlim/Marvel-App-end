import { Helmet } from 'react-helmet';

import './singleComicPage.scss';
import { useState, useEffect } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import CharList from '../charList/CharList';
import useMarvelService from '../../services/MarvelService';
import { useParams, Link } from 'react-router-dom';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {loading, error, clearError, getSingleComic} = useMarvelService();

    useEffect(() => {
        updateComic();
        console.log('request')
        // eslint-disable-next-line
    }, [comicId])

    const updateComic = () => {
        console.log(comicId)
        clearError();
        getSingleComic(comicId).then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        console.log(comic)
        setComic(comic)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <><View comic={comic}/><h2 style={{'marginBottom': '30px'}}>Characters in this comic:</h2> <CharList comicId={comicId}/></> : null;

    return (
        
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, thumbnail, language, pageCount, price, link } = comic;
    

    return(
        <div className="single-comic">
            <Helmet>
                <title>{comic ? comic.title : 'Comic page'}</title>
            </Helmet>
            <img src={thumbnail} alt="x-men" className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">Pages: {pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
                <a href={link} target="_blank" rel="noreferrer" className="single-comic__link">Comic page on Marvel.com</a>
            </div>
            <Link to=".." className="single-comic__back">Back</Link>
            
        </div>
    )
}



export default SingleComicPage;