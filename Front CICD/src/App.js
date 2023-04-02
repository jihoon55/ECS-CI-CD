import './App.css';
import { useState } from 'react'
import TabItem from './TabItem';
import TabBar from './TabBar';
import OrderHere from './tab/OrderHere';
import OrderHistory from './tab/OrderHistory';
import InDelivery from './tab/InDelivery';
import useSWR, { useSWRConfig } from "swr"

function App() {
  const { mutate } = useSWRConfig()
  const [currentTab, setCurrentTab] = useState("주문")
  const [currentRestaurant, setCurrentRestaurant] = useState(null)
  const [orders, setOrders] = useState([])

  const onSelectMenu = (m) => {
    return (e) => {
      const found = orders.find(o => o._id === m._id)
      console.log(found)
      if(found) {
        setOrders(orders.filter(o => o._id !== m._id))
      }
      else {
        setOrders([...orders, m])
      }
    }
  }

  const onSelectRestaurant = (r) => {
    if(r === null) {
      setCurrentRestaurant(null)
    }
    else {
      setCurrentRestaurant(r)
    }
  }

  const handleOrder = (callback) => {
    mutate('get/orders', async (o) => {
      const newOrder = await fetch(`${process.env.REACT_APP_ENDPOINT}/api/orders`, {
        method: 'POST',
        body: JSON.stringify({
          restaurantId: currentRestaurant._id,
          menu: orders
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(resp => resp.json())

      setCurrentRestaurant(null)
      setOrders([])

      alert('주문이 접수되었습니다')
      setCurrentTab('배달 현황')
      callback()

      return [...o, newOrder]
    })
  }

  return (
    <div className="app">
      <TabItem visible={currentTab === '주문'}>
        <OrderHere onSelectMenu={onSelectMenu} currentRestaurant={currentRestaurant} onSelectRestaurant={onSelectRestaurant} orders={orders} onClickOrder={handleOrder}/>
      </TabItem>
      <TabItem visible={currentTab === '배달 현황'}>
        <InDelivery />
      </TabItem>
      <TabItem visible={currentTab === '주문 내역'}>
        <OrderHistory />
      </TabItem>
      <TabBar onChange={setCurrentTab} currentTab={currentTab}>
        <TabBar.Item label="주문" icon="shop"></TabBar.Item>
        <TabBar.Item label="주문 내역" icon="file-list-tick"></TabBar.Item>
      </TabBar>
    </div>
  );
}

export default App;
