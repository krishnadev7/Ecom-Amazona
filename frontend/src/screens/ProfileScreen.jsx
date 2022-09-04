import React, { useContext } from 'react';
import { Store } from './Store';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useReducer } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';

const reducer= (state,action) => {
    switch(action.type){
        case "Update_Request":
            return{...state, loadingUpdate: true};
        case "Update_Success":
            return {...state, loadingUpdate: false};
        case "Update_Fail":
            return {...state, loadingUpdate: false};
        default:
            return state;
    }
}

function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name,setName] = useState(userInfo.name);
  const [email,setEmail] = useState(userInfo.email)
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const [{loadingUpdate}, dispatch] = useReducer(reducer,{
    loadingUpdate: false
  })

  const submitHandler = async(e) => {
    e.preventDefault();
    try {
        const {data} = await axios.put(`/api/users/profile`,{
            name,
            email,
            password
        },{
            headers: {Authorization: `Bearer ${userInfo.token}`}
        });
        dispatch({
            type: 'Update_Success'
        });
        ctxDispatch({type:'User_Signin', payload: data});
        localStorage.setItem('userInfo', JSON.stringify(data));
        toast.success('User updated successfully');
    } catch (err) {
        dispatch({type: "Fetch_Fail"});
        toast.error.getError(err)
    }
  }

  return (
    <div className='container small-container'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className='my-3'>User Profile</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={e => setPassword(e.target.value)}
            type='password'
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            type='password'
            required
          />
        </Form.Group>
        <div className='mb-3'>
            <Button type='submit'>Update</Button>
        </div>
      </form>
    </div>
  );
}

export default ProfileScreen;
