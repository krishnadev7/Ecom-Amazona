import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useReducer } from 'react';
import logger from 'use-reducer-logger';

// managing state with reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'Fetch_Request':
      return { ...state, loading: true };

    case 'Fetch_Success':
      return { ...state, loading: false, products: action.payload };

    case 'Fetch_Fail':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, products, error }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    products: [],
    error: '',
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'Fetch_Request' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'Fetch_Success', payload: result.data });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Featured Products</h1>
      <div className='products'>
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>error..</div>
        ) : (
          products.map(product => (
            <div className='product' key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className='product-info'>
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>{product.price}</strong>
                </p>
                <button>Add to cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
