import axios from '../../api/axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import "./SearchPage.css";
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchPage() {
  const navigate = useNavigate();
  const [saerchResults, setSaerchResults] = useState([]);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  
  let query = useQuery();
  const searchTerm = query.get("q");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if(searchTerm) {
      fetchSearchMovie(searchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchSearchMovie = async (searchTerm) => {
    try {
      const request = await axios.get(
        `/search/multi?include_adult=false&query=${searchTerm}`
      )

      setSaerchResults(request.data.results);
    } catch (error) {
      console.log("error", error);
    }
  }

  const renderSearchResults = () => {
    return saerchResults.length > 0 ? (
      <section className='search-container'>
        {saerchResults.map((movie) => {
          if(movie.backdrop_path !== null && movie.media_type !== "person") {
            const movieImageUrl = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            return (
              <div className='movie' key={movie.id}>
                <div
                  className='movie__column-poster'
                  onClick={() => navigate(`/${movie.id}`)}
                >
                  <img
                    src={movieImageUrl}
                    alt='movie'
                    className='movie__poster'
                  />
                </div>
              </div>
            )
          }
        })}
      </section>
    ) : (
      <section className='no-results'>
        <div className='no-results__text'>
          <p>찾고자하는 검색어"{searchTerm}"에 맞는 영화가 없습니다.</p>
        </div>
      </section>
    )
  }

  return renderSearchResults();
}
