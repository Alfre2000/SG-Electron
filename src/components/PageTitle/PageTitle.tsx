import { Card, Col, Row } from "react-bootstrap";

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Row className="justify-center">
      <Col xs={8} className="px-6">
        <Card className="h-full min-h-[70px]">
          <Card.Header className="h-full grid items-center border-b-0 titolo-pagina">
            <h3 className="text-2xl text-nav-blue text-bold font-roboto">{children}</h3>
          </Card.Header>
        </Card>
      </Col>
    </Row>
  );
}

export default PageTitle;
