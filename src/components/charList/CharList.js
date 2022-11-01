import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './charList.scss';
import useMarvelService from '../../services/MarvelService';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const CharList = (props) => {

    const {comicId} = props;

    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(comicId ? 0 : 1235);

    
    const [comicsEnd, setComicsEnd] = useState(false)

    
    
    const {loading, error, getAllCharecters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        if (comicId) {
            getAllCharecters(offset, null, comicId).then(onCharsLoaded)
        } else {
            getAllCharecters(offset).then(onCharsLoaded)
        }
    }

    const onCharsLoaded = (newChars) => {
        if (chars.length === [...chars, ...newChars].length || newChars.length < 9) {
            setComicsEnd(true);
        }
        setChars((chars) => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset((offset) => offset + 9);
    }

    const refsItems = useRef([]);

    const setCurrentChar = (id) => {
        refsItems.current.forEach(i => i.classList.remove('char__item_selected'));
        refsItems.current[id].classList.add('char__item_selected');   
    }

    function listItems(chars) {
        if (!chars.length === 0) {
            return "Sorry, no data about characters in this comic"
        }
        const items = chars.map((i, counter) => {
            let imgStyle = {objectFit: "cover"};
            if (i.thumbnail.indexOf('not_available') > -1 || i.thumbnail.indexOf('4c002e0305708.gif') > -1) {
                imgStyle = {objectFit: "contain"}
            }
            
            return(
                <CSSTransition key={i.id} timeout={500} classNames='char__item'>
                    {comicId ? <Link className="char__item" 
                        ref={el => refsItems.current[counter] = el} 
                        key={i.id} 
                        to={`/chars/${i.id}`}
                        >
                        <img src={i.thumbnail} alt={i.name} style={imgStyle}/>
                        <div className="char__name">{i.name}</div>
                    </Link> : <li className="char__item" 
                        ref={el => refsItems.current[counter] = el} 
                        key={i.id} 
                        onClick={() => {
                            props.onCharSelected(i.id);
                            setCurrentChar(counter);
                            
                    }}>
                        <img src={i.thumbnail} alt={i.name} style={imgStyle}/>
                        <div className="char__name">{i.name}</div>
                    </li>}
                </CSSTransition>
            )            
        })
        return (
            <ul className="char__grid" style={comicId ? {'gridTemplateColumns' : "repeat(5, 200px)"} : null}>
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup> 
            </ul>
        )
    }

    const elements = listItems(chars);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const empty = !loading && !error && chars.length === 0 ? <h3>Sorry, there is no data about characters in this comic</h3> : null;
    const buttonStyle = comicsEnd ? {'display': 'none'} : null;

    return (
        <div className="char__list">
            {errorMessage}
            {empty}
            {elements}
            {spinner}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={buttonStyle}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


export default CharList;