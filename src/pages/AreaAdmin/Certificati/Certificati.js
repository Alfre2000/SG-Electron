import React from "react";
import { Container } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle/PageTitle";
import useGetAPIData from "../../../hooks/useGetAPIData/useGetAPIData";
import { URLS } from "../../../urls";
import Wrapper from "../../AreaAdmin/Wrapper";

function Certificati() {
  const [data, setData] = useGetAPIData([
  ]);
  return (
    <Wrapper>
      <Container className="text-center my-10 lg:mx-2 xl:mx-6 2xl:mx-12">
        <PageTitle>Certificati</PageTitle>
      </Container>
    </Wrapper>
  );
}

export default Certificati;
