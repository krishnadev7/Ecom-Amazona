import React from 'react';
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Products from '../components/Products';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
          <div>{error}</div>
        ) : (
          <Row>
            {products.map(product => (
              <Col key={product.slug} sm={6} md={4} lg={3} className='mb-3'>
                <Products product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
