import Pagination from 'react-bootstrap/Pagination';

interface SimplePaginationComponents {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  first: number;
  last: number;
}

export default function SimplePagination({
  setPage,
  first,
  last,
}: SimplePaginationComponents) {
  return (
    <Pagination className="d-inline-flex align-self-center mb-0">
      <Pagination.First onClick={handleFirst} />
      <Pagination.Prev onClick={handlePrevious} />
      <Pagination.Next onClick={handleNext} />
      <Pagination.Last onClick={handleLast} />
    </Pagination>
  );

  function handleFirst() {
    setPage(first);
  }

  function handleLast() {
    setPage(last);
  }

  function handleNext() {
    setPage((page) => (page + 1 > last ? last : page + 1));
  }

  function handlePrevious() {
    setPage((page) => (page - 1 < first ? first : page - 1));
  }
}
