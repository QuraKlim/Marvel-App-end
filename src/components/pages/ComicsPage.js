import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
    return(
        <>
            <AppBanner/>
            <ComicsList mainPage={ComicsPage}/>
        </>
    )
}

export default ComicsPage;