import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Rating from '../components/Rating';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './Store';
import {getError} from '../utils'



// managing state with reducer;
const reducer = (state, action) => {
  switch (action.type) {
    case 'Fetch_Request':
      return { ...state, loading: true };

    case 'Fetch_Success':
      return { ...state, loading: false, product: action.payload };

    case 'Fetch_Fail':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate()
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    product: [],
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'Fetch_Request' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'Fetch_Success', payload: result.data });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: getError(err)});
      }
    };
    fetchData();
  }, [slug]);

  const {state,dispatch:ctxDispatch} = useContext(Store);
  const {cart} = state;
  const addToCartHandler = async() => {
    const exitItem = cart.cartItems.find(x => x._id === product._id);
    const quantity = exitItem ? exitItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${product._id}`);
    if(data.countInStock < quantity){
      window.alert('sorry. Product is out of stock');
      return;
    }
    ctxDispatch({type: 'Cart_Add_Item', payload: {...product, quantity},
  });
  navigate('/cart')
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className='img-large'
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: ???{product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Col>Price:</Col>
                  <Col>???{product.price}</Col>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg='success'>In Stock</Badge>
                    ) : (
                      <Badge bg='danger'>Unavailable</Badge>
                    )}
                  </Col>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button variant='primary' onClick={addToCartHandler}>Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
