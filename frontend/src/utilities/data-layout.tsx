import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

interface Props {
  pages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSearch: React.Dispatch<React.SetStateAction<string | null>> | null;
  children: React.ReactNode;
}

export default function DataLayout({
  pages,
  page,
  setPage,
  setSearch,
  children,
}: Props) {
  return (
    <>
      <Container className="d-flex p-2 flex-row flex-wrap justify-content-between">
        <Form>
          <Form.Control
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            disabled={!setSearch}
          ></Form.Control>
        </Form>

        <ButtonGroup>
          <Button
            variant="outline-primary"
            disabled={page === 1}
            onClick={() => setPage((page) => page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline-primary"
            disabled={page === pages}
            onClick={() => setPage((page) => page + 1)}
          >
            Next
          </Button>
        </ButtonGroup>
      </Container>
      {children}
    </>
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (setSearch) {
      setPage(1);
      setSearch(e.currentTarget.value);
    }
  }
}
