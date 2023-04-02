import useSWR from "swr"
import FilledMessage from '../FilledMessage'
const fetcher = () => fetch(`${process.env.REACT_APP_ENDPOINT}/api/orders`).then(res => res.json())

function OrderHistory() {
  const { data: orders, error } = useSWR('get/orders', fetcher)

  if (error) return <FilledMessage>요청을 받아올 수 없습니다. 서버 문제같은데요?</FilledMessage>
  if (!orders) return <FilledMessage>로딩 중</FilledMessage>

  console.log(orders)
  return <>
    <header>
      <h3>주문 관리</h3>
    </header>
    <div className="list-view">
      <ul>
        <li className='list-item list-header'>
          <div className='col-id'>ID</div>
          <div>메뉴</div>
          <div></div>
        </li>
        {orders.map(order => <li className='list-item' key={order._id}>
          <div className='col-id'>{order._id.substring(0,4)}</div>
          <div>{order.orderedMenu.map(m => m.name + ' ' + m.quantity).join(', ')}</div>
          <div className="action-btns">

          </div>
        </li>)}

        {orders.length === 0 ? <FilledMessage>아무것도 주문하지 않으셨어요. 주문하러 가볼까요?</FilledMessage> : ''}
      </ul>
    </div>
  </>
}

export default OrderHistory