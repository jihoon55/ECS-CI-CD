import useSWR from "swr"
import { OrderStatus } from '../OrderStatus'
import FilledMessage from '../FilledMessage'
const fetcher = () => fetch(`${process.env.REACT_APP_ENDPOINT}/api/orders`).then(res => res.json())

function InDelivery() {
  const { data: orders, error } = useSWR('get/orders', fetcher)

  if (error) return <FilledMessage>요청을 받아올 수 없습니다. 서버 문제같은데요?</FilledMessage>
  if (!orders) return <FilledMessage>로딩 중</FilledMessage>

  const currentDelivery = orders.find(o => {
    if(o.deliveryInfo.status === OrderStatus.PREPAIRING) return true;
    if(o.deliveryInfo.status === OrderStatus.READY_TO_PICK_UP) return true;
    if(o.deliveryInfo.status === OrderStatus.IN_DELIVERY) return true;
  })

  if(!currentDelivery) return '메뉴를 주문하세요!'

  return <>
    <header>
      <h3>배달 현황</h3>
    </header>
    <div>
      <h2>메뉴 준비 중</h2>
      <div>
        약 30분이 소요될 예정입니다.
      </div>
    </div>
    <div>
      <h2>매장</h2>
      <div>
        {currentDelivery.source.name}<br/>
        {currentDelivery.source.address}
      </div>
    </div>
    <div>
      <h2>주문한 메뉴</h2>
      <div>
        {currentDelivery.destination.address}
      </div>
    </div>
  </>
}

export default InDelivery