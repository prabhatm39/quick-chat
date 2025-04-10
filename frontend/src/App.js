import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './pages/home/index';
import Login from './pages/login/index';
import Singup from './pages/singup/index';
import { Toaster } from 'react-hot-toast';
import ProtechedRoute from './component/protechedRoute';
import Loader from './component/loader';
import { useSelector } from 'react-redux';
import Profile from './pages/profile';

function App() {
  const {loader} = useSelector(state => state.loaderReducer)
  return (
   <div>
    <Toaster  position="top-center"  reverseOrder={false}/>
    {loader && <Loader />}
    <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <ProtechedRoute>
        <Home />
        </ProtechedRoute>
      }></Route>
       <Route path="/profile" element={
        <ProtechedRoute>
        <Profile />
        </ProtechedRoute>
      }></Route>
      <Route path="/login" element={<Login />} />
      <Route path='/singup' element={<Singup/>} />
    </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
