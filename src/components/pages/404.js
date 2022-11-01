import img404 from '../../resources/img/deadpool.png';
import './404.scss'

import { Link } from 'react-router-dom';

const Page404 = () => {
    return(
        <div className="lost">
            <img src={img404} alt="404" className='lost__image' />
            <p className='lost__text'>There is no page... Maybe you lost?..</p>
            <Link className='lost__link' to="/">You can go back to homepage</Link>
        </div>
    )
}

export default Page404;