import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import { Store } from './screens/Store';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignUpScreen from './screens/SignUpScreen';

function App() {
  const { state,dispatch:ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({type: 'User_SignOut'});
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress');
  }
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position='bottom-center' limit={1}/>
        <Navbar bg='dark' variant='dark'>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>Amazona</Navbar.Brand>
            </LinkContainer>
            <Nav className='me-auto'>
              <Link to='/cart' className='nav-link'>
                Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg='danger'>
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/orderhistory'>
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className='dropdown-item'
                    to='#signout'
                    onClick={signoutHandler}
                  >Sign Out</Link>
                </NavDropdown>
              ) : (
                <Link className='nav-link' to='/signin'>
                  Sign In
                </Link>
              )}
            </Nav>
          </Container>
        </Navbar>
        <main>
          <Container className='pt-3'>
            <Routes>
              <Route path='/product/:slug' element={<ProductScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/signin' element={<SignInScreen />} />
              <Route path='/signup' element={<SignUpScreen />} />
              <Route path='/shipping' element={<ShippingAddressScreen />} />
              <Route path='/' element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className='text-center'>All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
