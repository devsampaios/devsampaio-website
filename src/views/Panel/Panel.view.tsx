import { useContext } from "react"
import Header from "../../components/Header/Header"
import { Alert, AlertContext} from "@moreirapontocom/npmhelpers"
import { Outlet } from "react-router-dom"
import Footer from "../../components/Footer/Footer"

const PanelView = () => {
  const {alert} = useContext(AlertContext)
  return <>
    <Header />
    <Alert alert={alert} />
    <Outlet />
    <Footer />
  </>
}

export default PanelView