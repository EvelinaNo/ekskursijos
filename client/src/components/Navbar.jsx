import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import account_icon from '../assets/account_icon.svg';
import { useContext, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';

const MainContainer = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 4rem 3rem 2rem 3rem;
  border-bottom: 1px solid #dddddd;
`;

const NavbarContainer = styled.nav`
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 1rem 4rem;
  height: 50px;
`;

const LogoContainer = styled.div``;

const Logo = styled.img`
  height: 1.8rem;
`;
const Divider = styled.img`
  height: 1rem;
  width: 1px;
  background-color: #000;
  margin: 0 1rem;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
`;

const Icon = styled(Link)`
  color: #000;
  font-size: 24px;
  margin: 0 10px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 1.6rem;
    width: auto;
  }
`;

const DropdownMenu = styled.div`
  position: relative;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  padding: 8px 0;
  min-width: 120px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  font-family: 'Poppins', sans-serif;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  color: black;
  display: block;
  cursor: pointer;
  width: 100%;
  white-space: nowrap;
  a {
    text-decoration: none;
    color: black;
    font-family: 'Poppins', sans-serif;
    &:hover {
      color: #a9a9a9;
    }
  }
`;

const LogoutLink = styled.p`
  text-decoration: none;
  color: black;
  font-family: 'Poppins', sans-serif;

  &:hover {
    color: #a9a9a9;
  }
`;

const Item = styled.p`
  color: #000;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

function Navbar() {
  const { isAuthenticated, user, logoutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <NavbarContainer>
      <MainContainer>
        <LogoContainer>
          <Link to="/">
            <Logo src={logo} alt="Logo" />
          </Link>
        </LogoContainer>
        <IconsContainer>
          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <Icon to="#" onClick={toggleMenu}>
                  <img src={account_icon} alt="Account icon" />
                </Icon>
                <DropdownContent isOpen={isMenuOpen}>
                  {user.role === 'admin' ? (
                    <DropdownItem>
                      <Link to="/registrations/admin/excursions">Manage Excursions</Link>
                    </DropdownItem>
                  ) : (
                    <DropdownItem>
                      <Link to={`/users/${user.id}/my-excursions`}>My Excursions</Link>
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={handleLogout}>
                    <LogoutLink>Log out</LogoutLink>
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <StyledLink to="/login">
                <Item>Login</Item>
              </StyledLink>
              <Divider />
              <StyledLink to="/registration">
                <Item>Register</Item>
              </StyledLink>
            </>
          )}
        </IconsContainer>
      </MainContainer>
    </NavbarContainer>
  );
}

export default Navbar;
