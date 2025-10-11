import Header from "../../components/Header/Header"
import { Outlet } from "react-router-dom"
import Footer from "../../components/Footer/Footer"

const PanelView = () => {
  
  return <>
    <Header />
    <Outlet />
    <Footer />
  </>
}

export default PanelView