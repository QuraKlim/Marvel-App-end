import './comicsList.scss';

import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const ComicsList = ({id, mainPage}) => {

    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnd, setComicsEnd] = useState(false)

    const {loading, error, getAllComics, getComics} = useMarvelService();

    useEffect(() => {
        loadingComics();
        // eslint-disable-next-line
    }, [id])

    function loadingComics() {
        console.log(offset);
        setNewItemLoading(true);
        if (mainPage) {
            getAllComics(8, offset).then(res => {
                stateComics(res);
                setOffset(offset => offset + 8)
            });
        } else if (id) {
            console.log(offset)
            getComics(id, offset, 8).then(res => {
                stateComics(res);
                setOffset(offset => offset + 8)
            });
        }
    }

    function stateComics(newComics) {
        
        if (comics.length === [...comics, ...newComics].length || newComics.length < 8) {
            setComicsEnd(true);
        }
        setComics(comics => [...comics, ...newComics]);
        
        setNewItemLoading(false);
    }

    function listItems() {

        const elements = comics.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="character" className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {elements}
            </ul>
        )
    }

    const list = listItems();
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const empty = !loading && !error && comics.length === 0 ? 'Sorry, there is no comics with this character(s)' : null;
    const buttonStyle = comicsEnd ? {'display': 'none'} : null;

    return (
        <div className="comics__list">
            {console.log(list)}
            {errorMessage}
            {empty}
            {list}
            {spinner}
            <button onClick={loadingComics} 
                    disabled={newItemLoading} 
                    className="button button__main button__long"
                    style={buttonStyle}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;