import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';
import useMarvelService from '../../services/MarvelService';
import './charInfo.scss';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharecter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId])

    const updateChar = () => {
        if (process === 'error') {
            clearError();
        }
        const {charId} = props;
        if (!charId) {
            return
        }
        getCharecter(charId).then(onCharLoaded).then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
        
    }

    return (
        <div>
            <div className="char__info">
                {setContent(process, View, char)}
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let imgStyle = {objectFit: "cover"};
    if (thumbnail.indexOf('not_available') > -1  || thumbnail.indexOf('4c002e0305708.gif') > 1) {
        imgStyle = {objectFit: "contain"}
    }

    return(
        <>
            <div className="char__basics" >
                <img style={imgStyle} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'Sorry, there is no comics with this character(s)'}
                {
                    comics.map((item, i) => {
                        return(
                            <li key={i} className="char__comics-item">
                                <Link to={`/comics/${item.resourceURI.split('/')[6]}`}>{item.name}</Link>
                            </li>
                            
                        )
                    })
                }
                
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;