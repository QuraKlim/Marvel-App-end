import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import {Link} from 'react-router-dom';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './findByName.scss'

const FindByName = () => {
    /* const [charOffset, setCharOffset] = useState(0); */
    const [findedChars, setfindedChars] = useState([]);

    const {getAllCharecters, loading, error} = useMarvelService();

    function charsOnloaded(res) {
        setfindedChars([...res]);
    }

    function charsList() {
        const findedCharList = findedChars.map((item, i) => {
            return (
                <Link to={`/chars/${item.id}`} className="char-item" key={i}>
                    <img src={item.thumbnail} alt="character" className="char-img" />
                    <div className="char-name">{item.name}</div>
                </Link>
            )
        })

        console.log(findedCharList)

        return (
            <div className="chars">
                {findedCharList}
            </div>

        )
    }
    
    useEffect(() => {
        console.log(findedChars);
        charsList();
        // eslint-disable-next-line
    }, [findedChars])

    const chars = charsList();
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;

    return (
        <div className='search'>
            
            <p className='search__heading'>Or find a character by name:</p>
            <Formik initialValues={{ name: ''}}
                validate={values => {
                    let errors = {};
                    if (!values.name) {
                        errors.name = "This field is required!"
                    } else if (values.name.length < 2) {
                        errors.name = "Enter more characters!"
                    }
                    return errors;
                }}
                onSubmit={values => {
                    getAllCharecters(0, values.name)
                                .then(charsOnloaded);
                    
                }}
                >
                <Form>
                    <Field type="name" name="name" className="search__input"/>
                    
                    <button type="submit"className="search__submit">
                        <div className="button button__main">
                            <div className="inner">Find</div>
                        </div>
                    </button>
                    
                    <FormikErrorMessage name="name" className="search__error" component="div" />
                    {errorMessage}
                    {spinner}
                    {findedChars[0] && !loading ? chars : null}
                </Form>
            </Formik>
            
        </div>
    )
}

export default FindByName;