import React from 'react';
import { useReducer } from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Button  from 'react-bootstrap/Button'
import {getError} from '../utils';
import {Store} from './Store'

const reducer = (state, action) => {
  switch (action.type) {
    case 'Fetch_Request':
      return { ...state, loading: true };
    case 'Fetch_Success':
      return { ...state, orders: action.payload, loading: false };
    case 'Fetch_Fail':
      return { ...state, error: action.payload, loading: false };
  }
};

function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'Fetch_Request' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'Fetch_Success', payload: data });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.isDeliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type='button'
                    variant='light'
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistoryScreen;
