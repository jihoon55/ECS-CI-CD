import { OrderStatus } from './OrderStatus';

function OrderAction({ status }) {
  if(status === OrderStatus.WAITING) {
    return <>
      <button className="btn-primary">수락</button>
      <button>거절</button>
    </>
  }
  else if(status === OrderStatus.PREPAIRING) {
    return <button>배달 요청</button>
  }
  else {
    return ''
  }

}

export default OrderAction;