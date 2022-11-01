import { useState, useEffect } from 'react';
import './randomChar.scss';
import setContent from '../../utils/setContent';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService'
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState({});

    const {getCharecter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharecter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }
    
    return (
        <div className="randomchar">
            {setContent(process, View, char)}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, id} = data;
    let imgStyle = {objectFit: "cover"};
    console.log(thumbnail)
    if (thumbnail) {
        if (thumbnail.indexOf('not_available') > -1) {
            imgStyle = {objectFit: "contain"}
        }
    }
    

    return(
        <div className="randomchar__block">
            <Link to={`chars/${id}`}>
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            </Link>
            
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} target="_blank" rel="noreferrer" className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} target="_blank" rel="noreferrer" className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )

}

export default RandomChar;