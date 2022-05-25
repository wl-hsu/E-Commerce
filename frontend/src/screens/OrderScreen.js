import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Image,
  Card,
  Modal,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import { ORDER_PAY_RESET } from '../contents/orderContents'
import { v4 as uuidv4 } from 'uuid'
import { PayPalButton } from 'react-paypal-button-v2'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  const dispatch = useDispatch()
  //popup state
  const [show, setShow] = useState(false)
  //Payment QR code picture
  const [image, setImage] = useState('')
  const [text, setText] = useState('Please Scan')

  //SDK
  const [SDK, setSDK] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, error: errorPay, success: successPay } = orderPay

  //calculate price
  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }
  useEffect(() => {
    //create paypal script Dynamically 
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      console.log(clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
    
      script.onload = () => {
        setSDK(true)
      }
      document.body.appendChild(script)
    }
    
    if (!userInfo) {
      history.push('/login')
    }
    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSDK(true)
      }
    }
    
    // eslint-disable-next-line
  }, [dispatch, history, userInfo, order, orderId, successPay])

  //Create functions to open and close popovers
  const handleClose = () => {
    setShow(false)
  }

  const handlePayment = () => {
    setImage('https://www.thenewstep.cn/pay/index.php?' + 'pid=' + order._id)
    setShow(true)

    //Set a timer to monitor payments
    let timer = setInterval(() => {
      //request payment status
      axios.get('/status').then((res) => {
        if (res.data.status === 0) {
          setText('Scan')
        } else if (res.data.status === 1) {
          setText('Scanned successfully, Please pay')
        } else if (res.data.status === 2) {
          //Create a payment result object
          const paymentResult = {
            id: uuidv4(),
            status: res.data.status,
            updata_time: Date.now(),
            email_address: order.user.email,
          }
          //Update paid orders
          dispatch(payOrder(orderId, paymentResult))
          setText('Paid successfully, please wait for delivery')
          setShow(false)
          clearTimeout(timer)
        }
      })
    }, 1000)
  }

    //Create a function for paypal to pay btn
    const successPaymentHandler = (paymentResult) => {
      console.log(paymentResult)
      dispatch(payOrder(orderId, paymentResult))
    }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order Number:{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping information</h2>
              
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                {' '}
                <strong>E-mail:</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                {order.shippingAddress.province},{order.shippingAddress.city},
                {order.shippingAddress.address},
                {order.shippingAddress.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivery time:{order.DeliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Undelivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment method</h2>
              <p>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid at{order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Unpaid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Review items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price} = {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order details</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Item</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Payment Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
                    {/*PayPal BTN*/}
                    {loadingPay && <Loader />}
              {order.paymentMethod === 'PayPal' && (
                <ListGroup.Item>
                  {!SDK ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  )}
                </ListGroup.Item>
              )}
              {order.paymentMethod === 'WeChat Pay' && (<ListGroup.Item>
                    {/*WeChat Pay BTN*/}
                <Button
                  type='button'
                  className='btn-block'
                  onClick={handlePayment}
                  disabled={order.orderItems === 0}
                >
                  pay
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Order {order._id}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Total:  ${order.totalPrice}</p>
                    <p>payment method: {order.paymentMethod}</p>
                    <Row>
                      <Col md={6} style={{ textAlign: 'center' }}>
                        <Image src={image} />
                        <p
                          style={{ backgroundColor: '#00C800', color: 'white' }}
                        >
                          {text}
                        </p>
                      </Col>
                      <Col>
                        <Image src='/images/saoyisao.jpg' />
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant='primary' onClick={handleClose}>
                     Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </ListGroup.Item>)}   
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen