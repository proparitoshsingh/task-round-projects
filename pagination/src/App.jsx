import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const res = await fetch('https://dummyjson.com/products?limit=40');
    const data = await res.json();
    setProducts(data.products);
  };

  const selectPageHandler = (selectedPage) => {
    setPage(selectedPage);
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < products.length / 10) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Pagination</h1>
      <div className='products'>
        {products.length > 0 ? (
          products.slice(page * 10 - 10, page * 10).map((product) => {
            return (
              <div className='product' key={product.id}>
                <img src={product.thumbnail} alt={product.title} />
                <p>{product.title}</p>
              </div>
            );
          })
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      {products.length > 0 && (
        <div className='pagination'>
          <span onClick={goToPrevPage}>◀</span>
          {[...Array(Math.ceil(products.length / 10))].map((_, i) => {
            return (
              <span
                key={i}
                onClick={() => selectPageHandler(i + 1)}
                className={page === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </span>
            );
          })}
          <span onClick={goToNextPage}>▶</span>
        </div>
      )}
    </div>
  );
}

export default App;
