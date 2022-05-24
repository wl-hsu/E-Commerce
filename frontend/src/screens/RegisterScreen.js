import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister
  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])
  //form submit function
  const submitHandler = (e) => {
    e.preventDefault()
    //dispatch register function
    if (password !== confirmPassword) {
      setMessage('passwords didn\'t match')
    } else {
      dispatch(register(name, email, password))
    }
  }
  return (
    <FormContainer>
      <h1>Create Account</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type='name'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type='email'
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>password:</Form.Label>
          <Form.Control
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>password confirm:</Form.Label>
          <Form.Control
            type='password'
            placeholder='password confirm'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' style={{float: 'right'}}>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Sign in instead
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen