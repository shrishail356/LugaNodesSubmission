import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { darkTheme, lightTheme } from './utils/Themes.js'
import Signup from '../src/components/Signup.jsx';
import Signin from '../src/components/Signin.jsx';
import Navbar from '../src/components/Navbar.jsx';
import Menu from '../src/components/Menu.jsx';
import Dashboard from '../src/pages/Dashboard.jsx'
import ToastMessage from './components/ToastMessage.jsx';
import Search from '../src/pages/Search.jsx';
import Favourites from '../src/pages/Favourites.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import { closeSignin } from "./redux/setSigninSlice.jsx";
import LatestTransactionsPage from "./pages/LatestTransactionsPage.jsx";
import { ContractProvider } from "./context/ContractProvider.jsx";
import GenerateWebHooks from "./pages/GenerateWebHooks.jsx";
const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const Tag = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bgLight};
  overflow-y: hidden;
  overflow-x: hidden;
`;

function App() {

  const [darkMode, setDarkMode] = useState(true);
  const { open, message, severity } = useSelector((state) => state.snackbar); 
  const {opensi} =  useSelector((state) => state.signin);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch()
    useEffect(() => {
      const resize = () => {
        if (window.innerWidth < 1110) {
          setMenuOpen(false);
        } else {
          setMenuOpen(true);
        }
      }
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(()=>{
      dispatch(
        closeSignin()
      )
    },[])

  return (
    <ContractProvider>
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>

      <BrowserRouter>
        {opensi && <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        {SignUpOpen && <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
        <Tag>
          {menuOpen && <Menu setMenuOpen={setMenuOpen} darkMode={darkMode} setDarkMode={setDarkMode} setSignInOpen={setSignInOpen}/>}
          <Frame>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
            <Routes>
              <Route path='/' exact element={<Dashboard setSignInOpen={setSignInOpen}/>} />
              <Route path='/search' exact element={<Search />} />
              <Route path='/favourites' exact element={<Favourites />} />
              <Route path='/latest' exact element={<LatestTransactionsPage />} />
              <Route path='/generatehooks' exact element={<GenerateWebHooks />} />
            </Routes>
          </Frame>

          {open && <ToastMessage open={open} message={message} severity={severity} />}
        </Tag>

      </BrowserRouter>

    </ThemeProvider>
    </ContractProvider>

  );
}

export default App;
