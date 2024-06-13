import { useState } from "react";
import { styled } from "styled-components";
import searchIcon from "../assets/search.svg";

const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  border: 1px solid #dddddd;
  border-radius: 0.25rem;
  padding: 0.563rem 0.938rem 0.563rem 3rem;
  max-width: 15.625rem;
  width: 100%;
  font-size: 1rem;
  &::placeholder {
    color: #d9d9d9;
    font-size: 1rem;
  }
  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const StyledIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 1.2rem;
  transform: translateY(-50%);
  z-index: 4;
`;

const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Container>
      <StyledInput
        type="text"
        placeholder={`Search`}
        value={searchQuery}
        onChange={handleSearch}
      />
      <StyledIcon src={searchIcon} />
    </Container>
  );
};

export default Search;