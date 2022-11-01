import { useHttp } from "../hooks/http.hook";
import MD5 from 'crypto-js/md5'

const useMarvelService = () => {
    const {loading, request, error, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = '0edd54a6f4c61bdedbc4bf6b5e85b209';
    const _privKey = '27d9f4b73b21ccc958a43053c627305080a87f9c'
    const _baseOffset = 82;
    


    const getAllCharecters = async (offset = _baseOffset, charName = null, comicId = null) => {
        let res;
        const ts = new Date().getTime();
        const hash = MD5(ts + _privKey + _apiKey)
        if (charName) {
            res = await request(`${_apiBase}characters?nameStartsWith=${charName}&limit=100&offset=${offset}&ts=${ts}&apikey=${_apiKey}&hash=${hash}`);
        } else if (comicId) {
            const link = `${_apiBase}characters?comics=${comicId}&limit=12&offset=${offset}&ts=${ts}&apikey=${_apiKey}&hash=${hash}`
            res = await request(link); 
            console.log(link)
        } else {
            res = await request(`${_apiBase}characters?limit=9&offset=${offset}&apikey=${_apiKey}`);
        }
        
        return res.data.results.map(_transformCharacter)
    }

    const getCharecter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?apikey=${_apiKey}`);
        return _transformCharacter(res.data.results[0])

    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? char.description : 'Sorry, there is no description',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const comicsArr = (arr) => {
        let comicsArr = [];

        arr.forEach((item, i) => {
            const obj = {
                id: item.id,
                thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
                title: item.title,
                price: item.prices[0].price === 0 ? 'NOT AVAILABLE' : item.prices[0].price+"$",
                name: item.title,
                url: item.urls[0].url
            }
            comicsArr[i] = obj;
        })
        return comicsArr
    }

    const getComics = async (id, offset = 0, limit = 100) => {
        const ts = new Date().getTime();
        const hash = MD5(ts + _privKey + _apiKey);
        const res = await request(`${_apiBase}comics?noVariants=true&characters=${id}&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${_apiKey}&hash=${hash}`);
        console.log(`${_apiBase}comics?noVariants=true&characters=${id}&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${_apiKey}&hash=${hash}`)
        return comicsArr(res.data.results)
    }

    const getAllComics = async (limit, offset) => {
        const res = await request(`${_apiBase}comics?noVariants=true&limit=${limit}&offset=${offset}&apikey=${_apiKey}`);
        return res.data.results.map(transformComics);
    }

    const getSingleComic = async (id) => {
        const ts = new Date().getTime();
        const hash = MD5(ts + _privKey + _apiKey)
        const res = await request(`${_apiBase}comics/${id}?ts=${ts}&apikey=${_apiKey}&hash=${hash}`);
        console.log(res);
        return transformComics(res.data.results[0]);
    }

    const transformComics = (comics) => {
        console.log(comics)
        return {
            link: comics.urls[0].url,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            title: comics.title,
            description: comics.description,
            price: comics.prices[0].price === 0 ? 'NOT AVAILABLE' : comics.prices[0].price+"$",
            id: comics.id,
            language: comics.textObjects[0] ? comics.textObjects[0].language : 'No data',
            pageCount: comics.pageCount && comics.pageCount > 0 ? comics.pageCount : 'No data'
        }
    }

    return {loading,
            error,
            process,
            getAllCharecters,
            getCharecter,
            getComics,
            clearError,
            getAllComics,
            getSingleComic,
            setProcess
        }
}

export default useMarvelService;